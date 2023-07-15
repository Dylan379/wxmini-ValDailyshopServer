# 引言
该项目是作为[瓦批的每日商店小程序](https://github.com/Dylan379/wxmini-ValDailyshop)服务端存在,其使用基于[NodeJS](https://nodejs.org/en)的[Koa](https://koa.bootcss.com/)框架简化了接口设计.其目的是为了驱动小程序运行.

# 运行

使用`npm install i`安装依赖

使用`cd src`进入源码文件夹,再使用`node app.js`运行,终端显示`服务器启动在5000端口`表明项目启动正常

也可根据自己需要修改相关启动命令,以及启动端口.

# 接口说明

## 每日商店接口

| 接口                    | 参数             | 说明           |
| ----------------------- | ---------------- | -------------- |
| /shop/getWeaponInfo     | weaponLevel0Uuid | 获取皮肤的信息 |
| /shop/getBundleInfo     | bundle           | 获取捆绑包信息 |
| /shop/getBonusStoreInfo | BonusStore       | 获取夜市信息   |

## 用户功能接口

| 接口                   | 参数                                      | 说明                       |
| ---------------------- | ----------------------------------------- | -------------------------- |
| /users/login           | code,avatarurl,nikename                   | 实现微信登录,获取扩展功能  |
| /users/getUserInfo     | token                                     | 获取用户的个人信息         |
| /users/add2MyLike      | token,weaponUuid                          | 将皮肤添加至喜欢列表       |
| /users/getMyLikes      | token                                     | 获取个人喜欢列表           |
| /users/disLikeSkin     | token,weaponUuid                          | 将武器皮肤从喜欢列表中删除 |
| /users/addSkinComment  | token, weaponUuid, score(number), comment | 给武器皮肤进行评价         |
| /users/getSkinComment  | weaponUuid                                | 得到武器的评价             |
| /users/getSkinBundles  | token, skinName                           | 条件查询武器皮肤           |
| /users/add2MyBellring  | token, weaponUuid                         | 将皮肤添加至推送列表       |
| /users/getMyBellring   | token                                     | 得到我的推送列表           |
| /users/disBellringSkin | token, weaponUuid                         | 将皮肤移出推送列表         |
| /users/setMyEmail      | token, email                              | 设置推送邮箱               |

以上接口参数后未作说明的皆为String类型,返回类型为JSON格式.

# 鸣谢

该项目使用有以下第三方接口

1. 由[@musnows](https://github.com/musnows)大佬提供的[Val-shop](https://val.musnow.top/)接口仓库,帮助实现拳头游戏的登录以及每日商店原始数据的提供

2. 由[Valorant-API](https://dash.valorant-api.com/)提供的皮肤以及其他物品的查询接口

3. 由[Cretin](https://www.mxnzp.com/)提供的简繁转换接口,帮助实现简繁用于相关查询

   ------

   感谢以上开源作者以及项目!
