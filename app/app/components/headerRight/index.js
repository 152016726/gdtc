import React, {Component} from 'react';
import {
    TouchableOpacity,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';

export default class MenuButton extends Component {
    static defaultProps = {
        onPress: () => {
        },    //点击事件
        img: null,            //图片地址
        type: '',               //类型
        text: null              //文字
    };

    handlePress(type) {
        const {onPress} = this.props;
        onPress && onPress(type)
    }

    render() {
        const {img, type, text, cls, imgCls, others} = this.props;
        return (
            <TouchableOpacity activeOpacity={1}
                              style={[styles.container, cls]}
                              onPress={this.handlePress.bind(this,type)}>
                {img && <Image resizeMode="contain" style={[styles.img,imgCls]}
                       source={img}/>}
                {text && <Text style={styles.txt}>{text}</Text>}
                {others}
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
        width: 24,
        height: 24,
        backgroundColor: 'transparent',
        justifyContent:'center',
        alignItems:'center'
    },
    img: {
        width: 24,
        height: 24
    },
    txt: {
        fontSize: CommonFont.FONT_16,
        color: CommonColor.SelfWhite
    }
});
