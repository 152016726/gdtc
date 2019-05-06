/**
 * Created by mac-ddt on 2017/8/30.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Animated,
    TouchableOpacity,
    View,
    Platform,
    Text,
    Dimensions
} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class TipWindow extends Component {
    state = {
        isShow:false,
        text:null,
        fadeAnim: new Animated.Value(1)
    };
    componentWillMount(){
        this.initStyle();
    }

    initStyle(){
        styles = StyleSheet.create({
            container: {
                position:'absolute',
                left:(width-200)/2,
                width:200,
                backgroundColor:'rgb(158,158,158)',
                padding:20,
                borderRadius:5,
                opacity:1
            },
            content:{
                color:'rgb(255,255,255)',
                lineHeight:18,
                textAlign:'center',
                fontSize: 16
            }
        });
    }

    shouldComponentUpdate(nextProps,nextState) {
        if(nextState.isShow != this.state.isShow && nextState.isShow){
            this.startAnimation();
        }
        return true;
    }

    endAnimation(){
        this.setState({isShow:false});
        this.setState({
            fadeAnim: new Animated.Value(1)
        }) ;
    }

    startAnimation() {
        Animated.timing(
            this.state.fadeAnim,
            {toValue: 0, duration: 2000}
        ).start(() => this.endAnimation());
    }

    showTips(text){
        // this.state.isShow&&this.setState({fadeAnim: new Animated.Value(0)});
        // this.setState({isShow:true,text:text});
        // this.startAnimation();
        this.setState({isShow:true,text:text});
    }

    render() {
        let {isShow,text} = this.state;

        return  <Animated.View style={[styles.container,{top:isShow?height*0.3:-10000000,
                opacity:this.state.fadeAnim.interpolate({inputRange: [0, 1],outputRange: [0, 1]})
              }]}>
            <View>
                <Text style={styles.content}>
                    {text}
                </Text>
            </View>
        </Animated.View>


    }
}

let styles;