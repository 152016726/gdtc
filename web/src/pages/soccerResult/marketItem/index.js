/**
 * Created by feng on 2018/06/01.
 */
require('./style.scss');
var $ = require('jquery');
var TplCompiler = require('modules/tplCompiler');
// var pageTool = require('../pageTool');
var Model = require('./model');

var view = new TplCompiler({
    tplModel: Model,
    template: require('./view.art'),
    events: {
    },
    rendered: function () {
        $('#result_num').text(this.model.marketNum);
    }
});

module.exports = view;