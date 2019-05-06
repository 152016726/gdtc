/**
 * Created by easyLottoMac on 2018/10/22.
 */
import React, {Component} from 'react';
import {connectComponentAction} from "~/reduxCfg/index";
import * as storeKey from "~/constants/storeKeys";
import action from "./action";
import NestedScrollView from 'react-native-nested-scroll-view';

class ScoreScrollView extends Component{
    static defaultProps = {
        scrollHandle: null  // 滚动事件回调
    };

    _onScroll(e) {
        const {scrollHandle, onScrollHandle} = this.props;
        scrollHandle && scrollHandle(e);
        onScrollHandle (e);
    }
    render (){
        const {children, refInnerSV} = this.props;
        return (
            <NestedScrollView
                        style={{flex:1}}
                        onScroll={(e)=>this._onScroll(e.nativeEvent)}
                        {...this.props}
                        ref={ view => { refInnerSV && refInnerSV(view)}}
                        scrollEventThrottle={1}>
                {children}
            </NestedScrollView>
        )
    }
}

export default connectComponentAction(action, storeKey.SCORE_DETAILS_SCROLLVIEW_STORE)(ScoreScrollView)