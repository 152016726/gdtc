/**
 * Created by easyLottoMac on 2018/9/13.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Text
} from 'react-native';
import {MainColor, BorderColor, BgColor, BgColorWhite} from '../../../../constants/color';
import {FONT_12} from "../../../../constants/fontSize";

export default class AnalysisTabBar extends Component {
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
        return (
            <TouchableOpacity onPress={()=>this.props.goToPage(i)}
                              key={i}>
                <View>
                    <Text style={[styles.eventBtn,  activeTab === i && styles.activeBtn]}>
                        {tab}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{height: 54}}>
                <ScrollView style={styles.tabs}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}>
                    {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        backgroundColor:BgColorWhite,
        flexDirection: 'row',
        height: 48,
        paddingHorizontal:12,
        paddingBottom:9,
        marginBottom: 9
    },
    activeBtn: {
        backgroundColor: BgColorWhite,
        borderWidth: 1,
        borderColor: MainColor,
        color: MainColor
    },
    eventBtn: {
        backgroundColor: BgColor,
        overflow: 'hidden',
        borderRadius: 4,
        fontSize: FONT_12,
        marginRight: 15,
        paddingVertical: 9,
        paddingHorizontal: 16,
    }
});
