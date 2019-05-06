/**
 * Created by marcus on 2018/11/13.
 */
import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput} from 'react-native';
import inputImg from './images/lock.png';
import inputing from './images/locking.png';
import deletePng from './images/delete.png';
import invisible from './images/invisible.png';
import visible from './images/visible.png';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';

const rowWidth = Dimensions.get('window').width-40;
let flag = true;

export default class CommonInput extends Component{
     static defaultProps = {
         inputImg,                   // type:string   描叙:左边未激活的小图标
         inputing,                   // type:string   描叙:左边激活状态的小图标
         isPwd: true,                // type:boolean  描叙: 是否为密码组件
         input: '',                  // type:string   描述:value值双向绑定 必填
         placeholderText: '输入密码',  // type:string   描述:placeholder
         maxLength: 20,              // type:number   描述:最大长度
         inputWarnState: false,      // type:boolean  描述:是否錯誤警告
         isInputTyping: false,       // type:boolean  描述:是否正在输入
         onFocus: function () {      // type:function 描述:焦点事件

         },
         onBlur: function () {       // type:function 描述:失焦事件

         },
         onChangeText: function (val) { // type:function 描述:onchange事件

         },
         clearData: function () {    // type:function 描述:重置Value事件

         }
     };

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isEncrypt: true            // type:boolean  描述:是否加密
        };
      }

    componentWillUnmount() {
        flag = true;
    }

    render(){
        const {inputImg, inputing, isPwd,input, placeholderText, maxLength, cls, isInputTyping, inputWarnState, onFocus, onBlur, onChangeText, clearData} = this.props;
        const {isEncrypt} = this.state;
        return(
            <View style={[styles.inputItem,cls]}>
                <View style={styles.inputContent}>
                    <Image
                        source={isInputTyping ? inputing : inputImg}
                        style={styles.icon}
                        resizeMode="contain"/>
                    <TextInput
                        ref={input => this.input = input}
                        style={[styles.input, inputWarnState ? styles.warn : '']}
                        placeholder={placeholderText}
                        secureTextEntry={isPwd && isEncrypt}
                        returnKeyType="done"
                        maxLength = {maxLength}
                        keyboardType="default"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChangeText={onChangeText}
                        value={input}>
                    </TextInput>
                    {!!input && clearData && isInputTyping && <TouchableOpacity
                        style={styles.deleteStyle}
                        onPress={() => {
                                flag && new Promise((resolve) => {
                                     flag = false;
                                     clearData(resolve);
                                     }).then(()=>{
                                     this.input.focus();
                                     flag = true;
                                 })
                            }
                        }>
                        <Image
                            source={deletePng}
                            style={styles.deleteIcon}
                            resizeMode="contain"/>
                    </TouchableOpacity>}
                    {isPwd && !!input && isInputTyping && <TouchableOpacity
                        style={styles.deleteStyle}
                        onPress={() => {
                                flag && new Promise((resolve) => {
                                         flag = false;
                                         this.setState({
                                            isEncrypt: !isEncrypt
                                         },()=>resolve())
                                     }).then(()=>{
                                         this.input.focus();
                                         flag = true;
                                     })
                            }}>
                        <Image
                            source={isEncrypt ? invisible : visible}
                            style={styles.deleteIcon}
                            resizeMode="contain"/>
                    </TouchableOpacity>}
                </View>
                <View style={[styles.line, isInputTyping ? styles.orangeBg : '']}></View>
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
    line: {
        height: 1,
        backgroundColor: CommonColor.SelfLine
    },
    icon: {
        flex: 5,
        height: 16
    },
    input: {
        paddingLeft: 13,
        fontSize:CommonFont.FONT_16,
        height: 24,
        flex: 77,
        paddingVertical: 0,
        color: CommonColor.SelfInput
    },
    deleteStyle:{
        flex:8,
        height:12,
        marginRight:14
    },
    deleteIcon:{
        flex:1,
        height:12
    },
    orangeBg: {
        backgroundColor: CommonColor.SelfOrange
    },
    warn:{
        color:'red'
    }
});