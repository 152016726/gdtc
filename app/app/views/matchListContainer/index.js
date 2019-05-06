/**
 * Created by DDT on 2018/11/29.
 */
import React, {Component} from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    FlatList,
    Alert,
    Text
} from 'react-native';
import action from "./action";
import Headerleft from '../../components/headerLeft'
import HeaderRight from "../../components/headerRight";
import HeaderButton from "../../components/headerButton";
import HeaderSelectView from '../../components/headerSelectView';
import MatchListView from './matchList';
import games from "@easylotto/bet";
import methodCfg from './methodCfg';
import matchDataCenter from '#/matchDataCenter';
import {WIN_DRAW_WIN, HANDICAP_WIN_DRAW_WIN} from '~/constants/MarketSort';
import MatchTypeSelectHeader from '~/components/matchTypeSelectHeader'
import oddsRangeData from '~/common/js/oddsRangeData'
import _ from 'lodash'
import {connectComponentAction} from "../../reduxCfg";
import * as storeKeys from "../../constants/storeKeys";

let _leagueidArr;
let _oddConf;
let _pageTypeOdd = 'matchListContainerOdd';
let _pageTypeMatch = 'matchListContainerMatch';
let _pageDataKey = new Date().getTime();
let _methodCfg;
let _fn = {
    getConfig(needShowSorts) {
        return methodCfg.filter((item) => {
            return needShowSorts ? needShowSorts.indexOf(item.sort) !== -1 && item.isExpertSort : !item.isExpertSort
        })
    }
};

