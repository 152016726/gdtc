/**
 * 事件图片映射
 * Created by DDT on 2018/10/22.
 */
import {
    DOUBLE_YELLOW_TO_RED,
    ENTER_THE_BALL,
    OOLONG_BALL,
    PENALTY_KICK,
    RED_CARD,
    YELLOW_CARD,
    MISS_PENALTY_KICK
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
        img: require('./images/penaltyShot.png'),
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