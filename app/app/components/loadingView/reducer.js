/**
 * Created by ycl on 16/7/11.
 */
import * as actionTypes from '../../constants/ActionTypes'

export default {
    [actionTypes.LOADING_SHOW_VIEW]:(state, action)=>{
        return Object.assign({}, state, {isShow:true})
    },
    [actionTypes.LOADING_HIDE_VIEW]:(state, action)=>{
        return Object.assign({}, state, {isShow:false})
    }
}