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
import {MainColor, BorderColor, BgColorWhite, contentText} from '~/constants/color';

export default class ScrollTabBar extends Component {

    static defaultProps = {
        goToPage:()=>{},
        activeTab: 0,
        tabs:[]
    };

    constructor(props){
        super(props);
    }

    renderTabOption(tab, i) {
        const {activeTab} = this.props;
        let color = activeTab === i ? MainColor : contentText; // 判断i是否是当前选中的tab，设置不同的颜色
        return (
            <TouchableOpacity onPress={()=>this.props.goToPage(i)}
                              style={[styles.tab, activeTab === i && styles.activeTab]}
                              key={i}>
                <View style={styles.tabItem}>
                    <Text style={{color: color, fontSize: 16}}>
                        {tab}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const {cls} = this.props;
        return (
            <View style={[styles.tabs, cls]}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: BgColorWhite,
        paddingBottom: 10
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:BorderColor,
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
