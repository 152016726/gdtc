/**
 * Created by mac-ddt on 2018/8/10.
 */
import React, {Component} from 'react';
import {
    View,
    FlatList,
    StyleSheet,
} from 'react-native';
import {connectReducerComponent} from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../constants/storeKeys'
import HeaderRight from '../../components/headerRight';
import Headerleft from '../../components/headerLeft';
import DateScrollBar from '../../components/dateScrollBar'
import ExponentTitle from "./components/exponentTitle"
import ExponentContent from "./components/exponentContent"
import MatchTypeSelectHeader from '~/components/matchTypeSelectHeader'
import {filterOpsConf} from './filterOpsConf'
import ScoreDetails from "../scoreDetails"
import * as sundry from '~/constants/sundry'
import Util from "../../common/js/util";
import _ from "lodash";

let _odds;                    //筛选组件点击指数选择保存的值
let _company;                 //筛选组件点击公司选择保存的值
let _league;                  //筛选组件点击赛事选择保存的值
let _pageType = 'exponentCompany';
let _pageTypeMatch = 'exponentMatch';
let _pageDataKey = new Date().getTime();
let _pageDataKeyMatch = new Date().getTime();
let filterEventsByLeagueResult;
const dateList = Util.getRecentDays();//获取前7后2的日期数组 格式为2018-10-10

class Exponent extends Component {
    static navigationOptions = ({navigation}) => {
        const {handleShowPage = null, handleGoBack = null} = navigation.state.params || {};
        let headerTitle = '指数';
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        let headerRight =
            <View style={styles.nav}>
                <HeaderRight img={require('./images/match.png')} type="match" onPress={handleShowPage}/>
                <HeaderRight img={require('./images/company.png')} type='company'
                             onPress={handleShowPage}/>
            </View>;
        return {headerTitle, headerLeft, headerRight}
    };

    componentWillMount() {
        let self = this;
        let {navigation, getCompanies} = self.props;
        // let dateList = Util.getRecentDays();
        getCompanies();            //获取公司列表
        this.onQuery(dateList[6]); //获取列表数据
        navigation.setParams({
            handleShowPage: self.handleShowPage.bind(self),
            handleSelectCallback: self.handleSelectCallback.bind(self),
            handleGoBack: () => {
                navigation.goBack()
            }
        });
    }

    componentDidMount() {
        //下面是还原初始值
        let {changeSomeProps} = this.props;
        changeSomeProps({
            filterOps: filterOpsConf
        });
        _pageDataKey = new Date().getTime();
        _pageDataKeyMatch = new Date().getTime();
        _odds = filterOpsConf.odds;
        _company = filterOpsConf.company;
        _league = filterOpsConf.league;
    }

    /**
     *日期请求数据
     */
    onQuery(selectDate) {
        let {getExponentData} = this.props;
        getExponentData({selectDate: Date.prototype.parseISO8601(selectDate).format('yyyy-MM-dd'), isMain: true});
        _pageDataKey = new Date().getTime();
        _pageDataKeyMatch = new Date().getTime();
    }

    /**
     * 选择赛事筛选之后的回调
     * @param filterOps 过滤条件对象
     */
    handleSelectCallback(league) {
        let {filterOps, changeSomeProps} = this.props;
        let obj = {
            filterOps: {
                ...filterOps,
                league
            }
        };
        changeSomeProps(obj);
        this.filterEventsByLeague(obj.filterOps);
    }

