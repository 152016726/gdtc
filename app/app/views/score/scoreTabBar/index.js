import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions
} from 'react-native';
import {MainColor, BgColorWhite, BorderColor} from '../../../constants/color';
import {connectComponentAction} from '../../../reduxCfg';
import action from './action';
import * as storeKeys from '../../../constants/storeKeys';
import DateScrollBar from '../../../components/dateScrollBar';
import Util from '../../../common/js/util';
import PropTypes from 'prop-types';

const s_w = Dimensions.get('window').width;
const date = Util.getRecentDays();//获取前7后2的日期数组 格式为2018-10-10

class ScoreTarBar extends Component {

    static PropsType = {
        goToPage: PropTypes.func, //转到页
        activeTab: PropTypes.number, //选中页下标
        tabs: PropTypes.array,   //转换项的数组
        pageIndex: PropTypes.number, //第一选项栏下标
        dateScrollIndex: PropTypes.number, //时间选项栏小标
        isHide: PropTypes.bool, //时间选项栏的按钮样式显示
        attentionLen: PropTypes.number
    };

    static defaultProps = {
        attentionLen: 0  //关注的数量
    };

    constructor(props) {
        super(props);
    }

    renderTabOption(tab, i) {
        const {pageIndex, attentionLen} = this.props;
        let color = pageIndex === i ? MainColor : "#909090"; // 判断i是否是当前选中的tab，设置不同的颜色
        let showIcon = pageIndex !== 3 && i === 3 && attentionLen > 0;
        return (
            <TouchableOpacity onPress={() => this.handleGoToPage(i)}
                              style={[styles.tab, pageIndex === i && styles.activeTab]}
                              key={i}>
                <View style={styles.tabItem}>
                    <Text style={{color: color}}>
                        {tab}
                    </Text>
                    {showIcon && <Text style={styles.iconSt}>{attentionLen}</Text>}
                </View>
            </TouchableOpacity>
        );
    }

    componentWillReceiveProps(nextProps) {
        const {pageIndex} = nextProps;
        if (pageIndex !== this.props.pageIndex) {
            this.props.goToPage(pageIndex);
        }
    }

    /**
     *  点击第一选项栏后 时间选项栏的响应
     * @param i=第一栏的下标
     */
    handleGoToPage(i) {
        const {handlePageIndex} = this.props;
        handlePageIndex(i);
    }

    render() {
        let {tabs, pageIndex, goToPage, dateScrollIndex, isHide} = this.props;
        return (
            <View style={{flexDirection: 'column'}}>
                <View style={styles.tabs}>
                    {tabs.map((tab, i) => this.renderTabOption(tab, i))}
                </View>
                {pageIndex !== 3
                    ? <DateScrollBar tabs={date}
                                     goToPage={goToPage}
                                     pageIndex={pageIndex}
                                     dateScrollIndex={dateScrollIndex}
                                     isHide={isHide}
                                     onQuery={this.onQuery.bind(this)}
                    >
                    </DateScrollBar>
                    : <View style={{height: 0}}/>}
            </View>
        );
    }

    //输出日期
    onQuery(_date) {

    }
}

export default connectComponentAction(action, storeKeys.SCORE_SCROLL_BAR)(ScoreTarBar)

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: 40,
        width: s_w,
        backgroundColor: BgColorWhite,
        borderColor: BorderColor,
        borderBottomWidth: 1
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconSt: {
        position: 'absolute',
        right: -12,
        top: -4,
        width: 12,
        height: 12,
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: MainColor,
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 12,
        fontSize: 10
    },
    activeTab: {
        borderColor: MainColor,
        borderBottomWidth: 2
    },
    tabItem: {
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
    }
});
