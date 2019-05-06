/**
 * Created by marcus on 2019/1/2.
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import * as CommonColor from '~/constants/color';
import * as CommonFont from '~/constants/fontSize';

const rowWidth = Dimensions.get('window').width-40;

export default class ExpertItemHeader extends Component{

    render(){
        const {cls, titleLeft, titleRight, color} = this.props;
        return(
            <View style={[styles.title, cls]}>
                <View style={styles.titleContent}>
                    {titleLeft}
                    {titleRight}
                </View>
                <View style={[styles.line, color ? {backgroundColor: color} : null]}>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title:{
        height: 44,
        justifyContent:'center',
        alignItems: "center",
        position: 'relative'
    },
    titleContent:{
        width: rowWidth,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: "center"
    },
    line:{
        position: 'absolute',
        left: 0,
        top: 14,
        width: 4,
        height: 16,
        backgroundColor: '#DE1D30'
    }
});
