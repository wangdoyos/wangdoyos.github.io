## 1、项目用到两个参数的Function
背景：在ssp和dsp进行联调时，接口接收的参数和响应的参数类型一致，但是处理逻辑不完全一致，开始的部分相同，后面不同。



**注意：如果handler需要两个参数，使用BiFunction，如果需要一个参数，使用Function，如果需要更多参数，可以自定义Function**

```java

@RequestMapping("/ssp")
public ResponseEntity<DebugResponse> sspDebug(@RequestBody DebugRequest requestParam) {
    return handleRequest(requestParam, this::sspHandler);
}

@RequestMapping("/dsp")
public ResponseEntity<DebugResponse> dspDebug(@RequestBody DebugRequest requestParam) {
    return handleRequest(requestParam, this::dspHandler);
}

    /**
     * 分配处理器
     *
     * @param requestParam   请求参数
     * @param requestHandler 处理器
     * @return 处理结果
     */
    private ResponseEntity<DebugResponse> handleRequest(DebugRequest requestParam, BiFunction<JxedtSsp.Request, String, ResponseEntity<DebugResponse>> requestHandler) {
        // ... 处理前统一逻辑...
        // 对应处理器开始处理
        return requestHandler.apply(sspRequest, requestParam.getUrl());
    }

    /**
     * 处理ssp联调
     *
     * @param sspRequest 请求参数
     * @return 响应结果
     */
    private ResponseEntity<DebugResponse> sspHandler(JxedtSsp.Request sspRequest, String url) {
        // ...特殊逻辑...
        // 请求广告
        byte[] bodyBytes = sendRequest(sspRequest, url);
        return null;
    }

    /**
     * 处理dsp联调
     *
     * @param sspRequest 请求参数
     * @return 响应结果
     */
    private ResponseEntity<DebugResponse> dspHandler(JxedtSsp.Request sspRequest, String url) {
        // 请求广告
        byte[] bodyBytes = sendRequest(sspRequest, url);
        // ...特殊逻辑...
        return null;
    }


    /**
     * 请求广告
     *
     * @param sspRequest 请求参数
     * @return 响应结果
     */
    private byte[] sendRequest(JxedtSsp.Request sspRequest, String url) {
        return HttpRequest.post(url)
                .body(sspRequest.toByteArray())
                .header(Header.CONTENT_TYPE, "application/octet-stream;charset=utf-8")
                .execute()
                .bodyBytes();
    }

```

## 2、自定义四个参数的Function
#### （1）定义QuadFunction接口
可以通过以下代码来创建一个接受四个参数并返回一个结果的自定义接口：

```java
@FunctionalInterface
public interface QuadFunction<T, U, V, W, R> {
    R apply(T t, U u, V v, W w);
}

```

这个接口定义了一个 apply 方法，该方法接受四个类型的参数 T, U, V, W，并返回类型 R 的结果。

#### （2）使用 QuadFunction
在使用 QuadFunction 时，可以像标准库中的 Function 和 BiFunction 那样，将其作为参数传递。下面是使用该接口的示例：

```java
private <T> ResponseEntity<DebugResponse> handleRequestWithFourParams(T param1, T param2, T param3, T param4, QuadFunction<T, T, T, T, ResponseEntity<DebugResponse>> requestHandler) {
    return requestHandler.apply(param1, param2, param3, param4);
}

```

#### （3）示例
在代码中使用 QuadFunction 的方式如下：

```java
public ResponseEntity<DebugResponse> exampleUsage() {
    return handleRequestWithFourParams(
        "param1",
        "param2",
        "param3",
        "param4",
        (p1, p2, p3, p4) -> {
            // 使用四个参数实现自定义逻辑
            return new ResponseEntity<>(new DebugResponse(p1 + p2 + p3 + p4), HttpStatus.OK);
        }
    );
}

```

