/**
 * Created by ycl on 16/7/13.
 */
import React, { Component } from 'react';
import {
    Animated,
    Easing
} from 'react-native';

export default class FadeInView extends Component {

    static defaultProps = {
        startRange:'90deg',// 开始转的角度
        endRange:'270deg', // 结束转的角度
        infinite:false,   //是否转动
        isShow:false
    };
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),
        };
    }
    componentDidMount() {
        //this.initStartAnimation();
        if(this.props.infinite){
            this.startInfinite();
        }
    }
    componentDidUpdate(prevProps) {
        //this.initStartAnimation(prevProps);
    }
    initStartAnimation(prevProps) {
        prevProps = prevProps || this.props;
        if(this.props.infinite && !prevProps.isShow && this.props.isShow){
            console.log('in init ', this.props.infinite, prevProps.isShow, this.props.isShow);
            this.startInfinite();
        }
    }
    startInfinite() {
        this.setState({
            fadeAnim: new Animated.Value(0)
        }, () => {
            this.startAnimation();
        })
    }
    startAnimation() {
        let {infinite, isShow} = this.props;
        //console.log(infinite, isShow, this.state.fadeAnim)
        Animated.timing(
            this.state.fadeAnim,
            {toValue: isShow ? 1:0,
                duration: 500,
                easing: Easing.linear
            }
        ).start(() => {
            if(infinite){
                this.startInfinite()
            }
        });

    }
    render() {
        let {infinite, isShow, startRange,endRange} = this.props;
        !infinite && this.startAnimation();
        this.anim = this.anim || new Animated.Value(0);
        return (
            <Animated.View style={{
                transform: [{rotate: this.state.fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    startRange, endRange
                  ],
                })}]
              }}>
                {this.props.children}
            </Animated.View>
        );
    }

}