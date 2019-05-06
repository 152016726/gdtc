/**
 * Created by mac-ddt on 2017/6/20.
 */

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Image
} from 'react-native';

export default class MenuButton extends Component{

    render(){
        const {onPress,img}=this.props;
        return(

            <TouchableOpacity style={{marginHorizontal:8,width:24,height:24,backgroundColor:'transparent'}} onPress={onPress}>
                <Image resizeMode="contain" style={{width:24,height:24,}} source={img||require('../../images/toplist.png')}/>
            </TouchableOpacity>
        )
    }
}