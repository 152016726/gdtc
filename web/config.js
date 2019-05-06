/**
 * Created by DDT on 2017/11/24.
 */
module.exports = {
    pathTemp: './temp',                 // 临时目录
    rootPath: './src',                  // 服务根映射
    target: './dist',                   // 打包目录
    serverPort: 3003,                   // 服务端口
    pagePath: './src/pages',            // 生成页面入口根目录
    isHash: false,                       // 是否需要hash生成文件
    publicPath: '/resource/',           // 生成文件对应静态位置
    staticLabel: "staticLabel",         // 默认静态化标签
    sourceRoot: 'resource',             // 资源根目录
    tempRoot: 'templates',              // 静态模板打包目录
    devPages: [                         // 指定只针对某些页面进行调试
        "eventAgenda",
        "eventCenter",
        "bonusOptimize",
        "index",
        "register"
        // "liveBroadcast",
        // "liveSubplate",
        // "scoreAnalysis",
        // "exponent",
        // "dot"
    ],
    copyPaths: [                        // 配置需要复制的外层目录
        "css", "img", "js", "plugin", "logo.png"
    ],
    temps: [                            // 静态模板的页面
        //{
        //    name: "article_temp"
        //    // 支持子模板配置, 但是没测试过行不行...
        //    subtemplates: [
        //        {
        //            label: "subtemplate1",
        //            path: "./src/pages/article_temp/view.art"
        //        }
        //    ]
        //},
        {
            name: "article"
        },
        {
            name: "index"
        },
        {
            name: "information"
        },
        {
            name: "dot"
        }
    ]
};