let avalon = require('avalon2');
require('./index.scss');

avalon.component('ms-loading', {
    template: require("./tpl.html"),
    defaults: {
        isShow: true,
        isCloseIcon: false,  //设置是否需要关闭按钮
        hideLoading() {
            this.isShohw = false;
        }
    }
});