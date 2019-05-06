import React, {Component} from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import * as FontSize from '../../constants/fontSize'
import * as Color from '../../constants/color'
import games from '@easylotto/bet'
import {connectReducerComponent} from '../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKeys from "../../constants/storeKeys";
import {
    MAX_SELECT_MATCH,
    MIN_SELECT_MATCH,
    TIPS,
    MAX_SELECT_TWO_OUTCOME,
    PLEASE_SELECT_TWO,
    MAX_SECLECT_ONE,
    ONLY_REPEAT_ONE
} from "../../constants/Tips";
import {contentText} from "../../constants/color";
import Screen from '../../modules/screen';
import Emitter from '@easylotto/emitter';

let betTypeMap = {
    'mix': games.Rule.EXPERT_TWO_STICK_ONE,
    'dg': games.Rule.EXPERT_SINGLE,
    'tg': games.Rule.EXPERT_TOTAL_GOALS
};

class BetArea extends Component {

    componentWillMount() {
        this.props.getbetslipList();
    }

    /**
     * 跳转至betslip
     */
    handleGoToBetslip() {
        const {handleGoToBetslip} = this.props;
        let outcomeList = games.Betslip.getBetslip();
        games.Rule.setRule(games.Rule.JING_CAI_SOCCER_RULE);
        let checkResult = games.Rule.checkBetslip();
        if(checkResult.isPass){
            handleGoToBetslip && handleGoToBetslip()
        }else {
            Alert.alert(TIPS, checkResult.reason[0]);
        }
        // 2019-2-19 投注揽校验走games里面的rule
        // let isDan = outcomeList.some((oc) => {
        //     return oc.matchInfo.dgStatus === '1';
        // });
        // if (isDan || eventCount > 1) {
        //     if (eventCount < 9) {
        //         handleGoToBetslip && handleGoToBetslip()
        //     } else {
        //         Alert.alert(TIPS, MAX_SELECT_MATCH)
        //     }
        // } else {
        //     Alert.alert(TIPS, MIN_SELECT_MATCH)
        // }
    }

    /**
     * 删除所有已选中的的赛事
     */
    deleteAll() {
        const {eventCount} = this.props;
        if (eventCount === 0) return;
        Alert.alert(
            '温馨提示',
            '将清空所有已选投注',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed')},
                {
                    text: '确认',
                    onPress: () => {
                        const {deleteAll} = this.props;
                        let betslipList = games.Betslip.getBetslip();
                        let arrVid = betslipList.map(item => item.matchInfo.vid);
                        games.Betslip.clearBetslip();
                        arrVid.forEach(vid => {
                            Emitter.global.emit('event_update_' + vid, '');
                        });
                        deleteAll();
                    }
                }
            ],
            {cancelable: false}
        )

    }

    /**
     * 跳转至发推荐页面
     */
    handleJumpToRecommend() {
        const {handleJumpToRecommend, sort} = this.props;
        // console.log(sort);
        games.Rule.setRule(betTypeMap[sort]);
        let errorObj = games.Rule.checkBetslip();
        // console.log(errorObj);
        if (errorObj.isPass) {
            handleJumpToRecommend(sort)
        } else {
            Alert.alert(TIPS, errorObj.reason[0])
        }
    }

    render() {
        const {eventCount, isFromExpert} = this.props;
        // console.log(eventCount);
        let outcomeList = games.Betslip.getBetslip();
        let isDan = outcomeList.some((oc) => {
            return oc.matchInfo.dgStatus === '1';
        });
        return (
            <View style={styles.container}>
                <View style={styles.bottomContent}>
                    <TouchableOpacity style={styles.leftSide} onPress={this.deleteAll.bind(this)}>
                        <Image style={styles.img} source={require('../../images/clear.png')}/>
                    </TouchableOpacity>
                    <View style={styles.centerSide}>
                        {
                            eventCount === 0 ? <Text style={styles.textColor}>请选择比赛</Text> :
                                <Text style={[styles.txt, styles.textColor]}>已选 <Text

                                    style={styles.count}>{eventCount || 1}</Text>场{
                                        // 2019-3-20 GSSL
                                        // 此处之前是 "isDan != true" 又多余又不严谨的判断 (彩蛋)
                                        (!isDan && eventCount < 2) ? '，至少再选择1场' : ''
                                    }
                                </Text>
                        }
                        <Text style={styles.static_txt}>页面指数仅供参考,请以出票指数为准</Text>
                    </View>
                    {
                        isFromExpert ?
                            <TouchableOpacity style={styles.rightSide} onPress={this.handleJumpToRecommend.bind(this)}>
                                <Text style={styles.confirm}>下一步</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.rightSide} onPress={this.handleGoToBetslip.bind(this)}>
                                <Text style={styles.confirm}>确定</Text>
                            </TouchableOpacity>
                    }

                </View>
            </View>
        )
    }
}

export default connectReducerComponent(storeKeys.BET_AREA_STORE, reducer, state, action)(BetArea)

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: 63,
        position: 'absolute',
        paddingVertical: 7,
        paddingHorizontal: 12,
        backgroundColor: '#FAFAFA',
        bottom: Screen.isIphoneXR() || Screen.isIphoneX() ? 54 : 0,
        borderColor: '#B3B3B3',
        borderTopWidth: 1
    },
    bottomContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftSide: {
        flex: 1,
        width: 30,
        height: 30
    },
    img: {
        width: 24,
        height: 23
    },
    centerSide: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txt: {
        fontSize: FontSize.FONT_N
    },
    static_txt: {
        color: '#999999',
        fontSize: FontSize.FONT_11
    },
    textColor: {
        color: contentText
    },
    count: {
        color: Color.MainColor
    },
    rightSide: {
        flex: 1,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.MainColor,
        borderRadius: 5,
    },
    confirm: {
        fontSize: FontSize.FONT_M,
        color: Color.BgColorWhite,
        textAlign: 'center'
    }
});
