/**
 * Created by easyLottoMac on 2018/9/28.
 */

import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'static/staticContent' : 'app/staticContent.json';

module.exports = {
    getData: function (data) {
        let ops = isDebug ? {} : {host: config.staticHost};
        action = data.link ? data.link : action;
        return service.getData(action, data || {}, ops);
    }
};