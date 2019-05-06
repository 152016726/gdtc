import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import * as colorConf from "../../../constants/color";

export default class allPlaysItemButton extends Component {
    render() {
        let {text, rate, isSelected} = this.props;
        return <View style={styles.buttonInner}>
            <Text style={[styles.buttonInnerText, isSelected ? styles.colorWhite : null]}>{text}</Text>
            <Text style={[styles.buttonInnerOdds, isSelected ? styles.colorWhite : null]}>{rate}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    buttonInner: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRightWidth: 1,
        borderColor: colorConf.SpiltLineColor
    },
    buttonInnerText: {
        fontSize: 12,
        color: '#333333'
    },
    buttonInnerOdds: {
        fontSize: 10,
        color: '#999999'
    },
    colorWhite: {
        color: '#ffffff'
    }
})