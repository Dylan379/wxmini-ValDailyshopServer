const koa2Req = require('koa2-request')
const { getWeaponUuid, getWeaponSkinLevel } = require('../middleware/getWeaponInfo')
const { getBundleFace, getBundleItemsInfo } = require('../middleware/getBundleInfo')
const { getBonusStoreWeaponsInfo } = require('../middleware/getBonusStoreInfo')
module.exports = {
    /**
       * 武器皮肤信息
       * @param {Object} ctx
       */
    GetWeaponInfo: async ctx => {
        //避免参数为空
        let { weaponLevel0Uuid } = ctx.request.body;
        if (weaponLevel0Uuid === '') {
            ctx.body = {
                code: '004',
                msg: '请求错误,参数为空'
            }
            return;
        }
        //得到武器的主Uuid,再获取武器信息与皮肤等级
        let weaponUuid = await getWeaponUuid(weaponLevel0Uuid)
        let url = 'https://valorant-api.com/v1/weapons/skins/' + weaponUuid + '?language=zh-TW';
        const res = await koa2Req(url)
        if (res.length === 0) {
            ctx.body = {
                code: '004',
                msg: '请求错误'
            }
        } else {
            let weaponInfo = JSON.parse(res.body);
            weaponInfo.data.skinLevelUrl = await getWeaponSkinLevel(weaponInfo.data.contentTierUuid);
            delete weaponInfo.data.uuid,
                delete weaponInfo.data.levelItem,
                delete weaponInfo.data.themeUuid,
                delete weaponInfo.data.displayIcon,
                delete weaponInfo.data.wallpaper,
                delete weaponInfo.data.assetPath;
            ctx.body = {
                code: '0',
                msg: '请求成功',
                weaponInfo: weaponInfo.data
            }
        }
        return;
    },
    /**
       * 捆绑包信息
       * @param {Object} ctx
       */
    GetBundleInfo: async ctx => {
        //获得捆绑包Uuid与捆绑包内容
        const { bundle } = ctx.request.body;
        const { DataAssetID, Items } = bundle;
        let bundleInfo = {};
        //获得捆绑包的名字与图片
        let bundleFace = await getBundleFace(DataAssetID);
        bundleInfo = bundleFace;
        //获得捆绑包每个单品的名字与图片
        let bundleItemsInfo = await getBundleItemsInfo(Items);
        bundleInfo.Items = bundleItemsInfo;
        if (bundleFace && bundleItemsInfo) {
            //补充信息
            bundleInfo.TotalBaseCost = Object.values(bundle.TotalBaseCost)[0];
            bundleInfo.TotalDiscountPercent = bundle.TotalDiscountPercent;
            bundleInfo.TotalDiscountedCost = Object.values(bundle.TotalDiscountedCost)[0];
            ctx.body = {
                code: '0',
                msg: '请求成功',
                bundleInfo: bundleInfo
            }
        } else {
            ctx.body = {
                code: '008',
                msg: '请求失败'
            }
        }
        return;
    },
    /**
       * 夜市信息
       * @param {Object} ctx
       */
    GetBonusStoreInfo: async ctx => {
        //获得捆绑包Uuid与捆绑包内容
        const { BonusStore } = ctx.request.body;
        const { BonusStoreOffers } = BonusStore;
        let weaponInfoArr = await getBonusStoreWeaponsInfo(BonusStoreOffers)

        ctx.body = {
            code: '0',
            msg: '请求成功',
            weaponInfo: weaponInfoArr
        }
        return;
    }
}