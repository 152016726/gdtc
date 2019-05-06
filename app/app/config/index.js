/**
 * Created by oWEn on 2018/8/30.
 */
//安卓调试增加属性host,并设置成PC的ip,如host:'http://192.168.199.148:8081/app'

let ipType = 'UAT'; //修改ipType 切换数据模式

let version = 'v1.7'; //当前版本号
//修改此处版本号后 还需要在改constants的版本号

let ipType_setting = {
    //开发数据
    'DEV':{
        debug: true,                                // debug状态，控制输出console等
        debugData: true,                            // 数据debug状态
        isApp: true,                                // 判断host是否需要修改
        host: '',           // http://172.20.52.35:8090
        pushServer: 'http://172.20.52.61:3000',     // push 地址
        success_code: 'SUCCESS',
        staticHost:'http://172.20.52.35',           // 静态文章 json 路径
        staticResourceHost:'http://172.20.52.35'    // 后台图片域名
    },
    //内部数据
    'SIT':{
        debug: false,                                // debug状态，控制输出console等
        debugData: false,                            // 数据debug状态
        isApp: true,                                // 判断host是否需要修改
        host: 'http://172.20.52.35:8090',
        pushServer: 'http://172.20.52.35:3000',     // push 地址
        success_code: 'SUCCESS',
        staticHost:'',           // 静态文章 json 路径
        staticResourceHost:''    // 后台图片域名
    },
    //外网数据
    'UAT':{
        debug: false,                                       // release状态
        debugData: false,                                   // 数据release状态
        isApp: true,                                        // 判断host是否需要修改
        host: 'http://14.18.86.60:8081/sporttery_web_api',
        pushServer: 'http://14.18.86.60:3000',
        success_code: 'SUCCESS',
        staticHost:'',               // 静态文章 json 路径
        staticResourceHost:''        // 后台图片域名
    }
};

module.exports = Object.assign(ipType_setting[ipType],{version:version});