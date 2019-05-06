import React, { Component } from 'react';
import {
    View,
    DeviceEventEmitter
} from 'react-native';

import { connectReducerComponent } from '../../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../../constants/storeKeys';
import ScoreList from '../../../components/scoreList/index';
import AttentionDataManager from'../../../dataManager/attentionDataManager';
import { BgColorWhite, BgColor } from '../../../constants/color';

export class Attention extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('UpdateData',this.props.refreshHandle);
    }

    componentWillUnmount(){
        DeviceEventEmitter.remove();
    }

    componentWillMount() {
        this.props.reqData(true);
    }

    componentWillReceiveProps(nextProps) {
        const { reqData, attentionList} = this.props;
        if ((nextProps.attentionList && nextProps.attentionList.toString())
            !== (attentionList && attentionList.toString())) {
            reqData(false);
        }
    }

    render() {
        const { attentionList, refreshHandle, navigation, isFooter, tabIndex, matchInfo, reqData }  = this.props;
        return (
            <View style={{ backgroundColor : BgColor }}
            >
                <ScoreList flatListData={attentionList}
                           matchInfo={matchInfo}
                           navigation={navigation}
                           isFooter={isFooter}
                           tabIndex={tabIndex}
                           refreshHandle={refreshHandle}
                />
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SCORE_ATTENTION, reducer, state, action)(Attention)