const koa2Req = require('koa2-request')
const config = {
    token: '59a05fbc-9281-11ed-a2f5-525400c9274f'
}
// const fetch = require('fetch')
module.exports = {
    /**
       * 得到捆绑包的name和displayIcon
       * @param {string} account
       * @return: 
       */
    getDailyWeaponUuid: async (thisaccount) => {
        const option = {
            method: 'post',
            uri: 'https://val.musnow.top/api/v2/shop',
            body: {
                "account": decodeURI(thisaccount),
                "token": decodeURI(config.token),
                "raw": 1
            },
            json: true
        }
        const res = (await koa2Req(option)).body;
        return res.storefront.SkinsPanelLayout.SingleItemOffers
    },

}