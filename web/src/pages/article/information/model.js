/**
 * Created by DDT on 2018/1/17.
 */
var $ = require("jquery");
var TplModel = require('modules/tplModel');
var getInformation = require('services/getInformation');
var model = new TplModel({
    param: {},
    model: {
        listData: [],
        dataEnd: false
    },
    ajaxData: function (param) {
        var $def = $.Deferred();
        switch (param[0]) {
            case 'showInformation':
                getInformation.getData(param[4]).then((rsp) => {
                    if (param[1]) {
                        var list = rsp.data.list || [];
                        var end = list.length !== parseInt(param[4].pageSize);
                        list = param[1].concat(list);
                        $def.resolve({
                            listData: list
                        });
                        param[2] && param[2](end); //请求接口返回成功回调，设置可以继续请求。
                    }
                    else{
                        $def.resolve(rsp);
                    }
                }, () => {
                    param[3] && param[3](); //请求接口返回失败回调，设置可以继续请求。
                });
                break;
            case 'initData':
            case 'renderData':
                $def.resolve(param[1]);
                break;
        }
        return $def.promise();
    }
});

module.exports = model;