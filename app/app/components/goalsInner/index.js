/**
 * Created by Roger(ljx) on 2018/9/6.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize'

export default class GoalsInner extends Component{

    render(){

        const {rate,text,isSelected} = this.props;

        return <View style = {styles.container}>
            <View style = {styles.goalsPadding}>
                <Text style = {isSelected?styles.selTxt:styles.goals}>{text}</Text>
            </View>
            <View style = {styles.ratePadding}>
                <Text style = {isSelected?styles.selTxt:styles.rate}>{rate}</Text>
            </View>
        </View>
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:"center",
        height:30,
        flexDirection: 'row'
    },
    goalsPadding:{
        paddingRight:4
    },
    ratePadding:{
        paddingLeft:4
    },
    goals:{
        color:"#282828",
        fontSize:CommonFont.FONT_14
    },
    selTxt:{
        color:'#ffffff',
        fontSize:CommonFont.FONT_14
    },
    rate:{
        color:CommonColor.teamRateGrey,
        fontSize:CommonFont.FONT_14

    }

});