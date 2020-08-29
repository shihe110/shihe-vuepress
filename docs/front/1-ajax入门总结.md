## ajax入门总结

## 1.什么是ajax？
js和xml异步技术，动态创建动态网页技术。

## 2.ajax的工作原理
- XMLHttpRequest对象发送HttpRequest请求  
- 服务器处理并返回结果  
- js处理返回数据更新页面内容

## 3.JavaScript关键对象
XMLHttpRequest对象（异步的与服务器交换数据）

## 4.ajax请求的方法有哪些？
- open()
- send()  

| 方法 | 说明 |
| ---- | ---- |
| open(method,url,) | 规定请求的类型、URL 以及是否异步处理请求。method：请求的类型；GET 或 POST   url：文件在服务器上的位置 async：true（异步）或 false（同步）|
| send(string) | 将请求发送到服务器。string：仅用于 POST 请求 |

发送一个请求的示例：
```
// get请求
xmlhttp.open("GET","/try/ajax/demo_get2.php?fname=Henry&lname=Ford",true);
xmlhttp.send();

// post请求
xmlhttp.open("POST","/try/ajax/demo_post.php",true);
xmlhttp.send();


xmlhttp.open("POST","/try/ajax/demo_post2.php",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send("fname=Henry&lname=Ford");
```


## 5.setRequestHeader(header,value)方法


## 6.异步请求
```
// Async=true
xmlhttp.onreadystatechange=function()
{
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
}
xmlhttp.open("GET","/try/ajax/ajax_info.txt",true);
xmlhttp.send();
```

## 7.服务端相应
XMLHttpRequest的响应属性：responseText或responseXML
| 属性 | 说明 |
| ---- | ---- |
| responseText | 获得字符串形式的响应数据 |
| responseXML | 获得xml形式的响应数据 |

xml形式响应
```
xmlDoc=xmlhttp.responseXML;
txt="";
x=xmlDoc.getElementsByTagName("ARTIST");
for (i=0;i<x.length;i++)
{
    txt=txt + x[i].childNodes[0].nodeValue + "<br>";
}
document.getElementById("myDiv").innerHTML=txt;
```

## 8.事件
readyState状态属性改变触发onreadystatechange事件

XMLHttpRequest 对象的三个重要的属性：
| 属性 | 说明 |
| ---- | ---- |
| onreadystatechange | 函数名，当readyState改变时，就会调用该函数|
| readyState | 请求对象的状态 0：请求初始化 1：服务器连接已建立 2：请求已接收 3：请求处理中 4：请求已完成，且响应已就绪 |
| status | 200：“OK”  404：未找到页面 |


