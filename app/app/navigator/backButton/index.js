/**
 * Created by mac-ddt on 2017/6/9.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

export default class BackButton extends Component {
    render() {
        const {navigation} = this.props;
        return (

            <TouchableOpacity style={{marginHorizontal: 8, width: 24, height: 24, backgroundColor: 'transparent'}}
                              onPress={() => navigation.goBack()}>
                <Image resizeMode="contain" style={{width: 24, height: 24,}}
                       source={require('../../images/reback.png')}/>
            </TouchableOpacity>
        )
    }
}