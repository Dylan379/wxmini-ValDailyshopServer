/*
 * @Description: 用户模块路由
 * @Author: hai-27
 * @Date: 2020-03-14 20:58:10
 * @LastEditors: hai-27
 * @LastEditTime: 2020-03-15 00:19:18
 */
const Router = require('koa-router');
// 导入控制层
const usersStateController = require('../../controllers/usersStateController');

let usersRouter = new Router();

usersRouter
  .post('/users/login', usersStateController.Login)
  .post('/users/getUserInfo', usersStateController.GetUserInfo)
  .post('/users/add2MyLike', usersStateController.Add2MyLikes)
  .post('/users/getMyLikes', usersStateController.GetUserLikes)
  .post('/users/disLikeSkin', usersStateController.DisLikeFromLikes)
  .post('/users/addSkinComment', usersStateController.AddSkinComment)
  .post('/users/getSkinComment', usersStateController.GetWeaponSkinComment)
  .post('/users/getSkinBundles', usersStateController.GetSkinBundles)
  .post('/users/add2MyBellring', usersStateController.Add2MyBellring)
  .post('/users/getMyBellring', usersStateController.GetUserBellring)
  .post('/users/disBellringSkin', usersStateController.DisBellringFromBellrings)
  .post('/users/setMyEmail', usersStateController.SetUserEmail)

module.exports = usersRouter;