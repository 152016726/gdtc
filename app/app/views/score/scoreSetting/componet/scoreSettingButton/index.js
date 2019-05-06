import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { connectComponentAction } from "../../../../../reduxCfg";
import action from "./action";
import { BgColor, headerBorderColor } from '../../../../../constants/color';
import * as storeKey from "../../../../../constants/storeKeys";

const choose_ok = require('../../../../../images/choose_ok_orange.png');
const no_choose = require('../../../../../images/no_choose.png');

class ScoreSettingButton extends Component {

    static defaultProps = {
        index : '',
        isGoalDialog : '',
        isGoalShakeTips : '',
        isGoalSoundTips : '',
        isFoulSoundTips : '',
        isFoulShakeTips : '',
        isFoulDialog : '',
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {
            index,
            isGoalDialog,
            isGoalShakeTips,
            isGoalSoundTips,
            isFoulSoundTips,
            isFoulShakeTips,
            isFoulDialog,
            updateGoalSound,
            updateFoulSound,
            updateGoalShake,
            updateFoulShake,
            updateGoalDialog,
            updateFoulDialog
        } = this.props;
        return (
            <View style={styles.itemTypeOneBox}>
                <TouchableOpacity onPress={() => {
                    index === 1 ? updateGoalSound(isGoalSoundTips)
                                : updateFoulSound(isFoulSoundTips)
                }}>
                    <Image style={styles.itemTypeOneImage}
                           source={(index === 1 ? isGoalSoundTips : isFoulSoundTips)
                               ? choose_ok
                               : no_choose}
                    />
                </TouchableOpacity>
                <Text style={styles.itemTypeOneText}>声音</Text>
                <TouchableOpacity onPress={() => {
                    index === 1 ? updateGoalShake(isGoalShakeTips)
                                : updateFoulShake(isFoulShakeTips)
                }}>
                    <Image style={styles.itemTypeOneImage}
                           source={(index === 1 ? isGoalShakeTips : isFoulShakeTips)
                               ? choose_ok
                               : no_choose}
                    />
                </TouchableOpacity>
                <Text style={styles.itemTypeOneText}>震动</Text>
                <TouchableOpacity onPress={() => {
                    index === 1 ? updateGoalDialog(isGoalDialog)
                                : updateFoulDialog(isFoulDialog)
                }}>
                    <Image style={styles.itemTypeOneImage} source={(index === 1 ? isGoalDialog : isFoulDialog)
                                ? choose_ok
                                : no_choose}
                    />
                </TouchableOpacity>
                <Text style={styles.itemTypeOneTextR}>弹窗</Text>
            </View>
        );
    }
}
export default connectComponentAction(action, storeKey.SCORE_SETTING_TIPS)(ScoreSettingButton)

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
        height : 36,
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