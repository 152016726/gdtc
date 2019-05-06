/**
 * Created by marcus on 2018/12/4.
 */
import {createAction} from 'redux-actions';
import * as ActionTypes from '../../../constants/ActionTypes';
import * as storeKey from '../../../constants/storeKeys';
import getSeasonList from '../../../services/getSeasonsList';

let actions={
    /**
     * 获取赛季列表
     * @returns {function()}
     */
    getSeasonInfo(){
      return(
          (dispatch, getState) => {
              const {id, seasonId} = getState()[storeKey.SEASONS_STORE];
              getSeasonList.getData({
                  lid: id
              }).then(rsp=>{
                  dispatch(actions.updateState({
                      seasons: rsp.data.list
                  }));
                  // 选择默认的赛季
                  rsp.data.list.forEach((val,index)=>{
                      if(val.seasonId === seasonId) {
                          return dispatch(actions.updateState({
                              defaultTab: index
                          }));
                      }
                  })
              },rej=>{
                  console.log(rej.rspMsg);
              });
          }
      )
    },
    updateState: createAction(ActionTypes.UPDATE_SEASONS,(obj)=>obj),
    updateLastState: createAction(ActionTypes.UPDATE_EVENTLEAGUEDETAIL,(obj)=>obj)
};
export default actions