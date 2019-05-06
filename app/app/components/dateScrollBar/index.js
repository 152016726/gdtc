/**
 * Created by easyLottoMac on 2018/9/13.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    Platform
} from 'react-native';
import { MainColor, BgColor, BgColorWhite, tipsTextGrey} from '../../constants/color';
import { FONT_12, FONT_11 } from "../../constants/fontSize";
import Util from '../../common/js/util';
import { connectComponentAction } from "../../reduxCfg";
import action from "./action";
import * as storeKeys from "../../constants/storeKeys";
import PropTypes from 'prop-types';

const scrollTab = 50;//偏移量

class DateScrollBar extends Component {
    static PropsType = {
        goToPage : PropTypes.func.isRequired,      //点击事件
        activeTab : PropTypes.number,               //第一选项栏下标
        tabs : PropTypes.array.isRequired,          //显示的数组
        pageIndex : PropTypes.number,               //第一选项栏下标
        dateScrollIndex : PropTypes.number,         //日期选项栏下标
        isHide : PropTypes.bool.isRequired,          //按钮样式是否显示
        onQuery : PropTypes.func.isRequired          //绑定方法
    }

    constructor(props) {
        super(props);
        this.state = {
            chooseActiveTab : 6,//选中的日期
        }
    }

    renderTabOption(tab, i) {
        let week = Util.getWeek(tab);//显示周几
        let day = tab.substr(5, 9);//截取月日
        const { isHide } = this.props;
        const { chooseActiveTab } = this.state;
        return (
            <TouchableOpacity onPress={() => {
                this.handleGoToPage(i)
            }}
                              key={i}>
                <View style={[ styles.eventBtn, chooseActiveTab === i && isHide && styles.activeBtn ]}>
                    <Text style={[ styles.text, {marginBottom:2},chooseActiveTab === i && isHide && styles.chooseText ]}>{week}</Text>
                    <Text style={[ styles.text, chooseActiveTab === i && isHide && styles.chooseText ]}>{day}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    componentDidMount() {
        if(this.props.pageIndex === 1){
            this.handleDateBarScroll(5);
            this.setState({chooseActiveTab : 5});
        }else if(this.props.pageIndex ===2){
            this.handleDateBarScroll(7);
            this.setState({chooseActiveTab : 7});
        }else{
            this.handleDateBarScroll(6);
            this.setState({chooseActiveTab : 6});
        }
    }

    componentWillReceiveProps(nextProps) {
        const { dateScrollIndex } = nextProps;
        if (dateScrollIndex !== this.props.dateScrollIndex) {
            this.setState({ chooseActiveTab : nextProps.dateScrollIndex, isHide : nextProps.isHide });
            this.handleDateBarScroll(dateScrollIndex);
        }
    }

    /**
     *  跳转指定的日期
     * @param i为日期的下标 6为当天 大于6为今天之后 小于为今天之前
     * @param isHide 为是否隐藏按钮样式
     */
    handleGoToPage(i) {
        const { saveCurrentTabToRedux } = this.props;
        saveCurrentTabToRedux(i);
        this.setState({ chooseActiveTab : i });
        this.handleDateBarScroll(i);
        this._onQuery(i);
    }

    /**
     * 日期选项栏的偏移
     * @param i 日期的下标
     */
    handleDateBarScroll(i) {
        let ScrollView = this.scoreTabBar;
        if (ScrollView !== null) {
            //偏移
            setTimeout(()=>{
                ScrollView.scrollTo({ x : i * scrollTab, y : 0, animated : true }, 1);
            },0)
        }
    }

    render() {
        const { tabs } = this.props;
        return (
            <View style={{ height : 48 }}>
                <ScrollView style={styles.tabs}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            ref={ref => this.scoreTabBar = ref}
                >
                    {tabs.map((tab, i) => this.renderTabOption(tab, i))}
                </ScrollView>
            </View>
        );
    }

    //输出时间
    _onQuery(i){
        const { tabs, onQuery } = this.props;
        onQuery(tabs[ i ]);
    }
}

export default connectComponentAction(action, storeKeys.SCORE_SCROLL_DATE_BAR)(DateScrollBar)

const styles = StyleSheet.create({
    tabs : {
        backgroundColor : BgColorWhite,
        flexDirection : 'row',
        height : 48,
        paddingHorizontal : 12
    },
    activeBtn : {
        backgroundColor : BgColorWhite,
        borderWidth : 1,
        borderColor : MainColor
    },
    eventBtn : {
        backgroundColor : BgColor,
        overflow : 'hidden',
        borderRadius : 4,
        height : 32,
        width : 56,
        marginRight : 18,
        marginTop : 8,
        justifyContent : 'center',
        alignItems : 'center',
    },
    text : {
        fontSize : FONT_11,
        color : tipsTextGrey,
        paddingVertical : 0,
        paddingHorizontal : 0,
        textAlign : 'center',
        ...Platform.select({
            ios:{
                lineHeight:11,
            },
            android:{
                marginTop:-3,
                marginBottom:-3
            }
        })
    },
    chooseText : {
        backgroundColor : BgColorWhite,
        color : MainColor,
    }
});
