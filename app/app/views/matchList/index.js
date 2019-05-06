import React, {Component} from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    FlatList,
    Alert,
    Text
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import Title from "./components/title"
import Headerleft from '../../components/headerLeft'
import HeaderRight from "../../components/headerRight";
import HeaderButton from "../../components/headerButton";
import HeaderSelectView from '../../components/headerSelectView'
import CommonEvent from '../../components/commonEvent';
import EventHeader from '../../components/toggleItem'
import BetArea from '../../components/betArea'
import games from '@easylotto/bet';
import * as CommonColor from '../../constants/color';
import _ from 'lodash'
import util from '../../common/js/util'
import {DateBarColor,tipsTextGrey} from '../../constants/color';

let methodCfg = [
    {text: '混合过关', shortTxt: '混合过关', sort: 'mix'},
    {text: '胜平负', shortTxt: '胜平负', sort: 'wdw'},
    {text: '让球胜平负', shortTxt: '让球胜平负', sort: 'hwdw'},
    {text: '比分', shortTxt: '比分', sort: 'cs'},
    {text: '总进球', shortTxt: '总进球', sort: 'tg'},
    {text: '半全场', shortTxt: '半全场', sort: 'hft'},
    {text: '单关固定', shortTxt: '单关', sort: 'dg'}
];

class MatchList extends Component {
    static navigationOptions = ({navigation}) => {
        const {handleClick = null, handleGoBack = null} = navigation.state.params || {};
        let headerTitle = <HeaderButton navigation={navigation} content={methodCfg}/>;
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        let headerRight = <View style={{flexDirection: 'row'}}>
            <HeaderRight img={require('../../images/filter.png')} onPress={handleClick}/>
            <HeaderRight img={require('../../images/help.png')} onPress={() => {
                navigation.navigate('Introduction');
            }}/>
        </View>;
        return {headerTitle, headerLeft, headerRight}
    };

    state = {
        isRefreshing: false,      //加载中状态
    };

    componentWillMount() {
        let _self = this;
        const {navigation, selSort} = _self.props;
        let _sort = selSort || methodCfg[0].sort;
        let isFocus = false;
        if (navigation.state.params) {
            isFocus = navigation.state.params.isFocusEvent;
            if (navigation.state.params.sort) {
                _sort = navigation.state.params.sort;
            }
        }
        navigation.setParams({
            sort: _sort,
            isShowMethod: false,
            handleClick: _self.handleClick.bind(_self),
            handleGoBack: _self.handleGoback.bind(_self),
            handleFilterEvent: _self.handleFilterEvent.bind(_self)
        });
        _self.props.getMatchList(isFocus);
        _self.props.getbetslipList();
        _self.props.getChooseOutcomes();
    }

    componentWillUnmount() {
        this.props.setShowEvents({
            allEvents: [],
            showEvents: []
        })
    }

