/*
 * @Description: 用户模块数据持久层
 * @Author: hai-27
 * @Date: 2020-03-14 23:26:24
 * @LastEditors: hai-27
 * @LastEditTime: 2020-03-15 00:15:49
 */
const db = require('../db.js');

module.exports = {
    // 检查token是否能找到对应用户
    CheckUser: async (token) => {
        const sql = 'select openid from user_token where token = ?';
        return await db.query(sql, [token]);
    },
    // 检查openid是否能找到对应用户
    HaveUser: async (openid) => {
        const sql = 'select * from user_token where openid = ?';
        return await db.query(sql, [openid]);
    },
    //拿到用户的相关用户信息
    GetUserInfo: async (openid) => {
        const sql = 'select * from users where openid = ?';
        return await db.query(sql, [openid]);
    },
    //将token与openid即用户对应起来
    Regist: async (token, openid) => {
        const sql = 'insert into user_token values (?,?)';
        return await db.query(sql, [token, openid]);
    },
    //更新用户token
    UpdateUserToken: async (token, openid) => {
        const sql = 'update user_token set token = ? where openid = ?';
        return await db.query(sql, [token, openid]);
    },
    //插入用户
    RegistUser: async (openid, avatarurl, nickname) => {
        const sql = 'insert into users values (?,?,?)';
        return await db.query(sql, [openid, nickname, avatarurl]);
    },
    //更新用户信息
    UpdateUser: async (openid, avatarurl, nickname) => {
        const sql = 'update users set avatarurl = ?,nickname = ? where openid = ?';
        return await db.query(sql, [avatarurl, nickname, openid]);
    },
    //检查喜欢列表中是否有想要添加的皮肤
    CheckMyLikes: async (openid, weaponUuid) => {
        const sql = 'select * from user_like where openid = ? and weaponUuid = ?';
        return await db.query(sql, [openid, weaponUuid]);
    },
    //添加皮肤到我喜欢列表
    Add2MyLike: async (openid, weaponUuid) => {
        const sql = 'insert into user_like values (?,?)';
        return await db.query(sql, [openid, weaponUuid]);
    },
    //获得某个用户得喜欢列表
    GetMyLikes: async (openid) => {
        const sql = 'select weaponUuid from user_like where openid = ?';
        return await db.query(sql, [openid]);
    },
    //删除不喜欢的皮肤
    DisLike: async (openid, weaponUuid) => {
        const sql = 'delete from user_like where openid = ? and weaponUuid = ?';
        return await db.query(sql, [openid, weaponUuid]);
    },
    //检查该用户是否评论过
    CheckSKinComment: async (openid, weaponUuid) => {
        const sql = 'select * from user_skin_comment where openid = ? and weaponUuid = ?';
        return await db.query(sql, [openid, weaponUuid]);
    },
    //评论过,则更新之前的评价
    UpdateSKinComment: async (openid, weaponUuid, score, comment) => {
        const sql = 'update user_skin_comment set score = ?,comment = ? where openid = ? and weaponUuid = ?';
        return await db.query(sql, [score, comment, openid, weaponUuid,]);
    },
    //没评论过,则插入新的评价
    AddSKinComment: async (openid, weaponUuid, score, comment) => {
        const sql = 'insert into user_skin_comment values (?,?,?,?)';
        return await db.query(sql, [openid, weaponUuid, score, comment]);
    },
    //通过weaponUuid获得皮肤的评论
    GetSkinComent: async (weaponUuid) => {
        const sql = 'select * from user_skin_comment where weaponUuid = ?';
        return await db.query(sql, [weaponUuid]);
    },
    //检查推送列表中是否有想要添加的皮肤
    CheckMyBellring: async (openid, weaponUuid) => {
        const sql = 'select * from user_bellring where openid = ? and weaponUuid = ?';
        return await db.query(sql, [openid, weaponUuid]);
    },
    //添加皮肤到我的推送列表
    Add2MyBellring: async (openid, weaponUuid) => {
        const sql = 'insert into user_bellring (openid,weaponUuid) values (?,?)';
        return await db.query(sql, [openid, weaponUuid]);
    },
    //获得某个用户得推送列表
    GetMyBellring: async (openid) => {
        const sql = 'select weaponUuid from user_bellring where openid = ?';
        return await db.query(sql, [openid]);
    },
    //删除不再想要推送的皮肤
    DisBellring: async (openid, weaponUuid) => {
        const sql = 'delete from user_bellring where openid = ? and weaponUuid = ?';
        return await db.query(sql, [openid, weaponUuid]);
    },
    //设置推送的邮箱
    SetUserEmail: async (openid, email) => {
        const sql = 'update user_bellring set email = ? where openid = ?';
        return await db.query(sql, [email, openid]);
    },
    //拿到所有用户
    AllUser: async () => {
        const sql = 'select openid,nickname from users';
        return await db.query(sql);
    },
    //拿到用户的邮箱
    GetUserEmail: async (openid) => {
        const sql = 'select email from user_bellring where openid = ?';
        return await db.query(sql, openid);
    },
}