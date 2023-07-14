const koa2Req = require('koa2-request')
const urlMap = new Map();
urlMap.set('de7caa6b-adf7-4588-bbd1-143831e786c6', 'https://valorant-api.com/v1/playertitles/')
    .set('dd3bf334-87f3-40bd-b043-682a57a8dc3a', 'https://valorant-api.com/v1/buddies/levels/')
    .set('3f296c07-64c3-494c-923b-fe692a4fa1bd', 'https://valorant-api.com/v1/playercards/')
    .set('e7c63390-eda7-46e0-bb7a-a6abdacd2433', 'https://valorant-api.com/v1/weapons/skinlevels/')
    .set('d5f120f8-ff8c-4aac-92ea-f2b5acbe9475', 'https://valorant-api.com/v1/sprays/levels/')
// const fetch = require('fetch')
module.exports = {
    /**
       * 得到捆绑包的name和displayIcon
       * @param {string} BundleUuid
       * @return: 
       */
    getBundleFace: async (BundleUuid) => {
        let bundleFace = {};
        let url = 'https://valorant-api.com/v1/bundles/' + BundleUuid + '?language=zh-TW';
        const res = await koa2Req(url);
        let bundleInfo = JSON.parse(res.body);
        if (bundleInfo.status === 200) {
            bundleFace.url = bundleInfo.data.displayIcon;
            bundleFace.name = bundleInfo.data.displayName;
            return bundleFace;
        }
    },
    /**
       * 得到捆绑包的name和displayIcon
       * @param {Array} Items
       * @return: 
       */
    getBundleItemsInfo: async (Items) => {
        //2023/6/23 以获取到捆绑包信息,在考虑速度优化问题,也许可以使用promise.all();
        let promiseAllArr = [];
        for (let i = 0; i < Items.length; i++) {
            let url = urlMap.get(Items[i].Item.ItemTypeID) + Items[i].Item.ItemID + '?language=zh-TW';
            promiseAllArr.push(koa2Req(url));
        }
        const allPromise = Promise.all(promiseAllArr);
        const res = await allPromise;
        for (let i = 0; i < Items.length; i++) {
            let elementInfo = JSON.parse(res[i].body);
            if (elementInfo.status === 200) {
                Items[i].name = elementInfo.data.displayName;
                Items[i].displayUrl = elementInfo.data.displayIcon;
                delete Items[i].Item,
                    delete Items[i].CurrencyId,
                    delete Items[i].IsPromoItem;
            }
        }
        return Items
    },
}