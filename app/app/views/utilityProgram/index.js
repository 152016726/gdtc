/**
 * Created by easyLottoMac_Feng on 2018/12/10.
 */
import React, {Component} from 'react';
import {
    Alert,
    View
} from 'react-native';
import {connectReducerComponent} from '~/reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '~/constants/storeKeys'
import HeaderLeft from "~/components/headerLeft";
import UPHeaderRight from "./components/UPHeaderRight";
import PeerReview from './peerReview';
import SelectHeaderTitle from '~/components/selectHeaderTitle';
import PlayingSkills from "./playingSkills";
import AwardDatePicker from "../award/components/datePicker";

const ONEDATETIME = 24 * 60 * 60 * 1000; // 一天的毫秒数

class UtilityProgram extends Component {
    static navigationOptions = ({navigation}) => {
        const {
            headerCallBack = null,  // 头部事件回调
            statusNum = 0,          // 当前选中的状态
            showPicker = null,      // 日期筛选回调
            navHandle = null        // 赛事筛选回调
        } = navigation.state.params || {};
        let configData = [
            {title: '同奖回查', idType: 0},
            {title: '玩法技巧', idType: 1}
        ];
        return {
            headerTitle: <SelectHeaderTitle headerCallBack={headerCallBack} statusNum={statusNum}
                                            configData={configData}/>,
            headerLeft: <HeaderLeft handleGoBack={() => navigation.goBack()} img={require('~/images/back.png')}/>,
            headerRight: !statusNum ? <UPHeaderRight navHandle={navHandle} showPicker={showPicker}/> : <View/>
        }
    };

    componentWillMount() {
        const {navigation, statusNum} = this.props;
        navigation.setParams({
            statusNum: statusNum,
            headerCallBack: (item) => this.headerCallBack(item),
            navHandle: () => this._navHandle(),
            showPicker: () => this.togglePicker(true)
        });
    }

    /**
     * 头部 title 切换回调
     * @param item
     */
    headerCallBack(item) {
        const {navigation, updateDate} = this.props;
        navigation.setParams({
            statusNum: item.idType
        });
        updateDate({
            statusNum: item.idType
        })
    }

    /**
     * 赛事筛选
     * @private
     */
    _navHandle() {
        const {navigation} = this.props;
        navigation.navigate('ScreeningPage', {fromPage: 'UtilityProgram'})
    }

    /**
     * 日期筛选弹窗
     * @private
     */
    togglePicker(show) {
        let {changeSomeProps} = this.props;
        changeSomeProps({
            showDatePicker: show
        });
    }

    render() {
        const {statusNum, navigation, initDate, changeSomeProps, showDatePicker, selectMarket} = this.props;
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
                            {text: '确认', style: 'cancel'},
                        ],
                        {cancelable: false}
                    )
                }
                else if (startDateTimeStamp > endDateTimeStamp) {
                    Alert.alert(
                        '警告',
                        '起始日期不能大于截止日期',
                        [
                            {text: '确认', style: 'cancel'},
                        ],
                        {cancelable: false}
                    )
                }
                else if ((startDateTimeStamp + ONEDATETIME * 7) < endDateTimeStamp) {
                    Alert.alert(
                        '警告',
                        '只能选择近7天的数据',
                        [
                            {text: '确认', style: 'cancel'},
                        ],
                        {cancelable: false}
                    )
                }
                else {
                    changeSomeProps({
                        startDate, endDate
                    });
                    selectMarket(startDateTimeStamp, endDateTimeStamp);
                    this.togglePicker(false);
                }
            },
            show: showDatePicker,
            initDate
        };
        return (
            <View style={{flex: 1}}>
                <AwardDatePicker {...awardDatePickerConf} />
                {
                    !statusNum ? <PeerReview navigation={navigation}/> : <PlayingSkills navigation={navigation}/>
                }
            </View>
        )
    }

}

export default connectReducerComponent(storeKey.UTILITY_PROGRAM_STORE, reducer, state, action)(UtilityProgram);
