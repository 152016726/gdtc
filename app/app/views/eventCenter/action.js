/**
 * Created by marcus on 2018/11/28.
 */
import {createAction} from 'redux-actions';
import getNationInfo from '../../services/getNationInfo';
import getAreaInfo from '../../services/getAreaInfo';
import * as ActionTypes from '../../constants/ActionTypes';
import * as storeKey from '../../constants/storeKeys';

let inner_fn = {
    initDataList(arr){
        let dataList = [];

        arr.forEach((item, index)=> {
            getNationInfo.getData({id: item.id}).then(rsp=>{
                // 应产品要求国际赛事下的名称去掉赛事两个字
                if(index === arr.length-1 ){
                    rsp.data.list.forEach((val)=> {
                        let name = val.name;
                        val.name = name.substring(0, name.length-2);
                    })
                }
                dataList[index] = rsp.data.list;
            },rej=>{
                dataList[index] = [];
                console.log(rej.rspMsg);
            });
        });

        return dataList
    }
};

let actions = {
    initNations(){
        return ((dispatch, getState)=>{
            getAreaInfo.getData().then(response=>{
                let arr = response.data.list;
                // 将赛区原数组存储在state中
                dispatch(actions.updateState({
                    nations: arr
                }));

                let list = arr.map((item)=>{
                    return item.name;
                });
                // 将赛区的名字保存为数组存储在state中
                dispatch(actions.updateState({
                    nationsNames: list
                }));
                // 每个赛事下的国家列表作为一个子项存在dataList数组中
                dispatch(actions.updateState({
                    dataList: inner_fn.initDataList(arr)
                }));
            },reject=>{
                console.log(reject.rspMsg);
            });
        })
    },
    updateState: createAction(ActionTypes.UPDATE_EVENTCENTER,(obj)=>obj)
};
export default actions