    /**
     * 跳转过滤页面
     * @param type
     */
    handleShowPage(type) {
        const {leagueList, navigation, companiesAH, companiesWDW, oddsCfg, count, filterOps, changeSomeProps} = this.props;
        let allFilter;
        if (type === 'match') {
            navigation.navigate('MatchTypeSelectVersion2', {
                title: '赛事选择',
                Header: MatchTypeSelectHeader,
                type: _pageTypeMatch,
                dataKey: _pageDataKeyMatch,
                confirm: () => {
                    let obj = {
                        filterOps: {
                            odds: _odds,
                            company: _company,
                            league: _league
                        }
                    };
                    if (!filterEventsByLeagueResult) {
                        filterEventsByLeagueResult = this.filterEventsByLeague(filterOps);
                    }
                    changeSomeProps({...obj, events: filterEventsByLeagueResult});
                },
                headerOps: {
                    count
                },
                config: [
                    {
                        data: leagueList,
                        countPerRow: 3,
                        idName: 'lid',
                        textName: 'lname',
                        checkAllBtn: true,
                        invertBtn: true,
                        title: '赛事选择',
                        onChanged: (arr) => {
                            return {count: this.matchFilterPressCb(arr).length};
                        }
                    }
                ]
            });
        }
        else {
            navigation.navigate('MatchTypeSelectVersion2', {
                title: '公司筛选',
                Header: MatchTypeSelectHeader,
                type: _pageType,
                dataKey: _pageDataKey,
                getAllFilterCb: (arr) => {
                    allFilter = arr;
                },
                confirm: () => {
                    changeSomeProps({
                        filterOps: {
                            odds: _odds,
                            company: _company,
                            league: _league
                        }
                    });
                },
                headerOps: {
                    count
                },
                config: [{
                    data: oddsCfg,
                    countPerRow: 3,
                    title: '指数选择（单选）',
                    isSingle: true,
                    onChanged: (arr) => {
                        _odds = arr[0];
                        if (_odds === 'ah') {
                            allFilter[1].setState({
                                data: companiesAH,
                                selectedArr: sundry.EXPONENT_COMPANY_INIT_AH
                            });

                            _company = sundry.EXPONENT_COMPANY_INIT_AH

                        }
                        else {
                            allFilter[1].setState({
                                data: companiesWDW,
                                selectedArr: sundry.EXPONENT_COMPANY_INIT_WDW
                            });
                            _company = sundry.EXPONENT_COMPANY_INIT_WDW
                        }
                    }
                }, {
                    data: filterOps.odds === 'ah' ? companiesAH : companiesWDW,
                    countPerRow: 3,
                    min: 1,
                    max: 3,
                    title: '公司选择（多选,最多三家）',
                    initArr: sundry.EXPONENT_COMPANY_INIT_AH,
                    onChanged: (arr) => {
                        _company = arr
                    }
                }]
            });
        }
    }

    /**
     * 根据赛事筛选的回调
     */
    matchFilterPressCb(arr) {
        let {_odds, _company, changeSomeProps} = this.props;
        _league = arr
        let obj = {
            filterOps: {
                odds: _odds,
                company: _company,
                league: arr
            }
        };
        return filterEventsByLeagueResult = this.filterEventsByLeague(obj.filterOps);
    }

    /**
     * 根据联赛筛选列表数据
     */
    filterEventsByLeague(filterOps) {
        let arr = [];
        let {changeSomeProps, eventsAll} = this.props;
        if (!filterOps.league) {
            arr = eventsAll;
        }
        else {
            eventsAll.forEach((ele) => {
                if (filterOps.league.indexOf(ele.leagueId) !== -1) {
                    arr.push(ele);
                }
            });
        }
        changeSomeProps({
            count: arr.length
        });
        return arr;
    }

    /**
     * 筛选events里的markets数据
     */
    filterCompanyByFilterOps(market = []) {
        let {filterOps} = this.props;
        let {company} = filterOps;
        let arr;
        if (!company) {
            company = sundry.EXPONENT_COMPANY_INIT_AH //公司默认选择
        }
        arr = _.filter(market, function (ele) {
            return company.indexOf(ele.cid) !== -1
        });
        return arr;
    }

    /**
     * 跳转至当前比赛的详细页面
     * @param vid
     */
    handleLinkToDetail(vid, cid) {
        const {navigation, filterOps} = this.props;
        const {odds} = filterOps;
        navigation.navigate('ScoreDetails', {
            vid, initPageId: 2, secondLevelPageId: odds === 'ah' ? 0 : 1,  //0亚盘, 1欧赔
            exponentPrevPage: 'exponent',
            exponentCid: cid
        })
        // navigation.navigate('LotteryShopImgManage');
    }

    handleSelectDate(index) {
        const {dateList} = this.props;
    }

    render() {
        const {events, filterOps} = this.props;
        const {odds} = filterOps;
        return <View style={styles.container}>
            <DateScrollBar tabs={dateList}
                           goToPage={this.handleSelectDate.bind(this)}
                           isHide={true}
                           onQuery={this.onQuery.bind(this)}/>
            <View style={styles.listContent}>
                <FlatList
                    style={styles.flatList}
                    data={events}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={filterOps}
                    removeClippedSubviews={true}
                    renderItem={({item}) => {
                        let data = this.filterCompanyByFilterOps(item.markets[odds]);
                        return (<View style={[styles.content]}>
                            <ExponentTitle data={item}/>
                            <ExponentContent company={data} onPress={this.handleLinkToDetail.bind(this, item.vid)}
                                             type={filterOps.odds}/>
                        </View>)

                    }}
                />
            </View>
        </View>
    }
}

export default connectReducerComponent(storeKey.EXPONENT_STORE, reducer, state, action)(Exponent)

const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    content: {},
    listContent: {
        paddingBottom: 49
    }
});

