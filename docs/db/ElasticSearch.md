## ElasticSearch学习笔记

### ElasticSearch是什么

ElasticSearch是一个基于Lucene，分布式，通过RestFul方式进行交互的近实时的搜索平台框架。

### ES官网

ElasticSearch官网：https://www.elastic.co/cn/

说明：

- ES安装的JDK的最低要求是1.8

- java开发中，ES的依赖版本必须和ES版本一致

### 下载安装es

下载地址：https://www.elastic.co/cn/downloads/elasticsearch

![image-20200917134700966](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917134700966.png)

>解压即用

解压目录

![image-20200917134843804](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917134843804.png)

配置文件说明

![image-20200917135003013](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917135003013.png)

jvm.options

![image-20200917135059451](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917135059451.png)

内存设置较大，注意机器配置避免无法启动

elasticsearch.yml配置文件，默认9200端口，注意跨域问题解决。

### 启动ES

```cmd
# 进入安装目录
cd C:\Program Files\elasticsearch-7.9.1  
# 启动
bin\elasticsearch.bat
```

### 访问9200验证

```http
http://127.0.0.1:9200
```

```json
# 出现以下结果表示安装启动成功
{
"name": "ADMIN-PC",
"cluster_name": "elasticsearch",
"cluster_uuid": "x88DE9qeRPy2rcmXyMhiUw",
"version": {
"number": "7.9.1",
"build_flavor": "default",
"build_type": "zip",
"build_hash": "083627f112ba94dffc1232e8b42b73492789ef91",
"build_date": "2020-09-01T21:22:21.964974Z",
"build_snapshot": false,
"lucene_version": "8.6.2",
"minimum_wire_compatibility_version": "6.8.0",
"minimum_index_compatibility_version": "6.0.0-beta1"
},
"tagline": "You Know, for Search"
}
```

### 安装head可视化插件

![image-20200917140424339](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917140424339.png)

该项目是一个标准前端项目，前提是必须有node环境

1、下载地址：https://github.com/mobz/elasticsearch-head

2、解压安装依赖:nmp install  或下载慢可使用淘宝:cnpm install

![image-20200917140314943](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917140314943.png)

3、head目录下cmd启动：npm run start

![image-20200917140637261](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917140637261.png)

4、启动es、访问head

![image-20200917141319265](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917141319265.png)

5、解决跨域问题elasticsearch.yml增加配置

```yaml
http.cors.enabled: true # 开启跨域
http.cors.allow-origin: "*" # 允许所有人访问
```

6、重启es再次连接

![image-20200917142119596](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917142119596.png)

es专有名词：索引（库）、文档（数据记录）

### ELK概览

ElasticSearch、Logstash、Kibana

Logstash是中央数据流引擎，用于从不同的目标（文件、db、mq）收集不同格式的数据，经过过滤后支持输出到不同目的地（文件、mq、redis、es、kafka等）

即：logstash服务收集清洗数据=》elasticsearch负责搜索存储=》Kibana负责分析可视化

### 下载Kibana

Kibana下载地址：https://www.elastic.co/cn/downloads/kibana

![image-20200917094325056](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917094325056.png)

### 解压安装Kibana

![image-20200917143902716](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917143902716.png)

### 启动测试验证

```cmd
# 进入目录
cd C:\Program Files\kibana-7.9.1-windows
# 启动
bin\kibana.bat
```

访问地址：

```http
http://127.0.0.1:5601
```

### 汉化配置

打开Kibana配置文件：kibana.yml

![image-20200917155920893](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917155920893.png)

![image-20200917155658938](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917155658938.png)

![image-20200917155742847](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917155742847.png)

### ES核心概述

1.索引

2.字段规则（mapping）

3.文档（document）



集群、节点、索引、类型、文档、分片、映射  专有名词

>elasticsearch是面向文档。和关系型数据库对比
>
>es都是json

关系型数据库和ES对比

|    Relation DB     |    ElasticSearch    |
| :----------------: | :-----------------: |
| 数据库（database） |   索引（indices）   |
|    表（table）     | 类型（type)将被弃用 |
|     行（row）      |  文档（document）   |
|  字段（columns）   |   属性（fields）    |

- 正向索引：例如数据文档 id

- 倒排索引：将文档提取关键词，并建立关键词和文档的矩阵。

**正向索引**的结构如下：

​    “文档1”的ID > 单词1：出现次数，出现位置列表；单词2：出现次数，出现位置列表；

​    “文档2”的ID > 此文档出现的关键词列表。

![image-20200917173341208](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917173341208.png)

**倒排索引**的结构如下：

​    “关键词1”：“文档1”的ID，“文档2”的ID

​    “关键词2”：带有此关键词的文档ID列表。

![image-20200917173349597](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917173349597.png)

![image-20200917173404422](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917173404422.png)

### ik分词器插件

1、下载

下载地址：https://github.com/medcl/elasticsearch-analysis-ik/releases

2、解压到es安装目录下的plugins文件夹新建的ik文件夹下

![image-20200917142826815](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917142826815.png)

3、启动es观察启动界面，ik插件已加载

![image-20200917142943241](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917142943241.png)

4、查看ES的插件列表

![image-20200917173908338](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20200917173908338.png)