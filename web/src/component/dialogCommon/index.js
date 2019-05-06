let temp = require('./index.art');
let $ = require('jquery');
require('./index.scss');
let innerFn = {
    /**
     * 绑定事件
     */
    initBindEvent: function () {
        let self = this;
        this.ele.find('.btn_close').on('click', function () {  //关闭按钮操作
            self.close();
        });
        this.ele.find('.buttons li').on('click', function (event) { //点击按钮操作
            let index = $(this).index();
            let objBtn = self.option.buttons[index];
            let clickHandle;
            if (objBtn.click) {
                clickHandle = objBtn.click.bind(self);
            }
            else {
                clickHandle = self.close;
            }
            clickHandle(self, objBtn, index, event); // 返回弹窗对象，按钮对象，和按钮序号
        });
    },
    /**
     * 设置长宽，在model层无法预知buttons高度，所以在渲染完成后控制
     */
    initSize() {
        let titleHeight = this.ele.find('.title').outerHeight();
        let buttonsHeight = this.ele.find('.buttons').outerHeight();
        let mc = this.ele.find('.main_content');
        let padding = parseInt(mc.css('padding'));
        let opt = this.option;
        let isNumber = /^\d+(\.\d+)?$/.test(opt.width)
        if (opt.width !== 'auto' && isNumber) {
            mc.width(opt.width - padding * 2);
        }
        if (opt.height !== 'auto' && isNumber) {
            mc.height(opt.height - titleHeight - buttonsHeight - padding * 2);
        }
    },
    /**
     * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
     **/
    dealObjectValue(obj) {
        var param = {};
        if (obj === null || obj === undefined || obj === "") return param;
        for (var key in obj) {
            if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
                param[key] = obj[key];
            }
        }
        return param;
    },
    /**
     *显示弹窗
     */
    showWin(opt) {
        let defaultConf = {
            title: '提示',                      //标题
            content: '',                       //内容
            cls: '',                           //弹窗类名
            width: null,                       //宽，暂时只支持数字
            height: null,                      //高，暂时只支持数字
            buttons: [                         //按钮数组
                {
                    text: '确定',              //按钮显示的文字
                    click: function (dialog) {
                        dialog.close();
                    }
                }
            ],
            beforeClose: function () {         //关闭前回调
            }
        };
        opt = innerFn.dealObjectValue(opt);
        opt = Object.assign(defaultConf, opt);
        this.ele = $(temp(opt));
        this.option = opt;
        this.close = () => {
            this.option.beforeClose.call(this);
            this.ele.remove();
        };
        innerFn.initBindEvent.call(this);
        $('body').append(this.ele);
        innerFn.initSize.call(this);
    },
    getButtonsConf(fnYes, fnNo) {
        let buttons = [];
        if (fnYes === undefined && fnNo === undefined) {
            return {}
        }
        if (typeof fnYes === 'function') {
            buttons.push({
                text: '确定',
                click: fnYes
            })
        }
        if (typeof fnNo === 'function') {
            buttons.push({
                text: '取消',
                click: fnNo
            })
        }
        return {buttons};
    }
}
module.exports = {
    /**
     * alert弹窗，fnYes和fnNo为可选，不传默认显示确定按钮，并有关闭功能
     * @param content {String|Dom} 内容
     * @param title {String|Dom} 标题
     * @param fnYes {Function} 确认按钮回调 可选
     * @param fnNo {Function} 取消按钮回调 可选
     */
    alert(content, title, fnYes, fnNo) {
        let buttons = innerFn.getButtonsConf(fnYes, fnNo);
        return this.showWin({content, title, ...buttons});
    },
    /**
     * warn弹窗，只是比alert弹窗多了个警告图标
     */
    warn(content, title, fnYes, fnNo) {
        let buttons = innerFn.getButtonsConf(fnYes, fnNo);
        return this.showWin({content, title, ...buttons, cls: 'warn'});
    },
    /**
     * showWin弹窗，alert弹窗和warn弹窗都是调用该方法弹出窗口，可定制opt
     * @param opt {Object} 弹窗配置
     */
    showWin(opt) {
        return new innerFn.showWin(opt);
    }
};