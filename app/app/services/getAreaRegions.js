/**
 * 获取所有市区
 * Created by owen on 2019/2/18.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'area/getAreaRegions' : 'area/getAreaRegions';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};