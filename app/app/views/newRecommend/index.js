/**
 * Created by easyLottoMac_Feng on 2019/1/2.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {connectReducerComponent} from "~/reduxCfg";
import * as storeKey from "~/constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import HeaderLeft from "~/components/headerLeft";
import DropDownSelection from "~/components/dropDownSelection";
import {BgColor} from "~/constants/color";
import {BorderColor, contentText} from "~/constants/color";
import {FONT_14} from "~/constants/fontSize";

let _pageTypeMatch = 'newRecommend';
let _pageDataKeyMatch = new Date().getTime();

import RecommendationFlatList from '~/components/recommendationFlatList';
import {tipsTextGrey} from "~/constants/color";

const CONFIG = [
    {
        type: 'title',
        selectedIndex: 0,
        data: [{
            title: '全部玩法',
            typeNum: 0,
            statusNum: '0'
        }, {
            title: '胜平负2串1',
            typeNum: 0,
            statusNum: '1'
        }, {
            title: '单关',
            typeNum: 0,
            statusNum: '2'
        }, {
            title: '总进球',
            typeNum: 0,
            statusNum: '3'
        }]
    },
    {
        type: 'title',
        selectedIndex: 0,
        data: [{
            title: '综合排序',
            typeNum: 1,
            statusNum: '0'
        }, {
            title: '近五场',
            typeNum: 1,
            statusNum: '1'
        }, {
            title: '连胜',
            typeNum: 1,
            statusNum: '2'
        }, {
            title: '周命中率',
            typeNum: 1,
            statusNum: '3'
        }, {
            title: '月命中率',
            typeNum: 1,
            statusNum: '4'
        }]
    }
];

class NewRecommend extends Component {
    static navigationOptions = ({navigation}) => {
        let headerLeft = <HeaderLeft handleGoBack={() => navigation.goBack()} img={require('../../images/back.png')}/>;
        return {
            title: '最新晒单',
            headerLeft
        }
    };

    componentWillMount() {
        // 数据初始化
        this.props.updateData({
            flatListData: [],                // 列表数据
            orderBy: '0',                    // 排序规则 0: 综合排序 1: 近5场 2: 连胜 3: 周命中率 4: 月命中率
            type: '0',                       // 荐单类型, 0: 全部; 1: 胜平负2串1; 2: 单关; 3: 总进球
            pageIndex: '0',                  // 页面索引
        });
        this.props.getRecommendationData();
        this.props.getExpertRLeagueListData();
    }

    /**
     * 筛选按钮的页面跳转
     */
    screenMarketHandle() {
        const {navigation, leagueList, updateData} = this.props;
        navigation.navigate('MatchTypeSelectVersion2', {
            title: '赛事选择',
            type: _pageTypeMatch,
            dataKey: _pageDataKeyMatch,
            confirm: () => {
                this.props.getRecommendationData();
            },
            config: [
                {
                    data: leagueList,
                    countPerRow: 3,
                    idName: 'lid',
                    textName: 'shortName',
                    checkAllBtn: true,
                    invertBtn: true,
                    title: '赛事选择',
                    onChanged: (arr) => updateData({
                        lids: arr
                    })
                }
            ]
        });
    }

    /**
     * 渲染页面的主体内容
     * @returns {*}
     */
    renderContent() {
        const {flatListData, navigation, pullUpLoad, refreshHandle, isFooter, isNoRecommend} = this.props;
        return (
            <View style={{marginBottom: 30}}>
                {
                    !isNoRecommend ?
                        <RecommendationFlatList
                            navigation={navigation}
                            flatListData={flatListData}
                            pullUpLoad={pullUpLoad}
                            refreshHandle={refreshHandle}
                            isFooter={isFooter}
                        /> : <View style={{alignItems: 'center'}}>
                            <View style={{marginTop: 130}}>
                                <Image
                                    style={styles.noRecIconSty}
                                    source={require('../../images/no_recommend_icon.png')}/>
                                <Text style={styles.tipsTextSty}>暂无晒单</Text>
                            </View>
                        </View>
                }
            </View>
        )
    }

    /**
     * 渲染右上角的筛选按钮
     * @returns {*}
     */
    rightRenderContent() {
        return (
            <TouchableOpacity
                style={styles.screenBoxSty}
                onPress={() => this.screenMarketHandle()}>
                <Text style={styles.screenTextSty}>
                    筛选
                </Text>
                <Image
                    style={styles.screenImageIcon}
                    source={require('../../images/screenIcon.png')}/>
            </TouchableOpacity>
        )
    }

    render() {
        const {selectHandle} = this.props;
        return (
            <DropDownSelection
                selectList={CONFIG}
                selectHandle={selectHandle}
                renderContent={() => this.renderContent()}
                rightRenderContent={() => this.rightRenderContent()}
            />
        )
    }
}

const styles = StyleSheet.create({
    screenBoxSty: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    screenTextSty: {
        fontSize: FONT_14,
        color: contentText
    },
    screenImageIcon: {
        width: 14,
        height: 12
    },
    noRecIconSty: {
        width: 84,
        height: 77
    },
    tipsTextSty: {
        color: tipsTextGrey,
        textAlign: 'center',
        marginTop: 12
    }
});

export default connectReducerComponent(storeKey.NEW_RECOMMEND_STORE, reducer, state, action)(NewRecommend)