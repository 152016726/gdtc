import React, { Component } from 'react';
import  {
    View,
    Text,
    FlatList,
    StyleSheet,
    Switch,
    Image,
    TouchableOpacity,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';

import { connectReducerComponent } from '../../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../../constants/storeKeys';
import HeaderLeft from '../../../components/headerLeft';
import { BgColor, headerBorderColor } from '../../../constants/color';
import ScoreSettingButton from './componet/scoreSettingButton';
import ScoreTipsRange from './componet/scoreTipsRange';
import ScoreSettingSwitch from './componet/scoreSettingSwitch';
import DataManager from '../../../dataManager/commonDataManager';

const data = [ { title : "比分提醒", type : 0 },
               { title : "进球提醒", type : 1 },
               { title : "红黄牌提醒", type : 1 },
               { title : "提醒范围", type : 2 },
               { title : "显示提醒", type : 0 },
               { title : "是否显示排名", type : 3 },
               { title : "是否显示红黄牌", type : 3 },
               { title : "推送设置", type : 0 },
               { title : "推送我关注的比赛", type : 4 }
              ];

const LOAD_SETTING_STATUS = 'load_setting_status';
const SCORE_SETTING = 'ScoreSetting';

class ScoreSetting extends Component {
    static navigationOptions = ({ navigation, defaultHeaderStyle }) => {
        return { title: '比分设置'};
    };

    componentWillMount(){
        //第一次进入比分设置
        this.hasData().then((data) => {
            let hasData = true;
            if (data == null) {
                hasData = false
            };
            //如果是第一次 将初始值放进缓存
            hasData ?  this.props.getDataManager(data)
                    :  this.props.updateInitProps() ;

        });

    }

    componentDidMount(){
        const { navigation } = this.props;
        navigation.setParams({
            handleGoBack : this.handleGoBack.bind(this)
        });
    }

    componentWillUpdate(){
        this.props.updateInitProps();
    }

    constructor(props) {
        super(props);
        this.state = {
          settingData : {}
        };
    }

    componentWillUnmount(){
        DeviceEventEmitter.emit('UpdateData');
    }

    handleGoBack() {
        this.props.navigation.goBack();
    }

    hasData(){
        //判断初次进入
        return new Promise((resolve)=>{
            AsyncStorage.getItem(SCORE_SETTING).then(
                (data)=>{
                    resolve(data);
                }
            );
        });
    }

    _renderItem(item) {
        // console.log(item.item.title, item.index, 'info+Item');
        return (
            <View style={[ styles.itemBox, { height : item.item.type === 0 ? 37 : 44 } ]}>
                <Text style={[ item.item.type === 0 ? styles.headerText : styles.itemText ]}>{item.item.title}</Text>
                {item.item.type === 1 && this.renderItemTypeOne(item)}
                {item.item.type === 2 && this.renderItemTypeTwo(item)}
                {item.item.type === 3 && this.renderItemTypeThree(item)}
                {item.item.type === 4 && this.renderItemTypeFour(item)}
            </View>
        )
    }

    /**
     *  第一部分的item
     *  @param item
     *  @returns {XML}
     */
    renderItemTypeOne(item) {
        const {
              isGoalDialog,
              isGoalShakeTips,
              isGoalSoundTips,
              isFoulSoundTips,
              isFoulShakeTips,
              isFoulDialog,
            } = this.props;
        return (
            <ScoreSettingButton index={item.index}
                                isGoalDialog={isGoalDialog}
                                isGoalShakeTips={isGoalShakeTips}
                                isGoalSoundTips={isGoalSoundTips}
                                isFoulSoundTips={isFoulSoundTips}
                                isFoulShakeTips={isFoulShakeTips}
                                isFoulDialog={isFoulDialog}
            />
        )
    }

    /**
     *  第二部分的item
     * @param item
     * @returns {XML}
     */
    renderItemTypeTwo(item) {
        const { allGame, favouriteGame } = this.props;
        return (
            <ScoreTipsRange allGame={allGame}
                            favouriteGame={favouriteGame}
                            index={item.index}
            />
        )
    }

    /**
     *  第三部分的item
     * @param item
     * @returns {XML}
     */
    renderItemTypeThree(item) {
        const { isShowRanking, isShowRedYellowCard } = this.props;
        return (
            <ScoreSettingSwitch item={item}
                                isShowRedYellowCard={isShowRedYellowCard}
                                isShowRanking={isShowRanking}
            />
        )
    }

    /**
     *  第四部分的item
     * @param item
     * @returns {XML}
     */
    renderItemTypeFour(item) {
        const { isPushMyFavouriteGame } = this.props;
        return (
            <ScoreSettingSwitch item={item}
                                isPushMyFavouriteGame={isPushMyFavouriteGame}
            />
        )
    }

    /**
     * 分割线 render
     * @returns {*}
     */
    borderBottomList() {
        return (
            <View style={styles.lineS}/>
        )
    }

    render() {
        return (
            <FlatList
                style={styles.container}
                renderItem={this._renderItem.bind(this)}
                keyExtractor={(item, index) => index.toString()}
                data={data}
                extraData={this.props}
                ItemSeparatorComponent={this.borderBottomList}
            />
        )
    }

}

export default connectReducerComponent(storeKey.SCORE_SETTING, reducer, state, action)(ScoreSetting)

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : BgColor
    },
    borderLine : {
        height : 1,
        backgroundColor : '#E6E6E6'
    },
    headerText : {
        paddingTop : 11,
        paddingLeft : 15,
        height : 37,
        backgroundColor : BgColor,
        color : '#777777',
        fontSize : 13,
        fontFamily : 'PingFang-SC-Medium'
    },
    itemText : {
        paddingTop : 16,
        paddingLeft : 15,
        height : 44,
        backgroundColor : '#ffffff',
        color : '#333333',
        fontSize : 16
    },
    lineS : {
        borderBottomWidth : 1,
        marginHorizontal : 0,
        borderColor : headerBorderColor
    },
    itemBox : {
        flexDirection : 'row',
        backgroundColor : BgColor,
        flex : 1
    },
    itemTypeOneBox : {
        flex : 1,
        backgroundColor : '#ffffff',
        flexDirection : 'row',
        justifyContent : 'flex-end',
        alignItems : 'center'
    },
    itemTypeOneImage : {
        height : 18,
        width : 18,
        marginRight : 9
    },
    itemTypeOneText : {
        marginRight : 27,
        fontSize : 14,
        fontFamily : 'PingFang-SC-Medium',
        color : '#333333'
    },
    itemTypeOneTextR : {
        marginRight : 15,
        fontSize : 14,
        fontFamily : 'PingFang-SC-Medium',
        color : '#333333'
    }
});