import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

const mapImg = require('../../../../images/icon_map.png');
const goImg = require('../../../../images/icon_jt.png');

export default class NearbyShopBar extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.barLeft}>
                    <Image style={styles.barLeftImage} source={mapImg}/>
                    <Text style={styles.barLeftContent}>附近网点</Text>
                </View>
                <View style={styles.barRight}>
                    <Text style={styles.barRightContent}>查看您周边的竞彩店</Text>
                    <Image style={styles.barRightImage} source={goImg}/>
                </View>
            </View> );
    }
}
const styles = StyleSheet.create({
    container :{
        justifyContent : 'space-between',
        backgroundColor : '#FFFFFF',
        height : 44,
        flexDirection : 'row',
        marginTop : 10,
        marginLeft : 12,
        marginRight : 12,
        marginBottom : 10,
        borderRadius : 4
    },
    barLeft:{
        justifyContent : 'flex-start',
        flexDirection : 'row'
    },
    barLeftImage:{
        height : 20,
        width : 20,
        marginTop : 12,
        marginLeft : 12,
        marginBottom : 12
    },
    barLeftContent:{
        marginLeft : 8,
        marginTop : 14,
        marginBottom : 14,
        fontSize : 14,
        fontFamily : 'PingFang-SC-Regular'
    },
    barRight:{
        alignContent : 'flex-end',
        flexDirection : 'row'
    },
    barRightContent:{
        marginTop : 15,
        marginBottom : 15,
        marginRight : 6,
        fontSize : 12,
        fontFamily : 'PingFang-SC-Regular'
    },
    barRightImage:{
        height : 14,
        width : 8,
        marginTop : 15,
        marginBottom : 15,
        marginLeft : 6,
        marginRight : 12
    }
});