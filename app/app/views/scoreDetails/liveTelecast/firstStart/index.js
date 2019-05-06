/**
 * Created by easyLottoMac on 2018/10/16.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    FlatList
} from 'react-native';
import ScoreScrollView from '../../components/scoreScrollView';
import {connectReducerComponent} from '../../../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../../../constants/storeKeys';
import Lineup from './components/lineup'
import HeaderBar from './components/headerBar'
import Player from './components/Player'
import testData from './testData'
import _ from 'lodash';

class ScoreInformation extends Component {
    componentWillMount() {
        this.props.getPlayerList({vid: this.props.vid});
    }

    /**
     *  切换主客显示
     * @param type 显示的类型
     */
    handleSelectType(type) {
        this.props.changeShowList(type)
    }

    /**
     * 渲染球员列表
     * @param data
     * @param formation
     * @returns {any[]}
     */
    renderPlayerList(data, formation) {
        return _.keys(data).map((type, index) => {
            let title = index === 0 ? `首发阵容(${formation})` : '替补阵容';
            let isBtn = Number(type) === 0;
            return data[type].map((item, _index) => (
                <View key={_index}>
                    {_index === 0 &&
                    <HeaderBar title={title} isBtn={isBtn} handleSelectType={this.handleSelectType.bind(this)}/>}
                    <Player key={index} {...item}/>
                </View>
            ))
        })
    }

    render() {
        const {showPlayerInfo = {}, lineupFormat = {}, homeLineCfg, awayLineCfg} = this.props;
        const {formation = '', showPlayerList = []} = showPlayerInfo;
        const {home = [], away = []} = lineupFormat;
        return (
            <View style={styles.container}>
                <ScoreScrollView>
                    <View style={styles.lineupCt}>
                        {
                            home.length > 0 ?
                                <Lineup lineupFormat={lineupFormat}
                                        homeLineCfg={homeLineCfg}
                                        awayLineCfg={awayLineCfg}/>
                                : <View style={styles.noDataWarp}>
                                    <Text style={styles.noDataText}>暂无阵容数据</Text>
                                </View>
                        }
                    </View>
                    {this.renderPlayerList(showPlayerList, formation)}
                </ScoreScrollView>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SCORE_DETAILS_LIVE_FIRST_STORE, reducer, state, action)(ScoreInformation)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Dimensions.get('window').height - 277,
        overflow: 'scroll'
    },
    lineupCt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataWarp: {
        paddingTop: 150
    },
    noDataText: {
        color: '#909090'
    }
});