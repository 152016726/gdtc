/**
 * Created by easyLottoMac on 2018/9/13.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import {MainColor, BgColorWhite} from '~/constants/color';

export default class SDScrollTabBar extends Component {

    static defaultProps = {
        goToPage:()=>{},
        activeTab: 0,
        tabs:[]
    };

    renderTabOption(tab, i) {
        const {activeTab} = this.props;
        let color = activeTab === i ? MainColor : "#777777"; // 判断i是否是当前选中的tab，设置不同的颜色
        return (
            <TouchableOpacity onPress={()=>this.props.goToPage(i)}
                              style={[styles.tab, activeTab === i && styles.activeTab]}
                              key={i}>
                <View style={styles.tabItem}>
                    <Text style={{color: color}}>
                        {tab}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.tabs}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: BgColorWhite
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:'transparent',
        borderBottomWidth: 1
    },
    activeTab: {
        borderColor:MainColor,
        borderBottomWidth: 2
    },
    tabItem: {
        flexDirection: 'column',
        alignItems: 'center',
    },
});
