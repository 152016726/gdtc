/**
 * Created by easyLottoMac_Feng on 2018/12/12.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import FilterListButton from "../filterList/button";
import {BorderColor, contentText, MainColor, tipsTextGrey} from "../../constants/color";
import {FONT_12, FONT_14} from "../../constants/fontSize";

export default class MarketSelect extends Component {
    static defaultProps = {
        allBtns: [],                        // 所有按钮数组
        title: '',                          // title
        subTitle: '',                       // 子title
        selectBtns: [],                     // 已选中的按钮数组
        allSelectHandle: () => {},          // 全选按钮回调
        reverseElectionHandle: () => {},    // 反选按钮回调
        selectBtnHandle: () => {},          // 单个按钮选择回调
        isAllSelect: true                   // 选中状态
    };

    render() {
        const {allBtns, selectBtns, allSelectHandle,
            reverseElectionHandle, selectBtnHandle, isAllSelect,
            title, subTitle} = this.props;
        return (
            <View>
                <View style={styles.oddsTitle}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.titleTextSty}>{title}</Text>
                        {
                            !!subTitle && <Text style={styles.tipsTextSty}> ({subTitle})</Text>
                        }
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            style={{marginRight: 8}}
                            onPress={allSelectHandle}>
                            <Text style={[styles.selectTextSty, isAllSelect && styles.activeBtnSty]}>
                                全选
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={reverseElectionHandle}>
                            <Text style={[styles.selectTextSty, !isAllSelect && styles.activeBtnSty]}>
                                反选
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.btnsBoxSty}>
                    {
                        allBtns.map((btn, index) => {
                            let checked = selectBtns.indexOf(btn) !== -1;
                            let config = {
                                checked,
                                text: btn,
                                onPress: () => selectBtnHandle(btn)
                            };
                            return (
                                <View style={styles.btnSty} key={index}>
                                    <FilterListButton {...config} />
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    oddsTitle: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        borderColor: BorderColor,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    titleTextSty: {
        fontSize: FONT_14,
        color: contentText
    },
    tipsTextSty: {
        fontSize: FONT_12,
        color: tipsTextGrey,
        paddingVertical: 1
    },
    selectTextSty: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderColor: BorderColor,
        borderWidth: 1,
        borderRadius: 4,
        fontSize: FONT_14,
        backgroundColor: '#F9F9F9',
        color: tipsTextGrey
    },
    activeBtnSty: {
        borderColor: MainColor,
        backgroundColor: MainColor,
        color: '#ffffff',
        overflow: 'hidden'
    },
    btnsBoxSty: {
        padding: 12,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    btnSty: {
        width: '33%',
        height: 40,
        marginBottom: 12
    }
});