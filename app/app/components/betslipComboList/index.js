import React, {Component} from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import * as Color from '../../constants/color'
import *as FontSize from '../../constants/fontSize'
import {connectComponentAction} from "../../reduxCfg";
import action from "./action";
import * as storeKeys from "../../constants/storeKeys";
import ComboContent from './components/comboContent';
import ActionProgressDialog from '../actionProgressDialog';
import {MAX_SELECT_STICK_WAY} from '../../constants/Tips';
import games from "@easylotto/bet";
import * as bet from "../../constants/bet";

class BetslipComboList extends Component {

    state = {
        isShowMore: false,       //是否显示下拉串关方式
        isSelected: false,       // 是否选中
        multiple: '1',           //倍数
        isCanMultiple: false,     //当前串关方式是否可以多选
        isBonusOptimization: false //是否奖金优化
    };

    componentWillReceiveProps(nextProps) {
        // 更新页面赔率
        if (nextProps.selectFreeArr.length === 1 &&
            nextProps.selectFreeArr[0] !== this.props.selectFreeArr[0] &&
            nextProps.updateSelectComboArr
        ) {
            this.handleSelectComboType(nextProps.selectFreeArr[0], true, true);
        }
    }

    /**
     * 显示更多方法
     */
    showMore() {
        const {handleChangeShow, free} = this.props;
        if (free.length === 0) {
            Alert.alert('提示', '请至少选择两场比赛(单关除外)')
        } else {
            handleChangeShow && handleChangeShow();
        }
    }

    /**
     * 选择过关方式
     * @param comboFormat
     * @param isCanMultiple 此值现在皆为true
     * @param flag 是否是重新刷新页面，重置选中串关
     */
    handleSelectComboType(comboFormat, isCanMultiple, flag) {
        // 现在所有的串关方式全部放在selectFreeArr里面, 所以只拿一个就好了...
        let {selectFreeArr, updateSelectComboArr} = this.props;
        const {combo, free} = this.props;
        const allStickWays = [].concat(combo, free);   // 所有串关方式
        let newSelectComboArr = [];
        let filterArr = [];
        let isBonusOptimization;
        let stickOps = {};                              // 串关选项
        let stickKey = "";                              // 选中的串关key

        // 找到所有的串关方式
        if(comboFormat === "单关"){
            stickOps = {
                m: 1,
                n: 1,
                p: [1]
            };
            stickKey = "1#1#1";
        }else{
            for(let i = 0; i < allStickWays.length; i++){
                if(`${allStickWays[i].m}X${allStickWays[i].n}` === comboFormat){
                    stickOps = allStickWays[i];
                    stickKey = `${allStickWays[i].m}#${allStickWays[i].n}#${allStickWays[i].p.join("")}`;
                    break;
                }
            }
        }

        if(flag) {
            selectFreeArr = [];
        }
        new Promise((resolve, reject) => {

            //这里添加数组个数限制 小于5
            if (isCanMultiple) {
                // 判断是新增还是删除
                if (selectFreeArr.indexOf(comboFormat) === -1) {
                    // 新增
                    games.Stick.addStickWay(stickOps).then(() => {
                        let result = games.Stick.getStickResult();
                        // console.log(result, "handleSelectComboType add");
                        selectFreeArr.push(comboFormat);
                        newSelectComboArr = selectFreeArr;
                        resolve();
                    });
                    return;
                } else {
                    // 删除stickKey
                    games.Stick.deleteStickWay(stickKey);
                    let result = games.Stick.getStickResult();
                    // console.log(result, stickKey, "handleSelectComboType");
                    newSelectComboArr = selectFreeArr.filter((item) => {
                        return item !== comboFormat
                    });
                    if(newSelectComboArr.length === 0){

                    }
                    if (newSelectComboArr.length === 5) {
                        this.progressDialog.toast(MAX_SELECT_STICK_WAY);
                    }
                }
            } else {
                selectFreeArr.indexOf(comboFormat) === -1 ? newSelectComboArr.push(comboFormat) : newSelectComboArr;
            }
            resolve();
        }).then(() => {

            //筛选数组中存在的组合方式
            // 这个逻辑其实不用filter来做更快... (彩蛋)
            // if (newSelectComboArr.length !== 0 && selectFreeArr.length !== 0) {
            //     filterArr = selectFreeArr.filter((item) => {
            //         let str;
            //         if (item !== "单关") {
            //             str = item.slice(2);
            //         } else {
            //             str = '1';
            //         }
            //         return str !== '1' ? item : null;
            //     });
            // }
            // // 原来 "isBonusOptimization = filterArr.length !== 0 ? 0 : 1;" .... (彩蛋)
            // isBonusOptimization = filterArr.length === 0;


            let maxM = games.Betslip.getBetslip().length.toString();

            isBonusOptimization = newSelectComboArr.length !== 0;
            for(let i = 0; i < newSelectComboArr.length; i++){
                let m, n;
                if (newSelectComboArr[i] === "单关") {
                    m = "1";
                    n = "1";
                } else {
                    m = newSelectComboArr[i].split("X")[0];
                    n = newSelectComboArr[i].split("X")[1];
                }

                console.log(maxM, m);
                if(m !== maxM || n !== "1"){
                    isBonusOptimization = false;
                    break;
                }
            }

            this.setState({
                isShowMore: !this.state.isShowMore,
                isCanMultiple: isCanMultiple,
                isBonusOptimization: isBonusOptimization
            });

            //下面修改selectComboArr和selectFreeArr 数组统一用newSelectComboArr筛选
            updateSelectComboArr && updateSelectComboArr({
                selectComboArr: isCanMultiple ? newSelectComboArr : [],
                selectFreeArr: isCanMultiple ? newSelectComboArr : [],
                isCanMultiple: isCanMultiple
            });
        });
    }

