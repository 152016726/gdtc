/**
 * Created by Administrator on 2018/6/15.
 */

let Vue = require("vue");
// 设置Vue
Vue.config.debug = __DEBUG__;
Vue.config.devtools = __DEBUG__;
Vue.config.productionTip = __DEBUG__;

let VueRouter = require("vue-router");
Vue.use(VueRouter);


function getRoutes(page, pages) {
    let routes = [];
    for(let i = 0; i < pages.length; i ++){
        let obj = {};
        let _path = "pages/" + page + "/views/" + pages[i];
        obj.path = "/" + pages[i];
        obj.component = require("../../" + _path + "/index.js");
        routes.push(obj);
    }
    return routes;
}

module.exports = {
    init: function(page, config){
        let routes = getRoutes(page, config.pages);
        let router = new VueRouter({
            routes: routes
        });
        let _config = Object.assign(config.vue_config, {router});
        let root = new Vue(_config).$mount('#root');
        router.push({
            path: config.default_page
        });

        return router;
    }
};

























