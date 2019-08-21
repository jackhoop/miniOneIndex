# miniOneIndex

#### 前言
利用OneDrive零成本搭建看图小程序或视频小程序，不需要服务器、域名、安全证书等。

#### 扫码体验
![Image text](https://oneindex.oss-cn-hangzhou.aliyuncs.com/gh_6c17c75023bb_258.jpg)

## 交流
QQ群：781407362 或扫描二维码。
<p align="center"><img src="https://oneindex.oss-cn-hangzhou.aliyuncs.com/githubQrcode.jpg" alt="" style="max-width:100%;" width="748"></p>	


#### 准备：

1. 小程序账号，并开通云函数 基础免费版 主要用于获取token
2. OneDrive 账号 (个人、企业版或教育版/工作或学校帐户)


#### 小程序使用到的云开发内容：
> 不了解小程序云开发请访问[文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
云函数，云数据库：
- 数据库：存储Token数据， 创建表token 把database_export-wWsxvKLEWJJj.json 导入云数据库，然后把值改为自己的。
- 云函数：获取OneDrive accessToken,把token函数目录复制到cloudfunctions目录，把index.js中的环境ID改为自己的，然后目录右键 上传部署 上传触发器

详细教程文章参考：https://bftudou.com/archives/139

#### 配置：

1. 小程序后台request合法域名域名添加：	
    https://graph.microsoft.com
    https://login.microsoftonline.com

2. 把store.js中的环境ID改为自己的


#### OneDrive目录结构
- 顶级目录
![Image text](https://oneindex.oss-cn-hangzhou.aliyuncs.com/1.png)
- 菜单目录
![Image text](https://oneindex.oss-cn-hangzhou.aliyuncs.com/2.png)
- 分类目录
![Image text](https://oneindex.oss-cn-hangzhou.aliyuncs.com/3.png)




