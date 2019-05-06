/**
 * Created by mac-ddt on 2017/8/1.
 */
import JPushModule from 'jpush-react-native';
import { NativeAppEventEmitter,Platform } from 'react-native';

let __receiveCustomMsgCallBack = null;
let __receiveNotificationCallBack = null;
let __receiveOpenNotificationCallBack = null;
// let __receiveOpenNotificationLaunchCallBack = null;

export default {
    init:function(){
        if(Platform.OS == 'android'){
            JPushModule.initPush();
            JPushModule.notifyJSDidLoad((resultCode)=>{
                console.log('JPush loaded, resultCode: '+ resultCode);
            });
        }

    },
    setBadge:function(badge,callback){
        Platform.OS == 'ios' && JPushModule.setBadge(badge,callback||(()=>{}));
    },
    setTags:function(array, callback){
        JPushModule.setTags(array, callback||(()=>{}));
    },
    getRegistrationID:function(callback){
        JPushModule.getRegistrationID(callback||(()=>{}));
    },
    setAlias:function(alias, callback){
        JPushModule.setAlias(alias, callback||(()=>{}));
    },
    startListenCustomMessage:function(callback){
        __receiveCustomMsgCallBack = callback;
        JPushModule.addReceiveCustomMsgListener(callback);
        return ()=>{JPushModule.removeReceiveCustomMsgListener(callback)};
    },
    startListenNotification:function(callback){
        __receiveNotificationCallBack = callback;
        JPushModule.addReceiveNotificationListener(callback);
        return ()=>{JPushModule.removeReceiveNotificationListener(callback)};
    },
    startListenOpenNotification:function(callback){
        __receiveOpenNotificationCallBack = callback;
        JPushModule.addReceiveOpenNotificationListener(callback);
        Platform.OS == 'ios' && JPushModule.addOpenNotificationLaunchAppListener(callback);
        return ()=>{
            JPushModule.removeReceiveOpenNotificationListener(callback);
            Platform.OS == 'ios' && JPushModule.removeReceiveOpenNotificationListener(callback);
        };
    },

    clear:function(){
        Platform.OS == 'android' && JPushModule.clearAllNotifications();
        JPushModule.removeReceiveCustomMsgListener(__receiveCustomMsgCallBack);
        JPushModule.removeReceiveNotificationListener(__receiveNotificationCallBack);
        JPushModule.removeReceiveOpenNotificationListener(__receiveOpenNotificationCallBack);
        Platform.OS == 'ios' && JPushModule.removeOpenNotificationLaunchAppEventListener(__receiveOpenNotificationCallBack);
    }

}

//消息格式(极光)

//iOS:
// message = {
//             _j_business: 1,
//             _j_msgid: 54043195902155280,
//             _j_uid: 10370352383,
//             key: "value",        //自定义字段
//             aps: {
//                 alert:"通知内容", //通知内容
//                 badge:1,        //图标小圆点
//                 sound:"default" //声音
//                 }
//             }

//android:
// message =  {
//             extras: "{"key1":"value1"}",    //自定义字段(字符串)
//             alertContent: "通知内容",        //通知内容
//             id: 519045998
//             }