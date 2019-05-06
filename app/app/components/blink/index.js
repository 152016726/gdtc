import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import { FONT_12} from '../../constants/fontSize';
import { MainColor } from '../../constants/color';
export default class index extends Component {
    static defaultProps ={
        text : '',
        cls : {}
    };

    constructor(props){
        super(props);
        this.state = { showText : true };

        this.timer = setInterval(()=>{
            this.setState((previousState)=>{
                return { showText: !previousState.showText };
            });
        },1000);
    }

    render() {
        return (
            <Text style={[ this.props.cls ,this.state.showText && {color: "rgba(255, 255, 255, 0)"}, styles.textSty]}>{this.props.text}</Text>
        );
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearInterval(this.timer);
    }

}
const styles = StyleSheet.create({
    container : {
        fontFamily : 'PingFang-SC-Regular',
        fontSize : FONT_12,
        color : MainColor,
        textAlign:'auto',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute'
    },
    textSty: {
        width: 10,
        height: 10
    }
});