/**
 * Created by oWEn on 2018/9/3.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import rightPng from '../images/right.png'
import * as colorConf from '../../../constants/color'

export default class FilterListButton extends Component {
    render() {
        let {onPress, checked, text} = this.props;
        return (
            <View style={styles.grid}>
                <TouchableOpacity
                    onPress={onPress}
                    style={[styles.gridInner, checked ? styles.gridInnerChecked : null]}>
                    <Text style={[styles.gridText, checked ? styles.gridTextChecked : null]}>{text}</Text>
                    {checked ? <Image style={styles.gridImage} source={rightPng}/> : null}
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    grid: {
        flex: 1,
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 3,
        paddingBottom: 3
    },
    gridInner: {
        borderWidth: 1,
        borderColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    gridInnerChecked: {
        borderColor: colorConf.MainColor
    },
    gridText: {
        color: '#999',
        fontSize: 15
    },
    gridTextChecked: {
        color: colorConf.MainColor
    },
    gridImage: {
        position: 'absolute',
        width: 20,
        height: 18,
        right: 0,
        bottom: 0
    }
});