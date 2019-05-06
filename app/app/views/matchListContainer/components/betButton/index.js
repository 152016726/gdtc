import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {connectComponentAction} from "~/reduxCfg";
import * as CommonColor from "~/constants/color";
import * as storeKeys from '~/constants/storeKeys';
import games from '@easylotto/bet';
import action from './action';
import PropTypes from 'prop-types';
import Emitter from '@easylotto/emitter';

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
        betKey: '',               //投注使用key 格式为 vid#sort#oddname
        currentKey: '',           //当前处理投注key
        handlePressItem: null,     //弹框使用点击事件
    };
    state = {
        isSelected: false
    };

    componentWillMount() {
        this.setIsSelected();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentKey !== this.props.currentKey) {
            this.setIsSelected();
        }
    }

    setIsSelected() {
        const {betKey} = this.props;
        let outcomeList = games.Betslip.getChooseOutcomes();
        this.setState({
            isSelected: outcomeList.indexOf(betKey) !== -1
        });
    }

    /**
     * 加入投注蓝或从投注揽删除注项方法
     */
    addToBet() {
        let {betKey} = this.props;
        //将选中的注项加入betslip
        if (this.state.isSelected) {
            games.Betslip.deleteFromBetslip([betKey], this.callbackAfterAdd.bind(this, false))
        } else {
            games.Betslip.setOutcomeToBetslip([betKey], this.callbackAfterAdd.bind(this, true));
        }
    }

    /**
     * 加入或删除注项回调
     * @param isAdd
     * @param list
     */
    callbackAfterAdd(isAdd, list) {
        let {vid, betKey} = this.props;
        //更新投注揽信息
        this.props.updateBetArea({
            eventCount: list.length
            // currentKey: (isAdd ? '+' : '-') + betKey
        });
        Emitter.global.emit('event_update_' + vid, (isAdd ? '+' : '-') + betKey);
    }

    /**
     *   添加业务限制
     *  一场赛事一个玩法
     *  此弹窗点击方法先不用
     *  后期可能会用上
     */
    handlePressItem() {
        // console.log('handlePressItem');
        const {handlePressItem, betKey} = this.props;
        let { isSelected } = this.state;
        isSelected = handlePressItem(!isSelected, betKey);
        this.setState({
            isSelected : isSelected,
        });
    }

    render() {
        const {cls, text = '', rate = '', name = '', homeRank, courtRank, num, ContentElement, handlePressItem, isLast} = this.props;
        const {isSelected} = this.state;
        return (
            <TouchableOpacity style={[styles.betBtn, cls, isSelected ? styles.selBg : '',isLast ? styles.noRightBorder: {}]}
                              activeOpacity={1}
                              onPress={handlePressItem ? this.handlePressItem.bind(this) : this.addToBet.bind(this)}
            >
                <ContentElement
                    text={text}
                    rate={rate}
                    homeRank={homeRank}
                    courtRank={courtRank}
                    name={name}
                    num={num}
                    isSelected={isSelected}
                />
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
    },
    noRightBorder: {
        borderRightWidth: 0
    }
});