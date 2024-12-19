## 1、引入依赖
```xml
<dependency>
	<groupId>com.github.ben-manes.caffeine</groupId>
  <artifactId>caffeine</artifactId>
</dependency>
```

## 2、添加配置文件
```java

/**
 * <h3>本地缓存</h3>
 *
 * @author wangshuaijing
 * @version 1.0.0
 * @date 2020/12/21 14:28
 */
@Configuration
public class LocalCacheConfiguration {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Lazy
    @Autowired
    private AdxTurnDownWeightServiceImpl turnDownWeightService;

    /**
     * 默认本地存储
     */
    @Bean(value = "turnDownWeightCache")
    public Cache<String, String> turnDownWeightCache() {
        return Caffeine.newBuilder()
                // 设置最后一次写入或访问后经过固定时间过期
                .expireAfterWrite(Duration.ofMinutes(15))
                .refreshAfterWrite(Duration.ofMinutes(12))
                // 初始的缓存空间数量
                .initialCapacity(100)
                // 缓存的最大条数
                .maximumSize(1_000)
                .removalListener((String key, String value, RemovalCause cause) -> {
                    // 没有访问，不会自动调用，即使已经过了超期时间
                    if (logger.isDebugEnabled()) {
                        logger.debug("Key was removed，cause：{}。key：{}， value：{}", cause, key, value);
                    }

                    if (RemovalCause.SIZE == cause) {
                        logger.error("{} 总数量太少，请增加缓存条数上限，当前上限：{}", "默认本地对象", 1_000);
                    }
                })
                .build(key -> {
                    logger.debug("触发自动刷新");
                    // 自动刷新本地缓存，调用getLevelByRedis方法从redis中取值放入本地缓存
                    return turnDownWeightService.getLevelByRedis(key);
                });
    }
}

```

## 3、业务类
```java
/**
 * <h3>adx降权服务</h3>
 *
 * @author wangzhe
 * @version 1.0.0
 * @createTime 2022/11/8 15:06
 */
@Service
@ServiceBehavior
public class AdxTurnDownWeightServiceImpl implements IAdxTurnDownWeightService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AdxTurnDownWeightServiceImpl.class);

    @Autowired
    private RedisClusterService redisClusterService;
    @Autowired
    private Cache<String, String> turnDownWeightCache;

    @Override
    public Integer getLevel(String dspId) {
        String key = "";
        try {
            key = RedisConstants.createDownWeightKey(dspId);
        } catch (BuildRedisKeyException e) {
            LOGGER.error(e.getMessage(), e);
        }
        // 从本地缓存取，取不到从redis取并放入本地缓存
        String value = turnDownWeightCache.get(key, this::getLevelByRedis);
        return NumberUtils.toInt(value, -1);
    }

    /**
     * 根据key从redis获取降权规则
     *
     * @param key key
     * @return 降权规则
     */
    public String getLevelByRedis(String key) {
        return redisClusterService.get(key);
    }
}

```

