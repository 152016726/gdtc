/**
 * Created by mac-ddt on 2018/8/10.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Alert,
    Text,
    RefreshControl
} from 'react-native';
import {connectReducerComponent} from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '~/constants/storeKeys'
import ScoreListBox from '~/components/scoreListBox'
import MatchTypeSelectHeader from '~/components/matchTypeSelectHeader'
import AwardHeaderRight from './components/headerRight'
import AwardDatePicker from './components/datePicker'
import * as colorConf from '~/constants/color'

let _pageType = 'award';
let _pageDataKey = new Date().getTime();

class Award extends Component {
    static navigationOptions = ({navigation}) => {
        let {navHandle, showPicker} = navigation.state.params || {};
        return {
            title: "开奖查询",
            headerRight: <AwardHeaderRight navHandle={navHandle} showPicker={showPicker}/>
        }
    }

    componentDidMount() {
        let {getMarketList} = this.props;
        this.updateAwardListHandle();      //第一次加载比分列表
        this.setHeaderParams(); //设置头部菜单
        getMarketList();
    }

    /**
     * 接口刷新数据
     */
    updateAwardListHandle(obj = {}, refreshing) {
        let {initAwardList, startDate, endDate} = this.props;
        obj = Object.assign({
            from: startDate,
            to: endDate,
            pageIndex: 1,
            pageSize: 10000,
            leagueId: ['-1']
        }, obj);
        initAwardList(obj, refreshing);
        _pageDataKey = new Date().getTime(); // 筛选后重新设置赛事筛选组件
    }

    /**
     * 根据联赛类型本地筛选数据
     * @param obj{Object} 筛选条件
     * @param changeView{Boolean} 是否更新视图
     * @returns {Number} 返回可玩场数
     */
    updateAwardListByMatchType(leagueId, changeView) {
        let {updateAwardListByMatchType, dataAll} = this.props;
        return updateAwardListByMatchType({
            leagueId,
            dataAll
        }, changeView);
    }

    setHeaderParams() {
        let {navigation} = this.props;
        navigation.setParams({
            navHandle: this.navHandle.bind(this),
            showPicker: this.togglePicker.bind(this, true),
        });
    }

    togglePicker(show) {
        let {changeSomeProps} = this.props;
        changeSomeProps({
            showDatePicker: show
        });
    }

    /**
     * 跳转到赛事筛选页面
     */
    navHandle() {
        let {lArr, navigation, matchCanSelect} = this.props;
        navigation.navigate('MatchTypeSelectVersion2', {
            title: '赛事选择',
            Header: MatchTypeSelectHeader,
            type: _pageType,
            dataKey: _pageDataKey,
            confirm:()=>{
              this.goBackFn();
            },
            headerOps: {
                count: matchCanSelect
            },
            config: [{
                data: lArr,
                countPerRow: 3,
                checkAllBtn: true,
                invertBtn: true,
                idName: 'lid',
                textName: 'lname',
                title: '赛事选择',
                onChanged: (arr) => {
                    return this.filterListPressCallBack(arr);
                }
            }]
        });
    }

    goBackFn(){
        let {leagueId} = this.props;
        this.updateAwardListByMatchType(leagueId, true)
    }
    /**
     * filterList点击回调
     */
    filterListPressCallBack(arr) {
        let {changeSomeProps} = this.props;
        changeSomeProps({
            leagueId: arr
        });
        return {
            count: this.updateAwardListByMatchType(arr, false)
        }
    }

    hideDialog() {
        let {changeSomeProps} = this.props;
        changeSomeProps({
            showDialog: false
        });
    }

    /**
     * 下拉刷新
     */
    refreshList() {
        let {changeSomeProps} = this.props;
        changeSomeProps({
            refreshing: true
        });
        this.updateAwardListHandle({}, true);
    }

    /**
     * 点击列表头部回调
     */
    onPressHandle(index) {
        let {changeSomeProps, showScoreListIndex} = this.props;
        if (index === showScoreListIndex) {
            index = -1;
        }
        changeSomeProps({
            showScoreListIndex: index
        });
    }

    render() {
        let {data, initDate, refreshing, showDatePicker, changeSomeProps, showScoreListIndex, matchCanSelect} = this.props;
        if (showScoreListIndex > data.length - 1) {
            showScoreListIndex = 0
        }
        let awardDatePickerConf = {
            onCancel: () => {
                this.togglePicker(false);
            },
            onConfirm: (startDate, endDate) => {
                let startDateTimeStamp = new Date(startDate).getTime();
                let endDateTimeStamp = new Date(endDate).getTime();
                if (isNaN(startDateTimeStamp) || isNaN(endDateTimeStamp)) {
                    Alert.alert(
                        '警告',
                        '起始日期或截止日期不能为空',
                        [
                            {text: '确定', style: 'cancel'},
                        ],
                        {cancelable: false}
                    )
                }
                else if (startDateTimeStamp > endDateTimeStamp) {
                    Alert.alert(
                        '警告',
                        '起始日期不能大于截止日期',
                        [
                            {text: '确定', style: 'cancel'},
                        ],
                        {cancelable: false}
                    )
                }
                else {
                    // changeSomeProps({
                    //     startDate, endDate
                    // });
                    this.updateAwardListHandle({
                        from: startDate,
                        to: endDate
                    });
                    this.togglePicker(false);
                }
            },
            show: showDatePicker,
            initDate
        }
        return <View style={styles.container}>
            <View style={styles.bg}></View>
            <AwardDatePicker {...awardDatePickerConf} />
            <FlatList
                style={styles.flatList}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={this.refreshList.bind(this)}
                    />
                }
                renderItem={({item, index}) => <ScoreListBox index={index} show={index === showScoreListIndex}
                                                             data={item} onPressHandle={this.onPressHandle.bind(this)}
                                                             navHandle={null}/>
                }
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: colorConf.awardBgColor,
        zIndex: 1
    },
    flatList: {
        zIndex: 2
    }
});

export default connectReducerComponent(storeKey.AWARD_STORE, reducer, state, action)(Award)