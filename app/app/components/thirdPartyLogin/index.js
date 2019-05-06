/**
 * Created by ljx on 2018/11/13.
 */
import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import icq from './images/icq.png';
import wechat from './images/wechat.png';
import blog from './images/blog.png';

const rowWidth = Dimensions.get('window').width-40;
export default class ThirdPartyLogin extends Component {
    static defaultProps = {
        id: ''
    };

    goToLink(){
        const {id} = this.props;
        console.log(id);
    }

    /**
     * 渲染第三方链接
     * @returns {Array}
     * {
     * imgSource: 图片
     * fn: 点击事件
     * }
     */
    renderIcons(){
        let linkArr = [
            {
                imgSource: icq,
                fn: ()=>{this.goToLink()}
            },
            {
                imgSource: wechat,
                fn: ()=>{this.goToLink()}
            },
            {
                imgSource: blog,
                fn: ()=>{this.goToLink()}
            }
        ];
        return linkArr.map(function (item,index) {
            return <TouchableOpacity key={index} style={styles.link} onPress={item.fn}>
                <Image
                    source={item.imgSource}
                    style={styles.icon}
                    resizeMode="contain"/>
            </TouchableOpacity>
        })
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.introduction}>
                    <View style={styles.line}></View>
                    <Text style={styles.textContent}>使用其他登录方式</Text>
                    <View style={styles.line}></View>
                </View>
                <View style={styles.thirdPart}>
                    {this.renderIcons()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: rowWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    introduction:{
        height:12,
        marginTop:24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    line:{
        flex: 1,
        height: 1,
        backgroundColor: CommonColor.CuttingLine
    },
    textContent:{
        flex:1,
        color:CommonColor.SelfCutLineTextColor,
        fontSize: CommonFont.FONT_12,
        marginHorizontal: 12
    },
    thirdPart:{
        height:44,
        marginTop:20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    link:{
        flex:1,
        marginHorizontal:22,
        height:44
    },
    icon:{
        flex:1,
        height:44
    }
});