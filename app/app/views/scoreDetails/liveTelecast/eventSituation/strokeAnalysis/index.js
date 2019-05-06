/**
 * 技术统计子模块
 * Created by DDT on 2018/10/17.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import LinePercent from '../components/linePercent';
import {BgColorWhite} from '../../../../../constants/color';
import dict from '@easylotto/dict';
import {
    CORNER_BALL,
    HALF_CORNER_BALL,
    YELLOW_CARD_ALL,
    RED_CARD_ALL,
    SHOTS,
    SHOT_ON_TARGET,
    ATTACK,
    DANGEROUS_ATTACK,
    FOULS,
    FREE_KICKS,
    POSSESSION,
    HALF_POSSESSION,
    OFFSIDE,
    PASSES,
    SHOT_SAVES,
    HEADER,
    TACKLES,
    THROW_IN,
    CROSSES,
    SHOT_WOOD_WORK,
    FIRST_KICK_OFF
} from '../../../../../constants/matchStatisticsType';

// 获取字典的key
const _typeDictKey = 'matchStatisticsType';
// 定义显示内容及顺序
const _arrLineType = [
    CORNER_BALL,
    HALF_CORNER_BALL,
    YELLOW_CARD_ALL,
    RED_CARD_ALL,
    SHOTS,
    SHOT_ON_TARGET,
    ATTACK,
    DANGEROUS_ATTACK,
    FOULS,
    FREE_KICKS,
    POSSESSION,
    HALF_POSSESSION,
    OFFSIDE,
    PASSES,
    SHOT_SAVES,
    HEADER,
    TACKLES,
    THROW_IN,
    CROSSES,
    SHOT_WOOD_WORK,
    FIRST_KICK_OFF
];

class StrokeAnalysis extends Component{
    static defaultProps = {
        homeData: {
        },
        awayData: {
        },
        firstKickOff: '-1'   // 首发球数据，1 为主队；2 为客队，-1未定
    };
    render() {
        let {homeData, awayData, firstKickOff} = this.props;
        return <View style={styles.container}>
            <View style={styles.analysisCon}>
                {
                    _arrLineType.map((type, i) => {
                        if(type === 'FIRST_KICK_OFF' && firstKickOff === -1){
                            return false;
                        }else{
                            return (homeData[type] || type === 'FIRST_KICK_OFF') && <LinePercent
                                key={`${type}_${i}`}
                                type={type}
                                title={dict.getDictText(_typeDictKey, type)}
                                left={homeData[type]}
                                right={awayData[type]}
                                directRight={type !== FIRST_KICK_OFF ? true : firstKickOff === '1'}
                            />
                        }
                    })
                }
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: BgColorWhite,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 10,
        paddingBottom: 20
    },
    homeCon: {
        paddingTop: 24,
        paddingRight: 10,
        flex: 4,
        flexDirection: 'row'
    },
    analysisCon: {
        flex: 1,
        paddingLeft: 50,
        paddingRight: 50
    },
    awayCon: {
        paddingTop: 24,
        paddingRight: 10,
        flex: 4,
        flexDirection: 'row-reverse'
    },
    verticalCol: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    flagStyle: {
        width: 12,
        height: 15,
        marginBottom: 21
    },
    cardStyle: {
        width: 13,
        height: 15,
        marginBottom: 21
    }
});

export default StrokeAnalysis;