/**
 * Created by easyLottoMac on 2018/11/1.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'scoreDetails/eventScoreDetails' : 'soccer/versusInfo';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};