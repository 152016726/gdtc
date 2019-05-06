require('./style.scss');
var $ = require('jquery');
var information = require('./information');
var model = require('./model');

$(function(){
    init();
})
/**
 * 初始化页面
 */
function init() {
    information.tplModel.setParam(['initData']);
    information.render('.information_other_list');
    bindShareEvent();
}

/**
 * 使用重渲染会导致分享失效，暂时用jq控制渲染
 */
function bindShareEvent() {
    $('.articleIndex_share_btns').on('mouseenter', function () {
        $(this).find('.otherBtns').show();
    }).on('mouseleave', function () {
        $(this).find('.otherBtns').hide();
    });
}







