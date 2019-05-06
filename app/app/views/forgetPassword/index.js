/**
 * Created by marcus on 2018/11/13.
 */
import React, {Component} from 'react';
import {View,Text,Image, Dimensions, StyleSheet, TouchableOpacity,ImageBackground} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import btnBg from './images/btn.png';
import btnOnPress from './images/btnOnPress.png';
import success from './images/success.png';
import lock from '~/images/lock.png';
import locked from '~/images/locked.png';
import Headerleft from '../../components/headerLeft';
import CommonInput from '../../components/commonInput';
import CodeInput from '../../components/codeInput';
import ImgCode from '~/components/imgCode';
import acount from '~/images/acount.png';
import acounting from '~/images/acounting.png';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import forgetPwd from '../../services/getUserForgetPassword';
import sendVerifyCode from '../../services/getSendVerifyCode';
import checkVerifyCode from '../../services/getCheckVerifyCode';
import getCheckPhoneNumOccupy from '~/services/getCheckPhoneNumOccupy';
import ActionProgressDialog from '../../components/actionProgressDialog';
import timer from '@easylotto/timer';

const rowWidth = Dimensions.get('window').width-40;

class ForgetPassword extends Component{
    static navigationOptions = ({navigation})=>{
        const {handleGoBack = null,title} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        return {title, headerLeft}
    };
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            step: 1,                     // 当前处在第几步
            imgCode: '',                 // 图形验证码
            phoneNum: '',                // 手机号码
            code: '',                    // 验证码
            password: '',                // 密码
            passwordCheck: '',           // 密码确认
            tipText:'',                  // 提示语
            phoneState: false,           // 手机号码输入状态
            passwordState: false,        // 密码的输入状态
            passwordCheckState:false,    // 再次输入密码的输入状态
            imgCodeTyping: false,        // 是否正在输入验证码
            codeState: false,            // 验证码输入状态
            tipState: false,             // 提示语状态
            phoneWarnState: false,       // 手机号码输入错误警告状态
            passwordWarnState: false,    // 密码输入错误警告状态
            passwordCheckWarnState: false, // 再次输入密码错误警告状态
            imgCodeSrc: '',                // 图形验证码图片src
            switchFlag: false             // 切换图形验证码
        };
      }

    componentWillMount(){
        let self = this;
        const {navigation} = self.props;
        navigation.setParams({
            title: '忘记密码',
            handleGoBack: () => self.handleGoBack()
        });
    }

    componentWillUnmount(){
        const {navigation} = this.props;
        navigation.setParams({
            title: '忘记密码'
        });
        this.setState({
            step: 1
        })
    }

    /**
     * 左上角返回
     */
    handleGoBack(){
        const {step} = this.state;
        const {navigation} = this.props;
        // 第三步的时候直接退回第一页并重置数据
        if(step === 3){
            this.setState({
                title:'忘记密码',
                step: 1,
                code: '',
                password: '',
                passwordCheck: ''
            });
        }else if(step === 2){
            // 第二步的时候直接显示第一步时候的样子
            this.setState({
                step: 1
            })
        }else{
            navigation.goBack();
        }
    }

    /**
     * 输入框选中状态toggle
     * @param obj state配置项
     * @param tag 标识符(可填)
     */
    toggleState(obj,tag){
        for(let key in obj){
            obj[key] = !obj[key];
        }
        // 如果tag标记为focus则每次输入将错误提示框隐藏
        tag === 'focus' && (obj["tipState"] = false);
        this.setState(obj);
    }

    /**
     * 输入验证
     * @param obj
     * {
     *  data: 被筛选的输入内容
     *  setting: 设置入state的内容
     *  exp: 正则
     *  stateName: 控制input输入状态的名字
     * }
     */
    validateInput(obj){
        let settings = {};
        if(!(obj.exp.test(obj.data))){
            settings[obj.stateName] = true;
            this.setState(Object.assign(settings, obj.setting));
        }else{
            settings[obj.stateName] = false;
            this.setState(Object.assign(settings, obj.setting));
        }
    }

    /**
     * 清空指定值
     * @param str state属性名
     */
    clearData(name,resolve){
        let obj = {};
        obj[name] = '';
        this.setState(obj,function () {
            resolve();
        });
    }

    /**
     * 发送验证码
     */
    sendCode(){
        const {phoneNum, imgCode, phoneWarnState, switchFlag} = this.state;
        const {changeState} = this.props;
        if(!phoneNum || phoneWarnState){
            this.setState({
                tipText: "手机号码格式不正确",
                tipState: true
            });
            return
        }else if(imgCode === ''){
            this.setState({
                tipText: '图形验证码不能为空',
                tipState: true
            });
            return
        }
        getCheckPhoneNumOccupy.getData({phone: phoneNum}).then(rsp=>{
            // 更新验证码
            this.setState({
                switchFlag: !switchFlag
            });
            if(rsp.data.isRegister === 'true'){
                sendVerifyCode.getData({
                    pin: imgCode,
                    phone: phoneNum
                }).then(res =>{
                    this.progressDialog.toast('验证码已发送');
                    changeState({
                        isCountdown: true
                    });
                    timer.setTimer(
                        Object.assign(
                            {},
                            this.props.timerOps,
                            {callback: (duration) => this.setCountdown(duration)}
                        )
                    );
                },rej => {
                    this.setState({
                        tipText: rej.rspMsg,
                        tipState: true
                    })
                });
            }else{
                this.setState({
                    tipText: '当前手机号未注册',
                    tipState: true
                })
            }

        }, rej=>{
            this.setState({
                switchFlag: !switchFlag,
                tipText: rej.rspMsg,
                tipState: true
            })
        });
    }

    /**
     * 设立倒计时该做的判断与结果
     * @param duration
     */
    setCountdown(duration){
        const {changeState} = this.props;
        if(duration > 0){
            changeState({num: duration})
        }else{
            // 重置倒计时长
            changeState({
                num: 59,
                isCountdown: false
            });
            timer.clearTimer(this.props.timerOps.key);
        }
    }
    
    /**
     * 下一步
     */
    nextStep(){
        const {phoneNum, code, phoneWarnState, step, password, passwordWarnState, passwordCheck, switchFlag} = this.state;
        const {navigation} = this.props;
        if(step === 1){
            if(phoneNum === '' || phoneWarnState){
                this.setState({
                    tipText: '手机号码格式不正确',
                    tipState: true
                })
            }else if(code === ''){
                this.setState({
                    tipText: '验证码不能为空',
                    tipState: true
                })
            }else{
                // 更新验证码
                this.setState({
                    switchFlag: !switchFlag
                });
                checkVerifyCode.getData({
                    "msgPin": code,
                    "phone": phoneNum
                }).then(rsp=>{
                    navigation.setParams({
                        title: '重置密码'
                    });
                    this.setState({
                        step: 2
                    })
                },rej=> {
                    this.setState({
                        tipText : rej.rspMsg,
                        tipState : true
                    });
                });
            }
        }else if(step === 2){
            if(password === '' || passwordWarnState){
                this.setState({
                    tipText: '密码格式不正确',
                    tipState: true
                })
            }else if(passwordCheck !== password){
                this.setState({
                    tipText: '两次输入密码不一致',
                    tipState: true
                })
            }else{
                forgetPwd.getData({
                    phone: phoneNum,
                    newPwd: password
                }).then(rsp => {
                    navigation.setParams({
                        title: '重置成功'
                    });
                    this.setState({
                        step: 3
                    });
                },rej => {
                    this.setState({
                        tipText: rej.rspMsg,
                        tipState: true
                    });
                });

            }
        }
    }

    /**
     * 立即返回
     */
    checkBack(){
        this.props.navigation.navigate('Login',{fromView: 'forgetPassword'});
    }

    /**
     * 第一步:输入手机号获取验证码
     * @returns {XML}
     */
    renderStepOne(){
        const {phoneNum, phoneState, phoneWarnState, codeState, code, imgCode, imgCodeTyping, switchFlag} = this.state;
        const {num, isCountdown} = this.props;
        return(
            <View>
                <CommonInput
                    isPwd={false}
                    input={phoneNum}
                    inputImg={acount}
                    inputing={acounting}
                    placeholderText={"请输入手机号"}
                    maxLength={11}
                    isInputTyping={phoneState}
                    onFocus={()=>this.toggleState({phoneState},'focus')}
                    onBlur={()=>this.toggleState({phoneState})}
                    onChangeText={(phoneNum)=>this.validateInput({
                                            data: phoneNum,
                                            setting: {phoneNum},
                                            exp: this.props.EXPLIST.phone,
                                            stateName: 'phoneWarnState'
                                           }
                                     )}
                    inputWarnState={phoneWarnState}
                    clearData={(resolve)=>this.clearData(this.props.clear.phone, resolve)}
                />
                <View style={{width: rowWidth, flexDirection: 'row'}}>
                    <CommonInput
                        isPwd={false}
                        input={imgCode}
                        inputImg={lock}
                        inputing={locked}
                        placeholderText={"请输入图形验证码"}
                        maxLength={4}
                        cls={{width: rowWidth-90}}
                        isInputTyping={imgCodeTyping}
                        onFocus={()=>this.toggleState({imgCodeTyping},'focus')}
                        onBlur={()=>this.toggleState({imgCodeTyping})}
                        onChangeText={(imgCode)=>this.setState({imgCode})}
                        clearData={(resolve)=>this.clearData(this.props.clear.imgCode,resolve)}
                    />
                    <ImgCode imgCodeTyping={imgCodeTyping} switchFlag={switchFlag}/>
                </View>
                <CodeInput
                    code={code}
                    codeState={codeState}
                    onFocus={()=>this.toggleState({codeState},'focus')}
                    onBlur={()=>this.toggleState({codeState})}
                    onChangeText={(code)=>this.setState({code})}
                    sendCode={()=>{this.sendCode()}}
                    isCountdown={isCountdown}
                    num={num}
                    maxLength={6}
                    placeholderText={"验证码"}
                />
            </View>
        )
    }

    /**
     * 第二步设置密码
     * @returns {XML}
     */
    renderStepTwo(){
        const {
            passwordState,
            password,
            passwordWarnState,
            passwordCheckState,
            passwordCheck,
            passwordCheckWarnState
        } = this.state;
        return (
            <View>
                <CommonInput
                    isInputTyping={passwordState}
                    input={password}
                    placeholderText={"新密码,密码长度6-20位"}
                    maxLength={20}
                    onFocus={()=>{this.toggleState({passwordState},'focus')}}
                    onBlur={()=>{this.toggleState({passwordState})}}
                    onChangeText={(password)=>this.validateInput({
                                    data: password,
                                    setting: {password},
                                    exp: this.props.EXPLIST.pwd,
                                    stateName: 'passwordWarnState'
                                   }
                             )}
                    inputWarnState={passwordWarnState}
                    clearData={(resolve)=>{
                                this.clearData(this.props.clear.pwd, resolve);
                            }}
                />
                <CommonInput
                    isInputTyping={passwordCheckState}
                    input={passwordCheck}
                    placeholderText={"再次输入新密码"}
                    maxLength={20}
                    onFocus={()=>{this.toggleState({passwordCheckState},'focus')}}
                    onBlur={()=>{this.toggleState({passwordCheckState})}}
                    onChangeText={(passwordCheck)=>this.validateInput({
                                    data: passwordCheck,
                                    setting: {passwordCheck},
                                    exp: this.props.EXPLIST.pwd,
                                    stateName: 'passwordCheckWarnState'
                                   }
                             )}
                    inputWarnState={passwordCheckWarnState}
                    clearData={(resolve)=>{
                                this.clearData(this.props.clear.pwdCheck, resolve);
                            }}
                />
            </View>
        )
    }

    /**
     * 第三步:展示重置成功页面
     * @returns {XML}
     */
    renderStepThree(){
        return (
            <View>
                <View style={styles.successStyle}>
                    <ImageBackground
                        source={success}
                        style={styles.successIcon}
                        resizeMode="contain">
                    </ImageBackground>
                    <Text style={[styles.md,styles.black]}>恭喜,重置登录密码成功!</Text>
                </View>
                <TouchableOpacity style={styles.back} onPress={()=>this.checkBack()}>
                    <Text style={[styles.orange,styles.md]}>重新登录</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render(){
        const {
            phoneNum,
            code,
            tipText,
            password,
            passwordCheck,
            tipState,
            step,
        } = this.state;
        return(
            <View style={styles.container}>
                { step === 1 && this.renderStepOne() }
                { step === 2 && this.renderStepTwo() }
                { step === 3 && this.renderStepThree() }
                <Text style={tipState ? styles.tipStyle : {height:0}}>{tipText}</Text>
                {step !== 3 && <TouchableOpacity onPress={this.nextStep.bind(this)} style={styles.btn}>
                    <ImageBackground
                        source={
                        (step === 1 && phoneNum && code) || (step === 2 && passwordCheck && password) ? btnOnPress : btnBg}
                        style={styles.btnBg}
                        resizeMode="contain">
                        <Text style={styles.white}>下一步</Text>
                    </ImageBackground>
                </TouchableOpacity>}
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}/>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.FORGET_PASSWORD_STORE, reducer, state, action)(ForgetPassword);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CommonColor.BgColor,
        alignItems: "center"
    },
    tipStyle:{
        width: rowWidth,
        paddingTop: 5,
        color:'red'
    },
    btn:{
        paddingTop:24
    },
    btnBg: {
        width: rowWidth,
        height: 44,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: 'transparent'
    },
    white: {
        color: CommonColor.SelfWhite
    },
    successStyle: {
        width:Dimensions.get('window').width,
        height: 250,
        backgroundColor:CommonColor.BgColorWhite,
        justifyContent: 'center',
        alignItems: "center"
    },
    successIcon: {
        width: 70,
        height: 70,
        marginBottom: 14
    },
    back: {
        flex: 1,
        paddingTop: 32,
        alignItems: "center",
        backgroundColor: CommonColor.BgColor
    },
    black: {
        color: CommonColor.SelfSuccessTextColor
    },
    orange: {
        color: CommonColor.SelfOrange
    },
    md: {
        fontSize: CommonFont.FONT_14
    }
});