class MatchListContainer extends Component {
    static navigationOptions = ({navigation}) => {
        const {handleClick = null, handleGoBack = null, needShowSorts, isFromExpert} = navigation.state.params || {};
        // console.log(needShowSorts);
        _methodCfg = _fn.getConfig(needShowSorts);
        let headerTitle = <HeaderButton navigation={navigation} content={_methodCfg}/>;
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('~/images/back.png')}/>;
        let headerRight = <View style={{flexDirection: 'row'}}>
            <HeaderRight img={require('~/images/filter.png')} onPress={handleClick}/>
            {!isFromExpert && <HeaderRight img={require('~/images/help.png')} onPress={() => {
                navigation.navigate('Introduction');
            }}/>}
        </View>;
        return {headerTitle, headerLeft, headerRight}
    };
    state = {
        isClearBetslip: false    //是否清空投注栏
    };

    componentWillMount() {
        const {navigation, selSort} = this.props;
        const {isFromExpert} = navigation.state.params || {};
        let _sort = selSort || _methodCfg[0].sort;
        let oddInitId = oddsRangeData.data[0].id;
        navigation.setParams({
            sort: _sort,
            isShowMethod: false,
            isFromExpert: isFromExpert,
            handleClick: this.handleClick.bind(this),
            handleGoBack: this.handleGoback.bind(this),
            handleFilterEvent: this.handleFilterEvent.bind(this)
        });

        this.handleGoToBetslipBind = this.handleGoToBetslip.bind(this);
        this.handleDirectDetailBind = this.handleDirectDetail.bind(this);
        this.handleJumpToRecommendBind = this.handleJumpToRecommend.bind(this);
        _pageDataKey = new Date().getTime();
        _leagueidArr = null;
        _oddConf = oddInitId
    }

    /**
     * 返回主页并清空投注揽
     */
    goback(isClear) {
        this.props.navigation.goBack();
        this.props.clearSelectStickAll();
        isClear && games.Betslip.clearBetslip();
    }

    /**
     * 跳转至赛事筛选页面
     */
    handleClick() {
        const {navigation, filterMatch} = this.props;
        const {sort = _methodCfg[0], isFromExpert} = navigation.state.params || {};
        let leagueList = matchDataCenter.getLeagueList();
        if (!_leagueidArr) {
            _leagueidArr = leagueList.map(ele => ele.id);
        }
        let confArr = [];
        if (sort === WIN_DRAW_WIN || sort === HANDICAP_WIN_DRAW_WIN) {
            confArr.push({
                data: oddsRangeData.data,
                countPerRow: 4,
                type: _pageTypeOdd,
                title: '指数区间选择',
                isSingle: true,
                onChanged: (arr) => {
                    _oddConf = arr[0];
                    return {count: this.getMatchCount(this.getConfObj())};
                }
            });
        }
        confArr.push({
            data: leagueList,
            countPerRow: 3,
            type: _pageTypeMatch,
            checkAllBtn: true,
            invertBtn: true,
            title: '赛事选择',
            onChanged: (arr) => {
                _leagueidArr = arr;
                return {count: this.getMatchCount(this.getConfObj())};
            }
        });

        navigation.navigate('MatchTypeSelectVersion2', {
            title: '赛事选择',
            Header: MatchTypeSelectHeader,
            dataKey: _pageDataKey,
            confirm: () => {
                filterMatch(this.getConfObj(), isFromExpert);
            },
            headerOps: {
                count: this.getMatchCount(this.getConfObj())
            },
            config: confArr
        });
    }

    getConfObj() {
        const {navigation} = this.props;
        const {sort = _methodCfg[0]} = navigation.state.params || {};
        let obj = {
            leagueId: _leagueidArr,
            sort
        };
        if (sort === WIN_DRAW_WIN || sort === HANDICAP_WIN_DRAW_WIN) {
            obj.odd = this.getOddObj(_oddConf)
        }
        return obj;
    }

    getOddObj(id) {
        let arr = id.split('#');
        return {
            min: parseFloat(arr[0]),
            max: parseFloat(arr[1])
        }
    }

    /**
     * 获取赛事筛选比赛数量
     */
    getMatchCount(obj) {
        const {isFromExpert} = this.props.navigation.state.params || {};
        let count = 0;
        if(isFromExpert){
            Object.assign(obj, {
                grpDate: true
            })
        }
        let data = matchDataCenter.filterMatch(obj, true);
        _.values(data.grpEvent).forEach((ele) => {
            count += ele.events.length
        });
        return count;
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
     * 返回首页事件
     */
    handleGoback() {
        // console.log(this.props.navigation);
        //todo 需要提示是否确认返回
        let outcomeList = games.Betslip.getChooseOutcomes();
        //投注揽没有已选注项不需要提示清空投注揽
        outcomeList.length > 0 ? Alert.alert(
            '温馨提示',
            '返回将清空所有已选投注',
            [
                {text: '取消'},
                {text: '确认', onPress: this.goback.bind(this, true)}
            ],
            {cancelable: false}
        ) : this.goback();

    }

    /**
     * 选择玩法触发玩法过滤
     * @param rowID
     */
    handleSelectMethod(rowID) {
        const {isFromExpert, sort} = this.props.navigation.state.params;
        const {navigation} = this.props;
        if (rowID) {
            const _sort = _methodCfg[rowID].sort;
            if (sort !== _sort) {
                let oddInitId = oddsRangeData.data[0].id;
                _pageDataKey = new Date().getTime();
                _leagueidArr = null;
                _oddConf = oddInitId;
            }
            navigation.setParams({
                sort: _sort,
                isShowMethod: false
            });
        } else {
            navigation.setParams({
                isShowMethod: !this.props.navigation.state.params.isShowMethod
            });
        }
    }

    /**
     * 跳转至betslip方法
     */
    handleGoToBetslip() {
        const {navigation} = this.props;
        navigation.navigate('BonusCalculation')
    }

    /**
     *跳转至发推荐页面
     */
    handleJumpToRecommend() {
        const {navigation} = this.props;
        const {sort} = navigation.state.params || {};
        navigation.navigate('SendRecommend', {sort: sort})
    }

    /**
     * 跳转比赛详情
     * @param event 整个比赛
     * @param type  跳转详情类别，0 跳到亚盘，1 跳到欧赔， 2 跳到同奖回查详情
     */
    handleDirectDetail(event, type) {
        if (type === 2) {
            // 跳转至同奖回查页面
            let {wdw = {}} = event.markets;
            let item = {
                win: wdw.homeOdds,
                draw: wdw.drawOdds,
                defeat: wdw.awayOdds
            };
            this.props.navigation.navigate('PeerReviewDetails', {item})
        } else {
            // 跳转至比分详情页
            this.props.navigation.navigate('ScoreDetails', {
                vid: event.vid,
                event: event,
                initPageId: 2,
                secondLevelPageId: type
            });
        }
    }

    render() {
        if (!this.props.navigation.state || !this.props.navigation.state.params) {
            return <View style={{flex: 1}}/>
        }
        /*
            2019-3-20 GSSL
            变量烦请补注释~~~ (彩蛋)
            leagueId: 没有用就删了吧, 留着过年喵?
            isFocusEvent: 是否焦点赛事
            isFromExpert: 是否专家页
         */
        const {isShowMethod = false, sort = _methodCfg[0].sort, isFocusEvent, isFromExpert} = this.props.navigation.state.params;

        return (<View style={styles.container}>
            <HeaderSelectView
                isShowMethod={isShowMethod}
                content={_methodCfg}
                sort={sort}
                onPress={this.handleSelectMethod.bind(this)}
            />
            <MatchListView
                sort={sort}
                isFocusEvent={isFocusEvent}
                isFromExpert={isFromExpert}
                handleGoToBetslip={this.handleGoToBetslipBind}
                handleJumpToRecommend={this.handleJumpToRecommendBind}
                handleDirectDetail={this.handleDirectDetailBind}
            />
        </View>)
    }
}

export default connectComponentAction(action, storeKeys.MATCH_LIST_CONTAINER_STORE)(MatchListContainer)

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});