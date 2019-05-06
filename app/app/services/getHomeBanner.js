/**
 * Created by mac-ddt on 2018/8/29.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'home/homeBanner' : 'getSlidesByPageId';
module.exports = {
    getData: function (data) {
        return new Promise((resolve, reject)=>{
            service.getData(action, data || {}, {}).then((data)=>{
                if(!isDebug){
                    data.data.list.forEach((bannerList, i)=>{
                        bannerList.image = config.staticResourceHost + bannerList.image
                    })
                }
                resolve(data)
            }, reject);
        });
    }
};