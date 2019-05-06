/**
 * Created by easyLottoMac_Feng on 2019/1/2.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import {connectReducerComponent} from "~/reduxCfg";
import * as storeKey from "~/constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import TabNavigator from "~/navigator/TabNavigator";
import {BgColor, contentText, SpiltLineColor, MainColor, tipsTextGrey, BorderColor} from "~/constants/color";
import {FONT_13, FONT_16} from "~/constants/fontSize";
import ExpertList from '~/components/expertList';
import RecommendationFlatList from '~/components/recommendationFlatList';
import {
    TIPS,
    ECEIPT_FULL_TODAY
} from "~/constants/Tips";

const BTNS = [      // 要展示的 title
    {text: '我要晒单', imageUrl: require('./images/recommendation.png'), rootName: 'MatchList'},
    {text: '最新晒单', imageUrl: require('./images/newRecommend.png'), rootName: 'NewRecommend'},
    {text: '晒单团', imageUrl: require('./images/expertGroup.png'), rootName: 'ExpertGroup'},
    {text: '排行榜', imageUrl: require('./images/rankingList.png'), rootName: 'ExpertRank'},
    {text: '我的关注', imageUrl: require('./images/myAttention.png'), rootName: 'ExpertAttention'}
];

class ExpertHome extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: '晒单'
        }
    };

    componentWillMount() {
        this.props.updateAllInfo();
    }

    componentWillReceiveProps(nextProps) {
        // 更新登录状态
        if (nextProps.isReceiveProps) {
            this.props.updateData({
                isReceiveProps: false
            });
            this.props.updateAllInfo();
        }
    }

    /**
     * 顶部 title 按钮事件
     * @param btn
     */
    subTitleHandle(btn) {
        const {navigation, needShowSorts, loginStatus} = this.props;
        if (!loginStatus) {
            navigation.navigate('Login')
        } else {
            if (btn.rootName === 'MatchList' && needShowSorts.length === 0) {
                Alert.alert(TIPS, ECEIPT_FULL_TODAY, [{text: '确定'}]);
                return;
            }
            navigation.navigate(btn.rootName, btn.rootName === 'MatchList' ? {
                needShowSorts,
                isFromExpert: true
            } : {});
        }
    }

    /**
     * 渲染顶部 title 按钮模块
     * @returns {*}
     */
    renderSubTitle() {
        const {isExpert, loginStatus} = this.props;
        let showBtns = (loginStatus && isExpert === 'true') ? BTNS.slice(0) : BTNS.slice(1);
        return (
            <View style={styles.subTitleBox}>
                {
                    showBtns.map((btn, index) => {
                        return (
                            <View key={index}>
                                <TouchableOpacity
                                    style={{alignItems: 'center'}}
                                    onPress={() => this.subTitleHandle(btn)}>
                                    <Image
                                        source={btn.imageUrl}
                                        style={styles.subTitleImageSty}/>
                                    <Text style={styles.subTitleTextSty}>{btn.text}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    render() {
        const {
            loginStatus, navigation, flatListData, expertList, onScrollHandle,
            refreshPress, isNoRecommend, isActiveNum, titleRECHandle, isShowExpert
        } = this.props;
        let handleArr = [
            {title: '最新晒单', statusNum: 0},
            {title: '昨日晒单', statusNum: 1}
        ];
        return (
            <View style={{flex: 1}}>
                <TabNavigator title='晒单'/>
                {isShowExpert ?
                    <ScrollView
                        style={styles.homeScrollSty}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={refreshPress}
                                title=''
                            />
                        }
                        onScroll={(e) => onScrollHandle(e.nativeEvent)}
                        scrollEventThrottle={1}
                        showsVerticalScrollIndicator={false}>
                        <View style={{backgroundColor: BgColor}}>
                            {this.renderSubTitle()}
                        </View>
                        {loginStatus ? <ExpertList
                            title='精选晒单团'
                            expertList={expertList.slice(0, 8)}
                            navigation={navigation}/> : null}
                        <View style={styles.newRecommendationBox}>
                            <View style={styles.bestExpertTitle}>
                                {
                                    handleArr.map((HA, index) => {
                                        return (
                                            <View
                                                style={[styles.newRecSty, index && styles.lastNewRecSty]}
                                                key={index}>
                                                <TouchableOpacity
                                                    onPress={() => titleRECHandle(HA)}>
                                                    <Text
                                                        style={[
                                                            styles.titleTextSty,
                                                            index === isActiveNum && styles.activeTextTitle
                                                        ]}>
                                                        {HA.title}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            {
                                loginStatus && !isNoRecommend ? <RecommendationFlatList
                                        navigation={navigation}
                                        flatListData={flatListData}
                                    /> :
                                    <View style={styles.tipsBox}>
                                        <Text style={{color: tipsTextGrey}}>暂无最新晒单</Text>
                                    </View>
                            }
                        </View>
                    </ScrollView> :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: '#999999'}}>该模块功能暂未开放</Text>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    homeScrollSty: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    subTitleBox: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        marginBottom: 10
    },
    newRecTitleText: {
        color: contentText,
        fontSize: FONT_16
    },
    subTitleImageSty: {
        width: 48,
        height: 48
    },
    subTitleTextSty: {
        paddingVertical: 5,
        color: contentText,
        fontSize: FONT_13
    },
    newRecommendationBox: {
        backgroundColor: BgColor
    },
    newRecommendationTitleSty: {
        padding: 12,
        paddingTop: 22
    },
    bestExpertTitle: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        flexDirection: 'row'
    },
    titleLeftIcon: {
        width: 4,
        height: 16,
        backgroundColor: MainColor,
        marginRight: 8
    },
    tipsBox: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    newRecSty: {
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderColor: BorderColor
    },
    lastNewRecSty: {
        borderRightWidth: 0
    },
    titleTextSty: {
        color: '#777777',
        fontSize: FONT_16
    },
    activeTextTitle: {
        color: MainColor,
    }
});

export default connectReducerComponent(storeKey.EXPERT_HOME_STORE, reducer, state, action)(ExpertHome)
