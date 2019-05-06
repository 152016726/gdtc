/**
 * Created by easyLottoMac_Feng on 2018/12/27.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'peerReview/peerReviewDetails' : 'museum/getVersusSameOdds';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};