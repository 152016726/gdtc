/**
 * Created by mac-ddt on 2017/11/20.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    FlatList,
    ScrollView,
    StyleSheet,
    Dimensions,
    Platform,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { connectReducerComponent } from '../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../constants/storeKeys';
import MyBanner from './myBanner';
import FocusEvent from './FocusEvent';
import SMGInformation from './SMGInformation';
import { FONT_14 } from '../../constants/fontSize';
import { BgColor, BorderColor, BgColorWhite, contentText } from '../../constants/color';
import JPushModule from 'jpush-react-native';

const S_W = Dimensions.get('window').width;                                     // 屏幕宽度
const COLLECTIONPADDING = 10;                                                   // 屏幕宽度 padding
const ITEMLINECOUNT = 4;                                                        // 每一行渲染的数量
const ITEMWIDTH = Math.floor((S_W - COLLECTIONPADDING * 2) / ITEMLINECOUNT);    // 每个菜单栏 icon 的宽度
const BUTTONSARR = [                                                            // 渲染菜单导航栏数据
    { title : "赛事资讯", image : require('./images/icon_eventInformation.png'), rootName : 'EventInformation' },
    { title : "竞彩赛程", image : require('./images/icon_scoringSchedule.png'), rootName : 'MatchList' },
    { title : "开奖查询", image : require('./images/icon_lotteryInquiry.png'), rootName : 'Award' },
    { title : "资料库", image : require('./images/icon_database.png'), rootName : 'EventCenter' },
    { title : "官方公告", image : require('./images/icon_officialAnnouncement.png'), rootName : 'OfficialNews' },
    { title : "赛事指数", image : require('./images/icon_exponent.png'), rootName : 'Exponent' },
    { title : "竞彩店", image : require('./images/icon_networkQuery.png'), rootName : 'LotteryShop' },
    { title : "实用工具", image : require('./images/icon_utilities.png'), rootName : 'UtilityProgram' }
];

class Home extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title : "",
            headerLeft : (<View/>)
        }
    };

    componentWillMount() {
        // 数据请求
        this.props.getHomeBanner();
        this.props.getFocusMarket();
        this.props.getInformationList();
        this.props.getExpertsList();
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            //ios打开事件监听
            JPushModule.addOpenNotificationLaunchAppListener(notification => {
                // console.log('addOpenNotificationLaunchAppListener',notification)
            })
        } else {
            //android支持，在其它功能之前调用
            JPushModule.notifyJSDidLoad((resultCode) => {
                if (resultCode === 0) {
                    // console.log('notifyJSDidLoad ok');
                }
            });
        }
        JPushModule.addReceiveNotificationListener((map) => {
            // console.log('addReceiveNotificationListener:' + JSON.stringify(map));
        });
        JPushModule.addReceiveOpenNotificationListener((map) => {
            //点击推送后
            if (map.extras) {
                let typeJson = JSON.parse(map.extras.notifyJson);
                if (typeJson) {
                    //通过type判断比分和新闻并跳转 0为新闻 1为比赛
                    let id = typeJson.type !== '1' ? typeJson.data.articleId : typeJson.data.vid;
                    let item = Object.assign(typeJson, { id });
                    (typeJson.type !== '1') && id ? this.props.navigation.navigate('StaticPage', { item })
                        : this.props.navigation.navigate('ScoreDetails', { vid : id })
                }
            }

        });
        JPushModule.addReceiveCustomMsgListener((map) => {
            // console.log("extras: " + map.extras);
        });

    }

    componentWillUnmount() {
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();
        JPushModule.removeOpenNotificationLaunchAppEventListener();
        JPushModule.removeOpenNotificationLaunchAppEventListener();
    }

    /**
     * title 按钮跳转页面
     * @param rootName
     * @param titleStr
     */
    buttonTaped(rootName, titleStr) {
        this.props.navigation.navigate(rootName);
    }

    /**
     *  button 按钮 render
     * @param item
     * @param index
     * @returns {*}
     */
    renderItem(item, index) {
        return (
            <View style={styles.itemStyle}>
                <TouchableOpacity
                    style={{ justifyContent : 'center', alignItems : 'center' }}
                    key={index}
                    onPress={() => this.buttonTaped(item.rootName, item.title)}
                >
                    <Image source={item.image}
                           style={styles.btnImage}/>
                    <Text style={styles.subTitle}>
                        {item.title}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const {
            focusMarkets, navigation, expertsList, information, onMarketTips, refreshPress,
            onScrollHandle, isFooterIF, isFooterEx, isLoadingEx, isLoadingIF, bannerList, hasMakert
        } = this.props;
        return (
            <ScrollView
                style={styles.topView}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={refreshPress}
                        title=''
                    />
                }
                onScroll={(e) => onScrollHandle(e.nativeEvent)}
                scrollEventThrottle={1}
                showsVerticalScrollIndicator={false}
            >
                <MyBanner
                    bannerList={bannerList}
                    navigation={navigation}/>
                <View style={{ paddingBottom : 10 }}>
                    <FlatList
                        style={styles.buttonsFlatList}
                        data={BUTTONSARR}
                        extraData={BUTTONSARR}
                        alwaysBounceVertical={false}
                        numColumns={ITEMLINECOUNT}
                        columnWrapperStyle={styles.flatS}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                        removeClippedSubviews={false}
                    />
                </View>
                <FocusEvent
                    focusMarkets={focusMarkets}
                    onMarketTips={onMarketTips}
                    navigation={navigation}
                    hasMakert={hasMakert}/>
                <SMGInformation
                    navigation={navigation}
                    information={information}
                    expertsList={expertsList}
                    isFooterIF={isFooterIF}
                    isFooterEx={isFooterEx}
                    isLoadingEx={isLoadingEx}
                    isLoadingIF={isLoadingIF}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    topView : {
        flex : 1,
        backgroundColor : BgColor
    },
    itemStyle : {
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : BgColorWhite,
        paddingTop : 5,
        paddingBottom : 0,
        width : ITEMWIDTH
    },
    buttonsFlatList : {
        paddingBottom : 15,
        borderBottomWidth : 1,
        borderColor : BorderColor,
        backgroundColor : BgColorWhite
    },
    btnImage : {
        width : 44,
        height : 44
    },
    flatS : {
        padding : COLLECTIONPADDING,
        paddingBottom : 0,
        backgroundColor : BgColorWhite
    },
    subTitle : {
        marginTop : 6,
        textAlign : 'center',
        fontSize : FONT_14,
        color : contentText
    }
});
export default connectReducerComponent(storeKey.HOME_STORE, reducer, state, action)(Home)