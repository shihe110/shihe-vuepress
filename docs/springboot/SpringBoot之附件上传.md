### SpringBoot之附件上传

springboot + thymeleaf

#### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

单附件上传html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="file" multiple>
    <input type="submit" value="提交">
</form>
</body>
</html>
```

#### 后台FileUploadController

```java
@RestController
public class FileUploadController {

    SimpleDateFormat sdf = new SimpleDateFormat("/yyyy/MM/dd/");

    @PostMapping("/upload")
    public String upload(MultipartFile file, HttpServletRequest req) {
        String format = sdf.format(new Date());
        String realPath = req.getServletContext().getRealPath("/img") + format;
        File folder = new File(realPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }
        String oldName = file.getOriginalFilename();
        String newName = UUID.randomUUID().toString() + oldName.substring(oldName.lastIndexOf("."));
        try {
            file.transferTo(new File(folder, newName));
            String url = req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + "/img" + format + newName;
            return url;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }

}
```

#### 上传附件大小限制application.properties

```properties
spring.servlet.multipart.max-file-size=100MB
```

#### 自定义异常处理

```java
@ControllerAdvice
public class MyCustomException {
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ModelAndView myexception(MaxUploadSizeExceededException e) throws IOException {
        ModelAndView mv = new ModelAndView("myerror");
        mv.addObject("error", "上传文件大小超出限制！");
        return mv;
    }
}
```

#### 单附件上传-ajax

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="jquery3.3.1.js"></script>
</head>
<body>
<div id="result"></div>
<input type="file" id="file">
<input type="button" value="上传" onclick="uploadFile()">
<script>
    function uploadFile() {
        var file = $("#file")[0].files[0];
        var formData = new FormData();
        formData.append("file", file);
        $.ajax({
            type:'post',
            url:'/upload',
            processData:false,
            contentType:false,
            data:formData,
            success:function (msg) {
                $("#result").html(msg);
            }
        })
    }
</script>
</body>
</html>
```

#### 多附件上传-html - multiple

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form action="/uploads" method="post" enctype="multipart/form-data">
    <input type="file" name="files" multiple>
    <input type="submit" value="提交">
</form>
</body>
</html>

```

#### 多附件上传controller

```java
 @PostMapping("/uploads")
    public String uploads(MultipartFile[] files, HttpServletRequest req) {
        String format = sdf.format(new Date());
        String realPath = req.getServletContext().getRealPath("/img") + format;
        File folder = new File(realPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }
        for (MultipartFile file : files) {
            String oldName = file.getOriginalFilename();
            String newName = UUID.randomUUID().toString() + oldName.substring(oldName.lastIndexOf("."));
            try {
                file.transferTo(new File(folder, newName));
                String url = req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + "/img" + format + newName;
                System.out.println(url);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "success";
    }
```



