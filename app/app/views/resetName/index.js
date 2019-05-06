/**
 * Created by marcus on 2018/11/17.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import Headerleft from '../../components/headerLeft';
import HeaderRight from '../../components/headerRight';
import mySelf from "./images/myIcon_no_select.png";
import deletePng from "./images/delete.png";
import Account from '#/account';
import updateInfo from "../../services/getUserUpdateInfo";
import ActionProgressDialog from '../../components/actionProgressDialog';

class ResetName extends Component{

    static navigationOptions = ({navigation}) => {
        const {handleClick = null, handleGoBack = null} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} text={"取消"} cls={{width: 40}}/>;
        let headerRight = <HeaderRight onPress={handleClick} text={"完成"} cls={{width: 40}}/>;
        return {title: "修改昵称", headerLeft,headerRight}
    };

    componentWillMount(){
        const {navigation, setNickname} = this.props;
        if(navigation.state.params){
            setNickname(navigation.state.params.nickname)
        }
        navigation.setParams({
            handleGoBack: ()=>{this.goBack()},
            handleClick:()=>{
                this.updateData()
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (Platform.OS === 'ios') {
            if (this.props.nickname !== nextProps.nickname) {
                return false;
            }
        }
        return true;
    };

    /**
     * 更新个人数据
     */
    updateData(){
        const {nickname, resetNickname} = this.props;
        updateInfo.getData({nickname}).then(rsp=>{
            resetNickname();
            Account.updateAccountInfo({nickname});
            this.goBack()
        }, rej=>{
            console.log(rej,'更新昵称失败');
            this.progressDialog.toast(rej.rspMsg);
        });
    }

    /**
     * 返回上一级
     */
    goBack() {
        this.props.navigation.goBack();
    }

    /**
     * nickname 变化
     * @param val
     */
    onChangeText(val){
        const {setNickname} = this.props;
        setNickname(val)
    }

    /**
     * 清空nickname值
     */
    deleteVal(){
        const {setNickname} = this.props;
        setNickname("")
    }


    render(){
        const {nickname} = this.props;
        return (
            <View style={styles.inputContent}>
                <Image
                    source={mySelf}
                    style={styles.icon}
                    resizeMode="contain"/>
                <TextInput
                    style={styles.input}
                    underlineColorAndroid = {'transparent'}
                    keyboardType="default"
                    autoFocus={true}
                    maxLength={5}
                    onChangeText={(val)=> this.onChangeText(val)}
                    value={nickname}>
                </TextInput>
                <TouchableOpacity
                    style={styles.deleteStyle}
                    onPress={() => {this.deleteVal()} }>
                    <Image
                        source={deletePng}
                        style={styles.deleteIcon}
                        resizeMode="contain"/>
                </TouchableOpacity>
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}
                />
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.RESET_NAME_STORE, reducer, state, action)(ResetName);

const styles = StyleSheet.create({
    inputContent: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal:15,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: CommonColor.BgColorWhite,
        marginTop: 10
    },
    icon: {
        flex: 5,
        height: 20
    },
    input: {
        flex: 87,
        paddingLeft: 12,
        fontSize:CommonFont.FONT_14,
        height: 21,
        color: CommonColor.playIntroduceContent,
        paddingVertical: 0
    },
    deleteStyle:{
        flex:8,
        height:12,
        marginRight:14
    },
    deleteIcon:{
        flex:1,
        height:12
    }
});