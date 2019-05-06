/**
 * 优化按钮组件
 * Created by DDT on 2018/9/5.
 */
import React,{Component} from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as commonColor from '../../../constants/color';
import {FONT_15} from "../../../constants/fontSize";

class BtnOptimize extends Component {
    static defaultProps = {
        isActive: false,    //是否被选上
        text: '',           //按钮显示文字
        isLeft: false,      //是否处于左边
        isRight: false,     //是否处于右边
        onPress: ()=>{}     //点击触发
    };

    render() {
        let {isActive, isLeft, isRight} = this.props;
        let arrStyle = [styles.container];
        if(isLeft){
            arrStyle.push(styles.leftBtn);
        }else if(isRight){
            arrStyle.push(styles.rightBtn);
        }

        return (
            <TouchableOpacity style={arrStyle} onPress={this.props.onPress}>
                <Text style={isActive ? styles.activeColor : styles.normalColor}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 36,
        width: 86,
        backgroundColor: commonColor.BgColorWhite,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: commonColor.BorderColor
    },
    leftBtn: {
        borderRightWidth: 0,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    rightBtn: {
        borderLeftWidth: 0,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    normalColor: {
        color: '#333333',
        fontSize: FONT_15
    },
    activeColor: {
        color: commonColor.MainColor,
        fontSize: FONT_15
    }
});

export default BtnOptimize;