    /**
     * 渲染自由过关方式按钮
     * @returns {*}
     */
    renderFree() {
        const {selectFreeArr, free} = this.props;
        return (
            <ComboContent
                data={free}
                title='自由过关'
                handleSelectComboType={this.handleSelectComboType.bind(this)}
                isCanMultiple={true} selectTypeArr={selectFreeArr}/>
        )
    }

    /**
     * 渲染混合过关方式
     * @returns {*}
     */
    renderCombo() {
        const {selectComboArr, combo} = this.props;
        return (
            <ComboContent
                data={combo}
                title='组合过关'
                handleSelectComboType={this.handleSelectComboType.bind(this)}
                isCanMultiple={true} selectTypeArr={selectComboArr}/>
        )
    }

    /**
     * 跳转至奖金优化页面
     */
    handleGotoOptimize() {
        const {handleGotoOptimize} = this.props;
        handleGotoOptimize && handleGotoOptimize();
    }

    /**
     * 更改投注倍数
     * @param val
     */
    changeBetTimes(val) {
        let regVal = /^([0-9])+$/;
        let {onChangeText, isDisabled} = this.props;
        if (regVal.test(val === '' ? 0 : val)) {
            let result = games.Rule.checkBonusOps(bet.TICKET_VALUE * val, val);
            if(result.isPass) {
                this.setState({
                    multiple: val
                });
            }else{
                this.setState({
                    multiple: "1"
                });
                Alert.alert('提示', result.reason[0]);
            }
        }
    }

    /**
     * 处理选中的过关方式数组
     * @returns {*}
     */
    initSelArr() {
        const {combo, free, selectComboArr, selectFreeArr} = this.props;
        let isCanMultiple = selectFreeArr.length !== 0;
        let curArr = isCanMultiple ? free : combo;
        let selArr = isCanMultiple ? selectFreeArr : selectComboArr;
        // console.log(curArr, selArr);
        let newArr = [];
        curArr.forEach((item) => {
            let str = item.m === 1 ? '单关' : item.m + 'X' + item.n;
            newArr.push(str);
        });
        // console.log(newArr);
        selArr = selArr.filter((arr) => {
            return newArr.indexOf(arr) !== -1
        });
        // console.log(selArr);
        return selArr;
    }