    /**
     * 返回首页事件
     */
    handleGoback() {
        // console.log(this.props.navigation);
        //todo 需要提示是否确认返回
        const {outcomeList} = this.props;
        //投注揽没有已选注项不需要提示清空投注揽
        outcomeList.length > 0 ? Alert.alert(
            '温馨提示',
            '返回将清空所有已选投注',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed')},
                {text: '确认', onPress: this.goback.bind(this, true)}
            ],
            {cancelable: false}
        ) : this.goback();

    }

    /**
     * 返回主页并清空投注揽
     */
    goback() {
        this.props.navigation.goBack();
        games.Betslip.clearBetslip();
    }

    /**
     * 跳转至赛事筛选页面
     */
    handleClick() {
        const {navigation, leagueList, count, selSort} = this.props;
        const {handleFilterEvent = null} = navigation.state.params || {};
        // console.log(count);
        navigation.navigate('MatchTypeSelect', {
            cbFn: handleFilterEvent,
            leagueList: leagueList,
            count: count,
            sort: selSort,
            type: 'matchList'
        })
    }

    /**
     * 联赛过滤
     * @param selLeague
     * @param selRate
     */
    handleFilterEvent(selLeague, selRate) {
        const {handleFilterEvent, filterOps} = this.props;
        const {isFocusEvent} = this.props.navigation.state.params;
        let filterVal = Object.assign({}, filterOps, {selLeague: selLeague}, {selRate: selRate});
        handleFilterEvent(filterVal, isFocusEvent);
    }

    /**
     * 选择玩法触发玩法过滤
     * @param rowID
     */
    handleSelectMethod(rowID) {
        const {navigation, handleFilterEvent, selSort, filterOps} = this.props;
        if (rowID) {
            const sort = methodCfg[rowID].sort;
            let isSame = selSort === sort;
            let filterVal = {
                sort: sort
            };
            navigation.setParams({
                sort: sort,
                isShowMethod: false
            });
            this.props.updateSelSort({selSort: sort});
            // console.log(allEvents, filterOps);
            !isSame && handleFilterEvent(Object.assign({}, filterOps, filterVal))
        } else {
            navigation.setParams({
                isShowMethod: !this.props.navigation.state.params.isShowMethod
            });
        }
    }

    /**
     * 渲染每一个赛事
     * @param item
     * @param isFocusEvent
     * @returns {*}
     */
    renderEvents(item, isFocusEvent) {
        // console.log(item);
        const {selSort} = this.props;
        let gIndex = 0;
        return _.keys(item).sort((item1, item2) => {
            return item1 < item2 ? -1 : 1
        }).map((strDate, index) => {
            let strDateFmt;
            let len;
            let evts = item[strDate];
            if (isFocusEvent) {
                strDateFmt = '焦点赛事'
            } else {
                strDateFmt = Date.prototype.parseISO8601(strDate).format('yyyy-MM-dd');
            }
            len = evts.list.length;  //当前日期有多少场比赛
            let week = evts.list[0].week || '';
            let isFirst = index === 0;
            let title = <Title count={len} strDate={strDateFmt} isFocusEvent={isFocusEvent} week={week}/>;
            let cpt = (<View key={index}>
                <EventHeader title={title} isFirst={isFirst} isFocusEvent={isFocusEvent}
                             cls={{backgroundColor: DateBarColor}}
                             content={this.renderCommonEvent(evts.list, selSort, gIndex)}/>
            </View>);
            gIndex += evts.list.length;
            return cpt;
        })
    }

    /**
     * 渲染公用的event外层
     * @param events
     * @param sort
     * @param baseIndex
     * @returns {*}
     */
    renderCommonEvent(events, sort, baseIndex) {
        const {handleAddToBetslip, outcomeCount, currentKey} = this.props;
        return events.map((evt, index) => {
            let isLast = index >= events.length - 1;
            return <CommonEvent key={index}
                                event={evt}
                                index={index}
                                gIndex={baseIndex + index}
                                sort={sort}
                                isLast={isLast}
                                outcomeCount={outcomeCount}
                                currentKey={currentKey}
                                handleAddToBetslip={handleAddToBetslip}
                                handleDirectDetail={this.handleDirectDetail.bind(this)}
            />
        })
    }

    /**
     * 跳转比赛详情
     * @param event 整个比赛
     * @param type  跳转详情类别，0 跳到亚盘，1 跳到欧赔
     */
    handleDirectDetail(event, type) {
        // 跳转至比分详情页
        this.props.navigation.navigate('ScoreDetails', { vid : event.vid, event : event, initPageId: 1, secondLevelPageId: type });
    }

    /**
     * 下拉刷新重新获取数据
     */
    reloadPage() {
        const {isFocusEvent = false} = this.props.navigation.state.params || {};
        this.props.updateRefreshStatus && this.props.updateRefreshStatus({isRefreshing: true});
        this.props.getMatchList({isFocus: isFocusEvent});
    }

    /**
     * 跳转至betslip方法
     */
    handleGoToBetslip() {
        const {navigation} = this.props;
        navigation.navigate('BonusCalculation')
    }

    /**
     * 获取不同玩法对应的文字描述
     * @param sort
     * @returns {*}
     */
    getNoEventText(sort) {
        let obj = methodCfg.filter((item) => {
            return item.sort === sort
        });
        return <Text style={styles.noMktText}>
            {`暂无${obj[0].shortTxt}赛事`}
        </Text>
    }

    render() {
        if (!this.props.navigation.state || !this.props.navigation.state.params) {
            return <View style={{flex: 1}}/>
        }
        const {showEvents, isRefreshing, eventCount, selSort} = this.props;
        const {isShowMethod = false, sort = methodCfg[0], isFocusEvent} = this.props.navigation.state.params;
        // console.log(showEvents);
        console.log('render ... matchList');
        return (<View style={styles.matchContainer}>
            <HeaderSelectView
                isShowMethod={isShowMethod}
                content={methodCfg}
                sort={sort}
                onPress={this.handleSelectMethod.bind(this)}/>
            {
                util.isEmptyObject(showEvents) ? <View style={styles.noMktCnt}>
                    <Text>{this.getNoEventText(selSort)}</Text>
                </View> : <FlatList
                    data={[showEvents]}
                    renderItem={(({item}) => this.renderEvents(item, isFocusEvent))}
                    onRefresh={this.reloadPage.bind(this)}
                    showsVerticalScrollIndicator = {false}
                    refreshing={isRefreshing}
                    keyExtractor={(item, index) => index.toString()}/>
            }

            <BetArea isShowComno={false}
                     handleGoToBetslip={this.handleGoToBetslip.bind(this)}
                     eventCount={eventCount}/>
        </View>)
    }
}

export default connectReducerComponent(storeKey.MATCH_LIST_STORE, reducer, state, action)(MatchList);

const styles = StyleSheet.create({
    matchContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 57,
        backgroundColor: 'rgb(243,243,243)',
        paddingBottom: 57
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
        color: tipsTextGrey,
        fontSize: 16
    }
});
