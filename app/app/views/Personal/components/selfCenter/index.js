/**
 * Created by marcus on 2018/11/15.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Dimensions
} from 'react-native';
import avatar from './images/avatar.png';
import code from './images/qrcode.png';
import * as CommonColor from '../../../../constants/color';
import * as CommonFont from '../../../../constants/fontSize';

const rowWidth = Dimensions.get('window').width-30;

export default class SelfCenter extends Component{
    static defaultProps = {
        loginStatus: 1,                  // 登录状态
        personalInfo: {}                 // 个人信息
    };

    render(){
        const {loginStatus, personalInfo, navigation} = this.props;
        const {icon, qrCode, webApiPath, isOwner, name} = personalInfo;
        console.log(name);
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <TouchableOpacity
                        style={styles.avatarView}
                        activeOpacity={1}
                        onPress={() => {loginStatus !== 1 && navigation.navigate("Login")}}>
                        <Image
                            source={loginStatus === 1 && icon ? {uri: webApiPath+icon}  : avatar}
                            style={styles.avatar}
                            resizeMode="cover"/>
                    </TouchableOpacity>
                    <View style={styles.info}>
                        {loginStatus ===1 && <View style={{flexDirection:'row'}}>
                            <Text style={styles.name}>{personalInfo.nickname}</Text>
                            <Image
                                source={code ? {uri: qrCode}  : code}
                                style={styles.qrCode}/>
                        </View>}
                        {loginStatus ===1 && <Text style={styles.phone}>{name}</Text>}
                        {loginStatus ===0 && <TouchableOpacity
                            onPress={() => {navigation.navigate("Login")}}>
                                <Text style={styles.name}>登录/注册</Text>
                        </TouchableOpacity>}
                    </View>
                    {loginStatus ===1 && <TouchableOpacity
                        style={styles.self}
                        activeOpacity={1}
                        onPress={() => navigation.navigate("PersonalInformation")}>
                        <Text style={styles.edit}>
                            {!isOwner || isOwner=== 'false' ? '编辑个人信息' : '编辑站点信息'}
                        </Text>
                    </TouchableOpacity>}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        height: 90,
        backgroundColor: CommonColor.SelfOrange,
        justifyContent:'center',
        alignItems: "center"
    },
    content:{
        flexDirection: 'row',
        width: rowWidth,
        justifyContent:'center',
        alignItems: "center"
    },
    avatarView:{
        width:52,
        height: 52,
        marginRight:20,
        borderRadius:25,
        borderWidth: 2,
        borderColor: '#F2EABD',
        justifyContent:'center',
        alignItems: "center"
    },
    avatar:{
        width:50,
        height:50,
        borderRadius:25
    },
    info:{
        flex:66,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    self:{
        flex:34,
        height:30,
        borderRadius:4,
        borderColor:CommonColor.SelfWhite,
        borderWidth:1,
        justifyContent:'center',
        alignItems: "center"
    },
    nameStyle:{
        flexDirection:'row',
        alignItems: "center"
    },
    name:{
        color: CommonColor.SelfWhite,
        fontSize: CommonFont.FONT_18
    },
    phone:{
        marginTop: 8,
        color: CommonColor.SelfWhite,
        fontSize: CommonFont.FONT_14
    },
    edit:{
        color: CommonColor.SelfWhite,
        fontSize: CommonFont.FONT_14
    },
    qrCode:{
        marginLeft: 12,
        width: 12,
        height: 12
    }
});