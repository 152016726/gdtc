/**
 * Created by marcus on 2019/1/3.
 */
import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {connectReducerComponent} from '../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '~/constants/storeKeys';
import * as CommonColor from '~/constants/color';
import * as CommonFont from '~/constants/fontSize';
import Headerleft from '~/components/headerLeft';
import HeaderRight from '~/components/headerRight';
import ExpertHeader from './expertHeader';
import ExpertScore from './expertScore';
import ShareDialog from '~/components/shareDialog';
import UShare from '../../modules/share/share';
import SharePlatform from '../../modules/share/SharePlatform';
import ActionProgressDialog from '../../components/actionProgressDialog';
import ViewShot, { captureScreen, captureRef } from "react-native-view-shot";
import PlaysSelections from './playsSelections';
import getExpertInfo from '~/services/getExpertInfo';

const shareImg = require('../../images/icon_share.png');
const backImg = require('../../images/back.png');

class ExpertZone extends Component{
    static navigationOptions = ({navigation})=>{
        const {handleGoBack = null,title, handleShare, isExpert} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={backImg}/>;
        let headerRight = <HeaderRight img={shareImg} onPress={handleShare}/>;
        return {title, headerLeft, headerRight: isExpert ? null : headerRight}
    };

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            info: {},         // 专家个人信息对象
            eid: 0,           // 专家id
            isExpert: false,  // 个人中心跳转过来的会携带该字段并为true
            imageURI: ''
        };
      }

    componentWillMount() {
        const {navigation} = this.props;
        if(navigation.state.params){
            const {id, isExpert} = navigation.state.params;
            navigation.setParams({
                title: isExpert ? '晒单历史' : '晒单人主页',
                isExpert,
                handleGoBack: ()=>{navigation.goBack()},
                handleShare:()=>{this.handleShareShow()}
            });
            if(isExpert){
                this.setState({
                    isExpert
                })
            }
            getExpertInfo.getData({eid: id}).then(rsp=> {
                this.setState({
                    info: rsp.data[0],
                    eid: id
                })
            },rej=> {
                console.log(rej.rspMsg)
            })
        }
    }

    /**
     * 第三方分享调用
     */
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

    render(){
        const {updatePersonal, navigation, personId} = this.props;
        const {info, isExpert, eid} = this.state;
        const {
            id,
            icon,
            nickname,
            attentionNumber,
            summary,
            weekHitRate,
            monthHitRate,
            fiveWinrate,
            isAttention,
            webApiPath,
            comboWin
        } = info;
        return(
            <ScrollView style={styles.container}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
            >
                {!isExpert && <ExpertHeader
                    lid={eid}
                    id={personId}
                    uri={icon}
                    webApiPath={webApiPath}
                    name={nickname}
                    updatePersonal={updatePersonal}
                    attentionNumber={attentionNumber}
                    summary={summary}
                    isAttention={isAttention}
                    navigation={navigation}
                />}
                <ExpertScore
                    isExpert={isExpert}
                    weekHitRate={weekHitRate}
                    monthHitRate={monthHitRate}
                    fiveWinrate={fiveWinrate}
                    comboWin={comboWin}
                />
                <PlaysSelections
                    eid={eid}
                    navigation={navigation}
                />
                {this.renderShareDialog()}
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}/>
            </ScrollView>
        )
    }
}

export default connectReducerComponent(storeKey.EXPERT_ZONE_STORE, reducer, state, action)(ExpertZone)

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: CommonColor.BgColor
    }
});