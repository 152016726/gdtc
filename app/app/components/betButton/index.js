import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {connectComponentAction} from "../../reduxCfg";
import * as CommonColor from "../../constants/color";
import * as storeKeys from '../../constants/storeKeys';
import games from '@easylotto/bet';
import action from './action';
import toastTip from '../../modules/toastTip';
import { ONE_MARKET_ONE_OUTCOME } from'../../constants/Tips';
import _ from "lodash";
import PropTypes from 'prop-types';

class BetButton extends Component {
    static propTypes = {
        children: PropTypes.element
    };

    static defaultProps = {
        vid: '',                  //赛事id
        sort: '',                 //当前玩法
        cls: {},                  //自定义组件样式
        text: '',                 //例如：主，客等文字
        rate: '',                 //赔率
        name: '',                 //针对胜平负以及让球胜平负设定，其他玩法可选
        ContentElement: null,     //需要生成的组件标签
        outcomeName: '',          //当前注项名
        isSelected: false,        //是否选中
        handlePressItem: null     //弹框使用点击事件
    };
    state = {
        selectedState: false,
        selectKey: ''
    };

    componentWillMount() {
        const {isSelected, vid, sort, outcomeName} = this.props;
        this.setState({
            selectedState: isSelected,
            selectKey: `${vid}#${sort}#${outcomeName}`
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSelected !== this.props.isSelected) {
            this.setState({
                selectedState: nextProps.isSelected
            });
        }
    }

    /**
     * 加入投注蓝或从投注揽删除注项方法
     * @param selectedState 根据selectedState状态判断是否是加入还是删除
     */
    addToBet(selectedState) {
        let {selectKey} = this.state;

        //将选中的注项加入betslip
        if (selectedState) {
            games.Betslip.deleteFromBetslip([selectKey], this.callbackAfterAdd.bind(this, false))
        } else {
            games.Betslip.setOutcomeToBetslip([selectKey], this.callbackAfterAdd.bind(this, true));
        }
    }

    // 计算当前赛事已选择玩法的数目
    getChoosePlays() {
        const {vid} = this.props;
        let outcomeList = games.Betslip.getChooseOutcomes();
        let objCount = _.countBy(outcomeList, item => item.substring(0, item.indexOf('#')));
        return objCount[vid] || 0;
    }

    /**
     * 加入或删除注项回调
     * @param isAdd
     * @param list
     */
    callbackAfterAdd(isAdd, list) {
        let { selectKey } = this.state;
        let outcomeList = games.Betslip.getChooseOutcomes();
        //更新投注揽信息
        this.props.updateBetSlipList({
            eventCount: list.length,
            outcomeCount: outcomeList.length,
            outcomeList: outcomeList,
            currentKey: (isAdd ? '+' : '-') + selectKey
        });
    }

    /**
     *   添加业务限制
     *  一场赛事一个玩法
     *  此弹窗点击方法先不用
     *  后期可能会用上
     */
    handlePressItem() {
        const {handlePressItem} = this.props;
        let { selectedState, selectKey } = this.state;
        let isSelected = handlePressItem(!selectedState, selectKey);
        this.setState({
            selectedState : isSelected,
        });
    }

    render() {
        const {cls, text = '', rate = '', name = '',homeRank,courtRank, num, ContentElement, handlePressItem} = this.props;
        const {selectedState, selectKey} = this.state;
        // console.log(selectedState);
        return (
            <TouchableOpacity style={[styles.betBtn, cls, selectedState ? styles.selBg : '']}
                              activeOpacity={1}
                              onPress={handlePressItem ? this.handlePressItem.bind(this) : this.addToBet.bind(this, selectedState)}>
                <ContentElement
                    text={text}
                    rate={rate}
                    homeRank={homeRank}
                    courtRank={courtRank}
                    name={name}
                    num={num}
                    isSelected={selectedState}/>
            </TouchableOpacity>
        )
    }
}

export default connectComponentAction(action, storeKeys.BET_BUTTON)(BetButton)

const styles = StyleSheet.create({
    betBtn: {
        flex: 1,
        backgroundColor: CommonColor.BgColorWhite,
        alignItems: 'center'
    },
    selBg: {
        backgroundColor: CommonColor.MainColor
    },
    added: {
        backgroundColor: CommonColor.MainColor,
        borderColor: 'transparent'
    },
    betTxt: {
        color: '#000',
        textAlign: 'center'
    },
    addTxt: {
        color: '#fff'
    }
});