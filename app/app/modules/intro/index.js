/**
 * Created by lichengke on 2017/8/28.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    TouchableOpacity,
    Platform,
    Dimensions,
    AsyncStorage,
    Image
} from 'react-native';
const { width, height } = Dimensions.get('window')

import Swiper from 'react-native-swiper';

const LOAD_STATUS = 'load_status';

const styles = {
    wrapper: {
        backgroundColor: 'white'
    },
    slide: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        position:'absolute',
        width:width,
        height:height,
        backgroundColor:'white'
    },
    imgBackground: {
        width,
        height,
        backgroundColor: 'transparent',
        position: 'absolute'
    },
    image: {
        width,
        height,
    },
    closeButton:{
        position:'absolute',
        bottom:60,
        left:width * 0.5 - 68.5,
        justifyContent:'center',
        alignItems:'center'
    }
}

export class IntroView extends Component {

    static defaultProps = {
        onClosed:()=>{}
    }

    closeAction(){
        const {onClosed} = this.props;
        IntroControl.setHasLoaded();
        onClosed();
    }

    datas=[
        {image:require('./images/0927_01.png'),key:1},
        {image:require('./images/0927_02.png'),key:2},
    ];

    renderContent(){
       return this.datas.map((obj,index,arr)=>{
            let source = obj.image;
            let isLast = index == arr.length - 1;
            // console.log('obj',obj);
                return (
                    <View style={styles.slide} key={index}>
                        <Image
                            style={styles.image}
                            source={source}
                            resizeMode='cover'
                        />
                        {
                            isLast
                            &&
                            <View style={styles.closeButton}>
                            <TouchableOpacity onPress={() => this.closeAction()}>
                                <Image style={{height:40,width:137}}
                                       source={require('./images/btn.png')}
                                       resizeMode='contain'/>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                );
        });
    }

    render () {
        return (
            <View style={styles.container}>
                <Swiper style={styles.wrapper}
                        dot={<View style={{backgroundColor: 'rgba(255,255,255,.3)', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7 }} />}
                        activeDot={<View style={{backgroundColor: '#fff', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7 }} />}
                        paginationStyle={{bottom: 30}}
                        loop={false}>
                    {this.renderContent()}
                </Swiper>
            </View>
        )
    }

}

export let IntroControl = {
    isFirstLoad(){
       return new Promise((resolve)=>{
           AsyncStorage.getItem(LOAD_STATUS).then(
               (data)=>{
                   console.log('isFirstLoad data',data);
                   resolve(data);
               }
           );
       });
    }
    ,
    setHasLoaded(){
        AsyncStorage.setItem(LOAD_STATUS,'exist');
    }
    ,
    reset(){
        AsyncStorage.removeItem(LOAD_STATUS);
    }
}