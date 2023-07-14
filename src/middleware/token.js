const jwt = require('jsonwebtoken')
const config = {
    secret: '20010824',
    time: '24h',
}
module.exports = {
    /**
     * 校验用户信息是否符合规则
     * @param {Object} data
     * @return: 
     */
    creatToken: (data, time) => {
        let token = jwt.sign(data, config.secret, {
            algorithm: 'HS256',
            expiresIn: time || config.time
        });
        return token;
    },
    /**
     * 校验用户信息是否符合规则
     * @param {String} token
     * @return: 
     */
    verifyToken: (token) => {
        return jwt.verify(token, config.secret, { algorithm: 'HS256' }, (err, decoded) => {
            if (err) return null
            else return decoded
        })
    }
}