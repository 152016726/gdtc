/**
 * 提示弹窗
 */

import React,{Component} from "react";
import PropTypes from 'prop-types';
import {StyleSheet,Text,LayoutAnimation, Modal,Animated, View,TouchableOpacity,ActivityIndicator,Dimensions,} from "react-native";
const TOAST_DURATION = 1500;
const CONTENT_TOP = 56;
const CONTENT_HEIGHT = 50;
const WINDOW_HEIGHT = Dimensions.get('window')['height'];
const STATUS_IDLE = 0;      //闲置隐藏状态
const STATUS_LOADING = 1;   //正在加载状态
const STATUS_ERROR = 2;     //显示错误状态,该状态下控件可响应点击事件

const GRAVITY_TOP = 0;      //显示在顶部
const GRAVITY_CENTER = 1;   //显示居中
const GRAVITY_BOTTOM = 2;     //显示在底部


export default class ActionProgressDialog extends Component{

    static REF = 'ActionProgressDialog';
    static propTypes = {
        status:PropTypes.oneOf([
            STATUS_IDLE,
            STATUS_LOADING,
            STATUS_ERROR,]),
        label:PropTypes.string,
        clickable:PropTypes.bool,
        onClick:PropTypes.func,
        onDismiss:PropTypes.func,
        gravity:PropTypes.oneOf([
            GRAVITY_TOP,
            GRAVITY_CENTER,
            GRAVITY_BOTTOM
        ]),
        offsetY:PropTypes.number, //y轴位移
    }
    static defaultProps = {
        gravity:GRAVITY_BOTTOM,
        offsetY:0,
        clickable:false,
    };

    constructor(props) {
        super(props);
        this.state = {
            anim:new Animated.Value(0),
            status:STATUS_IDLE,
            label:'正在加载',
        };

    }

    render() {

        let {clickable,offsetY,gravity,cls} = this.props;
        let {status,label,anim} = this.state;

        let marginTop = CONTENT_TOP;
        switch (gravity){
            case GRAVITY_CENTER:
                marginTop = (WINDOW_HEIGHT - CONTENT_HEIGHT)*0.5;
                break;
            case GRAVITY_BOTTOM:
                marginTop = WINDOW_HEIGHT - CONTENT_HEIGHT - CONTENT_TOP;
                break;
            case GRAVITY_TOP:
            default:
                marginTop = CONTENT_TOP;
                break;
        }

        marginTop += offsetY;

        let style = [styles.content,{
            marginTop,
            backgroundColor:anim.interpolate({
                inputRange:[0,1],
                outputRange:['rgba(0,0,0,0.6)','rgba(0,0,0,0.4)'],
            }),
        },cls];
        return (
            <Modal
                animationType = "fade"
                transparent = {true}
                onRequestClose = {()=>false}
                visible = {status !== STATUS_IDLE}>
                <View style = {styles.container}>
                    <TouchableOpacity
                        disabled = {!clickable}
                        style = {style}
                        onPress={this._onClick.bind(this)}>
                        {status === STATUS_LOADING &&
                        <ActivityIndicator size = "small" color="white" style = {{marginRight:8}}/>
                        }
                        <Text style={styles.message}>{label}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }


    _toggleStatusAnimated(fromStatus,toStatus){
        if(fromStatus === STATUS_IDLE){
            this.state.anim.setValue(toStatus === STATUS_ERROR?1:0);
        }

        if(toStatus === STATUS_ERROR){
            Animated.timing(this.state.anim,{
                toValue:1,
                duration:450,
            }).start();
        }else if(toStatus === STATUS_LOADING){
            Animated.timing(this.state.anim,{
                toValue:0,
                duration:450,
            }).start();
        }
    }

    _onClick(){
        if(typeof this.props.onClick === 'function'){
            this.props.onClick();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.status !== this.state.status);
    }

    _handlerStatusSwitch(status,label){
        if(status !== this.state.status || label !== this.state.label){
            this.setState({status,label});

            if(status === STATUS_ERROR || status === STATUS_LOADING){
                this._toggleStatusAnimated(this.props.status,status);
            }
        }
    }

    /**
     * 显示加载对话框
     * @param status ActionProgressDialog.STATUS_*
     * @param label 显示的文字
     */
    show(label = '正在加载'){
        this._handlerStatusSwitch(STATUS_LOADING,label);
    }

    hide(){
        this.setState({
            status:STATUS_IDLE,
            label:''
        });
    }

    toast(message,onDismissCallback,duration){
        this._toggleStatusAnimated(this.state.status,STATUS_ERROR);
        this.setState({
            status:STATUS_ERROR,
            label:message
        });
        this.timer = setTimeout(()=>{
            this.setState({
                status:STATUS_IDLE,
                label:''
            },onDismissCallback);
        },duration||TOAST_DURATION);
    }

    clearTimeout(){
        if(this.timer){
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    componentWillUnmount() {
        this.clearTimeout();
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
    },
    content:{
        flexDirection:'row',
        backgroundColor:'blue',
        borderRadius:CONTENT_HEIGHT/2,
        height:CONTENT_HEIGHT,
        paddingHorizontal:16,
        minWidth:88,
        marginTop:CONTENT_TOP,
        alignItems:'center',
        shadowColor:'rgba(0,0,0,0.54)',
        shadowOffset:{x:1,y:2},
        shadowRadius:2,
        shadowOpacity:1,
    },
    toastContent:{
        backgroundColor:'red',
    },
    message:{
        fontSize:14,
        color:'white',
    }
});