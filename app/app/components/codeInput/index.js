/**
 * Created by marcus on 2018/11/13.
 */
import React, {Component} from 'react';
import {View, Text, Image, Dimensions, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import validate from './images/validate.png';
import validating from './images/validating.png';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';

const rowWidth = Dimensions.get('window').width-40;
export default class CodeInput extends Component{
    static defaultProps = {
        codeState: false,
        placeholderText: '验证码',
        maxLength: 6
    };
    render(){
        const {
            code,            // type:string   描述:双向绑定value
            codeState,      // type:boolean   描述:是否正在输入
            onFocus,        // type:function  描述:焦点事件
            onBlur,         // type:function  描述:失焦事件
            onChangeText,   // type:function  描述:onchange事件
            sendCode,       // type:function  描述:发送验证码
            maxLength,      // type:number    描述:可输入长度
            placeholderText,// type:string    描述:placeholder
            isCountdown,    // type:boolean   描叙:是否倒计时
            num,            // type:string    描叙:倒计时
        } = this.props;
        return(
            <View style={styles.inputItem}>
                <View style={styles.inputContent}>
                    <Image
                        source={codeState ? validating : validate}
                        style={styles.icon}
                        resizeMode="contain"/>
                    <TextInput
                        style={[styles.input,styles.codePadding]}
                        placeholder={placeholderText}
                        keyboardType="default"
                        returnKeyType="done"
                        maxLength={maxLength}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChangeText={onChangeText}
                        value={code}>
                    </TextInput>
                    {
                        !isCountdown && <TouchableOpacity
                            style={styles.codeContent}
                            onPress={sendCode}>
                            <Text style={[styles.black, styles.sm]}>
                                获取验证码
                            </Text>
                        </TouchableOpacity>
                    }
                    {
                        isCountdown && <View style={styles.codeContent}>
                            <Text style={[styles.black, styles.sm]}>
                                {num}
                            </Text>
                        </View>
                    }
                </View>
                <View style={[styles.line, codeState ? styles.orangeBg : '']}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputItem: {
        height: 53,
        width: rowWidth
    },
    inputContent: {
        flexDirection: 'row',
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: "center"
    },
    codePadding:{
        paddingLeft:17
    },
    line: {
        height: 1,
        backgroundColor: CommonColor.SelfLine
    },
    icon: {
        flex: 4,
        height: 16
    },
    input: {
        paddingVertical: 0,
        paddingLeft: 13,
        fontSize:CommonFont.FONT_15,
        height: 24,
        flex: 76,
        color: CommonColor.SelfInput
    },
    codeContent: {
        flex: 20,
        height: 24,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: CommonColor.flatColor,
        justifyContent: 'center',
        alignItems: "center"
    },
    black: {
        color: CommonColor.flatColor
    },
    sm: {
        fontSize: CommonFont.FONT_12
    },
    orangeBg: {
        backgroundColor: CommonColor.SelfOrange
    }
});