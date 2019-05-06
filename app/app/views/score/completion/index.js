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
import { BgColor } from '../../../constants/color';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DateScrollBar from '../../../components/dateScrollBar';
import Util from '../../../common/js/util';

export class Completion extends Component {

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
        if(tabIndex === 1){
            reqData(date);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { date, reqData } = this.props;
        if (nextProps.date !== this.props.date) {
            if (nextProps.dateScrollIndex < 6) {
                reqData(nextProps.date);
            }
        }
    }

    render() {
        const { completionList, navigation, refreshHandle, pullUpLoad, isFooter, tabIndex, matchInfo } = this.props;
        return (
            <View style={{ backgroundColor : BgColor }}
            >
                <ScoreList flatListData={completionList}
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

export default connectReducerComponent(storeKey.SCORE_COMPLETION, reducer, state, action)(Completion)