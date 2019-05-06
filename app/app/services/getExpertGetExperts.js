/**
 * Created by marcus on 2019/1/5.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'expertRank/list' : 'expert/getExperts';
let handleExpert = isDebug ? '' : 'expert/handleInterestedExperts';
module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    },

    handleInterestedExperts : function (data) {
        return service.getData(handleExpert, data || {}, {});
    }
};