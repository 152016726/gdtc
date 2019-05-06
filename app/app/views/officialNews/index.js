/**
 * Created by easyLottoMac_Feng on 2019/1/21.
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
import {BgColor} from '~/constants/color';
import HeaderLeft from "~/components/headerLeft";
import OfficialAnnouncement from './officialAnnouncement';
import WinningNews from './winningNews';


class OfficialNews extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "官方公告",
            headerLeft: <HeaderLeft handleGoBack={() => navigation.goBack()} img={require('../../images/back.png')}/>,
        }
    };

    render() {
        const {navigation} = this.props;
        let tabName = ['官方公告', '中奖喜报'];
        return (
            <ScrollableTabView style={styles.contentBox}
                               renderTabBar={() => <ScrollTabBar tabNames={tabName}/>}
                               locked={false}
            >
                <OfficialAnnouncement navigation={navigation} tabLabel='官方公告'/>
                <WinningNews navigation={navigation} tabLabel='中奖喜报'/>
            </ScrollableTabView>
        )
    }

}

const styles = StyleSheet.create({
    contentBox: {
        backgroundColor: BgColor
    }
});

export default connectReducerComponent(storeKey.OFFICIALNEWS_STORE, reducer, state, action)(OfficialNews)