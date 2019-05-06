/**
 * Created by marcus on 2019/1/5.
 */
import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'expertRank/list' : 'expert/getExperts';
module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};