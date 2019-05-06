/**
 * Created by marcus on 2018/11/16.
 */
import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import TabBar from "../../components/tabBar";
import Headerleft from '../../components/headerLeft';
import avatar from "./images/avatar.png";
import code from "./images/qrCode.jpg";
import backImg from "../../images/back.png";
import getUploaderImg from '~/services/getUploaderImg';
import ActionProgressDialog from '../../components/actionProgressDialog';
import updateInfo from "../../services/getUserUpdateInfo";
import getCurrentClient from '../../services/getCurrentClientService';
import Account from '#/account';

class PersonalInformation extends Component{

    static navigationOptions = ({navigation}) => {
        const {handleGoBack = null, isOwner} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={backImg}/>;
        return {
            title: (!isOwner || isOwner === 'false') ? "我的资料" : "投注站资料",
            headerLeft
        }
    };

    componentWillMount(){
        const {navigation, changeState} = this.props;
        navigation.setParams({
            handleGoBack: ()=>{this.goBack()}
        });
        getCurrentClient.getData().then(rsp=>{
            const {webApiPath, icon} = rsp.data;
            changeState(Object.assign(
                {},
                {...rsp.data},
                {uri: webApiPath+icon}
            ))
        }, rej=>{
            this.progressDialog.toast(rej.rspMsg);
        });
    }

