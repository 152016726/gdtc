/**
 * Created by DDT on 2018/1/17.
 */
var TplCompiler = require('modules/tplCompiler');
var model = require('./model');
var canGetData = true; //相关资讯是否能请求接口
var $ = require('jquery');
var view = new TplCompiler({
    tplModel: model,
    events: {
        'click .information_loadMore': 'loadMore',
    },
    loadMore: function () {
        if (canGetData) { //不能继续请求
            var $def = $.Deferred();
            var data = this.model.listData;
            var arr = [];
            var mainArticleId = $('.articleIndex .article').attr('data-id');
            $('.articleIndex .information_list li').each(function () {
                arr.push($(this).attr('data-id'));
            });
            canGetData = false;
            this.tplModel.setParam(
                ['showInformation',
                    data,
                    $def.resolve,
                    $def.reject,
                    {
                        id: mainArticleId,
                        pageSize: 6,
                        deviceType: 0,
                        exclude: arr.join('#')
                    }
                ]);
            this.reRender();
            $def.then((end) => {
                if (end) {
                    this.model.dataEnd = true;
                    canGetData = false; //已经结束，不能继续请求
                    this.tplModel.setParam(['renderData', this.model]);
                    this.reRender();
                }
                else {
                    canGetData = true; //设置可以继续请求
                }
            }, () => {
                canGetData = true; //设置可以继续请求
            });
        }
    },
    template: require('./index.art')
});

module.exports = view;