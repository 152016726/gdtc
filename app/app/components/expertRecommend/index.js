/**
 * Created by owen on 2019/1/2.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    Alert,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as colorConf from '~/constants/color.js'
import imgRed from './images/red.png'
import imgBlack from './images/black.png'
import imgCancle from './images/cancle.png'
import imgDelay from './images/delay.png'
import imgIndex1 from './images/index1.png'
import imgIndex2 from './images/index2.png'
import * as EventState from "../../constants/eventState";
import getRecommendBetResult from '~/services/getRecommendBetResult'
import oddDealCtrl from "~/constants/oddDealCtrl";
import ExpertAvatar from "../expertAvatar";
import _ from 'lodash';
import {
    TIPS,
    UPDATING_TRY_AGAIN,
    LESS_THIRTY_WORDS
} from "~/constants/Tips";

const _TYPEMARKET = [           // 玩法字典
    {title: '胜平负2串1', statusNum: '1'},
    {title: '单关', statusNum: '2'},
    {title: '总进球', statusNum: '3'}
];

let _betsCn = oddDealCtrl.getOdds();

let _indexImgObj = [imgIndex1, imgIndex2];
let _arrWeekCn = [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六',
];
let stateObj = {
    NO_DRAW: '0',
    DRAW: '1',
    WIN: '2',
    LOSE: '3',
    NO_WIN_OR_LOSE: '4',
    DELAY: '5',
    CANCLE: '6'
};
let _purchase = 100;
export default class expertRecommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resultForState: props.result    //推荐和分析
        };
    }

    static defaultProps = {
        rid: '',             //荐单id,
        eid: '',             //专家id
        showTitle: true,     //是否显示头部
        icon: '',            //头像
        nickname: '',        //专家名称
        fiveWinrate: '',     //近5中几
        comboWin: '',        //几连胜
        type: null,          //玩法
        state: null,         //荐单状态 0: 荐单内的比赛都没结算;1: 荐单内部分比赛结算, 但不是所有比赛都结算了;2: 荐单红了;3: 荐单黑了;4: 荐单走水;5: 荐单内有比赛延期;6: 荐单内有比赛取消.
        events: [],
        result: null,        //外面传进来的推荐和分析(只用于初始化)
        navigation: null     //外面传进来的navigation对象
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.result !== this.props.result) {
            this.setState({
                resultForState: nextProps.result
            });
        }
    }

    /**
     * 近5中几百分比转换
     */
    getRecentCoutByPercent(percent) {
        return Math.round(5 * percent);
    }

    /**
     * 玩法名称获取
     */
    getBetCnString(marketKey, outcomeKey) {
        let obj = _.find(_betsCn[marketKey], function (o) {
            return o.key === outcomeKey;
        });
        if (!obj) {
            obj = {}
        }
        return obj.title || '';
    }

    /**
     * 渲染头部
     */
    renderTitle() {
        let {icon, nickname, fiveWinrate, comboWin, navigation, eid} = this.props;
        let showComboWin = true;
        if (comboWin === '0' || comboWin === '1') {
            showComboWin = false;
        }
        return <View style={styles.titleInner}>
            <ExpertAvatar direction='row'
                          navigation={navigation}
                          width={34}
                          name={nickname}
                          id={eid}
                          customStyles={{wrapper: {flex: 1}}}
                          uri={icon}/>
            <View style={[styles.tag, !showComboWin ? styles.mr0 : null]}>
                <Text style={[styles.tagText]}>{`近5中${this.getRecentCoutByPercent(fiveWinrate)}`}</Text>
            </View>
            {showComboWin && <View style={[styles.tag, styles.lastTag]}>
                <Text style={[styles.tagText, styles.lastTagText]}>{`${comboWin}连胜`}</Text>
            </View>
            }
        </View>
    }

    /**
     * 显示推荐和分析
     */
    showMore() {
        let {rid, navigation} = this.props;
        getRecommendBetResult.getData({rid}).then(rsp => {
            this.setState({
                resultForState: rsp.data
            });
        }, (rsp) => {
            if(rsp.rspCode === 'NOLOGIN'){
                navigation && navigation.navigate('Login');
            }
            else{
                Alert.alert(TIPS, UPDATING_TRY_AGAIN, [
                    {text: '确定'}
                ]);
            }
        })
    }

    /**
     * 获取周几和编号
     */
    getWeekAndNo(completeNo) {
        let betWeekCode = parseInt(completeNo.substr(completeNo.length - 4, 1), 10);    // 赛事所属周几
        let week = _arrWeekCn[betWeekCode];
        return week + completeNo.substr(-3);
    }

    /**
     * 获取yyyy/MM/dd hh:mm
     */
    getDate(vsDate) {
        return Date.prototype.parseISO8601(vsDate).format('yyyy/MM/dd hh:mm');
    }

    /**
     * 获取VS或者比分（比分为红色）
     */
    renderVsText(data) {
        if (data.eventState === EventState.FULL_TIME ) {
            return <Text style={styles.score}>{`${data.homeGoalsScored}-${data.awayGoalsScored}`}</Text>;
        }
        else {
            return <Text style={styles.score}>VS</Text>;
        }

    }

    getMax(str){
        return str.replace(/(\d)\.(00)$/,'$1');
    }

    /**
     * 渲染选择赛事的相关资讯
     */
    renderPlayItem() {
        let {events} = this.props;
        let {resultForState} = this.state;
        return events.map((ele, index) => <View key={index}
                                                style={[styles.rowSpace, (!resultForState && index === events.length - 1) ?
                                                    styles.noMarginBottom : null]}>
            <View style={[styles.row, styles.alignItemsCenter]}>
                <Image
                    style={styles.indexImg}
                    source={_indexImgObj[index]}
                />
                <Text style={styles.timeText}>{this.getWeekAndNo(ele.completeNo)}</Text>
                <Text style={styles.grayText}>{this.getDate(ele.vsDate)}</Text>
            </View>
            <View style={[styles.row, {flexDirection: 'row'}, styles.alignItemsCenter]}>
                <Text style={[styles.grayText]}>{`${ele.leagueShortName}：`}</Text>
                <Text style={[styles.rowContent]}>
                    <Text style={styles.grayText}>
                        {
                            ele.homeShortName
                        }
                    </Text>
                    {
                        this.renderVsText(ele)
                    }
                    <Text style={styles.grayText}>
                        {
                            ele.awayShortName
                        }
                    </Text>
                </Text>
            </View>
        </View>)
    }

    /**
     * 渲染投注项
     */
    renderBets() {
        let {resultForState} = this.state;
        return resultForState.betslip.map((ele, index) =>
            <Text key={index} style={[styles.alignItemsCenter]}>
                <Image
                    style={styles.indexImg}
                    source={_indexImgObj[index]}
                />
                {
                    ele.outcomes.map((ele_c, index_c) => {
                            return <Text key={index_c}
                                         style={[styles.allFontSize, styles.grayText]}>
                                {
                                    !!ele_c.handicap ? `让球(${ele_c.handicap})` : null
                                }
                                {`${this.getBetCnString(ele_c.marketKey, ele_c.outcomeKey)}@`}
                                <Text style={styles.score}>{ele_c.odds}</Text>
                                {index_c !== ele.outcomes.length - 1 && '、'}
                            </Text>
                        }
                    )
                }
            </Text>)

    }
    /**
     * 渲染主体内容
     */
    renderContent() {
        let {resultForState} = this.state;
        let {type} = this.props;
        let method = '';    // 玩法
        if (type) {
            method = _TYPEMARKET.filter(typeM => {
                return type === typeM.statusNum
            })[0].title;
        }
        return <View style={styles.content}>

            <View style={styles.play}>
                <View style={styles.playLeft}>
                    <View style={[styles.row, styles.rowSpace]}>
                        <Text style={styles.rowTitle}>玩法：</Text>
                        <Text style={styles.rowContent}>{method}</Text>
                    </View>
                    {
                        this.renderPlayItem()
                    }
                    {
                        resultForState && <View>
                            <View style={styles.row}>
                                <Text style={styles.rowTitle}>晒单：</Text>
                                <View style={styles.rowContent}>
                                    {
                                        this.renderBets()
                                    }
                                </View>
                            </View>
                            <View style={[styles.row, styles.rowSpace]}>
                                <Text style={styles.rowTitle}/>
                                <Text style={[styles.rowContent]}>
                                    <Text style={styles.grayText}>{`投入${_purchase}，`}<Text style={[styles.score]}>
                                        {`最高可中${resultForState.maxBonus || ''}`}
                                    </Text></Text>
                                </Text>
                            </View>
                        </View>
                    }
                </View>
                <View style={styles.playRight}>
                    {
                        this.renderButton()
                    }
                </View>
            </View>
            {
                resultForState &&
                <View>
                    <View style={styles.row}>
                        <Text style={styles.rowTitle}>分析：</Text>
                        <Text style={[styles.rowContent]}>{resultForState.analysis}</Text>
                    </View>
                </View>
            }
        </View>
    }

    /**
     * 渲染查看按钮或者印章
     */
    renderButton() {
        let {state} = this.props;
        let {resultForState} = this.state;
        //没有result，显示查看按钮
        if (!resultForState) {
            return <TouchableOpacity
                onPress={this.showMore.bind(this)}
                style={styles.showButton}>
                <Text style={styles.showButtonText}>查看</Text>
            </TouchableOpacity>
        }
        //显示印章
        else if (state === '' && state === undefined) {
            return null;
        } else {
            return <View style={[styles.showButton, styles.stamp]}>
                {
                    this.getTagImg(state)
                }
            </View>
        }
    }

    /**
     * 获取印章图片
     */
    getTagImg(state) {
        let img;
        if (state === stateObj.WIN) {
            img = imgRed;
        }
        else if (state === stateObj.LOSE) {
            img = imgBlack;
        }
        else if (state === stateObj.CANCLE) {
            img = imgCancle;
        }
        else if (state === stateObj.DELAY) {
            img = imgDelay;
        }
        else {
            img = null;
        }
        return img && <Image
            style={styles.imgStamp}
            source={img}
        />
    }

    render() {
        let {showTitle} = this.props;
        return <View style={styles.wrapper}>
            {
                showTitle && this.renderTitle()
            }
            {
                this.renderContent()
            }
        </View>
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#ffffff'
    },
    allFontSize: {
        fontSize: 14
    },
    indexImg: {
        width: 14,
        height: 14
    },
    titleInner: {
        paddingVertical: 6,
        paddingHorizontal: 20,
        flexDirection: 'row',
        height: 46,
        borderBottomColor: colorConf.BorderColor,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    score: {
        marginHorizontal: 4,
        color: colorConf.DarkerRedColor
    },
    tag: {
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: colorConf.MainColor,
        borderRadius: 13
    },
    lastTag: {
        marginRight: 0,
        borderColor: colorConf.DarkerRedColor
    },
    mr0: {
        marginRight: 0
    },
    tagText: {
        color: colorConf.MainColor
    },
    lastTagText: {
        color: colorConf.DarkerRedColor
    },
    content: {
        paddingTop: 21,
        paddingBottom: 17,
        paddingHorizontal: 21,
        color: '#333333'
    },
    alignItemsCenter: {
        alignItems: 'center'
    },
    fontBold: {
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
        flexWrap: 'wrap'
    },
    grayText: {
        color: '#333333',
    },
    rowTitle: {
        width: 45,
        color: '#333333',
        fontWeight: 'bold'
    },
    rowContent: {
        flex: 1,
        color: '#333333'
    },
    play: {
        flexDirection: 'row'
    },
    playLeft: {
        flex: 1
    },
    playRight: {
        width: 100
    },
    rowSpace: {
        marginBottom: 8
    },
    showButton: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1
    },
    imgStamp: {
        //justifyContent: 'flex-start',
        width: 66,
        height: 66
    },
    showButtonText: {
        fontSize: 13,
        lineHeight: 14,
        paddingVertical: 5,
        paddingHorizontal: 15,
        textAlign: 'center',
        backgroundColor: colorConf.MainColor,
        borderRadius: 12,
        overflow: 'hidden',
        color: '#ffffff',
        minWidth: 40
    },
    matchIndex: {
        borderColor: '#2b78b2',
        borderWidth: 1,
        width: 13,
        height: 13,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    matchIndexText: {
        color: '#2b78b2',
        fontSize: 10
    },
    timeText: {
        color: colorConf.ACTIVE_BG,
        marginLeft: 4,
        marginRight: 8
    },
    noMarginBottom: {
        marginBottom: 0
    }
});