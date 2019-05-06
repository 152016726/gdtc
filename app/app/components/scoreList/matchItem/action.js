import { createAction } from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';
import DictData from '../../../common/js/dictData';
import { MainColor, FinalMatchColor, NotStartMatchColor } from '../../../constants/color';
import getAddAttentionVid from '../../../services/getAddAttentionVid';
import JPushModule from 'jpush-react-native';

let actions = {
    /**
     * 比赛状态判断
     * @param data
     * @returns {function(*, *)}
     */
    handleMatchState(item) {
        return ((dispatch, getState) => {
            let matchScore;          //比赛比分
            let matchStateColor;     //比赛状态颜色
            let matchState;          //比赛状态
            let matchHalfScore;      //半场比分
            let fullTimeScore;       //全场比分
            let overTimeScore;       //加时比分
            let penaltyScore;        //点球比分
            if (item.eventState.length === 0) {
                return;
            }
            //赛事比分判断  1：为开赛 11：待定 12：推迟
            if (item.eventState === DictData.eventState[ 1 ].id ||
                item.eventState === DictData.eventState[ 11 ].id ||
                item.eventState === DictData.eventState[ 12 ].id) {
                matchScore = 'VS';
            } else {
                matchScore = item.homeGoalsScored + '﹣' + item.awayGoalsScored;
            }
            //比赛颜色判断  2：上半场 3:上半场完 4：下半场 5：加时上半场 7：加时下半场 9：完场
            if (item.eventState === DictData.eventState[ 2 ].id ||
                item.eventState === DictData.eventState[ 4 ].id ||
                item.eventState === DictData.eventState[ 5 ].id ||
                item.eventState === DictData.eventState[ 7 ].id) {
                matchStateColor = MainColor;
            } else
            if (item.eventState === DictData.eventState[ 9 ].id ||
                item.eventState === DictData.eventState[ 3 ].id)
            {
                matchStateColor = FinalMatchColor;
            }
            else {
                matchStateColor = NotStartMatchColor;
            }
            //比赛时间判断 2：上半场 4：下半场 5：加时上半场 7：加时下半场
            if (item.eventState === DictData.eventState[ 2 ].id ||
                item.eventState === DictData.eventState[ 4 ].id ||
                item.eventState === DictData.eventState[ 5 ].id ||
                item.eventState === DictData.eventState[ 7 ].id) {
                if (item.vsTime === '' && item.time !== null) {
                    item.vsTime = item.time;
                }
                if (item.eventState === DictData.eventState[ 2 ].id && parseInt(item.vsTime) > 2700) {
                    //如果超过2700秒 还是2：上半场 显示45+'
                    matchState = '45' + '+';
                } else if (item.eventState === DictData.eventState[ 4 ].id && parseInt(item.vsTime) > 5400) {
                    //如果超过5400秒 还是2：上半场 显示90+'
                    matchState = '90' + '+';
                } else if (item.eventState === DictData.eventState[ 5 ].id && parseInt(item.vsTime) > 6300) {
                    //如果超过6300秒 还是2：上半场 显示105+'
                    matchState = '105' + '+';
                } else if (item.eventState === DictData.eventState[ 7 ].id && parseInt(item.vsTime) > 7200) {
                    //如果超过7200秒 还是2：上半场 显示120+'
                    matchState = '120' + '+';
                } else {
                    //否则直接显示比赛时间
                    matchState = Math.floor(item.vsTime / 60) + '';
                    if(matchState < 2){
                        matchState = 1 + '';
                    }else if(matchState < 46 && item.eventState === DictData.eventState[ 4 ].id ){
                        matchState = 45 + '';
                    }
                }

            }
            else {
                matchState = DictData.eventState[ item.eventState ].shortText;
            }
            //中场判断 1：开赛 11：待定 12：推迟
            if (item.eventState === DictData.eventState[ 1 ].id ||
                item.eventState === DictData.eventState[ 11 ].id ||
                item.eventState === DictData.eventState[ 12 ].id ||
                item.eventState === DictData.eventState[ 2 ].id
            ) {
                if (item.vsTime === '' && item.time !== null) {
                    item.vsTime = item.time;
                }
                matchHalfScore = ' ';
            }
            else {
                matchHalfScore = item.homeHalftimeScored + '﹣' + item.awayHalftimeScored;
            }

            //尾部的90分钟比分 加时比分 点球比分
            if (item.homeOverTimeScored !== undefined &&
                item.homeOverTimeScored !== '' &&
                item.awayOverTimeScored !== undefined &&
                item.awayOverTimeScored !== '') {
                fullTimeScore = '90分钟[' + item.homeGoalsScored + '﹣' + item.awayGoalsScored + ']';
            } else {
                fullTimeScore = ' '
            }

            //尾部的120分钟比分
            if (item.homeOverTimeScored !== undefined &&
                item.homeOverTimeScored !== '' &&
                item.awayOverTimeScored !== undefined &&
                item.awayOverTimeScored !== '') {
                overTimeScore = '120分钟[' + item.homeOverTimeScored + '﹣' + item.awayOverTimeScored + ']';
            } else {
                overTimeScore = ' ';
            }

            //尾部的点球比分
            if (item.homePenaltyScored !== undefined &&
                item.homePenaltyScored !== '' &&
                item.awayPenaltyScored !== undefined &&
                item.awayPenaltyScored !== '') {
                penaltyScore = '点球[' + item.homePenaltyScored + '﹣' + item.awayPenaltyScored + ']';
            } else {
                penaltyScore = ' ';
            }

            //将判断后的值合并到item里面
            Object.assign(item, { matchScore, matchStateColor, matchState, matchHalfScore, fullTimeScore, overTimeScore, penaltyScore });
            dispatch(actions.updateScore({
                matchInfo : item
            }));

        })
    },
    /**
     * 更新当前list数据
     * @returns {function(*, *)}
     */
    updateScoreList(){
        return ((dispatch, getState) => {
            let { dataList } = getState()[ storeKey.SCORE_STORE ];

            dispatch(actions.updateScore({
                dataList : dataList
            }));
        })
    },
    /**
     * 修改收藏上标数字
     * @param isFavourite 按钮点击是收藏还是删除
     * @returns {function(*, *)}
     */
    handleAttentionDataLenth(isFavourite){
        return ((dispatch, getState) => {
            let { attentionLen } = getState()[ storeKey.SCORE_STORE ];
                if(isFavourite){
                    attentionLen--;
                }else{
                    attentionLen++;
                }
                dispatch(actions.updateScore({
                    attentionLen:attentionLen
                }));
        })
    },
    updateAddAttention(vid,isAttention){
      return ((dispatch, getState) => {
          JPushModule.getRegistrationID((registrationId) => {
              let operation = isAttention ? 1 : 2 ;
              let reqData = { registrationID : registrationId,
                  operation:operation,
                  vid:vid
              };
              // console.log('关注的推送ID',registrationId,reqData);
              getAddAttentionVid.getData(reqData)
                  .then(data =>{
                      console.log('关注变更',data,reqData);
                  })
                  .catch(e=>{});
          });

      })
    },

    updateScore : createAction(ActionTypes.UPDATE_SCORE, (obj) => obj)

};
export default actions