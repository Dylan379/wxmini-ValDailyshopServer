const koa2Req = require('koa2-request')
const { getWeaponUuid, getWeaponSkinLevel } = require('./getWeaponInfo')
// const fetch = require('fetch')
module.exports = {
    /**
      * 得到夜市每把武器的name和displayIcon
      * @param {Array} BonusStoreOffers
      * @return: 
      */
    getBonusStoreWeaponsInfo: async (BonusStoreOffers) => {
        let weaponUuidArr = [];
        let requestWeaponInfoArr = [];
        let weaponInfoArr = [];
        //获得每把武器的信息
        BonusStoreOffers.forEach((element) => {
            weaponUuidArr.push(getWeaponUuid(element.Offer.OfferID));
        })
        const weaponUuidRes = Promise.all(weaponUuidArr);
        (await weaponUuidRes).forEach((weaponUuid) => {
            const url = 'https://valorant-api.com/v1/weapons/skins/' + weaponUuid + '?language=zh-TW';
            requestWeaponInfoArr.push(koa2Req(url));
        })
        // const weaponInfoRes = Promise.all(requestWeaponInfoArr);
        const weaponInfoPromises = Promise.all(requestWeaponInfoArr);
        const weaponInfoRes = await weaponInfoPromises;
        for (let i = 0; i < weaponInfoRes.length; i++) {
            let weaponInfo = JSON.parse(weaponInfoRes[i].body);
            weaponInfo.data.skinLevelUrl = await getWeaponSkinLevel(weaponInfo.data.contentTierUuid);
            delete weaponInfo.data.uuid,
                delete weaponInfo.data.levelItem,
                delete weaponInfo.data.themeUuid,
                delete weaponInfo.data.displayIcon,
                delete weaponInfo.data.wallpaper,
                delete weaponInfo.data.assetPath,
                delete weaponInfo.data.chromas,
                weaponInfo.data.levels.length = 1;
            weaponInfo.data.discountCosts = Object.values(BonusStoreOffers[i].DiscountCosts)[0],
                weaponInfo.data.discountPercent = BonusStoreOffers[i].DiscountPercent,
                weaponInfo.data.cost = Object.values(BonusStoreOffers[i].Offer.Cost)[0];
            weaponInfoArr.push(weaponInfo.data);
        }
        //2023/6/27 还需要添加一些必要信息,像原价折扣价格,结束时间等
        return weaponInfoArr
    },
}