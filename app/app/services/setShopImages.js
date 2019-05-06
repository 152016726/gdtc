/**
 * Created by owen on 2019/3/14.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;

module.exports = {
    getData: function (data, type) {
        let action = 'user/'
        if(type === 'get'){
            action += 'getShopImages';
        }
        else if(type === 'save'){
            action += 'saveShopImage';
        }
        else if(type === 'setFirst'){
            action += 'chooseCoverImage';
        }
        else if(type === 'del'){
            action += 'removeImage';
        }
        return service.getData(action, data || {}, {}).then(rsp => {
            // 补图片域名头
            if (!isDebug) {
                rsp.data.list.forEach((item, i) => {
                    if (item.url && item.url !== 'null') {
                        item.url = config.staticResourceHost + item.url;
                    }
                });
            }
            return rsp;
        });
    }
};