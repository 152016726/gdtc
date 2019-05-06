import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import * as FONT_SIZE from '../../../constants/fontSize'
import * as Color from '../../../constants/color'
import * as EventState from "../../../constants/eventState";
import dict from '@easylotto/dict';

let _arrWeekCn = [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六',
];

export default class ExponentTitle extends Component {
    static defaultProps = {
        data: {},                    //数据
    };

    /**
     * 获取时分
     */
    getHm(vsDate) {
        return <Text style={styles.hmText}>{Date.prototype.parseISO8601(vsDate).format('hh:mm')}</Text>;
    }

    /**
     * 获取周几和编号
     */
    renderTime(completeNo) {
        let betWeekCode = parseInt(completeNo.substr(completeNo.length - 4, 1), 10);    // 赛事所属周几
        let week = _arrWeekCn[betWeekCode];
        return <Text style={styles.timeText}>{week + completeNo.substr(-3)}</Text>;
    }

    /**
     * 获取VS或者比分（比分为红色）
     */
    getVsText() {
        let {data} = this.props;
        if (data.eventState === EventState.FULL_TIME) {
            return <Text style={[styles.text, styles.cr]}>{`${data.homeGoalsScored}-${data.awayGoalsScored}`}</Text>;
        }
        else {
            return <Text style={styles.text}>VS</Text>;
        }

    }

    render() {
        const {data} = this.props;
        return (
            <View style={styles.title}>
                <Text style={styles.text}>
                    {this.renderTime(data.completeNo)}
                </Text>
                <Text style={styles.text}>{data.leagueShortName}</Text>
                <Text style={styles.text}>
                    {this.getHm(data.vsDate)}
                </Text>
                <Text style={styles.text}>{data.homeShortName}</Text>
                {this.getVsText()}
                <Text style={styles.text}>{data.awayShortName}</Text>
                <View style={styles.imgWrapper} >
                    <Image style={styles.img} source={require('./images/rightArrow.png')} resizeMode='contain'/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        paddingHorizontal: 15,
        backgroundColor: '#f5c9b1'
    },
    text: {
        fontSize: 13,
        marginRight: 6
    },
    vs: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vsText: {
        color: '#666666',
        fontSize: 12
    },
    cr: {
        color: '#f46859'
    },
    imgWrapper: {
        flex: 1,
        height: '100%'
    },
    img: {
        position: 'absolute',
        width: 6,
        height: 10,
        top: 11,
        right: 0
    },
    mc: {
        color: Color.MainColor
    },
    textAlign: {
        alignItems: 'flex-end'
    }
});