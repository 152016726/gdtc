/**
 * Created by easyLottoMac on 2018/10/16.
 */

import {createAction} from 'redux-actions';
import * as ActionTypes from '../../../../constants/ActionTypes';
import * as storeKey from '../../../../constants/storeKeys';
import getAgainstStatistic from '../../../../services/getAgainstStatistic';
import getImportantVersusInfo from '../../../../services/getImportantVersusInfo';

/**
 * 初始化数据统计部分
 * @param data
 */
const initTeamData = (data)=>{
    let homeData = {};
    let awayData = {};
    let isNoData = true;
    if(data){
        for(let p in data){
            let prefix = '';
            let objSet = null;
            isNoData && (isNoData = false);
            // 主队参数
            if(p.indexOf('home') === 0){
                prefix = 'home';
                objSet = homeData;
            // 客队参数
            }else if(p.indexOf('away') === 0){
                prefix = 'away';
                objSet = awayData;
            }
            // 开始设置属性，非home、away属性不处理
            if(objSet){
                let key = p.replace(prefix, '');
                key = key.charAt(0).toLowerCase() + key.substr(1);
                objSet[key] = data[p];
            }
        }
    }
    return {
        homeData,
        awayData,
        isStrokeData: !isNoData
    };
};

/**
 * 初始化事件数据部分
 * @param data
 */
const initEventsData = (data, oldEvents)=>{
    let events = oldEvents ? oldEvents.splice(0) : [];
    if(data && data.actions){
        data.actions.forEach((item) => {
            for(let p in item){
                if(p !== 'time'){
                    let prefix = '';
                    let isHome = false;
                    let person1 = '';
                    let person2 = '';
                    let type = '';
                    // 主队参数
                    if(p.indexOf('home') === 0){
                        prefix = 'home';
                        isHome = true;
                        // 客队参数
                    }else if(p.indexOf('away') === 0){
                        prefix = 'away';
                    }
                    if(prefix !== ''){
                        type = p.replace(prefix, '');
                        type = type.charAt(0).toLowerCase() + type.substr(1);
                        // 非换人
                        if(type !== 'substitution'){
                            person1 = item[p]['playerCnShort'] || '';
                        }else{
                            person1 = item[p]['in'];
                            person2 = item[p]['out'];
                        }
                    }
                    events.push({
                        // -- ljx 2018.11.09
                        time: Math.floor((item.time ? item.time : 0 )/60) + '\'',
                        type,
                        isHome,
                        person1,
                        person2
                    });
                }
            }
        });
    }
    return {
        events
    };
};

let actions = {
    getData(vid) {
        return (dispatch, getState) => {
            getAgainstStatistic.getData({ vid }).then(rsqTechData => {
                dispatch(actions.updateData(
                    Object.assign({
                        firstKickOff: rsqTechData.data.firstKickOff || '-1'
                    }, initTeamData(rsqTechData.data))
                ));
            });
            getImportantVersusInfo.getData({ vid }).then(rsqLineData => {
                let objUpdate = initEventsData(rsqLineData.data);
                dispatch(actions.updateData(
                    Object.assign(objUpdate, {
                        isTimeData: objUpdate.events.length > 0
                    })
                ));
            });
        };
    },
    updateData : createAction(ActionTypes.UPDATE_LIVE_EVENT_SITUATION, (dataObj) => dataObj)
};

export default actions;