    //选择图片
    selectPhotoTapped() {
        const {updateState, updatePersonal} = this.props;
        const options = {
            title: '请选择',
            // takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle: '选择照片',
            cancelButtonTitle: '取消',
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.8,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                this.progressDialog.toast('照片访问失败 请在设置-隐私-照片中开启对APP的使用权限');
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                let formData = new FormData();
                if(response.type.indexOf('gif') !== -1 || response.type.indexOf('GIF') !== -1) {
                    this.progressDialog.toast('头像不支持gif格式');
                    return
                }
                let file = {uri: response.uri, type: response.type, name: response.fileName};
                formData.append('file', file);
                getUploaderImg.getData(formData).then(rsp=>{
                    let data = rsp.data;
                    updateInfo.getData({icon: data.id}).then(rsp=>{
                        updateState({icon: data.urlPath, uri:data.webApiPath + data.urlPath});
                        updatePersonal({icon: data.urlPath});
                        Account.updateAccountInfo({icon: data.urlPath});
                    }, rej=>{
                        console.log(rej,'更新图片失败');
                        this.progressDialog.toast(rej.rspMsg);
                    });
                },rej=>{
                    console.log(rej,'上传图片失败');
                    this.progressDialog.toast(rej.rspMsg);
                });
            }
        });
    }

    /**
     * 返回上一级
     */
    goBack() {
        this.props.navigation.goBack();
    }


    /**
     * 渲染设置里的横条
     * @param arr
     */
    renderTabBars(arr){
        const {isExpert, isOwner} = this.props;
        return arr.map(function (item,index) {
            const {
                img,
                text,
                cls,
                addInfo,
                goToTab,
                isShowLine,
                customStyles,
                isShowArrow=true
            } = item;
            if((isOwner === 'false' || !isOwner) && isExpert === 'false' && index === 2){
                return <View key={(index+arr.length).toString()}></View>
            }
            else{
                return <TabBar
                    img={img}
                    text={text}
                    key={(index+arr.length).toString()}
                    addInfo={addInfo}
                    cls={cls}
                    goToTab={goToTab}
                    isShowArrow={isShowArrow}
                    customStyles={customStyles}
                    isShowLine={index === arr.length -1 ? false : isShowLine}/>
            }
        })
    }

    render(){
        const {
            nickname, icon, regtime, summary, uri, dotNumber, contactName, contactPhone, dotQrcode, dotPictures, isOwner} = this.props;
        // 个人信息
        const settings = [
            {
                text:"头像",
                addInfo:<Image
                    source={icon ? {uri} : avatar}
                    style={styles.imgStyle}
                    resizeMode="cover"/>
                ,
                customStyles:{content:{height: 56}},
                goToTab: ()=> {this.selectPhotoTapped()}
            },
            {
                text:"昵称",
                addInfo:<Text style={styles.infoFont}>{nickname}</Text>,
                goToTab:()=>{
                    this.props.navigation.navigate("ResetName",{nickname})
                }
            },
            {
                text:"简介",
                addInfo:<Text style={[styles.infoFont, {marginRight: 20}]}>{summary}</Text>,
                goToTab:()=>{
                    this.props.navigation.navigate("Summary",{summary})
                }
            },
            // {text:"账号绑定"},
            {
                text:"修改密码",
                goToTab:()=>{
                    this.props.navigation.navigate("ResetPassword")
                }
            },
            {
                text:"注册时间",
                addInfo:<Text style={styles.infoFont}>{regtime.split(" ")[0]}</Text>
            }
        ];
        // 投注站资料
        const bettingsInfo = [
            {
                text:"头像",
                addInfo:<Image
                    source={icon ? {uri} : avatar}
                    style={styles.imgStyle}
                    resizeMode="cover"/>
                ,
                customStyles:{content:{height: 56}},
                goToTab: ()=> {this.selectPhotoTapped()}
            },
            {
                text:"昵称",
                addInfo:<Text style={styles.infoFont}>{nickname}</Text>,
                goToTab:()=>{
                    this.props.navigation.navigate("ResetName",{nickname})
                }
            },
            {
                text:"简介",
                addInfo:<Text style={[styles.infoFont, {marginRight: 20}]}>{summary}</Text>,
                goToTab:()=>{
                    this.props.navigation.navigate("Summary",{summary})
                }
            }
        ];
        const bettingsShop = [
            {
                text: "站点编号",
                isShowArrow: false,
                addInfo: <Text style={styles.bettingFont}>{dotNumber}</Text>
            },
            {
                text: "联系人",
                isShowArrow: false,
                addInfo: <Text style={styles.bettingFont}>{contactName}</Text>
            },
            {
                text: "联系电话",
                isShowArrow: false,
                addInfo:<Text style={styles.bettingFont}>{contactPhone}</Text>
            },
            {
                text:"修改密码",
                goToTab:()=>{
                    this.props.navigation.navigate("ResetPassword")
                }
            },
            {
                text:"店铺图片上传",
                addInfo: dotPictures.length > 0 ? null : <Text style={styles.todoFont}>未完成</Text>,
                goToTab:()=>{
                    this.props.navigation.navigate("LotteryShopImgManage")
                }
            }
            // ,
            // {
            //     text:"我的二维码",
            //     addInfo: dotQrcode ? <Image
            //         source={code}
            //         style={styles.codeStyle}
            //         resizeMode="cover"/> : <Text style={styles.todoFont}>未完成</Text>,
            //     goToTab:()=>{
            //         this.props.navigation.navigate("MyQRCode")
            //     }
            // }
        ];
       return(
           <View style={styles.container}>
               {(!isOwner || isOwner === 'false') && this.renderTabBars(settings)}
               {isOwner === 'true' && this.renderTabBars(bettingsInfo)}
               {isOwner === 'true' && <View style={styles.margin}></View>}
               {isOwner === 'true' && this.renderTabBars(bettingsShop)}
               <ActionProgressDialog
                   ref={progressDialog => this.progressDialog = progressDialog}
                   />
           </View>
       )
    }
}

export default connectReducerComponent(storeKey.PERSONAL_INFORMATION_STORE, reducer, state, action)(PersonalInformation);

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 10,
        backgroundColor: CommonColor.BgColor
    },
    infoFont:{
        paddingHorizontal: 10,
        fontSize: CommonFont.FONT_13,
        color: '#808080'
    },
    todoFont:{
        fontSize: CommonFont.FONT_13,
        color: '#777777'
    },
    bettingFont:{
        fontSize: CommonFont.FONT_13,
        color: '#C4C4C4'
    },
    imgStyle:{
        width: 40,
        height: 40,
        borderRadius: 20
    },
    codeStyle:{
        width: 18,
        height: 18
    },
    margin:{
        height: 10
    }
});