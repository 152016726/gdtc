/**
 * Created by ljx on 2018/11/7.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    LayoutAnimation,
    Platform
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import logo from './images/logo.png';
import btnBg from './images/btn.png';
import lock from '~/images/lock.png';
import locked from '~/images/locked.png';
import acount from '~/images/acount.png';
import acounting from '~/images/acounting.png';
import btnOnPress from './images/btnOnPress.png';
import Headerleft from '../../components/headerLeft';
import ImgCode from '~/components/imgCode';
import CommonInput from '../../components/commonInput';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import Account from '#/account'
import config from '../../config'
import DataManager from '../../dataManager/commonDataManager';
import CookieManager from 'react-native-cookies';

const COOKIE_DATA = 'cookie_data';
const rowWidth = Dimensions.get('window').width - 40;

class Login extends Component {
    static navigationOptions = ({navigation}) => {
        const {handleGoBack = null, title} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        return {title, headerLeft}
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isOverCount: false,                             // 是否超过5次
            imgCode: '',                                    // 图形验证码
            isTyping: false,                                // 是否正在输入
            isAccountTyping: false,                         // 是否正在输入用户名
            isPasswordTyping: false,                        // 是否正在输入密码
            imgCodeTyping: false,                           // 是否正在输入验证码
            account: config['debug'] ? '18588746752' : '',  // 账号
            password: config['debug'] ? '123456' : '',      // 密码
            tipText: '',                                    // 错误提示语
            tipState: false                                 // 错误提示语的状态
        };
    }

    componentWillMount() {
        let self = this;
        const {navigation} = self.props;
        navigation.setParams({
            title: '登录',
            handleGoBack: () => {
                if (!!navigation.state.params) {
                    navigation.navigate('Personal');
                } else {
                    navigation.goBack();
                }
            }
        });
    }

    /**
     * 路由跳转
     * @param rootName 路由
     * @param obj      路由传参
     */
    toNavigation(rootName, obj) {
        this.props.navigation.navigate(rootName, obj);
    }

    /**
     * 切换输入框的选中装填
     * @param obj state配置项
     * @param tag 标记位(可选)
     */
    toggleState(obj, tag) {
        const {isTyping} = this.state;
        !isTyping && LayoutAnimation.configureNext(LayoutAnimation.create(this.props.times,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.opacity
        ));
        for (let key in obj) {
            obj[key] = !obj[key];
        }
        tag === 'focus' && setObjStatus();
        this.setState(obj);

        /**
         * 获取焦点时,隐蔽头部和错误提示
         */
        function setObjStatus() {
            obj["tipState"] = false;   // 隐藏错误提示
            obj["isTyping"] = true;    // 隐藏登录的头部
        }
    }

    /**
     * 清空指定值
     * @param name      state中的属性名
     * @param resolve   操作完成之后的callback
     */
    clearData(name, resolve) {
        let obj = {};
        obj[name] = '';
        this.setState(obj, function () {
            resolve()
        });
    }

    /**
     * 提交数据
     */
    submitData() {
        const {password, account, imgCode, isOverCount} = this.state;
        const {navigation, updatePersonal, updateEHData, updateExpertZone} = this.props;
        if (account === '') {
            this.setState({
                tipText: '用户名或者手机号不能为空',
                tipState: true
            })
        } else if (password === '') {
            this.setState({
                tipText: '密码不能为空',
                tipState: true
            })
        } else {

            Account.login(account, password, isOverCount ? imgCode : null).then(rsp => {
                //判断iOS 接着获取cookie 保存到缓存
                if(Platform.OS === 'ios'){
                    CookieManager.getAll()
                        .then((res) => {
                            // console.log('CookieManager.getAll =>', res);
                            DataManager.clearAll(COOKIE_DATA);
                            DataManager.put(COOKIE_DATA,Object.assign(res.JSESSIONID));
                        });
                }
                this.props.isLoginState();
                updatePersonal({
                    ...rsp
                });

                // 外部链接跳转进来的如果带了参数的登录操作完成之后跳至带参路由页面
                if (navigation.state.params && navigation.state.params.fromView) {
                    navigation.navigate(navigation.state.params.fromView);
                } else {
                    navigation.goBack();
                }
                // 更新专家预测页面
                updateEHData({
                    isReceiveProps: true
                });
                // 更新专家个人中心页面
                updateExpertZone({
                    personId: rsp.id
                })
            }, rej => {
                if(rej.rspCode === 'overcount'){
                   this.setState({
                       isOverCount: true
                   })
                }
                this.setState({
                    tipText: rej.rspMsg,
                    tipState: true
                });
            });
        }
    }

    render() {
        const {
            isTyping,
            isAccountTyping,
            isPasswordTyping,
            password,
            account,
            tipText,
            tipState,
            imgCodeTyping,
            imgCode,
            isOverCount
        } = this.state;
        return (
            <View style={styles.container}>
                <Image source={logo} resizeMode={'contain'} style={[styles.logo, isTyping ? styles.hide : '']}/>
                <CommonInput
                    isPwd={false}
                    input={account}
                    inputImg={acount}
                    inputing={acounting}
                    placeholderText={"请输入手机号或用户名或投注站编号"}
                    maxLength={11}
                    isInputTyping={isAccountTyping}
                    onFocus={() => {
                        this.toggleState({isAccountTyping}, 'focus')
                    }}
                    onBlur={() => {
                        this.toggleState({isAccountTyping})
                    }}
                    onChangeText={(account) => this.setState({account})}
                    clearData={(resolve) => this.clearData(this.props.clear.ac, resolve)}
                />
                <CommonInput
                    isInputTyping={isPasswordTyping}
                    input={password}
                    placeholderText={'输入密码'}
                    maxLength={20}
                    onFocus={() => {
                        this.toggleState({isPasswordTyping}, 'focus')
                    }}
                    onBlur={() => {
                        this.toggleState({isPasswordTyping})
                    }}
                    onChangeText={(password) => this.setState({password})}
                    clearData={(resolve) => this.clearData(this.props.clear.pwd, resolve)}
                />
                {isOverCount && <View style={{width: rowWidth, flexDirection: 'row'}}>
                    <CommonInput
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
                    <ImgCode imgCodeTyping={imgCodeTyping}/>
                </View>}
                <Text style={tipState ? styles.tipStyle : styles.hide}>{tipText}</Text>
                <TouchableOpacity onPress={() => {
                    this.submitData()
                }} style={styles.btn}>
                    <ImageBackground
                        source={account && password ? btnOnPress : btnBg}
                        style={styles.btnBg}
                        resizeMode="stretch">
                        <Text style={styles.white}>登录</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <View style={styles.labelText}>
                    <TouchableOpacity onPress={() => {
                        this.toNavigation(this.props.tab.fPWD)
                    }}>
                        <Text style={styles.forget}>忘记密码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.toNavigation(this.props.tab.reg)
                    }}>
                        <Text style={styles.register}>新用户注册</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.notice}>
                    <Text style={[styles.dark, styles.sm]}>登录即代表您已同意我们的</Text>
                    <TouchableOpacity onPress={() => {
                        this.toNavigation(this.props.tab.doc)
                    }}>
                        <Text style={[styles.blue, styles.sm]}>用户协议</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.LOGIN_STORE, reducer, state, action)(Login);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CommonColor.BgColor,
        alignItems: "center"
    },
    logo: {
        marginTop: 24,
        marginBottom: 11,
        width: 86,
        height: 95
    },
    title: {
        color: CommonColor.SelfTitle,
        paddingTop: 12,
        paddingBottom: 11,
        fontSize: CommonFont.FONT_14
    },
    notice: {
        width: rowWidth,
        flexDirection: 'row',
        position: "absolute",
        bottom: 20,
        justifyContent: 'center',
        alignItems: "center"
    },
    labelText: {
        width: rowWidth,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    forget: {
        paddingVertical: 18,
        fontSize: CommonFont.FONT_15,
        color: CommonColor.SelfOrange,
        textAlign: 'left'
    },
    register: {
        paddingVertical: 18,
        fontSize: CommonFont.FONT_15,
        color: CommonColor.SelfOrange,
        textAlign: 'right'
    },
    btn: {
        paddingTop: 24
    },
    btnBg: {
        width: rowWidth,
        height: 44,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: 'transparent'
    },
    tipStyle: {
        width: rowWidth,
        fontSize: CommonFont.FONT_14,
        paddingTop: 5,
        color: 'red'
    },
    hide: {
        height: 0,
        marginTop: 0,
        paddingTop: 0,
        paddingBottom: 0
    },
    dark: {
        color: CommonColor.SelfDark
    },
    blue: {
        color: CommonColor.SelfBlue
    },
    white: {
        color: CommonColor.BgColorWhite,
        fontSize: CommonFont.FONT_16
    },
    sm: {
        fontSize: CommonFont.FONT_14
    }
});