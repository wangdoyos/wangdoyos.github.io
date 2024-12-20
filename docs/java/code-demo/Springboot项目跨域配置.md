# 一、全局配置
```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // 匹配所有请求路径
                        .allowedOrigins("*") // 允许所有来源
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的方法
                        .allowedHeaders("*") // 允许的请求头
                        .exposedHeaders("Content-Type", "Authorization") // 暴露的响应头
                        .allowCredentials(false) // 是否允许发送Cookie
                        .maxAge(3600); // 预检请求的缓存时间（秒）
            }
        };
    }
}

```

# 二、指定类配置
在 Controller 上添加局部配置

```java
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600) // 跨域配置应用于整个类
@RequestMapping("/debug")
public class DebugController {

    @PostMapping("/ssp")
    public String handleDebugRequest(@RequestBody String request) {
        // 处理请求逻辑
        return "Request received";
    }

    @PostMapping("/another-endpoint")
    public String handleAnotherRequest(@RequestBody String request) {
        // 处理其他请求
        return "Another request received";
    }
}

```

# 三、指定接口配置
如果只想为某些接口启用跨域，可以在对应的 Controller 方法上使用 @CrossOrigin 注解：

```java
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DebugController {

    @CrossOrigin(origins = "*", maxAge = 3600) // 设置允许的来源和缓存时间
    @PostMapping("/debug/ssp")
    public String handleDebugRequest(@RequestBody String request) {
        // 处理请求逻辑
        return "Request received";
    }
}

```

# 四、基于过滤器实现跨域
如果需要更灵活的配置，可以添加一个自定义的 Filter：

```java
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class CorsFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", "*"); // 允许所有来源
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Expose-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK); // 预检请求直接返回200
        } else {
            filterChain.doFilter(request, response); // 继续处理其他请求
        }
    }
}

```

