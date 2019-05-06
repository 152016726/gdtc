/**
 * Created by ljx on 2018/11/7.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    ImageBackground,
    Alert,
    TouchableOpacity,
    Platform
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import btnBg from './images/btn.png';
import btnOnPress from './images/btnOnPress.png';
import lock from '~/images/lock.png';
import locked from '~/images/locked.png';
import acount from '~/images/acount.png';
import acounting from '~/images/acounting.png';
import CodeInput from '../../components/codeInput';
import CommonInput from '../../components/commonInput';
import Headerleft from '../../components/headerLeft';
import ImgCode from '~/components/imgCode';
import ThirdPartyLogin from '../../components/thirdPartyLogin';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import userRegister from '../../services/getUserRegister';
import sendVerifyCode from '../../services/getSendVerifyCode';
import getCheckPhoneNumOccupy from '~/services/getCheckPhoneNumOccupy';
import ActionProgressDialog from '../../components/actionProgressDialog';
import timer from '@easylotto/timer';
import Account from '#/account';
// import DeviceInfo from 'react-native-device-info';

const rowWidth = Dimensions.get('window').width-40;

class Register extends Component{
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
            phoneNum: '',                // 手机号码
            imgCode: '',                 // 图形验证码
            code: '',                    // 验证码
            password: '',                // 密码
            tipText:'',                  // 提示语
            phoneState: false,           // 手机号码输入状态
            imgCodeState: false,         // 图形验证码输入状态
            codeState: false,            // 验证码输入状态
            passwordState: false,        // 密码输入状态
            tipState: false,             // 提示语状态
            phoneWarnState: false,       // 手机号码输入错误警告状态
            imgCodeWarnState: false,     // 图形验证码输入错误警告状态
            passwordWarnState: false,    // 密码输入错误警告状态
            accountFlag: true,           // 切换普通用户和站点用户登录
            switchFlag: false             // 切换图形验证码
        };
      }

    componentWillMount() {
        let self = this;
        const {navigation} = self.props;
        navigation.setParams({
            title: '注册',
            handleGoBack: ()=>{navigation.goBack()}
        });
    }
    
    /**
     * 路由跳转
     * @param rootName 路由
     */
    toNavigation(rootName){
        this.props.navigation.navigate(rootName);
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
     * 站点提示
     */
    showAlert(){
        Alert.alert("该功能暂未开放!");
    }

    /**
     * 清空指定值
     * @param name      state中的属性名
     * @param resolve   操作完成之后的callback
     */
    clearData(name, resolve){
        let obj = {};
        obj[name] = '';
        this.setState(obj, function () {
            resolve()
        });
    }

    /**
     * 发送验证码
     */
    sendCode(){
        const {phoneNum, imgCode, imgCodeWarnState, phoneWarnState, switchFlag} = this.state;
        const {changeState} = this.props;
        if(!phoneNum || phoneWarnState){
            this.setState({
                tipText: "手机号码格式不正确",
                tipState: true
            });
            return
        }else if(!imgCode || imgCodeWarnState){
            this.setState({
                tipText: "请输入正确形式的验证码",
                tipState: true
            });
            return
        }
        getCheckPhoneNumOccupy.getData({phone: phoneNum}).then(rsp=>{
            // 更新验证码
            this.setState({
                switchFlag: !switchFlag
            });
            if(rsp.data.isRegister === 'false'){
                sendVerifyCode.getData({
                    pin: imgCode,
                    phone: phoneNum
                }).then(res =>{
                    this.progressDialog.toast("验证码已发送");
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
                    tipText: '当前手机号已注册',
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
     * 提交
     */
    submitData(){
        const {phoneNum, code, password, phoneWarnState, passwordWarnState, switchFlag} = this.state;
        const {navigation, updatePersonal} = this.props;
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
        }else if(password === '' || passwordWarnState){
            this.setState({
                tipText: '密码格式不正确',
                tipState: true
            })
        }else{
            // 更新验证码
            this.setState({
                switchFlag: !switchFlag
            });
            userRegister.getData({
                phone: phoneNum,
                msgPin: code,
                source: Platform.OS,
                pwd: password
            }).then(res => {
                Account.login(phoneNum, password).then(rsp=> {
                    this.progressDialog.toast("恭喜您,注册成功!");
                    updatePersonal({
                        ...rsp
                    });
                    navigation.navigate('Personal');
                });
            }, rej => {
                this.setState({
                    tipText: rej.rspMsg,
                    tipState: true
                })
            });
        }
    }

    render() {
        const {accountFlag,
                phoneState,
                phoneWarnState,
                imgCode,
                imgCodeState,
                imgCodeWarnState,
                codeState,
                passwordState,
                passwordWarnState,
                phoneNum,
                code,
                password,
                tipState,
                tipText,
                switchFlag
            } = this.state;
        const {num, isCountdown} = this.props;
        return (
            <View style={styles.container}>
                {/*<View style={styles.account}>*/}
                    {/*<TouchableOpacity style={styles.accountFlex}>*/}
                        {/*<View style={styles.simpleAccount}>*/}
                            {/*<Text style={accountFlag ? styles.orange : styles.black}>*/}
                                {/*普通用户*/}
                            {/*</Text>*/}
                        {/*</View>*/}
                        {/*<View style={[styles.TopLine, accountFlag ? styles.orangeBg : '']}>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<TouchableOpacity*/}
                        {/*style={styles.accountFlex}*/}
                        {/*onPress={this.showAlert.bind(this)}>*/}
                        {/*<View style={styles.dotAccount}>*/}
                            {/*<Text style={accountFlag ? styles.black : styles.orange}>*/}
                                {/*投注站点*/}
                            {/*</Text>*/}
                        {/*</View>*/}
                        {/*<View style={[styles.TopLine, accountFlag ? '' : styles.orangeBg]}>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}
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
                    clearData={(resolve)=>this.clearData(this.props.clear.phone,resolve)}
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
                        isInputTyping={imgCodeState}
                        onFocus={()=>this.toggleState({imgCodeState},'focus')}
                        onBlur={()=>this.toggleState({imgCodeState})}
                        onChangeText={(imgCode)=>this.validateInput({
                                    data: imgCode,
                                    setting: {imgCode},
                                    exp: this.props.EXPLIST.imgCode,
                                    stateName: 'imgCodeWarnState'
                                   }
                             )}
                        inputWarnState={imgCodeWarnState}
                        clearData={(resolve)=>this.clearData(this.props.clear.imgCode,resolve)}
                    />
                    <ImgCode imgCodeTyping={imgCodeState} switchFlag={switchFlag}/>
                </View>
                <CodeInput
                    codeState={codeState}
                    onFocus={()=>this.toggleState({codeState},'focus')}
                    onBlur={()=>this.toggleState({codeState})}
                    onChangeText={(code)=>this.setState({code})}
                    sendCode={()=>{this.sendCode()}}
                    maxLength={6}
                    isCountdown={isCountdown}
                    num={num}
                    placeholderText={"验证码"}
                />
                <CommonInput
                    isInputTyping={passwordState}
                    input={password}
                    placeholderText={"密码长度6-20位"}
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
                    clearData={(resolve)=>this.clearData(this.props.clear.pwd,resolve)}
                />
                <View>
                    <Text style={tipState ? styles.tipStyle : {height:0}}>{tipText}</Text>
                </View>
                <TouchableOpacity onPress={()=>{this.submitData()}} style={styles.btn}>
                    <ImageBackground
                        source={phoneNum && code && password ? btnOnPress : btnBg}
                        style={styles.btnBg}
                        resizeMode="stretch">
                        <Text style={styles.white}>注册</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <View style={styles.notice}>
                    <Text style={[styles.dark, styles.sm]}>点击注册即表示接受广东竞猜的</Text>
                    <TouchableOpacity onPress={()=>{this.toNavigation('UserAgreement')}}>
                        <Text style={[styles.blue, styles.sm]}>用户协议</Text>
                    </TouchableOpacity>
                </View>
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}
                    cls={styles.dialogRadius}/>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.REGISTER_STORE, reducer, state, action)(Register);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CommonColor.BgColor,
        alignItems: "center"
    },
    account: {
        height:48,
        marginBottom: 10,
        flexDirection:'row'
    },
    accountFlex: {
        flex:1
    },
    simpleAccount: {
        marginVertical: 10,
        height: 28,
        borderColor: CommonColor.headerBorderColor,
        borderRightWidth: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    dotAccount: {
        marginVertical: 10,
        height: 28,
        justifyContent: 'center',
        alignItems: "center"
    },
    TopLine:{
        height: 2,
        backgroundColor: CommonColor.SelfLine
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
    notice: {
        width: rowWidth,
        flexDirection: 'row',
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: "center"
    },
    tipStyle:{
        width: rowWidth,
        paddingTop: 5,
        color:'red'
    },
    dark: {
        color: CommonColor.SelfDark
    },
    blue: {
        color: CommonColor.SelfBlue
    },
    white: {
        color: CommonColor.SelfWhite,
        fontSize: CommonFont.FONT_16
    },
    black: {
        color: CommonColor.flatColor
    },
    orange: {
        color: CommonColor.SelfOrange
    },
    orangeBg: {
        backgroundColor: CommonColor.SelfOrange
    },
    sm: {
        fontSize: CommonFont.FONT_14
    },
    dialogRadius:{
        borderRadius:5
    }
});