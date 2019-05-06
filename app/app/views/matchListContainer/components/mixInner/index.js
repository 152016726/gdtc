/**
 * Created by Roger(ljx) on 2018/9/4.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import * as CommonColor from '~/constants/color';
import * as CommonFont from '~/constants/fontSize'

export default class MixInner extends Component{
    render(){

        const {rate,text,isSelected} = this.props;
        
        return <View style={[styles.container]}>
                <View style={styles.matchPadding}>
                    <Text style={isSelected?styles.selTxt:styles.match}>{text}</Text>
                </View>
                <View style={styles.ratePadding}>
                    <Text style={isSelected?styles.selTxt:styles.rate}>{rate}</Text>
                </View>

        </View>

    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        height:30,
        alignItems:'center',
        justifyContent:"center",
        flexDirection: 'row'
    },
    matchPadding:{
        paddingRight:5
    },
    ratePadding:{
        paddingLeft:5
    },
    match:{
       color:"#282828",
       fontSize: CommonFont.FONT_13
    },
    selTxt:{
        color:'#ffffff',
        fontSize: CommonFont.FONT_13
    },
    rate:{
        color:CommonColor.teamRateGrey,
        fontSize: CommonFont.FONT_13
    }

});
