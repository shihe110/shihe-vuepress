## idea基于github代码托管拉取项目

- 1.注册github账号
- 2.安装git
- 3.IDE设置git
Settings->Version Control->git
    配置本地git路径：D:/git/bin/git.exe
- 4.ide配置github账号
Settings->Version Control->GitHub
    Host:xxx
    Token:xxx
- 5.github拉取项目
new project ->Project from Version Control 或VCS->Checkout from Version Control
选择git:填写github库地址（https://github.com/XXX/xxx）

- 6.本地开发

- 7.提交（先远程拉取，避免代码冲突，再做提交）