/**
 * 赛事时间轴模块
 * Created by DDT on 2018/10/19.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import EventTimeLine from '../components/eventTimeLine';
import {
    CORNER_BALL,
    ENTER_THE_BALL,
    PENALTY_KICK,
    MISS_PENALTY_KICK,
    OOLONG_BALL,
    DOUBLE_YELLOW_TO_RED,
    SUBSTITUTION_OF_PLAYERS,
    YELLOW_CARD,
    RED_CARD,
    FULL_TIME_END
} from '../../../../../constants/matchEventType';
import {BgColorWhite} from "../../../../../constants/color";

class EventTimeBar extends Component{
    static defaultProps = {
        events: [
            { type: CORNER_BALL, time: '9\'', person1: '孔戈洛' },
            { type: SUBSTITUTION_OF_PLAYERS, isHome: false, time: '24\'', person1: '摩西', person2: '佩德罗' },
            { type: ENTER_THE_BALL, isHome: false, time: '25\'', person1: '佩德罗', remark: '(0-1)' },
            { type: YELLOW_CARD, isHome: false, time: '28\'', person1: '路易斯' },
            { type: MISS_PENALTY_KICK, time: '43\'', person1: '孔戈洛', remark: '(0-1)' },
            { type: RED_CARD, time: '58\'', person1: '路达' },
            { type: PENALTY_KICK, isHome: false, time: '80\'', person1: '马里博尔', remark: '(0-2)' },
            { type: OOLONG_BALL, isHome: false, time: '90\'', person1: '马里博尔', remark: '(0-2)' },
            { type: FULL_TIME_END }
        ]
    };

    render() {
        let {events} = this.props;
        return <View style={styles.container}>
            {
                events.map((evt, i) => <EventTimeLine
                    key={i}
                    {...evt}
                    isShowLine={ events.length - 1 !== i }
                />)
            }
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column-reverse',
        alignItems: 'center',
        backgroundColor: BgColorWhite,
        paddingTop: 20,
        paddingBottom: 20
    }
});

export default EventTimeBar;