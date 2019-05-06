/**
 * Created by easyLottoMac_Feng on 2018/12/13.
 */
import React, {Component} from 'react';
import {
    TextInput,
    StyleSheet
} from 'react-native';
import {BorderColor, MainColor} from "../../constants/color";

export default class OddInputBtn extends Component {
    static defaultProps = {
        isFocus: false
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue || '0.00',
            isFocus: false  // 是否是焦点
        }
    }

    /**
     * 获取焦点事件
     * @private
     */
    _onFocus() {
        this.setState({
            isFocus: true
        })
    }

    /**
     * 失去焦点事件
     * @private
     */
    _onBlur() {
        this.setState({
            isFocus: false
        });
    }

    /**
     * 输入框值改变改变事件
     * @param eValue
     * @private
     */
    _onChangeText(eValue) {
        const {onChangeCallback = null} = this.props;
        this.setState({
            value: eValue
        });
        onChangeCallback && onChangeCallback(eValue)
    }

    render() {
        const {isFocus, value} = this.state;
        return (
            <TextInput
                style={[styles.inputSty, isFocus && styles.activeInput]}
                defaultValue={value}
                keyboardType={'numeric'}
                selectionColor={MainColor}
                onChangeText={(eValue) => this._onChangeText(eValue)}
                onFocus={() => this._onFocus()}
                onBlur={() => this._onBlur()}
            />
        )
    }
}

const styles = StyleSheet.create({
    inputSty: {
        width: '100%',
        height: 40,
        borderColor: BorderColor,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        borderWidth: 1,
        textAlign: 'center',
        marginTop: 8
    },
    activeInput: {
        borderColor: MainColor
    }
});