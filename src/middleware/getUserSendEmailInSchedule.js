const schedule = require('node-schedule');
const userDao = require('../models/dao/usersStateDao');
const { getDailyWeaponUuid } = require('../middleware/getDailyWeaponUuid')
const { hasSame, sameItems } = require('../middleware/hasSameItem')
const { sendEmail2User } = require('../middleware/sendEmail')
const koa2Req = require('koa2-request')
module.exports = {
    /**
     * 校验用户信息是否符合规则
     * @return: 
     */
    getUserSendEmail: () => {
        // 定义规则
        // let rule = new schedule.RecurrenceRule();
        // rule.second = [0, 10, 20, 30, 40, 50]; // 每隔 10 秒执行一次
        //'10 30 8 * * *'
        schedule.scheduleJob('10 30 8 * * *', async () => {
            const sqlres = await userDao.AllUser();
            sqlres.forEach(async element => {
                let thisUserDailyWeaponUuid = await getDailyWeaponUuid(element.nickname)
                let thisUserBellrings = (await userDao.GetMyBellring(element.openid).then((res) => {
                    let weaponUuidArr = [];
                    res.forEach(element1 => {
                        weaponUuidArr.push(element1.weaponUuid)
                    })
                    return weaponUuidArr
                }))
                if (hasSame(thisUserBellrings, thisUserDailyWeaponUuid)) {
                    let bellringList = await sameItems(thisUserBellrings, thisUserDailyWeaponUuid)
                    let weaponName = '';
                    for (let i = 0; i < bellringList.length; i++) {
                        weaponName += ' ' + (JSON.parse((await koa2Req('https://valorant-api.com/v1/weapons/skinlevels/' + bellringList[i] + '?language=zh-TW')).body)).data.displayName;
                    }
                    const text = '你的订阅表中的皮肤' + weaponName + '出现在每日商店中了,快去看看吧!'
                    const email = ((await userDao.GetUserEmail(element.openid))[0]).email;
                    await sendEmail2User(email, text)
                }

            });
        });
    },
}