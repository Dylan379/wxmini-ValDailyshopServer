
const Router = require('koa-router');
const shopController = require('../../controllers/shopController')

let shopRouter = new Router();

shopRouter
    .post('/shop/getWeaponInfo', shopController.GetWeaponInfo)
    .post('/shop/getBundleInfo', shopController.GetBundleInfo)
    .post('/shop/getBonusStoreInfo', shopController.GetBonusStoreInfo)
module.exports = shopRouter;