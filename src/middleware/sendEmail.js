const nodemailer = require('nodemailer');
module.exports = {
    /**
     * 校验用户信息是否符合规则
     * @param {String} email
     * @param {String} text
     * @return: 
     */
    sendEmail2User: async (email, text) => {
        let transporter = nodemailer.createTransport({
            host: "smtp.163.com", // 第三方邮箱的主机地址
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'tt2373571519@163.com', // 发送方邮箱的账号
                pass: 'FJHVGMNNJFFDLEVI', // 邮箱授权密码
            },
        });
        // 定义transport对象并发送邮件
        await transporter.sendMail({
            from: '"瓦的每日商店" <tt2373571519@163.com>', // 发送方邮箱的账号
            to: email, // 邮箱接受者的账号
            subject: "商店出现了你想要的武器", // Subject line
            text: text // 文本内容
        });
    },
}