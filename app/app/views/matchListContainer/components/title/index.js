import {Component} from "react";
import React from "react";
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import * as CommonColor from "../../../../constants/color";
import {contentText} from "../../../../constants/color";

export default class Title extends Component {
    static defaultProps = {
        strDate: '',            //日期，焦点赛事直接转为文字形式
        count: 0,               //当前日期有多少场比赛
        isFocusEvent: false,   //是否为焦点赛事
        week: ''               //星期几
    };

    render() {
        const {strDate, count, isFocusEvent, week} = this.props;
        return (
            <View style={styles.header}>
                <View style={styles.line}/>
                {
                    !isFocusEvent && <View style={styles.txtCt}>
                        <Text style={styles.dateTxt}>{week}</Text>
                    </View>
                }
                <View style={styles.txtCt}>
                    <Text style={styles.dateTxt}>{strDate}</Text>
                </View>
                <View style={styles.txtCt}>
                    <Text style={styles.lastTxt}><Text style={styles.txtCount}>{count}</Text>场比赛可选</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: CommonColor.DateBarColor
    },
    line: {
        width: 10,
        height: 15,
        borderLeftWidth: 3,
        borderLeftColor: CommonColor.MainColor,
        marginLeft: 12
    },
    txtCt: {
        marginRight: 10
    },
    dateTxt: {
        color: contentText,
        fontSize: 13
    },
    lastTxt: {
        fontSize: 12,
        color: 'rgb(101,101,101)'
    },
    txtCount: {
        color: CommonColor.MainColor
    }
});