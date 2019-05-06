/**
 * Created by Feng on 2018/05/31.
 */
require('./style.scss');
var pageTool = require('./component/pageTool');
var $ = require('jquery');
var common = require('../../common/js/common.js');
var search = require('./search');
var marketItem = require('./marketItem');
var avalon = require('avalon2');

var vm = avalon.define({
    $id: 'root',
    template: require('./view.art')
});

init();

function init() {
    $("#header .navigation li").eq(1).addClass('active');
    search.tplModel.initDate();
    search.tplModel.setParam([{type: 0}, search.model]);
    search.render('#search');
    marketItem.render('#market_lists');
}