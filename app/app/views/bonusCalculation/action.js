/**
 * Created by mac-ddt on 2018/9/4.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'
import * as bet from '../../constants/bet'
import games from '@easylotto/bet';
import util from '../../common/js/util';
import {DEFAULT_SITCK_WAY} from '../../constants/bet';
import CommonDataManager from '../../dataManager/commonDataManager';
import saveMyProjectList from '../../services/getMyProjectDataList';
import matchDataCenter from '#/matchDataCenter';
import Emitter from '@easylotto/emitter';
import {
    Alert
} from 'react-native';

let actions = {

    searchMinDate(marketLists) {
        return ((dispatch, getState) => {
            let minDate = new Date();
            let maxDate = new Date();
            //筛选已选赛事中最晚的一天赛事
            marketLists.forEach((ml, i) => {
                maxDate = Date.prototype.parseISO8601(ml.matchInfo.vsDate);
                if (i === 0) {
                    minDate = Date.prototype.parseISO8601(ml.matchInfo.vsDate);
                }
                if (minDate.getTime() > maxDate.getTime()) {
                    minDate = Date.prototype.parseISO8601(ml.matchInfo.vsDate);
                }
            });
            let minDateStr = minDate.format('yyyy-MM-dd hh:mm');
            dispatch(actions.updateData({
                minDateStr: minDateStr
            }))
        })
    },

    /**
     * 清除赛事
     * @returns {Function}
     */
    clearMarketList() {
        return ((dispatch, getState) => {
            let betslipList = games.Betslip.getBetslip();
            let arrVid = betslipList.map(item => item.matchInfo.vid);
            games.Betslip.clearBetslip();
            arrVid.forEach(vid => {
                Emitter.global.emit('event_update_' + vid, '');
            });
            dispatch(actions.updateBetArea({
                eventCount: 0
            }));
            dispatch(actions.updateData({
                marketLists: []
            }));
            //清空一选择的过关方式以及串关组合
            dispatch(actions.updateSelectComboArr({
                selectComboArr: [],
                selectFreeArr: [],
                isCanMultiple: false
            }));
            //清空过关组合
            dispatch(actions.setMstickNList([]));
        })
    },
    /**
     * 隐藏赛事所有玩法回调
     * @returns {Function}
     */
    hideDialog() {
        return ((dispatch, getState) => {
            dispatch(actions.updateData({
                showDialog: false
            }))
        })
    },

    /**
     * 赛事弹出框
     * @param vid
     * @returns {Function}
     */
    selectMarket(vid) {
        return ((dispatch, getState) => {
            let event = matchDataCenter.getEventObject(vid);
            dispatch(actions.updateData({
                event,
                showDialog: true
            }));
        })
    },

    /**
     *获取串关方式
     * @returns {Function}
     */
    getMStickNList() {
        return ((dispatch, getState) => {
            games.Stick.getMStickNList().then((list) => {

                dispatch(actions.setMstickNList(list));

                let m = games.Betslip.getBetslip().length;
                console.log(list);

                // 添加默认串关到串关方式
                games.Stick.addStickWay({
                    m: m,
                    n: 1,
                    p: [m]
                }).then(() => {
                    dispatch(actions.updateData({
                        selectFreeArr: [m === 1 ? "单关" : `${m}X1`]
                    }));
                    dispatch(actions.searchMinDate(marketLists));
                });

            }, () => {
                dispatch(actions.setMstickNList([]));
            })
        });
    },

    /**
     * 获取赛事, 同时添加默认串关到串关方式
     * @returns {Function}
     */
    marketListData() {
        return ((dispatch, getState) => {
            let marketLists = games.Betslip.getBetslip();

            marketLists.forEach((mkl, i) => {
                mkl.oddsAry = actions.setMarketList(mkl);
            });
            dispatch(actions.updateData({
                marketLists: marketLists
            }));
            dispatch(actions.searchMinDate(marketLists));
        })
    },

    clearBetslipBottom(){
        return ((dispatch, getState) => {
            //清空一选择的过关方式以及串关组合
            dispatch(actions.updateSelectComboArr({
                selectComboArr: [],
                selectFreeArr: [],
                isCanMultiple: false
            }));
            //清空过关组合
            dispatch(actions.setMstickNList([]));
        });
    },

    /**
     * 设胆 按钮事件
     * @param idNum
     * @param banker
     * @returns {Function}
     */
    setDanHandle(idNum, banker) {
        return ((dispatch, getState) => {
            let isBanker = !banker;
            games.Betslip.setBankerEventToBetslip(idNum, isBanker);

            // 先清空串关选择
            dispatch(actions.updateSelectComboArr({
                isCanMultiple: false,
                selectComboArr: [],
                selectFreeArr: []
            }));
            dispatch(actions.marketListData());
            dispatch(actions.getMStickNList())

        })
    },

    /**
     * 删除赛事
     * @param idNum
     * @returns {Function}
     */
    delMarket(idNum) {
        return ((dispatch, getState) => {
            games.Betslip.deleteFromBetslip([idNum], ((list) => {
                // 先清空串关选择
                dispatch(actions.updateSelectComboArr({
                    isCanMultiple: false,
                    selectComboArr: [],
                    selectFreeArr: []
                }));
                dispatch(actions.marketListData());
                dispatch(actions.getMStickNList());
                dispatch(actions.updateBetArea({
                    eventCount: list.length
                }));
                Emitter.global.emit('event_update_' + idNum);
            }));

        })
    },

    /**
     * 更新选中场数
     */
    updateMarketListData: createAction(ActionTypes.UPDATE_BETSLIP_LIST, (obj) => obj),

    /**
     * 对赛事 outcome 进行分类
     * @param mk 选中的赛事
     * @returns {Array}
     */
    setMarketList(mk) {
        let oddsAry = [];
        let oddObj = {
            marketName: '',
            handicap: '0',
            odds: []
        };
        let flag = false;
        mk.outcomes.forEach((ot, i) => {
            flag = oddsAry.some((val) => {            // 判断玩法是否已经存在
                return val.marketName === ot.marketKey
            });
            if (flag) {         // 玩法若已存在则在对应玩法中直接添加所选 outCome
                oddsAry.forEach((od, k) => {
                    if (od.marketName === ot.marketKey) {
                        od.odds.push(ot.oddsName + '@' + ot.odds);
                    }
                });
            } else {            // 玩法若未存在则添加所选玩法以及 outCome
                oddObj = {
                    marketName: '',
                    handicap: '0',
                    odds: []
                };
                oddObj.marketName = ot.marketKey;
                oddObj.odds.push(ot.oddsName + '@' + ot.odds);
                oddObj.handicap = ot.data.handicap || "0";
                oddsAry.push(oddObj);
            }
        });
        return oddsAry;
    },

    updateData: createAction(ActionTypes.UPDATE_CALCULATION, (marketList) => marketList),

    /**
     *更新显示过关方式列表的状态
     * @returns {Function}
     */
    handleChangeShow() {
        return ((dispatch, getState) => {
            const {isShowMore} = getState()[storeKey.CALCULATION_STORE];
            dispatch(actions.updateIsShowMore({
                isShowMore: !isShowMore
            }))
        })
    },
    updateIsShowMore: createAction(ActionTypes.UPDATE_IS_SHOW_MORE, (obj) => obj),

    /**
     * 更新选中的过关方式
     * @param selObj
     * @returns {Function}
     */
    updateSelectComboArr(selObj) {
        return ((dispatch, getState) => {
            const {free, combo} = getState()[storeKey.CALCULATION_STORE];
            // console.log(free);
            // console.log(selObj, free, combo, getState(), "呵呵呵呵");
            let betTypeArr = free.concat(combo);
            let selBetTypeArr = selObj.selectFreeArr;
            let selectMsticktN = actions.getSelectMsticktN(betTypeArr, selBetTypeArr);
            dispatch(actions.setBonusInfo({selectMSNArr: selectMsticktN}));
            dispatch(actions.computeBonus(selectMsticktN));
            dispatch(actions.setSelectComboArr(selObj));
        })
    },
    /**
     *获取选择的串关组合
     * @param betTypeArr
     * @param selBetTypeArr
     * @returns {Array}
     */
    getSelectMsticktN(betTypeArr, selBetTypeArr) {
        // console.log(betTypeArr,selBetTypeArr);
        let newArr = [];

        betTypeArr.forEach((type) => {
            selBetTypeArr.forEach((betType) => {
                let mStr = betType.substr(0, 1);
                let nStr = betType.slice(2);
                if (mStr === '单') {
                    mStr = '1';
                    nStr = '1';
                }
                if (type.m === Number(mStr) && type.n === Number(nStr)) {
                    newArr.push(type)
                }
            })
        });
        return newArr;
    },
    /**
     *计算奖金
     * @param selectMsticktN
     * @returns {Function}
     */
    computeBonus(selectMsticktN) {
        // 调整好selectMstickN的值
        return ((dispatch, getState) => {
            // 查看缓存里面有无已经串关的结果
            // 找到缓存里面没有的串关方式，执行games.mStickN(), 并将结果缓存起来， 更新stickResult
            let {multiple} = getState()[storeKey.CALCULATION_STORE];
            // console.log(selectMsticktN, "selectMsticktN");
            if (selectMsticktN.length > 0) {
                let result = games.Stick.getStickResult();

                let maxArr = [];
                let minArr = [];
                let _r = [];
                for(let key in result){
                    _r.push(...result[key]);
                }
                let __r = [].concat(_r);
                selectMsticktN.forEach((item, index) => {
                    let checkResult = games.Rule.checkBonusOps(bet.TICKET_VALUE * multiple, multiple);
                    if(checkResult.isPass){
                        let maxMinObj = games.Bonus.getMaxMinBonusQuckly(item, multiple);
                        minArr.push(maxMinObj.minBonus);
                        minArr.sort((a, b) => {
                            return a - b;
                        });
                        maxArr.push(maxMinObj.maxBonus);
                        maxArr.sort((a, b) => {
                            return a - b;
                        });
                    }else{
                        Alert.alert('提示', checkResult.reason[0]);
                    }
                });

                dispatch(actions.setBonusInfo({
                    minBonus: minArr[0],
                    maxBonus: maxArr[maxArr.length - 1],
                    amount: __r.length,
                    orgin: __r.length * 2,
                    minOrgin: minArr[0],
                    maxOrgin: maxArr[maxArr.length - 1],
                    pay: __r.length * 2
                }));

                games.Bonus.computeBonus({
                    data: result,
                    pay: _r.length * 2,
                    multiple: multiple
                });

            } else {
                dispatch(actions.setBonusInfo({
                    minBonus: 0,
                    maxBonus: 0,
                    amount: 0,
                    orgin: 0,
                    minOrgin: 0,
                    maxOrgin: 0,
                    pay: 0
                }));
            }

        })
    },
    setBonusInfo: createAction(ActionTypes.UPDATE_BONUS_INFO, (obj) => obj),

    setSelectComboArr: createAction(ActionTypes.UPDATE_SELECT_COMBO, (obj) => obj),

    setMstickNList: createAction(ActionTypes.UPDATE_MSTICKN_LIST, (list) => {
        let free = [], combo = [];
        // util.sortCollection(list,['m','n']); 旧的串关筛选方法
        let result = [];
        // 根据配置过滤出需要的串关方式
        for (let i = 0; i < list.length; i++) {
            // 生成key
            let key = `${list[i].m}#${list[i].n}#${list[i].p.join("")}`;
            if (DEFAULT_SITCK_WAY.hasOwnProperty(key)) {
                result.push(DEFAULT_SITCK_WAY[key]);
            }
        }
        result.forEach((item) => {
            if (item.n === 1) {
                free.push(item)
            } else {
                combo.push(item)

            }
        });
        return {
            free: free,
            combo: combo,
            comboList: result
        }
    }),
    /**
     * 保存方案
     */
    saveProject() {
        return ((dispatch, getState) => {
            let {multiple, selectFreeArr, pay, marketLists, selectMSNArr} = getState()[storeKey.CALCULATION_STORE];
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
                betslip: marketLists,
                stickWays: selectMSNArr,
                multiple: multiple,
                money: pay,
                gameType: 1
            };

            let reqData = {
                gameType: 1,
                deadline: util.formatDate(minArr[0]),
                stickWay: stickWays,
                money: pay,
                multiple: multiple,
                data: JSON.stringify(data)
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
    /**
     * 获取登录状态
     * @returns {function(*, *)}
     */
    getLoginState() {
        return ((dispatch, getState) => {
            let {isLogin} = getState()[storeKey.LOGIN_STORE];
            dispatch(actions.setBonusInfo({isLogin}));
        });
    },
    updateBetSlipList(obj) {
        return ((dispatch, getState) => {
            dispatch(actions.marketListData());
            dispatch(actions.updateMatchBetSlipList(obj));
        });
    },
    /**
     * 更新投注揽信息
     */
    updateBetArea: createAction(ActionTypes.UPDATE_BET_AREA, (obj) => obj),
    updateMatchBetSlipList: createAction(ActionTypes.UPDATE_BETSLIP_LIST, (obj) => obj),
    /**
     * 更新弹出窗口
     */
    updateCommonDialog: createAction(ActionTypes.UPDATE_COMMON_DIALOG, (obj) => obj),
    /**
     * 更新弹出窗口
     */
    toggleCommonDialog: createAction(ActionTypes.TOGGLE_COMMON_DIALOG, (obj) => obj)
};

export default actions;