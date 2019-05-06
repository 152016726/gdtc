/**
 * Created by marcus on 2018/11/14.
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
    FlatListl
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import btnBg from './images/btn.png';   
import btnOnPress from './images/btnOnPress.png';
import CommonInput from '../../components/commonInput';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import updatePwd from '../../services/getUserUpdatePassword';
import ActionProgressDialog from '../../components/actionProgressDialog';
import Account from '#/account'

const rowWidth = Dimensions.get('window').width-40;

class ResetPassword extends Component{
    static navigationOptions = ({navigation})=>{
        return {title: '修改密码'}
    };
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            curPwd: '',
            newPwd: '',
            checkPwd: '',
            isCurPwdTyping: false,
            isNewPwdTyping: false,
            isCheckPwdTyping: false,
            newPwdWarnState: false,
            isCurEncrypt: true,     // 当前密码是否加密
            isNewEncrypt: true,     // 新密码是否加密
            isEncrypt: true,        // 是否加密
            tipState: false,
            tipText:''
        };
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
    clearData(name, resolve){
        let obj = {};
        obj[name] = '';
        this.setState(obj,function () {
            resolve();
        });
    }

    /**
     * 提交数据
     */
    submitData(){
        const {curPwd, newPwd, newPwdWarnState, checkPwd} = this.state;
        const {navigation, updatePersonal} = this.props;
        if(curPwd === ''){
            this.setState({
                tipText: '当前登录密码不能为空',
                tipState: true
            })
        }else if(newPwd === '' || newPwdWarnState){
            this.setState({
                tipText: '新密码必须为6-20位数字或者字母,符号_和-组成',
                tipState: true
            })
        }else if(newPwd !== checkPwd){
            this.setState({
                tipText: '两次输入的密码不一致',
                tipState: true
            })
        }else{
            updatePwd.getData({
                oldPwd: curPwd,
                newPwd
            }).then(res => {
                Account.logout().then(rsp=>{
                    updatePersonal({
                        ...rsp
                    });
                    this.progressDialog.toast("修改密码成功!");
                    navigation.navigate('Login',{fromView: 'Personal'});
                });
            },rej => {
                this.setState({
                    tipText: rej.rspMsg,
                    tipState: true
                })
            });
        }
    }

    render(){
        const {
            curPwd,
            newPwd,
            isCurPwdTyping,
            isNewPwdTyping,
            checkPwd,
            isCheckPwdTyping,
            newPwdWarnState,
            tipText,
            tipState
        } = this.state;
        return(
            <View style={styles.container}>
                <CommonInput
                    isInputTyping={isCurPwdTyping}
                    input={curPwd}
                    placeholderText={'请输入当前登录密码'}
                    maxLength={20}
                    onFocus={()=>{this.toggleState({isCurPwdTyping},'focus')}}
                    onBlur={()=>{this.toggleState({isCurPwdTyping})}}
                    onChangeText={(curPwd)=>this.setState({curPwd})}
                    clearData={(resolve)=>{
                        this.clearData(this.props.clear.curPwd, resolve);
                    }}
                />
                <CommonInput
                    isInputTyping={isNewPwdTyping}
                    input={newPwd}
                    placeholderText={'请输入新密码'}
                    maxLength={20}
                    onFocus={()=>{this.toggleState({isNewPwdTyping},'focus')}}
                    onBlur={()=>{this.toggleState({isNewPwdTyping})}}
                    onChangeText={(newPwd)=>this.validateInput({
                                    data: newPwd,
                                    setting: {newPwd},
                                    exp: this.props.EXPLIST.pwd,
                                    stateName: 'newPwdWarnState'
                                   }
                             )}
                    inputWarnState={newPwdWarnState}
                    clearData={(resolve)=>{
                        this.clearData(this.props.clear.newPwd, resolve);
                    }}
                />
                <CommonInput
                    isInputTyping={isCheckPwdTyping}
                    input={checkPwd}
                    placeholderText={'再次输入新密码'}
                    maxLength={20}
                    onFocus={()=>{this.toggleState({isCheckPwdTyping},'focus')}}
                    onBlur={()=>{this.toggleState({isCheckPwdTyping})}}
                    onChangeText={(checkPwd)=>this.setState({checkPwd})}
                    clearData={(resolve)=>{
                        this.clearData(this.props.clear.checkPwd, resolve);
                    }}
                />
                <Text style={tipState ? styles.tipStyle : styles.hide}>{tipText}</Text>
                <TouchableOpacity onPress={()=>{this.submitData()}} style={styles.btn}>
                    <ImageBackground
                        source={curPwd && newPwd && checkPwd ? btnOnPress : btnBg}
                        style={styles.btnBg}
                        resizeMode="contain">
                        <Text style={styles.white}>确定</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}
                    />
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.RESET_PASSWORD_STORE, reducer, state, action)(ResetPassword);

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
    hide:{
        height:0
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
        color: CommonColor.BgColorWhite
    }
});