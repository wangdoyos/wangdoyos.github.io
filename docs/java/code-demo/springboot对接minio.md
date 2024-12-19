## 一、引入依赖
```javascript
<!-- MinIO SDK -->
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.5.6</version>
</dependency>
```

## 二、minio配置
```yaml
minio:
  ## MinIO 服务地址
  endpoint: http://6e91j11801.vicp.fun:9002
  ## 访问密钥
  access-key: ix0xhwjDKv5icGbtpPaj
  ## 秘密密钥
  secret-key: d0yJZV0xcWmB3Lo2KQbmJSVK9WnI7LSehshBxfpS
  ## 默认桶名称
  bucket-name: shiji
```

## 三、编写工具类
```java
package com.doyo.shiji.util;

import io.minio.*;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Component
public class MinioUtil {

    private final MinioClient minioClient;
    private final String bucketName;

    public MinioUtil(
        @Value("${minio.endpoint}") String endpoint,
        @Value("${minio.access-key}") String accessKey,
        @Value("${minio.secret-key}") String secretKey,
        @Value("${minio.bucket-name}") String bucketName) {
        this.minioClient = MinioClient.builder()
        .endpoint(endpoint)
        .credentials(accessKey, secretKey)
        .build();
        this.bucketName = bucketName;

        // 初始化时确保桶存在
        createBucketIfNotExists(bucketName);
    }


    /**
     * 创建桶，如果不存在
     */
    private void createBucketIfNotExists(String bucketName) {
        try {
            boolean isExist = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!isExist) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
        } catch (Exception e) {
            throw new RuntimeException("创建桶失败: " + e.getMessage(), e);
        }
    }

    /**
     * 上传文件
     */
    public String uploadFile(MultipartFile file, String objectName) {
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                PutObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .stream(inputStream, file.getSize(), -1)
                .contentType(file.getContentType())
                .build());
            return objectName; // 返回文件名或完整URL
        } catch (Exception e) {
            throw new RuntimeException("上传文件失败: " + e.getMessage(), e);
        }
    }

    /**
     * 下载文件
     */
    public InputStream downloadFile(String objectName) {
        try {
            return minioClient.getObject(GetObjectArgs.builder().bucket(bucketName).object(objectName).build());
        } catch (Exception e) {
            throw new RuntimeException("下载文件失败: " + e.getMessage(), e);
        }
    }

    /**
     * 获取文件URL
     */
    public String getFileUrl(String objectName) {
        try {
            return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .method(Method.GET)
                .build());
        } catch (Exception e) {
            throw new RuntimeException("获取文件url失败: " + e.getMessage(), e);
        }
    }
}

```

## 四、编写控制器
```java
package com.doyo.shiji.controller;

/**
 * <h3>minio控制器</h3>
 *
 * @author wangzhe
 * @version 1.0.0
 * @createTime 2024/11/23 下午1:44
 */

import com.doyo.shiji.model.Response;
import com.doyo.shiji.util.MinioUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/api/files")
public class MinioController {

    @Autowired
    private MinioUtil minioUtil;

    /**
     * 上传文件
     */
    @PostMapping("/upload")
    public Response<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename();
        String objectName = System.currentTimeMillis() + "_" + fileName;
        return Response.ok(minioUtil.uploadFile(file, objectName));
    }

    /**
     * 下载文件
     */
    @GetMapping("/download/{objectName}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String objectName) {
        try (InputStream inputStream = minioUtil.downloadFile(objectName)) {
            byte[] content = readAllBytes(inputStream);
            return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + objectName + "\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(content);
        } catch (Exception e) {
            throw new RuntimeException("下载文件失败: " + e.getMessage(), e);
        }
    }

    /**
     * 替代 Java 9 readAllBytes 方法
     */
    private byte[] readAllBytes(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] temp = new byte[4096];
        int bytesRead;
        while ((bytesRead = inputStream.read(temp)) != -1) {
            buffer.write(temp, 0, bytesRead);
        }
        return buffer.toByteArray();
    }

    /**
     * 获取文件URL
     */
    @GetMapping("/url/{objectName}")
    public Response<String> getFileUrl(@PathVariable String objectName) {
        return Response.ok(minioUtil.getFileUrl(objectName));
    }
}


```

