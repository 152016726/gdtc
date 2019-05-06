/**
 * Created by mac-ddt on 2018/8/9.
 */
/**
 * Created by mac-ddt on 2017/6/7.
 */
import React, { Component } from 'react';
import {
    View,
    StatusBar,
    SafeAreaView,
    ImageBackground,
    Platform,
    Alert,
    Linking
} from 'react-native';
import { connectReducerComponent } from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../constants/storeKeys'
import { MainNavigator } from '../../navigator'
import { MainColor } from '../../constants/color';
import Drawer from 'react-native-drawer' //https://github.com/root-two/react-native-drawer
import DrawerView from '../drawer'
import { IntroControl, IntroView } from '../../modules/intro';
import TipWindow from '../../components/tipWindow'
import PushNotification from '../../components/pushNotification'
import LoadingView from '../../components/loadingView'
import ActionProgressDialog from '../../components/actionProgressDialog';
import toastTip from '../../modules/toastTip';
import CommonDialog from '../../components/commonDialog';
import Screen from '../../modules/screen';
import { iOS_Version, Android_Version } from '../../constants/version';
import BaiduMobStat from "baidumobstat-react-native";
import JPushModule from 'jpush-react-native';
import CookieManager from 'react-native-cookies'
import DataManager from '../../dataManager/commonDataManager';
import SplashScreen from 'react-native-splash-screen';

const COOKIE_DATA = 'cookie_data';

class RootPage extends Component {
    constructor(props) {
        super(props);
        // IntroControl.reset();  //测试用,每次启动会重置.出现引导页
        this.state = {
            showIntro : null
        }
    }

    componentWillMount() {
        IntroControl.isFirstLoad().then((data) => {
            let isFirstLoad = true;

            if (data && data == 'exist') {
                JPushModule.getRegistrationID((registrationId) => {
                    // console.log('推送ID',registrationId);
                    this.props.updateRegistrationID(registrationId);
                });
                isFirstLoad = false;
            } else {
                JPushModule.getRegistrationID((registrationId) => {
                    // console.log('推送ID',registrationId);
                    //当第一次进入App时 设置设置id 传送给后台全部推送
                    this.props.getRegistrationID(registrationId);
                });
            }
            this.setState(
                { showIntro : isFirstLoad }
            );
        });

        if (Platform.OS === 'ios') {
            let cookie;
            //获取缓存的cookie数据
            DataManager.getAll(COOKIE_DATA).then(res => {
                cookie = res[ 0 ];
                if (cookie) {
                    //设置cookie
                    CookieManager.set({
                        name : 'JSESSIONID',
                        value : cookie.value,
                        domain : '14.18.86.60',
                        origin : '14.18.86.60',
                        path : '/',
                        version : '1',
                        expiration : '2020-05-30T12:30:00.00-05:00'
                    })
                        .then((res) => {
                            //获取全部cookie
                            CookieManager.getAll().then((res) => {
                                this.props.getCurrentClient();
                            });
                        });
                }

            });

        } else {
            this.props.getCurrentClient();
        }

        Screen.init();
        PushNotification.init();
        this.props.getHostsInfo();
        this.props.getVersionUpdate(this.versionUpdateTips.bind(this));
        BaiduMobStat.onPageStart("index");

    }

    componentDidMount() {
        //启动页隐藏
        SplashScreen.hide();
    }

    componentWillUnmount() {
        BaiduMobStat.onPageEnd("index");
    }

    componentDidUpdate() {
        toastTip.init(this.progressDialog);
    }

    openControlPanel() {
        this._drawer.open()
    };

    closeControlPanel() {
        this._drawer.close()
    };

    popScreen(type, routeName, params) {
        // call navigate for AppNavigator here:
        this._navigator && this._navigator.dispatch({ type : type, routeName, params });
    }

    showTips(text) {
        this._tipWindow.showTips(text);
    }

    introViewClosed() {
        console.log('introViewClosed..');
        this.setState({
            showIntro : false
        });
    }

    renderNull() {
        return null;
    }

    renderView(showIntro) {
        //style={{width:Screen.getWidth(),height:Screen.getHeight(),position: 'relative'}}
        return (
            <ImageBackground style={{ flex : 1 }}
                             source={require('../../images/backGroundImage.png')}>
                <SafeAreaView style={{ flex : 1 }}>
                    <LoadingView/>
                    <StatusBar barStyle='light-content'/>
                    <Drawer
                        ref={(ref) => this._drawer = ref}
                        side="right"
                        openDrawerOffset={0.65}
                        tapToClose={true}
                        content={<DrawerView popScreen={this.popScreen.bind(this)}
                                             closeDrawer={this.closeControlPanel.bind(this)}/>}
                    >
                        <MainNavigator ref={nav => {
                            this._navigator = nav;
                        }} screenProps={{
                            openDrawer : this.openControlPanel.bind(this),
                            showTips : this.showTips.bind(this)
                        }}/>
                    </Drawer>
                    {showIntro && <IntroView onClosed={() => this.introViewClosed()}/>}
                    <TipWindow ref={(ref) => {
                        this._tipWindow = ref
                    }}/>
                    <ActionProgressDialog
                        ref={progressDialog => this.progressDialog = progressDialog}/>
                    <CommonDialog/>
                </SafeAreaView>
            </ImageBackground>
        )
    }

    versionUpdateTips() {
        const { content, url, isForce } = this.props;
        let btnArr = [];
        isForce === 'true' ? btnArr = [ {
            text : '确认', onPress : () => {
                this.handleCall(url)
            }
        } ]
            : btnArr = [ {
            text : '确认', onPress : () => {
                this.handleCall(url)
            }
        }, { text : '取消', style : 'cancel' } ];
        if (Platform.OS === 'ios') {
            if (iOS_Version !== parseFloat(this.props.iOS_Version)) {
                Alert.alert(
                    '升级提示',
                    content,
                    btnArr,
                    { cancelable : false });
            }
        } else {
            if (Android_Version !== parseFloat(this.props.Android_Version)) {
                Alert.alert(
                    '升级提示',
                    content,
                    btnArr,
                    { cancelable : false });
            }
        }

    }

    handleCall(url) {
        // console.log(url);
        if (url && url !== '') {
            Linking.canOpenURL(url).then(supported => {
                // console.log(supported);
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log('Don\'t know how to open URI: ' + url);
                }
            });
        }
    }

    render() {
        const { showIntro } = this.state;
        // console.log('state',this.state);
        if (showIntro === null) {
            return this.renderNull();
        }
        else {
            return this.renderView(showIntro);
        }
    }
}

export default connectReducerComponent(storeKey.ROOT_PAGE_STORE, reducer, state, action)(RootPage)