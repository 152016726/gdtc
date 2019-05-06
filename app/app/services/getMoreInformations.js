/**
 * Created by easyLottoMac on 2018/10/30.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'home/articleList' : 'cmscp/core/generate_push/informations';
// let staticResourceHost = config.staticResourceHost;

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};