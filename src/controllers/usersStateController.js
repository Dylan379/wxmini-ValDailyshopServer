/*
 * @Description: 用户模块控制器
 * @Author: hai-27
 * @Date: 2020-03-14 21:16:08
 * @LastEditors: hai-27
 * @LastEditTime: 2020-03-15 00:15:27
 */
const koa2Req = require('koa2-request');
const jwt = require('../middleware/token')
const { translate2Complex } = require('../middleware/translate2Complex')
const userDao = require('../models/dao/usersStateDao');
const { getWeaponUuid, getWeaponSkinLevel, getSkinBundles } = require('../middleware/getWeaponInfo')
module.exports = {
    /**
     * 用户登录
     * @param {Object} ctx
     */
    Login: async ctx => {
        const appid = 'wx70e4cf6c9d31e2c8';
        const secret = 'f9cb254f97fc727cc27e1a79e3e039c2';
        const { code, avatarurl, nikename } = ctx.request.body;
        if (code) {
            const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code';
            const res = JSON.parse((await koa2Req(url)).body);
            const token = jwt.creatToken(res);
            const sqlres = (await userDao.HaveUser(res.openid))[0]
            if (sqlres) {
                //存在用户则更新token
                const sqlres1 = await userDao.UpdateUserToken(token, res.openid)
                if (sqlres1.affectedRows) {
                    const sqlres2 = await userDao.UpdateUser(res.openid, avatarurl, nikename)
                    if (sqlres2.affectedRows) {
                        ctx.body = {
                            code: '0',
                            msg: '请求成功',
                            token: token
                        }
                    }
                }
            } else {
                //不存在用户则自动注册
                if (userDao.Regist(token, res.openid)) {
                    if (userDao.RegistUser(res.openid, avatarurl, nikename)) {
                        ctx.body = {
                            code: '0',
                            msg: '请求成功',
                            token: token
                        }

                    }
                }
            }
        }
        return;
    },
    /**
     * 得到用户名等数据
     * @param {Object} ctx
     */
    GetUserInfo: async ctx => {
        const { token } = ctx.request.body
        const res = jwt.verifyToken(token);
        if (res) {
            const sqlres = await userDao.GetUserInfo(res.openid);
            if (sqlres) {
                ctx.body = {
                    code: '0',
                    msg: '请求成功',
                    userInfo: sqlres[0]
                }
            }
        } else {
            ctx.body = {
                code: '404',
                msg: '身份验证过期'
            }
        }
        return;
    },
    /**
     * 添加武器到我喜欢列表
     * @param {Object} ctx
     */
    Add2MyLikes: async ctx => {
        const { token, weaponUuid } = ctx.request.body
        const res = jwt.verifyToken(token);
        if (res) {
            const sqlres1 = await userDao.CheckMyLikes(res.openid, weaponUuid);
            if (!sqlres1[0]) {
                const sqlres2 = await userDao.Add2MyLike(res.openid, weaponUuid);
                if (sqlres2.affectedRows) {
                    ctx.body = {
                        code: '0',
                        msg: '添加成功',
                    }
                }
            } else {
                ctx.body = {
                    code: '01',
                    msg: '已添加过',
                }
            }
        } else {
            ctx.body = {
                code: '404',
                msg: '身份验证过期'
            }
        }
        return;
    },
    /**
     * 得到我喜欢皮肤列表
     * @param {Object} ctx
     */
    GetUserLikes: async ctx => {
        const { token } = ctx.request.body
        const res = jwt.verifyToken(token);
        if (res) {
            const sqlres = await userDao.GetMyLikes(res.openid);
            let weaponUuids = [];
            sqlres.forEach(element => {
                weaponUuids.push(element.weaponUuid)
            });
            if (sqlres) {
                ctx.body = {
                    code: '0',
                    msg: '请求成功',
                    weaponUuids: weaponUuids
                }
            }
        } else {
            ctx.body = {
                code: '404',
                msg: '身份验证过期'
            }
        }
        return;
    },
    /**
     * 删除不再喜欢的皮肤
     * @param {Object} ctx
     */
    DisLikeFromLikes: async ctx => {
        const { token, weaponUuid } = ctx.request.body
        const res = jwt.verifyToken(token);
        if (res) {
            const sqlres = await userDao.DisLike(res.openid, weaponUuid);
            console.log(sqlres.affectedRows);
            if (sqlres.affectedRows) {
                ctx.body = {
                    code: '0',
                    msg: '删除成功',
                }
            }
        } else {
            ctx.body = {
                code: '404',
                msg: '身份验证过期'
            }
        }
        return;
    },
    /**
    * 添加评论
    * @param {Object} ctx
    */
    AddSkinComment: async ctx => {
        const { token, weaponUuid, score, comment } = ctx.request.body
        const res = jwt.verifyToken(token);
        if (res) {
            const sqlres = await userDao.CheckSKinComment(res.openid, weaponUuid);
            console.log(sqlres[0]);
            if (sqlres[0]) {
                const sqlres1 = await userDao.UpdateSKinComment(res.openid, weaponUuid, score, comment)
                if (sqlres1.affectedRows) {
                    ctx.body = {
                        code: '01',
                        msg: '更新成功'
                    }
                }
            } else {
                const sqlres2 = await userDao.AddSKinComment(res.openid, weaponUuid, score, comment)
                if (sqlres2.affectedRows) {
                    ctx.body = {
                        code: '02',
                        msg: '评论添加成功'
                    }
                }
            }
        } else {
            ctx.body = {
                code: '404',
                msg: '身份验证过期'
            }
        }
        return;
    },
    /**
     * 得到某个皮肤的评论
     * @param {Object} ctx
     */
    GetWeaponSkinComment: async ctx => {
        const { weaponUuid } = ctx.request.body
        const sqlres = await userDao.GetSkinComent(weaponUuid);
        //随机获得一个用户
        const aComment = sqlres[Math.floor(Math.random() * sqlres.length)];
        if (aComment) {
            const sqlres1 = (await userDao.GetUserInfo(aComment.openid))[0];
            let commentInfo = {};
            commentInfo.account = sqlres1.nickname,
                commentInfo.score = aComment.score,
                commentInfo.comment = aComment.comment;
            if (commentInfo) {
                ctx.body = {
                    code: '0',
                    msg: '评论获取成功',
                    commentInfo: commentInfo
                }
            }
        } else {
            ctx.body = {
                code: '10',
                msg: '该皮肤暂无评论',
            }
        }
        return;
    },
    /**
     * 查询皮肤
     * @param {Object} ctx
     */
    GetSkinBundles: async ctx => {
        const { token, skinName } = ctx.request.body
        const res = jwt.verifyToken(token);
        if (res) {
            const skinNameInComplex = await translate2Complex(skinName);
            const weaponBundlesInfo = await getSkinBundles(skinNameInComplex);
            if (weaponBundlesInfo) {
                ctx.body = {
                    code: '0',
                    msg: '获取成功',
                    weaponBundlesInfo: weaponBundlesInfo
                }
            }
        } else {
            ctx.body = {
                code: '404',
                msg: '身份验证过期'
            }
        }
        return;
    },
    /**
     * 将皮肤添加至我的推送
     * @param {Object} ctx
     */
    Add2MyBellring: async ctx => {
        const { token, weaponUuid } = ctx.request.body
        const res = jwt.verifyToken(token);
        //token正常
        if (res) {
            const sqlres1 = await userDao.CheckMyBellring(res.openid, weaponUuid);
            if (!sqlres1[0]) {//若不在订阅表中
                const sqlres2 = await userDao.Add2MyBellring(res.openid, weaponUuid);
                if (sqlres2.affectedRows) {
                    ctx.body = {
                        code: '0',
                        msg: '添加成功',
                    }
                }
            } else {
                ctx.body = {
                    code: '01',
                    msg: '已添加过',
                }
            }
        } else {
            ctx.body = {
                code: '404',
                msg: '身份验证过期'
            }
        }
        return;
    },
    /**
     * 删除不再想要推送的皮肤
     * @param {Object} ctx
     */
    DisBellringFromBellrings: async ctx => {
        const { token, weaponUuid } = ctx.request.body
        const res = jwt.verifyToken(token);
        if (res) {
            const sqlres = await userDao.DisBellring(res.openid, weaponUuid);
            if (sqlres.affectedRows) {
                ctx.body = {
                    code: '0',
                    msg: '删除成功',
                }
            }
        } else {
            ctx.body = {
                code: '404',
                msg: '身份验证过期'
            }
        }
        return;
    },
    /**
     * 得到我的推送皮肤列表
     * @param {Object} ctx
     */
    GetUserBellring: async ctx => {
        const { token } = ctx.request.body
        const res = jwt.verifyToken(token);
        if (res) {
            const sqlres = await userDao.GetMyBellring(res.openid);
            let weaponUuids = [];
            sqlres.forEach(element => {
                weaponUuids.push(element.weaponUuid)
            });
            if (sqlres) {
                ctx.body = {
                    code: '0',
                    msg: '请求成功',
                    weaponUuids: weaponUuids
                }
            }
        } else {
            ctx.body = {
                code: '404',
                msg: '身份验证过期'
            }
        }
        return;
    },
    /**
     * 设置推送邮箱
     * @param {Object} ctx
     */
    SetUserEmail: async ctx => {
        const { token, email } = ctx.request.body
        var reg = new RegExp(/^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/)
        if (reg.test(email)) {
            const res = jwt.verifyToken(token);
            if (res) {
                const sqlres = await userDao.SetUserEmail(res.openid, email);
                if (sqlres.affectedRows) {
                    ctx.body = {
                        code: '0',
                        msg: '邮箱更新成功'
                    }
                }
                else {
                    ctx.body = {
                        code: '104',
                        msg: '至少订阅一件'
                    }
                }
            } else {
                ctx.body = {
                    code: '404',
                    msg: '身份验证过期'
                }
            }
        } else {
            ctx.body = {
                code: '201',
                msg: '邮箱格式错误'
            }
        }
        return;
    },
};