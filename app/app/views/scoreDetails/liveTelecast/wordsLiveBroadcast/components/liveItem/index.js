import React, {Component} from 'react';
import {
    Text,
    Image,
    View,
    StyleSheet,
    Dimensions
} from 'react-native';
import * as CommonColor from '../../../../../../constants/color';
import * as FONT_SIZE from '../../../../../../constants/fontSize';

export default class LiveItem extends Component {
    static defaultProps = {
        anchor: '',      //直播员
        time: '',        //时间
        text: '',        //文字内容
        isLast: false    //是否最后一句
    };

    render() {
        const {time, text, isLast} = this.props;
        // console.log(isLast);
        let url = isLast ? require('./images/greyArrow.png') : require('./images/arrow.png');
        return (<View style={styles.container}>
            <View style={styles.leftSide}>
                <Text style={[styles.txt, styles.bold]}>直播员</Text>
                {
                    time!=='' && <Text style={styles.txt}>{time ? Math.ceil(time / 60) : ''}'</Text>
                }
            </View>
            <View style={[styles.rightSide, isLast ? styles.isLast : {}]}>
                <Text style={styles.txt}>{text}</Text>
                <Image style={styles.img} source={url} resizeMode='contain'/>
            </View>
        </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10
    },
    leftSide: {
        flex: 2,
        flexDirection: 'column',
        paddingTop: 5
    },
    rightSide: {
        flex: 8,
        position: 'relative',
        backgroundColor: CommonColor.BgColorWhite,
        paddingVertical: 14,
        paddingRight: 24,
        paddingLeft: 15,
        borderRadius: 5,
        shadowColor: '#E0E0E0',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowRadius: 3,
        shadowOpacity: 0.5
    },
    img: {
        width: 15,
        height: 13,
        position: 'absolute',
        top: 10,
        left: -14
    },
    txt: {
        fontSize: FONT_SIZE.FONT_14,
        color: CommonColor.playIntroduceContent,
        marginBottom: 5
    },
    isLast: {
        backgroundColor: '#E0E0E0'
    },
    bold: {
        fontWeight: 'bold'
    }
});