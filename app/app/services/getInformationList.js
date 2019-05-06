/**
 * Created by mac-ddt on 2018/8/30.
 */
/**
 * Created by oWEn on 2018/8/28.
 */
import service from '@easylotto/service';
import config from '../config'

let isDebug = config.debugData;
let action = isDebug ? 'home/articleList' : 'getStaticCMSNews';

module.exports = {
    getData: function (data) {
        return new Promise((resolve, reject) => {
            service.getData(action, data || {}, {}).then((data) => {
                // 补图片域名头
                if (!isDebug) {
                    data.data.list.forEach((dl, i) => {
                        if (dl.titleImage && dl.titleImage !== 'null') {
                            dl.titleImage = config.staticResourceHost + dl.titleImage;
                        }
                    });
                }
                resolve(data);
            }, reject);
        });
    }
};
