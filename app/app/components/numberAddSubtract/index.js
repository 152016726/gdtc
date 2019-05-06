/**
 * 数字加减器，用于奖金优化页
 * Created by DDT on 2018/9/5.
 */
import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import {FONT_11, FONT_14} from '../../constants/fontSize';

class NumberAddSubtract extends Component {
    static defaultProps = {
        minValue: 0,            //最小值
        maxValue: 99999,          //最大值
        step: 1,                //步长，每次点击增加或减少
        value: '0',             //输入框数值
        isEven: false,          //是否必须偶数，若输入奇数则作出提示
        isLarge: false,         //是否使用大尺寸
        isDisabled: false,      //是否屏蔽，不能改变值
        onChangeText: ()=>{}    //改变值触发
    };

    /**
     * 改变数值时触发
     * @param text  改变的值
     */
    handleChangeText(text) {
        let regText = /^([0-9])+$/;
        let {onChangeText, isDisabled} = this.props;
        if(text === ''){
            onChangeText(text);
            return true;
        }else{
            if(regText.test(text) && !isDisabled){
                let num = +text;
                text = num + "";
                onChangeText(text);
                return true;
            }
            return false;
        }
    }

    /**
     * 加减按钮触发计算
     * @param isAdd 是否加，为false则为减
     */
    handleAddSubClick(isAdd) {
        let {value, step} = this.props;
        let num = +value;
        if(isAdd){
            num += step
        }else{
            num -= step;
        }
        this.handleChangeText(num + "");
    }

    render() {
        let {isLarge} = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.buttonStyle, styles.buttonLeft, isLarge && styles.largeButtonStyle]}
                    onPress={this.handleAddSubClick.bind(this, false)}>
                    <View style={[styles.acrossLogo, isLarge && styles.largeAcrossLogo]}/>
                </TouchableOpacity>
                <TextInput
                    underlineColorAndroid='transparent'
                    keyboardType="numeric"
                    style={[styles.inputStyle, isLarge && styles.largeInputStyle]}
                    value={this.props.value}
                    onChangeText={this.handleChangeText.bind(this)}
                />
                <TouchableOpacity
                    style={[styles.buttonStyle, styles.buttonRight, isLarge && styles.largeButtonStyle]}
                    onPress={this.handleAddSubClick.bind(this, true)}>
                    <View style={[styles.acrossLogo, isLarge && styles.largeAcrossLogo]}/>
                    <View style={[styles.verticalLogo, isLarge && styles.largeVerticalLogo]}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonStyle: {
        position: 'relative',
        backgroundColor: '#fafafa',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#d1d1d1'
    },
    largeButtonStyle: {
        width: 28,
        height: 28,
    },
    buttonLeft: {
        borderRightWidth: 0,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    buttonRight: {
        borderLeftWidth: 0,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    acrossLogo: {
        height: 12,
        width: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#d1d1d1'
    },
    largeAcrossLogo: {
        height: 13,
        width: 13,
    },
    verticalLogo: {
        position: 'absolute',
        left: 0,
        top: 6,
        width: 12,
        height: 11,
        borderRightWidth: 1,
        borderRightColor: '#d1d1d1'
    },
    largeVerticalLogo: {
        left: 0,
        top: 7,
        width: 14,
        height: 12
    },
    inputStyle: {
        paddingVertical: 0,
        width: 42,
        height: 24,
        borderWidth: 1,
        borderColor: '#d1d1d1',
        textAlign: 'center',
        color: '#333333',
        fontSize: FONT_11
    },
    largeInputStyle: {
        width: 60,
        height: 28,
        fontSize: FONT_14
    }
});

export default NumberAddSubtract;