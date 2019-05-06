/**
 * Created by ycl on 16/7/14.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
    Dimensions
} from 'react-native';

import {connectReducerComponent} from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../constants/storeKeys'
import service from '@easylotto/service';
import Screen from '../../modules/screen';

class LoadingView extends Component {
    componentWillMount() {
        service.setBeginCallback(this.props.loadingShow);
        service.setEndCallback(this.props.loadingHide);
    }

    render() {
        let {isShow} = this.props;
        return <View style={[styles.container, isShow && styles.showView]}>
            <View style={styles.innerView}>
                <Image style={styles.img} source={require('./images/loading.gif')} resizeMode='contain'/>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: -10000,
        elevation: 100
    },
    showView: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100000
    },
    innerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5,5,5,0.05)'
    },
    img:{
        width: 44,
        height: 67
    }
});


export default connectReducerComponent(storeKey.LOADING_STORE, reducer, state, action)(LoadingView)
