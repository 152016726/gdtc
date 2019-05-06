/**
 * Created by easyLottoMac on 2018/10/16.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native';
import ScoreScrollView from '../../components/scoreScrollView';
import {connectReducerComponent} from '../../../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../../../constants/storeKeys';
import LiveItem from './components/liveItem';
import pushClient from '@easylotto/push_client';

let off = null;               //解绑push方法

class ScoreInformation extends Component {
    componentWillMount() {
        // this.props.getBroadcastList(this.props.vid);
        //TODO  是否需要判断赛事状态是否需要绑定 push
        this.bindLiveInfoUpdate()
    }

    /**
     *绑定赛事文字直播push
     */
    bindLiveInfoUpdate() {
        off = pushClient.onEventTextUpdate(this.props.vid, this.onEventTextUpdate.bind(this))
    }

    /**
     * 更新文字直播信息
     * @param data
     */
    onEventTextUpdate(data) {
        // console.log(data);
        const {info} = this.props;
        let updateObj = {
            time: data.time,
            text: data.text,
        };
        info.unshift(updateObj);
        // console.log(info);
        this.props.setLiveAllData({info: info.slice(0)})
    }

    /**
     * 渲染文字直播数据列表
     * @param info
     * @returns {*}
     */
    renderLiveInfo(info) {
        /* const {info} = this.props;*/
        return info.map((list, index) => {
            let isLast = index === list.length - 1;
            return <LiveItem key={index} {...list} isLast={isLast}/>
        })
    }

    componentWillUnmount() {
        //解绑push
        off && off();
        //销毁组件需要重置数据
        this.props.setLiveAllData(state)
    }

    render() {
        const {info} = this.props;
        return (
            <View style={styles.container}>
                <ScoreScrollView showsVerticalScrollIndicator={false}>
                    {this.renderLiveInfo(info)}
                </ScoreScrollView>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SCORE_DETAILS_LIVE_WORDS_STORE, reducer, state, action)(ScoreInformation)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Dimensions.get('window').height - 263,
        overflow: 'scroll',
        paddingLeft: 17,
        paddingRight: 14
    },
    noWordsWarp: {
        paddingTop: 150
    },
    noWords: {
        textAlign: 'center',
        color: '#909090'
    }
});