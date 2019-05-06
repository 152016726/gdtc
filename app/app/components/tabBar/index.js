/**
 * Created by marcus on 2018/11/15.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Dimensions
} from 'react-native';
import arrow from './images/rightArrow.png';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import _ from 'lodash';

const rowWidth = Dimensions.get('window').width-30;

export default class TabBar extends Component{

    constructor(props) {
        super(props);
        let {customStyles = {}} = this.props;
        this.styles = StyleSheet.create(_.merge({}, this.stylesObj, customStyles));
    }

    stylesObj = {
        container:{
            justifyContent:'center',
            alignItems: "center",
            backgroundColor: CommonColor.BgColorWhite
        },
        content:{
            height:43,
            width:rowWidth,
            flexDirection: 'row',
            justifyContent:'center',
            alignItems: "center"
        },
        line:{
            height: 1,
            backgroundColor: "#E6E6E6",
            width: rowWidth+15,
            marginLeft: 15
        },
        name:{
            flex:97,
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems: "center"
        },
        nameFont:{
            fontSize: CommonFont.FONT_16,
            color: CommonColor.playIntroduceContent
        },
        infoFont:{
            fontSize: CommonFont.FONT_13,
            color: '#808080'
        },
        iconImg:{
            marginRight:15,
            width:18,
            height:20
        },
        arrowTab:{
            flex:5,
            justifyContent:'center',
            alignItems: "center",
            paddingLeft:12
        },
        arrow:{
            height:10
        }
    };

    static defaultProps = {
        isShowLine: true,
        isShowArrow: true,
        customStyles: null     // 自定义样式对象
    };

    render(){
        const {
            img,                    // 图片
            text,                  // 左侧标题
            cls,                  // 给头部添加的样式
            goToTab,              // 点击事件
            addInfo,             // 右侧补充的信息
            isShowLine,         // 是否战地底线
            isShowArrow        // 是否展示箭头
        } = this.props;
        return(
            <TouchableOpacity
                style={[this.styles.container,cls]}
                onPress={goToTab}>
                 <View style={this.styles.content}>
                     {img && <Image source={img}
                           style={this.styles.iconImg}
                           resizeMode={'contain'}/>}
                     <View style={this.styles.name}>
                         <Text style={this.styles.nameFont}>{text}</Text>
                         {addInfo}
                     </View>
                     {isShowArrow && <View style={this.styles.arrowTab}>
                         <Image
                             source={arrow}
                             style={this.styles.arrow}
                             resizeMode={"contain"}/>
                     </View>}
                 </View>
                {isShowLine && <View style={this.styles.line}></View>}
            </TouchableOpacity>
        )
    }
}