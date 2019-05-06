/**
 * Created by mac-ddt on 2018/9/4.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import games from "@easylotto/bet";
import * as storeKey from '../../constants/storeKeys'
import saveMyProjectList from '../../services/getMyProjectDataList';
import util from '../../common/js/util';

let actions = {
    getAllBonus() {
        return ((dispatch, getState) => {
            dispatch(actions.updateState( games.Bonus.getBonusInfo() ));
        })
    },
    changeOptimize(type, price) {
        return ((dispatch, getState) => {
            games.Bonus.changeBonusPayment('', +price, () => {
                games.Bonus.changeBonusOptimizeType(type, () => {
                    let bonus = games.Bonus.getBonusInfo();
                    dispatch(actions.updateState(
                        Object.assign({isDisableOne: false}, bonus)
                    ));
                });
            });
        })
    },
    changeMultiple(multi) {
        return ((dispatch, getState) => {
            games.Bonus.changeBonusMultiple(+multi, () => {
                let bonus = games.Bonus.getBonusInfo();
                dispatch(actions.updateState( bonus ));
            });
        })
    },
    changeOnePrice(key, text) {
        return ((dispatch, getState) => {
            games.Bonus.changeBonusPayment(key, +text * 2, () => {
                // console.log(key, +text * 2, bonus);
                let bonus = games.Bonus.getBonusInfo();
                dispatch(actions.updateState(
                    Object.assign({price: null}, bonus)
                ));
            });
        })
    },
    /**
     * 获取登录状态
     * @returns {function(*, *)}
     */
    getLoginState(){
        return ((dispatch, getState) => {
            let { isLogin } = getState()[ storeKey.LOGIN_STORE ];

            dispatch(actions.setBonusInfo({ isLogin }));
        });
    },
    /**
     * 保存方案
     */
    saveProject(){
        return ((dispatch, getState) => {
            let { selectFreeArr, marketLists, selectMSNArr } = getState()[ storeKey.CALCULATION_STORE ];
            let { pay , multiple} = getState()[ storeKey.OPTIMIZE_STORE];
            let stickWays = '';     //'2串1, 3串4'...' 串关方式
            let minArr = [];       //vsDate的数组
            let stickWaysArr = [];  //串关方式的数组
            let str = '';           //替换字符串的X 放进串关方式的数组

            //筛选已选串关方式 并改变字符串 放进串关方式数组
            selectFreeArr.forEach((item) => {
                str = item.replace(/X/g, '串');
                stickWaysArr.push(str);
            });
            //合拼数组 以,分隔
            stickWays = stickWaysArr.join(',');

            //筛选出vsDate 并以最小得时间戳排序
            marketLists.forEach((item) => {
                delete item.oddsAry;
                let _date = Date.prototype.parseISO8601(item.matchInfo.vsDate)
                minArr.push(_date);
                minArr.sort((a, b) => {
                    return a - b
                });
            });

            //拼装需要的Data 下面要转JSON
            let data = {
                betslip : marketLists,
                stickWays : selectMSNArr,
                multiple : multiple,
                money : pay,
                gameType : 1
            };

            let reqData = {
                gameType : 1,
                deadline : util.formatDate(minArr[ 0 ]),
                stickWay : stickWays,
                money : pay,
                multiple : multiple,
                data : JSON.stringify(data)
            };

            saveMyProjectList.saveData(reqData)
                .then(rsp => {
                    if (rsp) {
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        })
    },
    setBonusInfo : createAction(ActionTypes.UPDATE_BONUS_INFO, (obj) => obj),

    updateState: createAction(ActionTypes.UPDATE_OPTIMIZE, (data)=>{
        return data
    })

};

export default actions;