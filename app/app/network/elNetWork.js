/**
 * Created by mac-ddt on 2018/8/31.
 */

import config from '../config'
let IS_DEBUG = config.debug;

function timeout_fetch(fetch_promise,timeout = 20000) {
    let timeout_fn = null;

    //这是一个可以被reject的promise
    let timeout_promise = new Promise(function(resolve, reject) {
        timeout_fn = function() {
            reject('timeout promise');
        };
    });

    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    let abortable_promise = Promise.race([
        fetch_promise,
        timeout_promise
    ]);

    setTimeout(function() {
        timeout_fn();
    }, timeout);

    return abortable_promise ;
}

function staticDataFetch(query,method,params){
    let header = {
        "Content-Type": "application/json;charset=UTF-8",
        'credentials':'include'
    };
    //console.log('staticDataFetch url:',query,params);  //打印请求参数
    return new Promise(function (resolve, reject) {
        timeout_fetch(fetch(query, {
            method: method,
            headers: header
        })).then((response) => {
                // IS_DEBUG && console.log("no json response",response);
                return  response.json();
            })
            .then((responseData) => {
                // IS_DEBUG && console.log('res:',query,responseData);  //网络请求成功返回的数据
                resolve(responseData);
            })
            .catch( (err) => {
                //console.log('err:',query, err);     //网络请求失败返回的数据
                reject(err);
            });
    });
}
export {staticDataFetch}