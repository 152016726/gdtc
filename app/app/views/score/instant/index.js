import React, { Component } from 'react';
import {
    View,
    DeviceEventEmitter
} from 'react-native';

import { connectReducerComponent } from '../../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../../constants/storeKeys';
import ScoreList from '../../../components/scoreList/index';
import { BgColor } from '../../../constants/color';

export class Instant extends Component {

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        const { date, reqData,tabIndex } = this.props;
        if(tabIndex === 0){
            reqData(date);
        }
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('UpdateData',this.props.refreshHandle);
    }

    componentWillUnmount(){
        DeviceEventEmitter.remove();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.date !== this.props.date) {
            if (nextProps.dateScrollIndex === 6) {
                //请求当前日期的数据
                this.props.reqData(nextProps.date);
            }
        }
    }

    render() {
        const { instantList, navigation, refreshHandle, pullUpLoad, isFooter, tabIndex, matchInfo } = this.props;
        return (
            <View style={{ backgroundColor : BgColor }}>
                <ScoreList flatListData={instantList}
                           matchInfo={matchInfo}
                           navigation={navigation}
                           pullUpLoad={pullUpLoad}
                           isFooter={isFooter}
                           refreshHandle={refreshHandle}
                           tabIndex={tabIndex}/>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SCORE_INSTANT, reducer, state, action)(Instant)