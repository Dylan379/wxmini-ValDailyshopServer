const koa2Req = require('koa2-request')
module.exports = {
    /**
       * 校验用户信息是否符合规则
       * @param {string} contentTierUuid
       * @return: 
       */
    getWeaponSkinLevel: async (contentTierUuid) => {
        let skinLevelUrl = '';
        let url = 'https://valorant-api.com/v1/contenttiers/' + contentTierUuid;
        const res = await koa2Req(url);
        let skinLevelInfo = JSON.parse(res.body);
        if (skinLevelInfo.status === 200) {
            skinLevelUrl = skinLevelInfo.data.displayIcon;
            return skinLevelUrl;
        }
    },
    /**
       * 校验用户信息是否符合规则
       * @param {string} weaponLevel0Uuid
       * @return: 
       */
    getWeaponUuid: async (weaponLevel0Uuid) => {
        let weaponUuid = '';
        const res = require('../../public/json/skins.json');
        res.data.forEach(element => {
            if (element.levels[0].uuid === weaponLevel0Uuid) {
                weaponUuid = element.uuid;
            }
        });
        return weaponUuid;
    },
    /**
       * 校验用户信息是否符合规则
       * @param {String} skinName
       * @return: 
       */
    getSkinBundles: async (skinName) => {
        let weaponBundlesInfo = [];
        const res = require('../../public/json/skins.json');
        var reg = new RegExp('' + skinName)
        res.data.forEach(async element => {
            if (reg.test(element.displayName)) {
                element.chromas.length = 1,
                    element.displayIcon = 0,
                    element.levels.length = 1;
                weaponBundlesInfo.push(element)
            }
        });
        return weaponBundlesInfo;
    }
}