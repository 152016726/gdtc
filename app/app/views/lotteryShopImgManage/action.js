/**
 * Created by owen on 2019/03/05.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '~/constants/ActionTypes'
import setShopImages from "~/services/setShopImages"
import Account from '#/account'

const innerFn = {
    /**
     * 排序图片数据，首图放在第一张
     * @param arr
     */
    sortImgs(arr) {
        let _arr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].isDefault === 'true') {
                _arr.unshift(arr[i]);
            }
            else _arr.push(arr[i])
        }
        return _arr;
    }
};

let actions = {
    changeSomeProps(data) {
        return ((dispatch) => {
            dispatch(actions.setAllData(data));
        });
    },
    setShopImages(data, type) {
        return ((dispatch) => {
            setShopImages.getData(data, type).then(rsp => {
                dispatch(actions.setAllData({
                    lotteryImgArr: innerFn.sortImgs(rsp.data.list)
                }));
                dispatch(actions.updatePersonnalInformation({
                    dotPictures: innerFn.sortImgs(rsp.data.list)
                }));
                Account.updateAccountInfo({dotPictures: innerFn.sortImgs(rsp.data.list)});
            })
        })
    },
    setAllData: createAction(ActionTypes.UPDATE_LOTTERY_SHOP_IMG_MANAGE, (obj) => obj),
    /**
     * 更新通用弹窗属性
     */
    updateCommonDialog: createAction(ActionTypes.UPDATE_COMMON_DIALOG, (obj) => obj),
    /**
     * 更新弹出窗口
     */
    toggleCommonDialog: createAction(ActionTypes.TOGGLE_COMMON_DIALOG, (obj) => obj),

    /**
     * 更新个人信息页面
     */
    updatePersonnalInformation: createAction(ActionTypes.UPDATE_PERSONAL_INFORMATION,(obj)=>obj)

};
export default actions