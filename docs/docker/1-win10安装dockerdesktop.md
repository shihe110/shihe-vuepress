## 1.docker下载
[官网下载地址](https://docs.docker.com/docker-for-windows/install/#download-docker-for-windows)

可使用迅雷加快下载速度

## 2.启动Hyper-V
"控制面板"->"程序"->"启动或关闭Windows功能"-重启

重启后检查启动情况-win图标-windows管理工具

## 3.安装
可能会出现内存不足问题-可以在任务栏找到-docker图标-右键settings--advanced调整内存值

## 4.验证
win+R  cmd  
命令：docker --version

## 5.win10家庭版没有Hyper-V解决办法

将以下的命令保存在一个txt文件中，然后重命名为.cmd文件，最后以管理员身份运行该文件。

```
pushd "%~dp0"dir /b %SystemRoot%\servicing\Packages\*Hyper-V*.mum >hyper-v.txtfor /f %%i in ('findstr /i . hyper-v.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"del hyper-v.txtDism /online /enable-feature /featurename:Microsoft-Hyper-V-All /LimitAccess /ALL
```

该命令运行过程中会出现百分比，如果运行成功不关闭的话可能会一遍遍运行，当你看到运行成功即可关闭该文件，然后重启电脑就可以拥有完整的Hyper-V选项了。

按照第2步进行启动Hyper-V

## 6.解决家庭版win10问题

家庭版伪装成专业版

由于家庭版的系统不支持Docker Desktop版本的安装，所以我们得把家庭版伪装成专业版从而绕过软件的检测。

步骤很简单，在cmd命令中运行regedit，打开注册表，按照以下路径找到相应的位置进行修改。

路径：

HKEY_LOCAL_MACHINE\software\Microsoft\WindowsNT\CurrentVersion

点击current version，在右侧找到EditionId，右键点击EditionId 选择“修改”，在弹出的对话框中将第二项“数值数据”的内容改为Professional，然后点击确定。

注意，这个修改会在电脑重启之后恢复原状。只要后续安装成功的话就没有影响了。


