/**
 * 暂时没有路由,使用单一
 * Created by mac-ddt on 16/7/6.
 */
/**
 * Created by DDT on 2016/1/25.
 */
import { combineReducers, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {  handleActions } from 'redux-actions'
import { reloadStore } from './configureStore'
// import multiLang from '../modules/multiLanguage'
let reducerMap = {};

/**
 * 增加注入reducer到store
 * @param curReducerMap
 */
export const injectReducer = (curReducerMap) => {
    let isNew = false;
    for(let p in curReducerMap){
        if(!reducerMap[p]){
            isNew = true;
            reducerMap[p] = curReducerMap[p];
        }
    }
    isNew && reloadStore(reducerMap);
};

export const createReducerMap = (key, handlers, initialState) => {
    return {
        [key]: handleActions(handlers, initialState)
    }
};

export const createStateToProps = (key) => {
    return (state) => state[key];
};

export const createDispatchToProps = (actions) => {
    return (dispatch) => bindActionCreators(actions, dispatch);
};

export const connectReducerComponent = (key, handlers, initialState, actions) => {
  /*  if(lang){
        multiLang.setTransData(key, lang,()=>{
            initialState['langData'] = multiLang.getTransData(key);
        });
        
    }*/
    injectReducer(createReducerMap(key, handlers, initialState));
    
    return actions ? connect(createStateToProps(key), createDispatchToProps(actions)) : connect(createStateToProps(key));
};

/**
 * 只绑定调用dispatch事件对象
 * @param actions
 * @param key
 */
export const connectComponentAction = (actions, key) => {
    let createState = null;
    if(key){
        let initialState = {};
       /* multiLang.setTransData(key, lang,()=>{
            initialState['langData'] = multiLang.getTransData(key);
        });*/
        injectReducer(createReducerMap(key, {}, initialState));
        createState = createStateToProps(key)
    }
    return connect(createState, createDispatchToProps(actions));
};

export const connectComponentState = (key, initialState={}) => {
   /* if(lang){
        multiLang.setTransData(key, lang,()=>{
            initialState['langData'] = multiLang.getTransData(key);
        });
    }*/
    injectReducer(createReducerMap(key, {}, initialState));
    return connect(createStateToProps(key));
};

export const connectComponentLang = (key) => {
    return connectComponentState(key, {});
};

export default function getCombineReducers(){
    return combineReducers(reducerMap);
}
