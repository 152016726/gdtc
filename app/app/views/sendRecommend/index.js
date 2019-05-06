import React, {Component} from 'react';
import {
    View,
    Text,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    Modal,
    Platform
} from 'react-native';
import {connectReducerComponent} from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from "~/constants/storeKeys";
import {FONT_16, FONT_12, FONT_15} from "~/constants/fontSize";
import * as CommonColor from '~/constants/color';
import games from "@easylotto/bet";
import OutcomeList from './components/outcomeList'
import WordCount from './components/wordCount'
import {
    TIPS,
    LESS_THIRTY_WORDS,
    PLEASE_INPUT_WORDS
} from "../../constants/Tips";

let _MULTIPLE = 1;        //投注倍数
let _BETMONEY = 100;      //投注金额
//投注类型Map
let betTypeMap = {
    mix: '1',
    dg: '2',
    tg: '3'
};
//玩法串关Map
let comboMap = {
    mix: {
        m: 2,
        n: 1,
        p: [2]
    },
    dg: {
        m: 1,
        n: 1,
        p: [1]
    },
    tg: {
        m: 1,
        n: 1,
        p: [1]
    }
};

class SendRecommend extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: '我要晒单'
        }
    };
    state = {
        matchData: [],             //选择赛事数据
        text: "",                  //推荐理由
        isShowModal: false       //是否展示发布成功确认窗
    };

    wordCount;

    componentWillMount() {
        this.getMatchData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (Platform.OS === 'ios') {
            if (this.state.text !== nextState.text) {
                return false;
            }
        }
        return true;
    };

    getMatchData() {
        const {sort} = this.props.navigation.state.params;
        let matchData = games.Betslip.getBetslip();
        matchData.forEach((mkl) => {
            mkl.oddsAry = this.setMarketList(mkl);
        });
        //获取最大最小中奖金额对象
        let BonusObj = games.Bonus.getMaxMinBonusQuckly(comboMap[sort], _BETMONEY / 2);
        // console.log(BonusObj);
        //该方法返回单注最大金额，故需要乘以投注金额/2
        this.setState({
            matchData: matchData,
            maxBonus: BonusObj.maxBonus,
            minBonus: BonusObj.minBonus
        })
    }

    setMarketList(mk) {
        let oddsAry = [];
        let oddObj = {
            marketName: '',
            handicap: '0',
            odds: []
        };
        let flag = false;
        mk.outcomes.forEach((ot, i) => {
            flag = oddsAry.some((val) => {            // 判断玩法是否已经存在
                return val.marketName === ot.marketKey
            });
            if (flag) {         // 玩法若已存在则在对应玩法中直接添加所选 outCome
                oddsAry.forEach((od, k) => {
                    if (od.marketName === ot.marketKey) {
                        od.odds.push(ot.oddsName + '@' + ot.odds);
                    }
                });
            } else {            // 玩法若未存在则添加所选玩法以及 outCome
                oddObj = {
                    marketName: '',
                    handicap: '0',
                    odds: []
                };
                oddObj.marketName = ot.marketKey;
                oddObj.odds.push(ot.oddsName + '@' + ot.odds);
                oddObj.handicap = ot.data.handicap || "0";
                oddsAry.push(oddObj);
            }
        });
        return oddsAry;
    }

    updateWordCount(text){
        this.wordCount.setState({text});
    }

    handlePublish() {
        const {text, matchData, maxBonus, minBonus} = this.state;
        const {sort} = this.props.navigation.state.params || {};
        let source = Platform.OS;
        if (text.length < 30) {
            Alert.alert(TIPS, LESS_THIRTY_WORDS, [
                {text: '确定'}
            ]);
        } else {
            let betslip = [];
            // console.log(matchData);
            matchData.forEach((event) => {
                let outcomes = [];
                event.outcomes.forEach((oc) => {
                    let ishandicap = oc.data.handicap;
                    outcomes.push(
                        Object.assign({
                            odds: oc.odds,
                            marketKey: oc.marketKey,
                            outcomeKey: oc.outcomeKey
                        }, ishandicap ? {handicap: oc.data.handicap} : {})
                    )
                });
                betslip.push({
                    vid: event.matchInfo.vid,
                    outcomes: outcomes
                })
            });
            let reqData = {
                "type": betTypeMap[sort],
                "gameType": "1",
                'source': source,
                "betslip": betslip,
                "multiple": _MULTIPLE,
                "money": _BETMONEY,
                "maxBonus": maxBonus,
                "minBonus": minBonus,
                "analysis": text
            };
            // console.log(JSON.stringify(reqData));
            this.props.publish(reqData, sort);
        }
    }

    /**
     * 分割线
     * @returns {*}
     */
    borderBottomList() {
        return (
            <View style={styles.flatBorder}>
                <View style={styles.flatBorderLine}/>
            </View>
        )
    }

    /**
     * 关闭modal对话框
     */
    handleCloseModal() {
        const {navigation} = this.props;
        this.props.updateAllState({
            isRespond: false
        });
        //跳转至专家主页
        navigation.navigate('ExpertHome')
    }

    componentWillUnmount() {
        this.props.initState();
    }

    render() {
        const {matchData, text, maxBonus, minBonus} = this.state;
        const {isRespond} = this.props;
        return (
            <View style={styles.container}>
                {
                    isRespond &&
                    <View style={styles.maskView}>
                        <View style={styles.modalView}>
                            <Image style={styles.topView} source={require('./images/topView.png')}
                                   resizeMode="contain"/>
                            <TouchableOpacity style={styles.btn_confirm} onPress={this.handleCloseModal.bind(this)}>
                                <Image style={styles.confirm} source={require("./images/confirm.png")}
                                       resizeMode="contain"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                <View style={styles.recommendList}>
                    <FlatList data={matchData}
                              extraData={matchData}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({item}) => (
                                  <OutcomeList marketList={item}/>
                              )}
                              ItemSeparatorComponent={this.borderBottomList}>
                    </FlatList>
                    <ImageBackground style={styles.refound} source={require('./images/refound_bg.png')}
                                     resizeMode="cover">
                        <View style={styles.refound_content}>
                            <Text style={[styles.returns, styles.boldTxt]}>回报：</Text>
                            <Text style={styles.returns}>投入100，最高可中</Text>
                            <Text style={[styles.returns, styles.moneyTxt]}>{maxBonus}</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.bottom}>
                    <View style={styles.title}>
                        <ImageBackground style={styles.img} source={require('./images/title_3.png')}
                                         resizeMode="contain">
                            <View style={styles.inner}>
                                <Text style={styles.title_txt}>晒单分析</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.reasonContent}>
                        <View style={styles.textAreaBox}>
                            <TextInput style={styles.textArea} placeholder="请输入您的晒单分析..." multiline={true}
                                       maxLength={150}
                                       onChangeText={(text) => {
                                           this.updateWordCount(text);
                                           this.setState({text: text})
                                       }}
                                       value={text}/>
                            <View style={styles.count}>
                                <WordCount max={150} ref={ref => {
                                    this.wordCount = ref
                                }} text={text}/>
                            </View>
                        </View>
                        <View style={styles.rules}>
                            <Text style={styles.rule_txt}>
                                * 理由不少于30个字，最多不超过150个字
                            </Text>
                        </View>
                    </View>
                    <View style={styles.btnContent}>
                        <TouchableOpacity style={styles.btn} activeOpacity={1} onPress={this.handlePublish.bind(this)}>
                            <Text style={styles.txt}>发布</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SEND_RECOMMEND_STORE, reducer, state, action)(SendRecommend);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: CommonColor.BgColorWhite
    },
    refound: {
        width: '100%',
        height: 43,
    },
    refound_content: {
        width: '100%',
        height: '100%',
        lineHeight: 43,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 22
    },
    boldTxt: {
        fontWeight: 'bold'
    },
    returns: {
        fontSize: FONT_15,
        color: CommonColor.contentText
    },
    moneyTxt: {
        color: '#EB812A'
    },
    recommendList: {
        backgroundColor: '#F5F5F5',
        height: 'auto',
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    bottom: {
        flex: 4,
        paddingHorizontal: 12,
        paddingVertical: 15,
        flexDirection: 'column',
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    inner: {
        width: 64,
        height: 16
    },
    title_txt: {
        color: CommonColor.contentText,
        fontSize: FONT_16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    img: {
        width: 164,
        height: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reasonContent: {
        alignItems: 'center',
        marginTop: 11
    },
    textAreaBox: {
      width: '100%'
    },
    textArea: {
        width: '100%',
        height: 120,
        borderWidth: 1,
        borderColor: '#DEDEDE',
        borderRadius: 5,
        paddingHorizontal: 11,
        paddingVertical: 10
    },
    rules: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    rule_txt: {
        color: '#8E8E8E',
        marginTop: 8,
        fontSize: FONT_12
    },
    btnContent: {
        width: '100%',
        height: 40,
        marginTop: 16
    },
    btn: {
        flex: 1,
        backgroundColor: '#EB812A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    txt: {
        color: CommonColor.SelfWhite,
        fontSize: FONT_16
    },
    flatBorder: {
        height: 1,
        overflow: "hidden",
        paddingHorizontal: 10
    },
    flatBorderLine: {
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#E2E2E2'
    },
    maskView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
        zIndex: 100
    },
    modalView: {
        width: 300,
        height: 'auto',
        flexDirection: 'column',
        opacity: 1,
        marginBottom: 70
    },
    btn_confirm: {
        width: 300,
        height: 'auto',
        borderRadius: 5,
        marginTop: -5
    },
    topView: {
        width: 300,
        height: 300 * 386 / 590,
        opacity: 1
    },
    confirm: {
        width: 300,
        height: 300 * 98 / 590,
        borderRadius: 5,
        opacity: 1
    },
    count: {
        position: 'absolute',
        bottom: 6,
        right: 6
    }
});

