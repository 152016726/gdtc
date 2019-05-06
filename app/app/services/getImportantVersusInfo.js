/**
 * 获取比赛技术指标
 * Created by DDT on 2018/10/30.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'getImportantVersusInfo' : 'getImportantVersusInfo';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};