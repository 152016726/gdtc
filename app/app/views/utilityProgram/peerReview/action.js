/**
 * Created by easyLottoMac_Feng on 2018/12/10.
 */

import {createAction} from 'redux-actions'
import * as ActionTypes from '~/constants/ActionTypes'
import * as storeKey from '~/constants/storeKeys'

import getPeerReview from '~/services/getPeerReview';
const ONEDATETIME = 24 * 60 * 60 * 1000; // 一天的毫秒数
const PAGESIZE = '200';                  // 每次请求的是赛事列表数

let actions = {

    getPeerReviewData() {
      return ((dispatch, getState)=>{
          let _today = new Date();
          let beforeDate = new Date(_today.getTime() - ONEDATETIME * 7);
          let startDate = beforeDate.format('yyyy-MM-dd');
          let endDate = _today.format('yyyy-MM-dd');
          let rspObj = {
              from: startDate,
              to: endDate,
              pageIndex: '0',
              pageSize: PAGESIZE
          };
          let leagues = [];
          getPeerReview.getData(rspObj).then(rsp => {
              let RDList = rsp.data.list;
              // 获取联赛
              RDList.forEach(dl => {
                  if(!(leagues.length) || leagues.indexOf(dl.leagueShortName) === -1) {
                      leagues.push(dl.leagueShortName)
                  }
              });
              dispatch(actions.updateData({
                  allFlatListData: RDList,
                  showFlatListData: RDList.slice(0)
              }));
              dispatch(actions.updateSCDate({
                  allBtns: leagues,
                  selectBtns:leagues.slice(0)
              }))
          })
      })
    },
    updateSCDate: createAction(ActionTypes.UPDATE_SCREENINGPAGE, (obj) => obj),
    updateData: createAction(ActionTypes.UPDATE_PEER_REVIEW, (obj) => obj)
};

export default actions