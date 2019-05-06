import React, {Component} from 'react';
import {
    TouchableOpacity,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';

export default class HeaderLeft extends Component {
    static defaultProps = {
        handleGoBack: ()=>{},   //返回事件
        img: null,              //图片地址
        text: null              //文字
    };

    render() {
        const {handleGoBack, img, text, cls} = this.props;
        return (

            <TouchableOpacity activeOpacity={1} style={[styles.container,cls]}
                              onPress={handleGoBack}>
                {img && <Image resizeMode="contain" style={styles.img}
                       source={img}/>}
                {text && <Text style={styles.txt}>{text}</Text>}
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
        width: 10,
        height: 19
    },
    txt: {
        fontSize: CommonFont.FONT_16,
        color: CommonColor.SelfWhite
    }
});
