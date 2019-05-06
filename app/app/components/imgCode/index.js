/**
 * Created by marcus on 2019/3/13.
 */
import React, {Component} from 'react';
import {View,Text,Image, Dimensions, StyleSheet, TouchableOpacity,ImageBackground} from 'react-native';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import config from '../../config';

export default class ImgCode extends Component {
    static defaultProps = {
        imgCodeTyping: false,     // 输入状态
        switchFlag: false        // 切换图形验证码
    };

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            timeFlag: new Date().getTime()
        };
      }

    componentWillReceiveProps(nextProps) {
        if(nextProps.switchFlag !== this.props.switchFlag){
            this.imgCodeTouch()
        }
    }

    /**
     * 图形验证码点击
     */
    imgCodeTouch() {
        this.setState({
            timeFlag: new Date().getTime()
        })
    }

    render(){
        const {timeFlag} = this.state;
        const {imgCodeTyping} = this.props;
        return (
            <View style={styles.codeTouchView}>
                <TouchableOpacity onPress={()=>{this.imgCodeTouch()}} style={styles.codeImgTouch}>
                    <Image
                        source={{uri: config.host+'/getImgVerifyCode?timeFlag='+timeFlag}}
                        style={styles.codeImg}
                        resizeMode="stretch"
                    />
                </TouchableOpacity>
                <View style={[styles.line, imgCodeTyping ? styles.orangeBg : '']}>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    codeTouchView:{
        width: 90
    },
    codeImgTouch:{
        width: 90,
        height: 52,
        justifyContent: 'center',
        alignItems: "center"
    },
    codeImg:{
        width: 90,
        height: 36
    },
    line: {
        height: 1,
        backgroundColor: CommonColor.SelfLine
    },
    orangeBg: {
        backgroundColor: CommonColor.SelfOrange
    }
});