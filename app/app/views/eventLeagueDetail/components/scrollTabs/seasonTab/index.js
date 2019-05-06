/**
 * Created by marcus on 2018/12/4.
 */
import React, {Component} from 'react';
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import * as CommonColor from '../../../../../constants/color';
import * as CommonFont from '../../../../../constants/fontSize';
import unchoose from './images/weigouxuan.png';
import choosed from './images/gouxuan.png';

const rowWidth = Dimensions.get('window').width-30;

export default class SeasonTab extends Component{

    render(){
        const {data, _onPress, defaultIndex} = this.props;
        const {item, index} = data;
        return(
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.textStyle}>{item.seasonName}</Text>
                    <TouchableOpacity style={styles.press} onPress={()=>_onPress(index)}>
                        <Image source={defaultIndex === index ? choosed : unchoose}
                               style={styles.icon}
                               resizeMode={'contain'}>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CommonColor.BgColorWhite
    },
    content:{
        flex: 1,
        width: rowWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textStyle:{
        fontSize: CommonFont.FONT_16,
        color: CommonColor.playIntroduceContent
    },
    press:{
        paddingHorizontal: 5
    },
    icon:{
        width: 18,
        height: 18
    }
});