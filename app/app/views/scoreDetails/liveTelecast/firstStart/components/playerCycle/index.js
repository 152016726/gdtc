import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity, Platform
} from 'react-native';
import * as CommonColor from '../../../../../../constants/color';
import * as FONT_SIZE from '../../../../../../constants/fontSize';

export default class PlayerCycle extends Component {
    static defaultProps = {
        shirtnumber: '',           //球衣号码
        playerCnShort: '',            //球员名字
        playerId: '',               //球员ID
        isHome: false                  //是否主队
    };

    render() {
        const {isHome, shirtnumber, playerCnShort} = this.props;
        // console.log(shirtnumber, playername);
        return (
            <View style={[styles.container]}>
                <TouchableOpacity activeOpacity={1} style={[styles.common, isHome ? {} : styles.awayBg]}>
                    <Text style={styles.txt}>{shirtnumber}</Text>
                </TouchableOpacity>
                <Text style={styles.name}>
                    {playerCnShort}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    common: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: CommonColor.BgColorWhite,
        backgroundColor: CommonColor.HOME_PLAYER_BG,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10
    },
    awayBg: {
        backgroundColor: CommonColor.AWAY_PLAYER_BG
    },
    txt: {
        textAlign: 'center',
        lineHeight: 18,
        color: CommonColor.BgColorWhite,
        fontSize: FONT_SIZE.FONT_12
    },
    name: {
        width: 50,
        height: 20,
        textAlign: 'center',
        lineHeight: 9,
        color: CommonColor.BgColorWhite,
        fontSize: FONT_SIZE.FONT_9
    }
});