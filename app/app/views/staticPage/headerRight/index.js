/**
 * Created by easyLottoMac on 2018/10/29.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import ActionProgressDialog from "../../../components/actionProgressDialog";
import ShareDialog from "../../../components/shareDialog";
import SharePlatform from "../../../modules/share/SharePlatform";
import UShare from "../../../modules/share/share";
import ViewShot, { captureScreen, captureRef } from "react-native-view-shot";

export default class HeaderRight extends Component{

    constructor(props){
        super(props);
        this.state = {
            imageURI: ''
        };
    }

    moreHandle(){
        captureScreen({
            format: "jpg",
            quality: 0.5,
            result: "tmpfile"
        }).then(
            uri => {
                console.log("Image saved to", uri);
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
        return (
            <View>
                <TouchableOpacity style={styles.headerRightTouch}
                                  onPress={() => this.moreHandle()}>
                    <Image resizeMode="contain" style={styles.headerIcon}
                           source={require('../../scoreDetails/images/icon_share.png')}/>
                </TouchableOpacity>
                {this.renderShareDialog()}
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerRightTouch: {
        marginRight: 12
    },
    headerIcon: {
        width: 21,
        height: 21
    }
});
