/**
 * Created by DDT on 2018/1/17.
 */
var $ = require("jquery");

//默认定义的方法
var _innerFnDef = {
    ajaxData: function(param, otherOps){
        return $.Deferred().resolve(this.model);
    },
    initData: function(data){
        return data;
    },
    //开始请求数据，请不要重写
    request: function(param, otherOps){
        var _self = this;
        param && (this.param = param);
        param = this.param;
        var $def = $.Deferred();
        _self.ajaxData(param, otherOps).then(function(data){
            data = _self.initData(data);
            data = $.extend({}, _self.model || {}, data);
            //获取数据后广播自己已经获取数据了，view应当接收此事件
            _self.setData(data);
            $def.resolve(data); 
        }, function(data){
            //请求失败时需要处理
            $def.reject(data);
        });
        return $def.promise();
    },
    setData: function(data){
        this.data = data;
    },
    getData: function(){
        return this.data;
    },
    setParam: function(param){
        this.param = param
    }
};

function TplModel(ops){
    var defOps = {
        data: null,             //存放模块数据
        model: {},              //原来默认model
        param: {},              //请求需要的参数
        ajaxData: null,          //通过调用service获取数据，需要返回延时对象或者Promise
        initData: null         //返回处理后的data数据对象
    };
    ops = $.extend(defOps, _innerFnDef, ops || {});

    for(var p in ops){
        this[p] = ops[p];
    }
}

module.exports = TplModel;