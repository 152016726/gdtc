import React, {Component} from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    SectionList,
    Text
} from 'react-native';
import {connectReducerComponent} from "../../../reduxCfg/index";
import * as storeKey from "../../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import CommonEvent from '../components/commonEvent';
import MatchHeader from '../components/matchHeader';
import BetArea from '~/components/betArea';
import * as CommonColor from '~/constants/color';
import methodCfg from '../methodCfg';
import util from '~/common/js/util'
import _ from 'lodash';
import games from '@easylotto/bet'
import Screen from '~/modules/screen'
let _FIXHEIGHT  = 54;     //针对IPHONEX & IPHONEXR 修正底部高度问题

const _VIEWABILITY_CONFIG = {
    // minimumViewTime: 3000,
    // viewAreaCoveragePercentThreshold: 100,
    // waitForInteraction: true,
    // viewAreaCoveragePercentThreshold: 0     // 元素若已经生成，不会自动销毁
};

class MatchList extends Component {
    state = {
        isRefreshing: false,      //加载中状态
    };

    componentWillMount() {
        let {isFromExpert, sort} = this.props;
        this.props.getMatchList({
            isFocus: this.props.isFocusEvent,
            sort,
            isFromExpert
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sort !== this.props.sort) {
            const {isFromExpert} = this.props;
            this.props.filterSort(nextProps.sort, isFromExpert);
            if (isFromExpert) {
                games.Betslip.clearBetslip();
                this.props.setBetsilpList({
                    eventCount: 0,
                    currentKey: ''
                })
            }
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.sort === this.props.sort;
    }

    renderOneEvent({item, index}) {
        const {sort, currentKey, hideGrp, handleDirectDetail, isFromExpert} = this.props;
        let {vid, grpDate} = item;
        let isHide = hideGrp.indexOf(grpDate) !== -1;

        return <CommonEvent
            key={index}
            index={index}
            sort={sort}
            vid={vid}
            isHide={isHide}
            currentKey={currentKey}
            isFromExpert={isFromExpert}
            handleDirectDetail={handleDirectDetail}
        />
    }

    /**
     * 下拉刷新重新获取数据
     */
    reloadPage() {
        const {isFocusEvent, isFromExpert, sort} = this.props;
        this.props.updateRefreshStatus();
        // TODO 这里重新获取数据，有可能存在问题，比如当前为半全场玩法，而获取是全部数据的，有可能存在没有半全场的比赛都刷新到比赛数据中
        this.props.getMatchList({
            isFocus: isFocusEvent,
            isReload: true,
            sort,
            isFromExpert
        });
    }

    /**
     * 获取不同玩法对应的文字描述
     * @returns {*}
     */
    getNoEventText() {
        const {sort} = this.props;
        let obj = methodCfg.filter((item) => {
            return item.sort === sort
        });
        return <Text style={styles.noMktText}>
            {`暂无${obj[0].shortTxt}赛事`}
        </Text>
    }

    /**
     * 更新隐藏组
     * @param key
     */
    handlePressGroup(key) {
        this.props.updateHideGroup(key);
    }

    /**
     * 销毁组件重置部分数据
     */
    componentWillUnmount() {
        const {setAllEvents} = this.props;
        setAllEvents && setAllEvents({
            grpEvent: {},
            isNullData: false,
            isRefreshing: false
        })
    }

    render() {
        const {grpEvent, handleGoToBetslip, handleJumpToRecommend, isFocusEvent = false, hideGrp, sort, isNullData, isFromExpert, selSort} = this.props;
        const {isRefreshing} = this.state;
        return (<View style={styles.matchContainer}>
            {
                isNullData ?
                    <View style={styles.noMktCnt}>
                        <Text>{this.getNoEventText()}</Text>
                    </View> :
                    util.isEmptyObject(grpEvent) ?
                        false :
                        <SectionList
                            renderItem={this.renderOneEvent.bind(this)}
                            renderSectionHeader={({section}) => {
                                let {key, week, data} = section;
                                let isHide = hideGrp.indexOf(key) !== -1;
                                return <MatchHeader
                                    strDate={key}
                                    count={data.length}
                                    week={week}
                                    status={isHide}
                                    isFocusEvent={isFocusEvent}
                                    onPress={this.handlePressGroup.bind(this, key)}
                                />
                            }}
                            onRefresh={this.reloadPage.bind(this)}
                            refreshing={isRefreshing}
                            sections={sort === '' ? [] : _.values(grpEvent).map((item) => ({
                                key: item.grpKey,
                                week: item.week,
                                data: item.events
                            }))}
                            viewabilityConfig={_VIEWABILITY_CONFIG}
                            keyExtractor={(item, index) => (item.vid + sort + index).toString()}
                        />
            }
            <BetArea
                isShowComno={false}
                handleGoToBetslip={handleGoToBetslip}
                handleJumpToRecommend={handleJumpToRecommend}
                isFromExpert={isFromExpert}
                sort={sort}
            />
        </View>)
    }
}

export default connectReducerComponent(storeKey.MATCH_LIST_STORE, reducer, state, action)(MatchList);

const styles = StyleSheet.create({
    matchContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 57,
        backgroundColor: 'rgb(243,243,243)',
        paddingBottom: (Screen.isIphoneX() || Screen.isIphoneXR()  ? _FIXHEIGHT : 0) + 57,
    },
    line: {
        width: 10,
        height: 15,
        borderLeftWidth: 3,
        borderLeftColor: CommonColor.MainColor,
        marginLeft: 12
    },
    header: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CommonColor.DateBarColor
    },
    txtCt: {
        marginRight: 10
    },
    dateTxt: {
        fontSize: 11
    },
    lastTxt: {
        fontSize: 10,
        color: 'rgb(101,101,101)'
    },
    txtCount: {
        color: CommonColor.MainColor
    },
    noMktCnt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noMktText: {
        color: '#909090',
        fontSize: 16
    }
});
