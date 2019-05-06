/**
 * Created by marcus on 2018/11/22.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'
import getShopInfo from '../../services/getShopInfo';

let actions = {
    /**
     * 修改城市
     * @param obj    城市
     * @returns {Function}
     */
    changeCityState(obj) {
        return ((dispatch, getState) => {
            dispatch(actions.updateState(obj));
            dispatch(actions.getInformationList(0, 0, {
                city: obj.city,
                area: obj.area
            }));
        })
    },
    changeSomeProps(data) {
        return ((dispatch) => {
            dispatch(actions.updateState(data))
        })
    },
    /**
     *  修改区域
     * @param cityAreaObj  区域
     * @returns {Function}
     */
    changeAreaState(area) {
        return ((dispatch, getState) => {
            dispatch(actions.updateState({
                area: area.name
            }));
            dispatch(actions.getInformationList(0, 0, {
                area: area.name
            }));
        })
    },
    /**
     * 筛选框搜索
     * @param text      输入框内容
     * @returns {Function}
     * @private
     */
    _onChangeText(text) {
        return ((dispatch, getState) => {
            dispatch(actions.updateState({
                keyword: text
            }));
        })
    },

    /**
     *  周围网点文章列表数据
     * @param pageIndex 页码
     * @param MaxHeight 页面的最大高度
     * @returns {Function}
     */
    getInformationList(pageIndex = 0, MaxHeight = 0, obj = {}) {
        return ((dispatch, getState) => {
            let {information, pageSize, keyword, city, area, areas = []} = getState()[storeKey.LOTTERY_SHOP_STORE];
            let rspObj = Object.assign({}, {
                pageIndex,     // 页码
                pageSize,      // 每页多少条
                keyword,
                city,
                area: area || areas[0].name
            }, obj);
            information = +pageIndex ? information : [];
            getShopInfo.getData(rspObj).then((rsp) => {
                let rspList = rsp.data.list;
                dispatch(actions.updateState({
                    information: information.concat(rspList),           // 储存周围网点 list
                    pageIndex: pageIndex,                               // 记录页面的最高高度
                    MaxHeight: +pageIndex ? MaxHeight : 0,               // 记录页面的最高高度
                    isFooter: rspList.length < pageSize,                // 若条数不足请求条数则显示到底提示
                    isNoData: !pageIndex && !(rspList.length)
                }))
            }, err => {
                console.log(err)
            })
        })
    },
    /**
     * 上拉加载更多
     * @param eNative scrollView 的滚动事件
     * @returns {Function}
     */
    onScrollHandle(eNative) {
        return ((dispatch, getState) => {
            let {pageIndex, MaxHeight, isFooter, pageSize} = getState()[storeKey.LOTTERY_SHOP_STORE];
            let contentHeight = eNative.contentOffset.y + eNative.layoutMeasurement.height;         // 计算页面的总高度
            // 确保只有滑到页面底部才开始重新请求数据且只请求一次
            if ((parseInt(contentHeight) === parseInt(eNative.contentSize.height)) && (eNative.contentSize.height > MaxHeight) && !isFooter) {
                if (isFooter) return;
                pageIndex = (+pageIndex) + (+pageSize);
                dispatch(actions.getInformationList(pageIndex, eNative.contentSize.height));
            }
        })
    },
    updateState: createAction(ActionTypes.UPDATE_LOTTERY_SHOP, (obj) => obj)
};
export default actions