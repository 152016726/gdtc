/**
 * 资讯列表的接口
 * Created by easyLottoMac_Feng on 2019/3/28.
 */
import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'home/articleList' : 'getStaticCMSNews';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};
