/**
 * Created by marcus on 2018/11/26.
 */
import React, { Component } from 'react';
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
import Headerleft from '../../components/headerLeft'
import { connectReducerComponent } from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import ShareDialog from '../../components/shareDialog';
import UShare from '../../modules/share/share';
import SharePlatform from '../../modules/share/SharePlatform';
import ActionProgressDialog from '../../components/actionProgressDialog';
import HeaderRight from "../../components/headerRight";
import { BgColor } from '../../constants/color';
import SolutionList from './component/solutionList';
import NearbyShopBar from './component/nearbyShopBar';
import ViewShot, { captureScreen, captureRef } from "react-native-view-shot";

const shareImg = require('../../images/icon_share.png');
const backImg = require('../../images/back.png');


class SolutionIntro extends Component {

    static navigationOptions = ({ navigation }) => {
        const { handleGoBack = null,handleShare = null } = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={backImg}/>;
        let headerRight = <HeaderRight img={shareImg} onPress={handleShare}/>;
        return { title : "方案详情", headerLeft, headerRight }
    };

    constructor(props){
        super(props);
        this.state = {
            imageURI : ''
        };
    }

    componentWillMount() {
        const { navigation } = this.props;
        navigation.setParams({
            handleGoBack : () => {this.handleGoBack()},
            handleShare:()=>{this.handleShareShow();}
        });
    }

    /**
     * 附近网点
     */
    handleGoToShop(){
        this.props.navigation.navigate('LotteryShop');
    }

    /**
     * 返回
     */
    handleGoBack() {
        this.props.navigation.goBack();
    }

    handleShareShow(){
        captureScreen({
            format: "jpg",
            quality: 0.5,
            result: "tmpfile"
        }).then(
            uri => {
                this.setState({ imageURI: uri })
            },
            error => console.log("Oops, snapshot failed==" + error)
        );
        this.shareDialog.show();
    }

    /**
     * 第三方分享
     * 参数：标题、分享内容、分享链接、图片、平台、分享结果回调
     */
    share(number) {
        UShare.shareImage( this.state.imageURI, number,
            (message) => {
                console.log(message,this.state.imageURI);
                // message: 分享成功、分享失败、取消分享
                this.progressDialog.toast(message);
                // TODO ...
            });
    }

    /**
     * 分享
     */
    renderShareDialog() {
        return (
            <ShareDialog
                ref={ref => this.shareDialog = ref}
                showCloseButton={true}
                actions={
                    [
                        {
                            text: '微信好友', onPress: () => {
                            this.share(SharePlatform.WECHAT);
                        }
                        },
                        {
                            text: '朋友圈', onPress: () => {
                            this.share(SharePlatform.WECHATMOMENT);
                        }
                        },
                        {
                            text: 'QQ好友', onPress: () => {
                            this.share(SharePlatform.QQ);
                        }
                        },
                        {
                            text: '新浪微博', onPress: () => {
                            this.share(SharePlatform.SINA);
                        }
                        }
                    ]
                }
            />
        )
    }

    render() {
        const {navigation} = this.props;
        let item = navigation.state.params.item;
        return (
            <View style={styles.container}>
                {/*红色部分*/}
                <View style={styles.redPart}>
                    <Text style={styles.redContent}>请在广东地区的线下投注站投注</Text>
                </View>

                {/*附近网点部分*/}
                <TouchableOpacity onPress={this.handleGoToShop.bind(this)}>
                    <NearbyShopBar />
                </TouchableOpacity>
                {/*方案部分*/}
                <SolutionList data={item}/>

                {this.renderShareDialog()}
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}/>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SOLUTION_INTRO_STORE, reducer, state, action)(SolutionIntro);

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#F5F5F5'
    },
    redPart:{
        backgroundColor : '#E24F48',
        height : 30,
        justifyContent : 'center',
        alignContent : 'center'
    },
    redContent:{
        textAlign : 'center',
        color : '#FFFFFF',
        fontSize : 12,
        fontFamily : 'PingFang-SC-Medium'
    },

});