import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import * as CommonColor from '~/constants/color'
import * as CommonFont from '~/constants/fontSize'

export default class WDWInner extends Component {
    static defaultProps = {
        text: '',             //主客队名
        rate: '',             //赔率
        name: '',             //主胜等文字
        num: '',              // ？？
        isSelected: false     //是否选中状态
    };

    render() {
        const {text = '', rate = '', name = '', num = '', homeRank = '19', courtRank = '14', isSelected} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.boxRow}>
                    {num === 0 &&
                    <Text style={[styles.rankHome, isSelected && styles.selTxt]}>{ homeRank ? '[' + homeRank + ']' : ''}</Text>
                    }
                    <Text style={[styles.home, isSelected ? styles.selTxt : '']}>{text}</Text>
                    { num === 2 &&
                    <Text style={[styles.rankCourt, isSelected && styles.selTxt]}>{ courtRank ? '[' + courtRank + ']' : ''} </Text>}
                </View>
                <View style={[styles.boxRow, styles.results]}>
                    <Text style={[styles.txtLeft, isSelected ? styles.selTxt : '']}>{name}</Text>
                    <Text style={[styles.txtRight, isSelected ? styles.selTxt : '']}>{rate}</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    boxRow: {
        flexDirection: 'row'
    },
    selTxt: {
        color: '#ffffff'
    },
    results: {
        justifyContent: 'center'
    },
    rankHome: {
        color: CommonColor.teamRateGrey,
        fontSize: CommonFont.FONT_13,
        lineHeight: 24,
        paddingRight: 4
    },
    home: {
        color: CommonColor.contentText,
        fontSize: CommonFont.FONT_15,
        lineHeight: 24
    },
    rankCourt: {
        color: CommonColor.teamRateGrey,
        fontSize: CommonFont.FONT_12,
        lineHeight: 24,
        paddingLeft: 4
    },
    txtLeft: {
        color: CommonColor.contentText,
        fontSize: CommonFont.FONT_12,
        lineHeight: 20
    },
    txtRight: {
        color: CommonColor.teamRateGrey,
        fontSize: CommonFont.FONT_12,
        marginLeft: 8,
        lineHeight: 20
    }
});
