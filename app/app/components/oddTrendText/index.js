import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import * as colorConf from "../../constants/color";

export default class oddTrendText extends Component {
    static defaultProps = {
        text: '',            //显示的文字
        type: '',            //指数是上升，不变还是下降
        styleCustom: {},     //自定义样式
        styleCustomText: {}, //自定义样式(文字)
        flex: 1
    }

    getTypeStyle(type) {
        if (type === '1') {
            return styles.u;
        }
        else if (type === '-1') {
            return styles.d;
        }
        else if (type === 'g') {
            return styles.g;
        }
        else {
            return null;
        }
    }

    render() {
        let {text, type, flex, styleCustom, styleCustomText} = this.props;
        return (
            <View style={[styles.textWrapper, styleCustom, {flex: flex}]}>
                <Text numberOfLines={1}
                      ellipsizeMode='tail'
                      style={[styles.textCommon, this.getTypeStyle(type), styleCustomText]}>
                    {text}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textCommon: {
        textAlign: 'center',
        lineHeight: 30,
        fontSize: 12,
        color: '#333333'
    },
    u: {
        color: colorConf.upColor
    },
    d: {
        color: colorConf.downColor
    },
    g: {
        color: '#999999'
    }
});
