const koa2Req = require('koa2-request')
const baseurl = 'https://www.mxnzp.com/api/convert/zh';
const config = {
    type: 1,
    app_id: '',
    app_secreat: ''
}
module.exports = {
    /**
     * 校验用户信息是否符合规则
     * @param {String} content
     * @return: 
     */
    translate2Complex: async (content) => {
        const url = baseurl + '?content=' + encodeURI(content) + '&type=' + config.type + '&app_id=' + config.app_id + '&app_secret=' + config.app_secreat;
        const res = JSON.parse((await koa2Req(url)).body);
        if (res.code === 1) {
            return res.data.convertContent
        }
    },
}
