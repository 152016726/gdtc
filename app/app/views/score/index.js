import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    Dimensions,
    Platform,
    TouchableOpacity
} from 'react-native';
import  { connectReducerComponent } from '../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../constants/storeKeys';
import HeaderRight from '../../components/headerRight';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Instant from './instant';
import Completion from './completion';
import Games from './games';
import Attention from'./attention';
import ScoreTabBar from './scoreTabBar';
import Util from '../../common/js/util';
import TabNavigator from '../../navigator/TabNavigator';
import { BgColorWhite, BgColor, MainColor } from './../../constants/color';
import MatchTypeSelectHeader from '~/components/matchTypeSelectHeader'
let _pageType = 'score';
let _pageDataKey = new Date().getTime();
let _leagueIdArr = null;

class Score extends Component {

    componentWillMount() {
        const { handleDate, navigation, handleAttentionDataLenth } = this.props;
        let dateArr = Util.getRecentDays();//获取前7后2的日期数组 格式为2018-10-10
        handleDate(dateArr[ 6 ]);
        handleAttentionDataLenth();
        navigation.setParams({
            handleShowPage: this.handleShowPage.bind(this)
        });
    }

    /**
     * 筛选赛事页
     */
    handleShowPage() {
        // console.log('XXXXXX',this.props);
        let {leagueList = [], navigation, dataList, handleDataListFilter,handFilterListData, pageIndex} = this.props;
        let _leagueIdArrHadData = !!_leagueIdArr;
        if(!_leagueIdArrHadData){
            _leagueIdArr = [];
        }
        dataList && dataList.map((item)=>{
            leagueList.push({lid:item.leagueId,lname:item.leagueShortName});
            if(!_leagueIdArrHadData && _leagueIdArr.indexOf(item.leagueId) === -1){
                _leagueIdArr.push(item.leagueId);
            }
        });
        //数组的去重
        leagueList = handleDataListFilter(leagueList);
        navigation.navigate('MatchTypeSelectVersion2', {
            title: '赛事选择',
            Header: MatchTypeSelectHeader,
            type: _pageType,
            dataKey: _pageDataKey,
            confirm:()=>{
                handFilterListData(_leagueIdArr, pageIndex)
            },
            headerOps: {
                count: this.matchTypeSelectCallback(_leagueIdArr)
            },
            config: [{
                data: leagueList,
                countPerRow: 3,
                checkAllBtn: true,
                invertBtn: true,
                idName: 'lid',
                textName: 'lname',
                title: '赛事选择',
                onChanged: (arr) => {
                    _leagueIdArr = arr;
                    return {
                        count: this.matchTypeSelectCallback(_leagueIdArr)
                    }
                }
            }]
        });
        //TODO 下面代码为测试代码
        //changeMTSmatchCanSelect(dataList.length);
    }

    //点击筛选后的回调
    matchTypeSelectCallback(arr){
        const {dataList} = this.props;
        let array = [];
        //筛选数组里的符合规定的比赛
        dataList.forEach((ele) => {
            if (arr.indexOf(ele.leagueId) !== -1) {
                array.push(ele);
            }
        });
        return array.length;
    }

    componentWillReceiveProps(nextProps) {
        const { handleDate } = nextProps;
        if (nextProps.dateScrollIndex !== this.props.dateScrollIndex) {
            // console.log('nextProps!!!',nextProps);
            let dateArr = Util.getRecentDays();//获取前7后2的日期数组 格式为2018-10-10
            handleDate(dateArr[ nextProps.dateScrollIndex ]);
            _pageDataKey = new Date().getTime();
            _leagueIdArr = null;
        }
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { dataList, navigation, pageIndex, dateScrollIndex, isHide, matchInfo, date, handleDate, handleAttentionDataRefresh, attentionLen } = this.props;
        let tabName = [ '即时', '完场', '赛程', '关注' ];
        return (
        <View style={{flex:1}}>
            <TabNavigator title='比分'
                          rightOneImg='filter'
                          rightOneEvent={() => this.handleShowPage()}
                          rightTwoImg='setting'
                          rightTwoEvent={() => navigation.navigate('ScoreSetting')}
            />
            <ScrollableTabView renderTabBar={() => <ScoreTabBar tabNames={tabName}
                                                                pageIndex={pageIndex}
                                                                attentionLen={attentionLen}
                                                                dateScrollIndex={dateScrollIndex}
                                                                isHide={isHide}/>}
                               locked={true}
                               style={{ backgroundColor : BgColor }}
                               prerenderingSiblingsNumber={3}
                               onChangeTab={(obj) => {
                                   //页面左右滑动时 求换日期组件
                                   let dateArr = Util.getRecentDays();//获取前7后2的日期数组 格式为2018-10-10
                                   if (obj.i === 0) {
                                       //当天
                                       handleDate(dateArr[ 6 ]);
                                   } else if (obj.i === 1) {
                                       //昨天
                                       handleDate(dateArr[ dateScrollIndex ]);
                                   } else if (obj.i === 2) {
                                       //明天
                                       handleDate(dateArr[ dateScrollIndex ]);
                                   }else if (obj.i === 3) {
                                       //收藏时让日期去数组第0位 解决不刷新的bug
                                       handleDate(dateArr[ 0 ]);
                                       handleAttentionDataRefresh();
                                   }
                                   _pageDataKey = new Date().getTime();
                                   _leagueIdArr = null;
                               }}
            >
                <Instant navigation={navigation}
                         tabIndex={pageIndex}
                         tabLabel='即时'
                         matchInfo={matchInfo}
                         date={date}
                         dateScrollIndex={dateScrollIndex}>即时
                </Instant>
                <Completion navigation={navigation}
                            tabIndex={pageIndex}
                            tabLabel='完场'
                            matchInfo={matchInfo}
                            date={date}
                            dateScrollIndex={dateScrollIndex}>完场
                </Completion>
                <Games navigation={navigation}
                       tabIndex={pageIndex}
                       tabLabel='赛程'
                       matchInfo={matchInfo}
                       date={date}
                       dateScrollIndex={dateScrollIndex}>赛程
                </Games>
                <Attention navigation={navigation}
                           tabIndex={pageIndex}
                           tabLabel='关注'
                           matchInfo={matchInfo}
                           date={date}
                           dateScrollIndex={dateScrollIndex}>关注
                </Attention>
            </ScrollableTabView>
        </View>
        )
    }

}
export default connectReducerComponent(storeKey.SCORE_STORE, reducer, state, action)(Score)