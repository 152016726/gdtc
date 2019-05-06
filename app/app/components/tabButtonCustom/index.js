import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as colorConf from "../../constants/color";


export default class TabButtonCustom extends Component {
    static defaultProps = {
        tabNames: [] //显示的tab数组
    };

    goToPage(i) {
        this.props.goToPage(i);
    }

    getTabText(i) {
        let {tabNames, tabs} = this.props;
        return tabNames[i] || tabs[i];
    }

    renderTabOption(tab, i) {
        let {tabs, activeTab} = this.props;
        return (
            <TouchableOpacity onPress={() => this.goToPage.call(this, i)} key={tab}
                              style={[
                                  styles.tab,
                                  i === tabs.length - 1 ? styles.tabLast : null,
                                  activeTab === i ? styles.active : null
                              ]}>
                <Text style={[styles.tabText, activeTab === i ? styles.activeText : null]}>
                    {this.getTabText(i)}
                </Text>
            </TouchableOpacity>
        );
    }

    render() {
        const {tabs} = this.props;
        let marginV = 90 - 30 * (tabs.length - 2);
        return (
            <View style={[styles.tabs, {marginHorizontal: marginV}]}>
                {tabs.map((tab, i) => this.renderTabOption(tab, i))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: 30,
        borderColor: colorConf.MainColor,
        borderWidth: 1,
        marginTop: 9,
        marginBottom: 9,
        borderRadius: 4
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: colorConf.MainColor
    },
    tabLast: {
        borderRightColor: 'transparent'
    },
    tabText: {
        flexDirection: 'column',
        alignItems: 'center',
        color: colorConf.MainColor,
        fontSize: 12
    },
    active: {
        backgroundColor: colorConf.MainColor
    },
    activeText: {
        color: '#ffffff'
    }
});
