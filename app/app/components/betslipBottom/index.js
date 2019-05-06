import React, {Component} from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    Platform
} from 'react-native';
import * as FontSize from '../../constants/fontSize'
import * as Color from '../../constants/color'
import Account from '#/account';

export default class Betslip extends Component {
    static defaultProps = {
        isJustShowPay: false,   //是否只显示投注金额
        isAbsolute: true,       //是否需要浮起对象
        multiple: 1,               //倍数
        minBonus: 0,            //最小奖金
        maxBonus: 0,            //最大奖金
        amount: 0,              //注数
        pay: 0,                 //投注金额
        saveProject:()=>{},      //保存方案
        isLogin:true,
    };

    handleShowMap() {
        const {navigation} = this.props;
        navigation.navigate('LotteryShop')
    }

    handleSaveProject(){
        const {navigation,saveProject,isLogin} = this.props;
        if(Account.getAccountInfo() && Account.getAccountInfo().loginStatus){
            saveProject();
            Alert.alert(
                '提示',
                '保存成功',
                [
                    {text: '取消', onPress: () => {}, style: 'cancel'},
                    {text: '立即查看', onPress: () => {
                        navigation.navigate('MyProject')}
                    },
                ],
            )
        }else{
            Alert.alert(
                '提示',
                '请先登录',
                [
                    {text: '取消', onPress: () => {}, style: 'cancel'},
                    {text: '前往登录', onPress: () => navigation.navigate('Login')},
                ],
            )
        }
    }

    render() {
        const {handleGoToBetslip, isAbsolute, isJustShowPay, maxBonus = 0, minBonus= 0,  multiple = 1, pay = 0, amount = 0} = this.props;
        return (
            <View style={[styles.container, isAbsolute && styles.absCon]}>
                <View style={styles.bottomContent}>
                    <View style={styles.leftSide}>
                        <TouchableOpacity onPress={this.handleShowMap.bind(this)}>
                            <Image style={styles.img} source={require('../../images/location.png')}/>
                        </TouchableOpacity>
                        <View style={styles.marginVal}>
                            <Text style={styles.mapTxt}>附近网点</Text>
                        </View>
                    </View>
                    <View style={styles.centerSide}>
                        <Text style={styles.txt}>
                            {isJustShowPay || `${amount}注${multiple}倍 `}
                            共<Text style={styles.amount}>{pay}</Text>元</Text>
                        <Text style={styles.static_txt}>预计奖金:{minBonus}～{maxBonus}元</Text>
                    </View>
                    <View style={styles.rightSide} onPress={handleGoToBetslip}>
                        <TouchableOpacity style={styles.btn} onPress={this.handleSaveProject.bind(this)}><Text style={styles.confirm}>保存方案</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: 63,
        paddingVertical: 7,
        paddingHorizontal: 12,
        backgroundColor: '#FAFAFA',
        bottom: 0
    },
    absCon: {
        position: 'absolute'
    },
    bottomContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftSide: {
        flex: 0.8,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: Color.DarkerBorderColor
    },
    marginVal: {
        marginTop: 5
    },
    mapTxt: {
        color: Color.MainColor,
        fontSize: FontSize.FONT_9
    },
    img: {
        width: 21,
        height: 21
    },
    centerSide: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txt: {
        fontSize: FontSize.FONT_14
    },
    amount:{
        color: Color.MainColor
    },
    static_txt: {
        color: '#999999',
        fontSize: FontSize.FONT_11
    },
    count: {
        color: Color.MainColor
    },
    rightSide: {
        flex: 1.2,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    btn: {
        width: '100%',
        justifyContent: 'center',
        height: 35,
        backgroundColor: Color.MainColor,
        borderRadius: 5,
    },
    confirm: {
        fontSize: FontSize.FONT_14,
        color: Color.BgColorWhite,
        textAlign: 'center'
    }
});
