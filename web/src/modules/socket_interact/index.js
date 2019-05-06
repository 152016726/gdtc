/**
 * Created by lzh on 2015/9/29.
 */
var config = require('common/js/config');
var isConnected = false;
var $ = require('jquery');
var $def = $.Deferred();
var socket;
var io = require('socket.io-client');
var __isNeedConnect = true;
var isFirstConnect = true;
var Emitter = require("@easylotto/emitter").global;

module.exports = {
    setNotConnect: function(){
        __isNeedConnect = false;
    },
    init: function(){
        //页面不需要连接push、维护页面也不需要push
        if(!__isNeedConnect || config.isMaintenance) return;
        var _self = this;
        socket = io(config.pushServer, {
            //不限制连接次数, 无限重连
            //reconnectionAttempts: 5     //5次重连，连接失败则放弃
        });
        var console = window.console;

        //收到server的连接确认
        socket.on('connect', function () {
            isConnected = true;
            $def.resolve();
            /*主动断开??可能不进行断开
            window.onbeforeunload = function(){
                _self.disconnectToServer();
            };
            */
            $(window).bind('unload', function(){
                _self.disconnectToServer();
            });
            //新连接
            if(isFirstConnect){
                isFirstConnect = false;
            //再次连接
            }else{
                Emitter.emit("pushReload");
                //暂时不刷新页面
                /*
                //暂时不需要重刷新
                var fromSrc = pageSetting.getFromSrc();
                var isNeedRefresh = false;
                //desktop
                if(fromSrc == 'D'){
                    var pathname = location.pathname;
                    var page = pathname.substr(pathname.lastIndexOf('/')+1);
                    isNeedRefresh = ['',
                            'index.html',
                            'coming_bet.html',
                            'livescore.html',
                            'playallbet.html',
                            'inplayallbet.html'
                        ].indexOf(page) != -1;

                //mobile
                }else{
                    var hash = location.hash;
                    var arrHash = hash.split('/');
                    var pageHash = arrHash[2] || '';
                    isNeedRefresh = ['',
                            'coming_bet',
                            'livescore',
                            'playallbet'
                        ].indexOf(pageHash) != -1;
                }
                if(isNeedRefresh){
                    var strPush = dict.getDictText('xlatesMsg', 'REV_PUSH_TERMINATED');
                    alert(strPush);
                    location.reload();
                }
                */
            }
            console && console.log('connected is ok ... ready for push');
            Emitter.emit("pushConnect");
        });

        socket.on('connect_error', function () {
            console && console.log('connect error');
        });

        socket.on('reconnect_failed', function () {
            console && console.log('give up to reconnect ...')
        });

        socket.on('disconnect', function () {
            isConnected = false;
            $def.reject();
            $def = $.Deferred();
            console && console.log('disconnect from server');
            Emitter.emit("pushDisconnect");
        });

        //接受信息提示推送，本质上不会触发
        socket.on('push_outcome', function (param) {
            console && console.log(param);
        });
        $def.promise();
    },
    emit: function(event, param){
        var _self = this;
        if(isConnected){
            socket.emit(event, param);
        }else{
            $def.then(function(){
                _self.emit(event, param);
            });
        }
    },
    on: function(event, param){
        var _self = this;
        if(isConnected) {
            socket.on(event, param);
        }else{
            $def.then(function(){
                _self.on(event, param);
            });
        }
    },
    off: function(event, param){
        var _self = this;
        if(isConnected) {
            socket.off(event, param);
        }else{
            $def.then(function(){
                _self.off(event, param);
            });
        }
    },
    /**
     * 主动取消链接
     */
    disconnectToServer: function(){
        if(isConnected && socket){
            socket.disconnect();
            isConnected = false;
        }
    },
    /**
     * 主动链接
     */
    connectToServer: function(){
        if(!isConnected && socket){
            socket.connect();
            isConnected = true;
        }
    },
    /*
    * 获取push连接状态
    * */
    isSocketConnect: function () {
        return isConnected;
    }
};
