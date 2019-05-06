/**
 * Created by easyLottoMac on 2018/10/23.
 */
import React, {Component} from 'react';
import {
    FlatList
} from 'react-native';
import {connectComponentAction} from "~/reduxCfg/index";
import * as storeKey from "~/constants/storeKeys";
import action from "./action";

class ScoreFlatList extends Component {
    static defaultProps = {
        scrollHandle: null // 滚动事件回调

    };

    _onScroll(e) {
        const {scrollHandle, onScrollHandle} = this.props;
        scrollHandle && scrollHandle(e);
        onScrollHandle(e);
    }

    render() {
        return (
            <FlatList
                {...this.props}
                onScroll={(e) => this._onScroll(e.nativeEvent)}
                scrollEventThrottle={1}/>
        )
    }
}

export default connectComponentAction(action, storeKey.SCORE_DETAILS_FLATLIST_STORE)(ScoreFlatList)