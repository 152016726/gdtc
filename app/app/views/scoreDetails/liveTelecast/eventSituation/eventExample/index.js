/**
 * 事件图片示例模块
 * Created by DDT on 2018/10/22.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import {
    CORNER_BALL,
    DOUBLE_YELLOW_TO_RED,
    ENTER_THE_BALL,
    MISS_PENALTY_KICK,
    OOLONG_BALL,
    PENALTY_KICK,
    SUBSTITUTION_OF_PLAYERS
} from "../../../../../constants/matchEventType";
import _typeImageMap from '../typeImageMap';
import {BgColorWhite} from "../../../../../constants/color";
import {FONT_10,FONT_12} from "../../../../../constants/fontSize";

// 定义底部显示内容及顺序
const _showType = [
    ENTER_THE_BALL,
    PENALTY_KICK,
    MISS_PENALTY_KICK,
    OOLONG_BALL,
    DOUBLE_YELLOW_TO_RED,
    SUBSTITUTION_OF_PLAYERS,
    CORNER_BALL
];

class EventExample extends Component{
    render() {
        return <View style={styles.container}>
            {
                _showType.map((item, i) => {
                    let objMap = _typeImageMap[item];
                    return <View key={i} style={styles.eventContainer}>
                        <Image source={objMap.img} style={objMap.style}/>
                        <Text style={styles.eventTextStyle}>{objMap.text}</Text>
                    </View>
                })
            }
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColorWhite,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight:2
    },
    // -- ljx 2018.11.09
    eventTextStyle: {
        fontSize:FONT_12
    }
});

export default EventExample;