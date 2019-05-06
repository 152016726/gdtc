import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    ImageBackground,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { MainColor, BgColorWhite} from '../../constants/color';
import Screen from'../../modules/screen';
const imgArr = {
    'filter':require('../../images/filter.png'),
    'setting':require('../../images/setting.png'),
    'match':require('../../views/exponent/images/match.png'),
    'company':require('../../views/exponent/images/company.png'),
    'my':require("../../views/Personal/images/message.png")
};
const s_w = Dimensions.get('window').width;

export default class TabNavigator extends Component {
    static defaultProps ={
        titie:'',
        rightOneImg:'',
        rightTwoImg:'',
        imgCls: '',
        latestMsgCount: '',
        rightOneEvent:()=>{},
        rightTwoEvent:()=>{}
    }

    render() {
        const { title, rightOneImg, rightOneEvent, rightTwoImg, rightTwoEvent ,latestMsgCount, imgCls} = this.props;
        return (
                <View style={styles.navigatorBox}>
                    <View style={styles.textBox}>
                        <Text style={styles.text}>{title}</Text>
                    </View>
                    <TouchableOpacity style={styles.rightOneImg} onPress={rightOneEvent}>
                        <Image style={styles.imgBox} source={imgArr[rightOneImg]}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rightOneImg} onPress={rightTwoEvent}>

                        {!!rightTwoImg && <ImageBackground
                            style={[styles.imgBox, !!imgCls ? imgCls : null]}
                            source={imgArr[rightTwoImg]}
                            resizeMode="cover"
                        >
                            {
                             !!latestMsgCount && <View style={styles.msgView}>
                                <Text style={styles.msg}>
                                    {+latestMsgCount > 99 ? '99+' : latestMsgCount}
                                </Text>
                            </View>
                             }
                        </ImageBackground>}

                    </TouchableOpacity>
                </View>
             );
    }
}
const styles = StyleSheet.create({
    navigatorBox:{
        alignContent:'center',
        justifyContent:'flex-end' ,
        flexDirection:'row',
        height:44,
        backgroundColor:MainColor },
    textBox:{
        width:s_w-120,
        height: 44,
        marginTop: 0 ,
        alignContent:'center',
        justifyContent:'center'},
    text:{
        height: 44,
        color:'white',
        textAlign:'center',
        fontSize:18,
        fontFamily:'PingFang-SC-Medium',
        ...Platform.select({
            ios: { lineHeight: 44},
            android: { marginTop:14 }
        })},
    rightOneImg:{
        alignContent:'center',
        justifyContent:'center',
        width:20,
        height:20,
        marginRight:10,
        marginBottom:12,
        marginTop:12},
    imgBox:{
        width:20,
        height:20
    },
    msgView:{
        width: 100,
        position: 'absolute',
        top: -12,
        left: 13
    },
    msg:{
        position: 'absolute',
        color: MainColor,
        fontSize: 10,
        paddingHorizontal: 1,
        backgroundColor: BgColorWhite
    }
});