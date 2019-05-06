/**
 * Created by mac-ddt on 2018/8/10.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native';
import {connectReducerComponent} from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../constants/storeKeys'

class Test extends Component{
    handleChangeTitle(){
        const {changeTitle} = this.props;
        changeTitle && changeTitle();
    }
    
    render(){
        const {title} = this.props;
        return <View>
            <Text>{title}</Text>
            <TouchableHighlight underlayColor="#e57474" style={{backgroundColor: 'red',height: 50,alignItems: 'center'}} onPress={this.handleChangeTitle.bind(this)}>
                <View style={{}}>
                    <Text style={{color: '#fff',textAlign: 'justify',lineHeight: 50}}>Touch Here Change Title</Text>
                </View>
            </TouchableHighlight>
        </View>    
    }
    
}
export default connectReducerComponent(storeKey.TEST_STORE, reducer, state, action)(Test)