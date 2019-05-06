/**
 * Created by marcus on 2018/11/27.
 */
import {createAction} from 'redux-actions';
import * as ActionTypes from '../../constants/ActionTypes';
import * as storeKey from '../../constants/storeKeys';

let actions = {
    updateState: createAction(ActionTypes.UPDATE_SUMMARY,(obj)=>obj),
    resetSummary(){
      return (
          (dispatch, getState) => {
              const {summary} = getState()[storeKey.SUMMARY_STORE];
              dispatch(actions.updatePersonnalInformation({summary}));
              dispatch(actions.updatePersonal({summary}))
          }
      )
    },
    updatePersonnalInformation: createAction(ActionTypes.UPDATE_PERSONAL_INFORMATION,(obj)=>obj),
    updatePersonal: createAction(ActionTypes.UPDATE_PERSONAL,(obj)=>obj)
};
export default actions