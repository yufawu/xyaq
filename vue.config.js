/**
 * @Description:
 * @Author:         TSY
 * @CreateDate:     2018/6/9 13:28
 */

module.exports = {
    productionSourceMap: false,//生产环境中关掉sourceMap
    baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
    devServer: {
        port: 80,
        proxy: {
            '/tsy': {
                // target: 'http://login.paxy365.com/',//设置调用的接口域名和端口号
                // target: 'http://edu_system.com:82/',//设置调用的接口域名和端口号
                // target: 'http://192.168.8.118/',//设置调用的接口域名和端口号
                // target: 'http://192.168.8.159:86/',//设置调用的接口域名和端口号
                // target: 'http://foshan.paxy365.com/',//设置调用的接口域名和端口号
                target: 'http://testweb.paxy365.com/',//设置调用的接口域名和端口号
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/tsy': ''
                }
            }
        }
    }
}