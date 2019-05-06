/**
 * 统计线，显示双方数据比例
 * Created by DDT on 2018/10/17.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import {FIRST_KICK_OFF} from '../../../../../../constants/matchStatisticsType';


class LinePercent extends Component{
    static defaultProps = {
        type: '',           // 时间轴类型
        title: '',          // 轴标题
        left: '0',          // 左数据
        right: '0',         // 右数据
        directRight: true   // 方向参数，为true为正向，false为反向
    };

    render() {
        let {left, right, title, type, directRight} = this.props;
        let percent = 0;
        let isFirst = type === FIRST_KICK_OFF;
        left = +left;
        right = +right;
        if(+left !== 0 || +right !== 0){
            percent = left/(left + right) * 100;
        }
        if(+left === 0 && +right === 0){
            percent = 50
        }
        // 首发球固定50%
        if(isFirst){
            percent = 50;
        }

        return <View style={styles.container}>
            <View style={styles.titleCon}>
                <Text style={styles.titleText}>{title}</Text>
            </View>
            <View style={styles.lineCon}>
                <View style={styles.lineLeft}>
                    {
                        !isFirst && <Text>{left}</Text>
                    }
                    {
                        isFirst && directRight && <Image style={styles.kickOffStyle} source={require('../../images/kickOff.png')}/>
                    }
                </View>
                <View style={[styles.lineOuter, !directRight && {alignItems: 'flex-end'}]}>
                    <View style={[styles.lineInner, {width: percent + '%'}]}/>
                </View>
                <View style={styles.lineRight}>
                    {
                        !isFirst && <Text>{right}</Text>
                    }
                    {
                        isFirst && !directRight && <Image style={styles.kickOffStyle} source={require('../../images/kickOffRight.png')}/>
                    }
                </View>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    titleCon: {
        height: 22
    },
    titleText: {
        textAlign: 'center',
        lineHeight: 22
    },
    lineCon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    lineLeft: {
        flex: 2,
        alignItems: 'center'
    },
    lineOuter: {
        flex: 8,
        height: 6,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: '#E5E5E5'
    },
    lineRight: {
        flex: 2,
        alignItems: 'center'
    },
    lineInner: {
        height: 4,
        borderWidth: 1,
        borderRadius: 3,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderColor: '#EB812B',
        backgroundColor: '#EB812B'
    },
    kickOffStyle: {
        width: 30,
        height: 18
    }
});

export default LinePercent;