/**
 * 固定公用弹窗生成option及点击回调统一处理
 * Created by DDT on 2018/12/3.
 */
import React from 'react';
import AllPlays from './index';
import games from "@easylotto/bet";

let _selectedOcKeyArr = [];              //保存当前选择的outcomeKeys
let _delOcKeyArr = [];                   //保存需要删除的outcomeKeys

export default {
    /**
     * 获取弹出注项列表窗口参数
     * @param event     赛事对象
     * @param sort      需要显示的sort
     * @param callback  选择比赛后回调
     * @param ctrlSingleShow  是否增加控制单关显示逻辑
     * @returns {*}
     */
    getDialogOption(event, sort, callback, ctrlSingleShow, closeCallback) {
        let self = this;
        return {
            title: {
                home: event.homeName,
                away: event.awayName
            },
            content: <AllPlays vid={event.vid}
                               ctrlSingleShow={ctrlSingleShow}
                               data={event}
                               sort={sort}
                               handlePressItem={self.handlePressItem.bind(this)}
            />,
            onCancel(ops) {
                self.clearSelected();
                ops.close();
                closeCallback && closeCallback();
            },
            onConfirm(ops) {
                self.handleUpdateBetslipInfo((strKey) => {
                    let closeDialog; //callback返回false将不会关闭弹窗
                    if(callback){
                        closeDialog = callback(strKey);
                    }
                    self.clearSelected();
                    if(closeDialog !== false){
                        ops.close();
                    }
                });
            }
        };
    },
    /**
     * 点击注项按钮触发事件
     * @param isSelected    是否选上
     * @param betKey        触发注项key
     * @returns {*}
     */
    handlePressItem(isSelected, betKey) {
        let outcomeList = games.Betslip.getChooseOutcomes();
        let idxAdd, idxDel, idxOc;

        idxAdd = _selectedOcKeyArr.indexOf(betKey);   // 存在于增加数组的下标
        idxDel = _delOcKeyArr.indexOf(betKey);        // 存在于删除数组的下标
        idxOc = outcomeList.indexOf(betKey);         // 存在于投注篮中的下标

        if(isSelected){
            // 已经存在增加数组中
            if(idxAdd !== -1){
                return true;
                // 需要增加的key若不在投注篮中才需要加入增加数组
            }else if(idxOc === -1){
                _selectedOcKeyArr.push(betKey);
            }
            // 需要增加的key存在在删除数组，需要去掉
            if(idxDel !== -1){
                _delOcKeyArr.splice(idxDel, 1);
            }
        }else{
            // 已经存在删除数组中
            if(idxDel !== -1){
                return false;
                // 存在于投注篮中需要加入删除数组
            }else if(idxOc !== -1){
                _delOcKeyArr.push(betKey);
            }
            // 需要删除的key存在在增加数组，需要去掉
            if(idxAdd !== -1){
                _selectedOcKeyArr.splice(idxAdd, 1);
            }
        }

        return isSelected;
    },
    /**
     * 确认选上内容触发
     * @param callback
     */
    handleUpdateBetslipInfo(callback){
        let fnAddPromise = () => {
            return new Promise((resolve, reject) => {
                if(_selectedOcKeyArr.length > 0){
                    games.Betslip.setOutcomeToBetslip(_selectedOcKeyArr, ()=>{
                        resolve();
                    });
                }else{
                    resolve();
                }
            });
        };

        let fnDelPromise = () => {
            return new Promise((resolve, reject) => {
                if(_delOcKeyArr.length > 0){
                    games.Betslip.deleteFromBetslip(_delOcKeyArr, ()=>{
                        resolve();
                    });
                }else{
                    resolve();
                }
            });
        };

        fnDelPromise().then(fnAddPromise).then(() => {
            let strKey = _selectedOcKeyArr.map(item => ('+' + item))
                .concat( _delOcKeyArr.map(item => ('-' + item)) )
                .join(',');
            callback && callback(strKey);
        });
    },
    clearSelected() {
        _selectedOcKeyArr = [];
        _delOcKeyArr = [];
    }
};