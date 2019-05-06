/**
 * Created by mac-ddt on 2018/8/10.
 */
import React, {Component} from 'react';
import {
    StyleSheet
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ScrollTabBar from '~/components/ScrollTabBar';
import {connectReducerComponent} from '~/reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '~/constants/storeKeys';
import HotNews from './hotNews';
import EventAnalysis from './EventAnalysis';
import OffSiteLace from './OffSiteLace';
import ExpertForecast from './ExpertForecast';
import {BgColor} from '~/constants/color';
import HeaderLeft from "~/components/headerLeft";


class EventInformation extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "赛事资讯",
            headerLeft: <HeaderLeft handleGoBack={() => navigation.goBack()} img={require('~/images/back.png')}/>,
        }
    };

    /**
     * 初始化数据
     * @param props
     */
    constructor(props) {
        super(props);
    }

    render() {
        const {navigation} = this.props;
        let tabName = ['热门资讯', '赛事分析', '专家分析', '场外花边'];
        return (
            <ScrollableTabView style={styles.contentBox}
                               renderTabBar={() => <ScrollTabBar tabNames={tabName}/>}
                               locked={false}
            >
                <HotNews navigation={navigation} tabLabel='热门资讯'/>
                <EventAnalysis navigation={navigation} tabLabel='赛事分析'/>
                <ExpertForecast navigation={navigation} tabLabel='专家分析'/>
                <OffSiteLace navigation={navigation} tabLabel='场外花边'/>
            </ScrollableTabView>
        )
    }

}

const styles = StyleSheet.create({
    contentBox: {
        backgroundColor: BgColor
    }
});

export default connectReducerComponent(storeKey.EVENTINFORMATION_STORE, reducer, state, action)(EventInformation)