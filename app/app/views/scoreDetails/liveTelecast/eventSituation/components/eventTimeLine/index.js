/**
 * 比赛事件时间轴事件组件
 * Created by DDT on 2018/10/19.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import {
    SUBSTITUTION_OF_PLAYERS,
    FULL_TIME_END
} from '../../../../../../constants/matchEventType';
import _typeImageMap from '../../typeImageMap';

class EventTimeLine extends Component{
    static defaultProps = {
        time: '',           // 触发时间
        isHome: true,       // 是否主队事件
        type: '-1',         // 事件类型
        person1: '',        // 事件发生主人
        person2: '',        // 事件发生对象
        remark: '',         // 可能的备注内容
        isShowLine: true    // 是否显示线，false 则只会显示圆圈时间以及事件内容
    };

    render() {
        let {time, isHome, type, person1, person2, remark, isShowLine} = this.props;
        let detailStyle = [styles.eventDetail].concat(isHome ? styles.homeDetail : styles.awayDetail);

        return <View style={styles.container}>
            {
                (isShowLine && type !== FULL_TIME_END) && <View style={styles.lineStyle}/>
            }
            <View style={styles.eventContainer}>
                <View style={styles.cycleTime}>
                    <Text style={styles.timeText}>{type === FULL_TIME_END ? '完' : time}</Text>
                </View>
                {
                    _typeImageMap[type] && (() => {
                        let obj = _typeImageMap[type];
                        // 换人事件使用特别现实方式
                        if(type === SUBSTITUTION_OF_PLAYERS){
                            return <View style={detailStyle.concat([{alignItems: 'flex-start'}])}>
                                <View style={[styles.paddingText, isHome && {alignItems: 'flex-end'}]}>
                                    <Text style={styles.personFrom}>{person1}</Text>
                                    <Text style={styles.personTo}>{person2}</Text>
                                </View>
                                <Image source={obj.img} style={obj.style}/>
                            </View>
                        }else{
                            return <View style={detailStyle}>
                                <View style={[styles.paddingText, isHome ? styles.homeRowText : styles.awayRowText]}>
                                    <Text>{person1}</Text>
                                    <Text style={styles.remarkText}>{remark}</Text>
                                </View>
                                <Image source={obj.img} style={obj.style}/>
                            </View>
                        }
                    })()
                }
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    lineStyle: {
        height: 30,
        width: 2,
        backgroundColor: '#E5E5E5'
    },
    eventContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    cycleTime: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height:30,
        backgroundColor: '#E5E5E5',
        borderColor: '#E5E5E5',
        borderStyle: 'solid',
        borderRadius: 15
    },
    timeText: {
        color: '#333333'
    },
    eventDetail: {
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    homeDetail: {
        flexDirection: 'row',
        right: 45,
        top: 5
    },
    awayDetail: {
        flexDirection: 'row-reverse',
        left: 45,
        top: 5
    },
    personText: {
        color: '#333333'
    },
    personFrom: {
        color: '#7DB839'
    },
    personTo: {
        color: '#E3696C',
        lineHeight: 20
    },
    paddingText: {
        paddingLeft: 8,
        paddingRight: 8
    },
    homeRowText: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    },
    awayRowText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    remarkText: {
        paddingLeft: 8,
        paddingRight: 8
    }
});

export default EventTimeLine;