/**
 * Created by DDT on 2018/1/17.
 */
var $ = require("jquery");
//内部方法，由对应view call
var _innerFn = {
    _initialize: function() {
        var $el = $(this.container);
        if ($el.length > 0) {
            this.$el = $el.eq(0);
            this.el = this.$el[0];
        }
        this._initDeferred = this.initialize();
    },
    _requestModel: function() {
        if (this.tplModel) {
            if (this.isAutoReq) {                return this.tplModel.request();
            } else {
                return $.Deferred().resolve(this.tplModel.getData());
            }
        }
        return $.Deferred().resolve(this.model);
    },
    _render: function(data) {
        var $def = $.Deferred();
        if (this.$el) {
            if (this.template) {
                var $con;
                var html = this.template(this.model);
                if (this.isReplace) {
                    var $newEl = $(html).appendTo('body');
                    this.$el.replaceWith($newEl);
                } else {
                    this.$el.html(html);
                }
            }
        }
        return $def.resolve();
    },
    _delegateEvents: function() {
        var _self = this;
        var $delegate = this.delegate ? $(this.delegate) : this.$el;
        if (this.events) {
            $.each(this.events, function(key, val) {
                var arr = key.replace(' ', '___split___').split('___split___');
                if (arr.length > 1) {
                    var method = arr[0];
                    var selector = arr[1];
                    _self[val] && $delegate.on(method, selector, _self[val].bind(_self));
                } else {
                    //配置错误
                }
            });
        }
    }
};

function TplCompiler(ops) {
    var defView = {
        _isRendered: false, //是否已经渲染了
        delegate: null, //指定事件委派对象，不传使用container对象进行委派
        el: null,
        $el: null,
        container: null, //指定渲染容器
        events: null, //容器委派事件
        template: null, //对应模板
        isReplace: false, //是否替换原来外包元素
        model: {}, //给予默认数据，不通过请求
        tplModel: null, //模板数据对象，用于获取数据后模板渲染
        isAutoReq: true, //是否自动请求tplModel
        initialize: function() {}, //render前处理
        render: function(container, data) { //内部render方法尽量不要重写了
            //兼容container后加入
            if (container) {
                var $el = $(container);
                if ($el.length > 0) {
                    this.container = container;
                    this.$el = $el.eq(0);
                    this.el = this.$el[0];
                }
            }
            var _self = this;
            $.when(_self._initDeferred).then(function() {
                _innerFn._requestModel.call(_self).then(function(reqData) {
                    _self.model = reqData;
                    // 以传递data为主
                    data && (_self.model = data);
                    _innerFn._render.call(_self).then(function() {
                        _innerFn._delegateEvents.call(_self);
                        _self.rendered();
                        _self._isRendered = true;
                    });
                });
            });
        },
        /**
         * 设置model内容，应该比较新旧对象两者区别，示意是否进行重新渲染
         * @param obj
         * @param isNotExtend
         * @param isSetTo
         */
        setModel: function(obj, isNotExtend, isSetTo) {
            var _self = this;
            var $def = $.Deferred();
            this.beforeReRender(obj).then(function(data) {
                data = data || obj;
                //暂时全部进行重新渲染
                _self.reRender(data, isNotExtend, isSetTo);
                $def.resolve();
            }, function() {
                $def.reject();
            });
            return $def.promise();
        },
        /**
         * 在重新渲染之前调用
         * @return 应该返回延时，延时解决后进行重渲染
         */
        beforeReRender: function(changeObj) {
            return $.Deferred().resolve();
        },
        /**
         * 重新渲染组件本身
         * @param model 重置model对象
         * @param isNotExtend
         * @param isSetTo
         */
        reRender: function(model, isNotExtend, isSetTo) {
            var _self = this;
            _innerFn._requestModel.call(_self).then(function(data) {
                _self.model = data;
                // 以传递model为主
                model && _self.extendModel(model, isNotExtend, isSetTo);
                _innerFn._render.call(_self).then(function() {
                    _self.rendered();
                });
            });
        },
        extendModel: function(model, isNotExtend, isSetTo) {
            if (isSetTo) {
                this.model = model || {};
            } else if (isNotExtend) {
                $.extend(this.model, model || {});
            } else {
                $.extend(true, this.model, model || {});
            }
        },
        isRendered: function() {
            return this._isRendered;
        },
        rendered: function() {}, //render后处理
        _initDeferred: null //initialize对应的延时对象
    };
    ops = $.extend(defView, ops || {});

    for (var p in ops) {
        this[p] = ops[p];
    }

    _innerFn._initialize.call(this);
}

module.exports = TplCompiler;