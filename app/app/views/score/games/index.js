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
import { BgColorWhite, BgColor } from '../../../constants/color';

export class Games extends Component {

    static defaultProps = {
        date : '',
    }

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
        const { date, reqData, tabIndex } = this.props;
        if(tabIndex === 2){
            reqData(date);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.date !== this.props.date) {
            if (nextProps.dateScrollIndex > 6) {
                this.props.reqData(nextProps.date);
            }
        }
    }

    render() {
        const { gamesList, navigation, refreshHandle, pullUpLoad, isFooter, tabIndex, matchInfo } = this.props;
        return (
            <View style={{ backgroundColor : BgColor }}
            >
                <ScoreList flatListData={gamesList}
                           matchInfo={matchInfo}
                           navigation={navigation}
                           pullUpLoad={pullUpLoad}
                           isFooter={isFooter}
                           refreshHandle={refreshHandle}
                           tabIndex={tabIndex}
                />
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SCORE_GAMES, reducer, state, action)(Games)