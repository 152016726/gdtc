import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import getVersionUpdate from '../../services/getVersionUpdate';
import { Platform } from 'react-native';

let actions = {
    getData(){
        let reqObj = {
            sysType: Platform.OS === 'ios' ? 1 : 0
        };
        return ((dispatch, getState) => {
            getVersionUpdate.getData(reqObj).then(data => {
                let dataJson = data.data;
                // console.log('@@@@@@@@@@@@@@@@',dataJson);
                    dispatch(actions.updateVersion({
                        version:dataJson.version,
                    }));
            }, rejectData => {
                console.log(rejectData);
            })
        })
    },
    updateVersion: createAction(ActionTypes.UPDATE_ABOUT_US, (obj) => obj),
};
export default actions