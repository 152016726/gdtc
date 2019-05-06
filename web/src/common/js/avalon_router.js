/**
 * Created by Administrator on 2018/6/14.
 */
require('../../plugin/avalon/mmRouter');

let vmRoot; //全局vm
let states = {}; //记录所以状态对应vm内容

module.exports = {
    /*
        view_name: 页面名称
        config: {
            defaultPage: 默认显示的页面
            rootVMProps: 绑定到root的VM的属性
            routerConfig: 路由配置项 { name: 页面名称, viewTarget: 呃.. 是个谜... }
        }
    */
    init: function(view_name, config) {
//路由定义
        const routerConfig = config.routerConfig;


        const addState = (path, vm, html) => {
            states[path] = {
                vm: vm.vm,
                html: html
            }
        };

//设置显示内容页组件
        avalon.component('ms-page-view', {
            template: '<div ms-html="@page" class="ms-view"></div>',
            defaults: {
                page: '&nbsp;',
                path: 'no',
                onReady(e) {
                    var path = e.vmodel.path;
                    var state = states[path];
                    var vm = avalon.vmodels[state.vm.$id] = state.vm;
                    var flag = (vm.init && vm.init() !== false);
                    vm.init && flag && setTimeout(function() { //必须等它扫描完这个template,才能替换
                        e.vmodel.page = state.html;
                        // rendered里面引用到其他组件需要用settimeout来延迟。。。
                        setTimeout(function() {
                            vm.rendered && vm.rendered();
                        });
                    }, 100)
                },
                onDispose(e) {
                    var path = e.vmodel.path;
                    var state = states[path];
                    var vm = state.vm;
                    var render = vm.render;
                    render && render.dispose();
                    vm.exit && vm.exit();
                    //竟然用了delete, 大神厉害
                    // 高层是有多讨厌delete....
                    /*
                     edit by gssl on 2017-12-16
                     页面返回调用之前页面的vm时报错. 因为之前的vm被干掉了. 但是我查了vmodels路由一加载就把所有页面的vm都加载了, 如果这个时候删了这些vm那么页面之间的依赖就只能靠root了...., 这样很不好....
                     */
                    //delete avalon.vmodels[vm.$id]

                }
            }
        });

        const getPage = (path) => {
            path = path.slice(1);
            return '<xmp is="ms-page-view" class="view-container" ms-widget="{path:\'' + path + '\'}"><xmp>';
        };

        const addStateRouter = () => {
            routerConfig.forEach((objRoute) => {
                var pathname = objRoute.name;
                var viewTarget = objRoute.viewTarget;
                var html_path = "pages/" + view_name + "/views/" + objRoute.name + "/view";
                var vm_path = "pages/" + view_name + "/views/" + objRoute.name + "/vmodel";
                var html = require('../../' + html_path + '.html');
                var vm = require('../../' + vm_path + '.js');
                addState(pathname, vm, html);
                avalon.router.add("/" + pathname, function(a) {
                    vmRoot.currPath = this.path;
                    vmRoot[viewTarget] = getPage(this.path);
                })
            });
        };

        let obj = Object.assign(config.rootVMProps, {
            $id: "root",
            currPath: '', //当前路径k
            mainPage: '<p></p>' //当前页面
        });

        vmRoot = avalon.define(obj);
        addStateRouter();
        avalon.history.start({
            root: "/" + config.defaultPage
        });
        avalon.history.setHash("/" + config.defaultPage);

        avalon.ready(function() {
            avalon.scan(document.body);
        });

    }
};































