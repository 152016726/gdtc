/**
 * 事件图片映射
 * Created by DDT on 2018/10/22.
 */
import {
    CORNER_BALL,
    DOUBLE_YELLOW_TO_RED,
    ENTER_THE_BALL,
    MISS_PENALTY_KICK,
    OOLONG_BALL,
    PENALTY_KICK,
    RED_CARD,
    SUBSTITUTION_OF_PLAYERS,
    YELLOW_CARD
} from "constants/matchEventType";

// 先定义样式
const styles = {
    flagStyle: {
        width: 18,
        height: 22
    },
    ballStyle: {
        width: 20,
        height: 20
    },
    cardStyle: {
        width: 18,
        height: 22
    },
    replaceStyle: {
        width: 26,
        height: 20
    }
};


// 定义事件类别与图片样式匹配关系
const _typeImageMap = {
    [CORNER_BALL]: {
        text: '角球',
        img: require('./images/flag.png'),
        style: styles.flagStyle
    },
    [ENTER_THE_BALL]: {
        text: '入球',
        img: require('./images/goal.png'),
        style: styles.ballStyle
    },
    [PENALTY_KICK]: {
        text: '点球',
        img: require('./images/penaltyKick.png'),
        style: styles.ballStyle
    },
    [MISS_PENALTY_KICK]: {
        text: '射失点球',
        img: require('./images/missPenalty.png'),
        style: styles.ballStyle
    },
    [OOLONG_BALL]: {
        text: '乌龙',
        img: require('./images/oolong.png'),
        style: styles.ballStyle
    },
    [DOUBLE_YELLOW_TO_RED]: {
        text: '两黄变红',
        img: require('./images/yellowToRed.png'),
        style: styles.cardStyle
    },
    [SUBSTITUTION_OF_PLAYERS]: {
        text: '换人',
        img: require('./images/replace.png'),
        style: styles.replaceStyle
    },
    [YELLOW_CARD]: {
        text: '黄牌',
        img: require('./images/yellow.png'),
        style: styles.cardStyle
    },
    [RED_CARD]: {
        text: '红牌',
        img: require('./images/red.png'),
        style: styles.cardStyle
    }
};

export default _typeImageMap;