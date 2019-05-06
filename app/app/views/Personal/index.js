/**
 * Created by marcus on 2018/11/15.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TextInput,
    Alert,
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
import SelfCenter from './components/selfCenter';
import TabBar from "../../components/tabBar";
import solution from "./images/solution.png";
import advice from "./images/advice.png";
import about from "./images/about.png";
import promote from "./images/promote.png";
import MyProject from '../myProject';
import TabNavigator from '../../navigator/TabNavigator';
import Account from '#/account';
import DataManager from '../../dataManager/commonDataManager';

const COOKIE_DATA = 'cookie_data';
const rowWidth = Dimensions.get('window').width - 30;

class Personal extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderDialog: false      // 弹窗提示
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showDialog !== this.props.showDialog) {
            this.setState({
                renderDialog: true
            });
        }
    }

    componentDidUpdate() {
        // 需要触发窗口操作
        if (this.state.renderDialog) {
            this.setState({
                renderDialog: false
            }, () => {
                this.setDialogState();
            });
        }
        return true;
    }

    /**
     *  开关注销弹窗
     */
    setDialogState() {
        const {updateCommonDialog, showDialog, hideDialog} = this.props;
        //  弹窗的配置
        let conf = {
            content: <View style={styles.tipsStyle}>
                <Text style={[styles.attention, styles.black]}>提示</Text>
                <Text style={[styles.md, styles.black]}>是否注销登录?</Text>
            </View>,
            show: showDialog,
            cancelBtnText: "取消",
            onCancel: () => hideDialog(),
            confirmBtnText: "确定",
            onConfirm: () => this.logOut(),
            customStyles: {
                content: {
                    padding: 0,
                    borderRadius: 8,
                    borderBottomWidth: 1,
                    borderColor: "#dedede",
                    backgroundColor: CommonColor.BgColorWhite
                },
                win: {
                    marginHorizontal: 30
                }
            }
        };
        updateCommonDialog(conf);
    }

    /**
     * 展示弹窗
     */
    _showDialog() {
        this.props.updateState({
            showDialog: true
        })
    }

    /**
     *
     * @param param     跳转的目的路由
     * @param obj       路由传参
     * @param isNoLogin 是否需要登录才能跳转
     */
    toNavigation(param, obj, isNoLogin) {
        const {loginStatus, navigation} = this.props;
        if (loginStatus === 1 || isNoLogin) {
            navigation.navigate(param, obj);
        } else {
            navigation.navigate("Login", {fromView: 'Personal'})
        }
    }

    /**
     * 注销登录
     */
    logOut() {
        const {updateState, updateExpertZone} = this.props;
        Account.logout().then(res => {
            this.props.hideDialog();
            if(Platform.OS === 'ios'){
                DataManager.clearAll(COOKIE_DATA);
            }
            updateState({
                ...res
            });
            // 更新专家预测页面数据
            this.props.updateEHData({
                isReceiveProps: true
            });
            // 更新专家个人中心
            updateExpertZone({
                personId: ''
            })
        }, rej => {
            console.log(rej);
        });
    }

    /**
     * 渲染设置里的横条
     * @param arr
     * @param isKeep  是否保留分割线
     */
    renderTabBars(arr, isKeep = false) {
        return arr.map(function (item, index) {
            const {img, text, cls, addInfo, goToTab, isShowLine} = item;
            return <TabBar
                img={img}
                text={text}
                key={index}
                addInfo={addInfo}
                cls={cls}
                goToTab={goToTab}
                isShowLine={!isKeep && index === arr.length - 1 ? false : isShowLine}/>
        })
    }

    render() {
        const {navigation, id, nickname, phone, name, qrCode, icon, latestMsgCount, isExpert, isOwner, webApiPath, loginStatus} = this.props;
        // 设置的配置项
        const self = [
            {img: solution, text: "我的方案", goToTab: () => this.toNavigation('MyProject')}
        ];
        const promotion = [
            {img: promote, text: "晒单历史", goToTab: () => this.toNavigation('ExpertZone', {id, isExpert})}
        ];
        const others = [
            // {img: share, text: "分享给好友", cls: {marginTop: 10},goToTab: () => this.toNavigation('')},
            {img: advice, text: "意见反馈", goToTab: () => this.toNavigation('Feedback')},
            // {img: cleanUp, text: "清除缓存", addInfo: <Text style={styles.infoFont}>3.88MB</Text>},
            {img: about, text: "关于我们", goToTab: () => this.toNavigation('AboutUs', false, true), cls: {marginBottom: 10}}
        ];
        return (
            <View style={styles.container}>
                <TabNavigator title='我的'
                              rightOneImg=''
                              rightOneEvent={() => {
                              }}
                    rightTwoImg={loginStatus ? 'my' : ''}
                    latestMsgCount={latestMsgCount}
                    imgCls={styles.imgCls}
                    rightTwoEvent={() => navigation.navigate('MessageCenter')}
                />
                <SelfCenter
                    navigation={navigation}
                    loginStatus={loginStatus}
                    personalInfo={{
                        icon, qrCode, webApiPath, isOwner, nickname, phone, name
                    }}
                />
                {/*<View style={styles.coupon}>
                    <TouchableOpacity style={styles.couponLeft}>
                        <Text style={styles.white}>
                            {attentionNumber ? attentionNumber : 0}
                        </Text>
                        <Text style={[styles.white,styles.marginTop]}>
                            关注
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.couponRight}>
                        <Text style={styles.white}>
                            {couponNumber ? couponNumber : 0}
                        </Text>
                        <Text style={[styles.white,styles.marginTop]}>
                            优惠券
                        </Text>
                    </TouchableOpacity>
                </View>*/}
                <View>
                    {this.renderTabBars(self, true)}
                    {loginStatus === 1 && isExpert === 'true' && this.renderTabBars(promotion, true)}
                    {this.renderTabBars(others)}
                </View>
                {loginStatus === 1 && <View style={{height: 90}}>
                    <TouchableOpacity onPress={this._showDialog.bind(this)} style={styles.btn}>
                        <Text style={[styles.white, styles.md]}>退出登录</Text>
                    </TouchableOpacity>
                </View>}
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.PERSONAL_STORE, reducer, state, action)(Personal);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CommonColor.BgColor
    },
    coupon: {
        height: 48,
        backgroundColor: "rgb(197,108,35)",
        flexDirection: 'row'
    },
    couponLeft: {
        flex: 1,
        marginVertical: 6,
        borderRightWidth: 1,
        borderColor: "rgb(211,144,89)",
        justifyContent: 'center',
        alignItems: "center"
    },
    couponRight: {
        flex: 1,
        marginVertical: 6,
        justifyContent: 'center',
        alignItems: "center"
    },
    white: {
        fontSize: CommonFont.FONT_12,
        color: CommonColor.SelfWhite
    },
    md: {
        fontSize: CommonFont.FONT_14
    },
    marginTop: {
        marginTop: 8
    },
    btn: {
        height: 40,
        margin: 12,
        backgroundColor: CommonColor.SelfOrange,
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 4
    },
    tipsStyle: {
        height: 66,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: CommonColor.BgColorWhite
    },
    attention: {
        fontWeight: 'bold',
        marginBottom: 12,
        fontSize: CommonFont.FONT_16
    },
    black: {
        color: CommonColor.SelfSuccessTextColor
    },
    infoFont: {
        fontSize: CommonFont.FONT_13,
        color: '#808080'
    },
    line: {
        height: 1,
        backgroundColor: "#E6E6E6",
        width: rowWidth + 15,
        marginLeft: 15
    },
    imgCls:{
        width:16,
        height:16
    }
});