    render() {
        const {isShowMore, selectFreeArr, combo, free} = this.props;
        // console.log('combo:', combo, 'free:', free)
        const {multiple} = this.state;
        let {isBonusOptimization} = this.state;//添加isBonusOptimization用于判断奖金优化入口
        let selArr = this.initSelArr();
        let selStr = selArr.join(',');
        let isCanOptimize = selArr.length > 0 && selectFreeArr.length > 0;//isCanOptimize将不起作用
        // console.log(isCanOptimize);
        let showTxt = isShowMore ? '收起' : selArr.length === 0 ? '投注方式' : selStr;
        let formatShowTxt = showTxt.length > 10 ? showTxt.substring(0, 8) + '...' : showTxt;
        return (
            <View style={styles.container}>
                <View style={styles.topContent}>
                    <TouchableOpacity style={styles.btn} activeOpacity={1}
                                      onPress={this.showMore.bind(this)}>
                        <Text style={styles.comboTxt}>{formatShowTxt}
                            {
                                !isShowMore && selArr.length === 0 &&
                                <Text>
                                    <Text>(</Text>
                                    <Text style={styles.selTxt}>必选</Text>
                                    <Text>)</Text>
                                </Text>
                            }
                        </Text>
                        {isShowMore
                            ? <Image style={styles.arrow} source={require('../../images/cell_arrow_down.png')}
                                     resizeMode='contain'/>
                            : <Image style={styles.arrow} source={require('../../images/cell_arrow_up.png')}
                                     resizeMode='contain'/>}

                    </TouchableOpacity>
                    <View style={styles.center}>
                        <View><Text>投</Text></View>
                        <View>
                            <TextInput
                                underlineColorAndroid='transparent'
                                style={styles.beishu}
                                value={multiple}
                                keyboardType="numeric"
                                onChangeText={this.changeBetTimes.bind(this)}
                            />
                        </View>
                        <View><Text>倍</Text></View>
                    </View>
                    <View style={styles.youhuaBtnContent}>
                        <TouchableOpacity activeOpacity={1}
                                          onPress={isBonusOptimization ? this.handleGotoOptimize.bind(this) : null}
                                          style={[styles.youhuaBtn, isBonusOptimization ? null : styles.disabled]}>
                            <Text style={[styles.yohua, isBonusOptimization ? null : styles.disabledTxt]}>奖金优化</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    isShowMore && <View style={styles.toggleContent}>
                        <View>
                            {this.renderFree()}
                            {combo.length > 0 && this.renderCombo()}
                        </View>
                    </View>
                }
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}/>
            </View>
        )
    }
}

export default connectComponentAction(action, storeKeys.BETSLIP_COMBOLIST)(BetslipComboList)

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: 'auto',
        minHeight: 40,
        flexDirection: 'column',
        position: 'absolute',
        bottom: 63
    },
    topContent: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Color.BgColorWhite,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: Color.DarkerBorderColor,
        paddingHorizontal: 12,
    },
    arrow: {
        width: 12,
        height: 7,
        position: 'absolute',
        right: 5,
        top: 10
    },
    center: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: Color.DarkerBorderColor,
        paddingHorizontal: 24
    },
    btn: {
        flex: 4,
        height: 28,
        borderColor: Color.DarkerBorderColor,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 11,
        borderRadius: 5
    },
    comboTxt: {
        fontSize: FontSize.FONT_14
    },
    beishu: {
        paddingVertical: 0,
        width: 40,
        height: 28,
        borderColor: Color.DarkerBorderColor,
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: FontSize.FONT_14
    },
    btnContainer: {
        backgroundColor: 'rgb(225,14,94)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 40,
    },
    youhuaBtnContent: {
        flex: 3,
        height: 28,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    youhuaBtn: {
        width: '80%',
        height: 28,
        backgroundColor: '#E6E6B8',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabled: {
        backgroundColor: Color.BgColor
    },
    disabledTxt: {
        color: '#C2C2C2'
    },
    yohua: {
        color: Color.MainColor,
        fontSize: FontSize.FONT_12
    },
    selTxt: {
        color: Color.MainColor
    },
    toggleContent: {
        width: '100%',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12

    },
    description: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    descTxt: {
        textAlign: 'center',
        fontSize: FontSize.FONT_10
    }
});