import {Component} from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground
} from "react-native";
import React from "react";
import * as FontSize from "../../../../constants/fontSize";
import * as Color from "../../../../constants/color";

export default class ComboButton extends Component {
    static defaultProps = {
        m: '',               //串关方式的n
        n: '',               //串关方式的n
        isCanMultiple: '',   //是否可以多选（即是否为自由过关）
        selectTypeArr: []    //当前选择的过关方式
    };
    state = {
        isSelected: false    //是否选中状态，默认为false
    };

    /**
     *选择过关方式
     * @param type
     * @param isCanMultiple
     */
    handleSelectComboType(type, isCanMultiple) {
        const {handleSelectComboType} = this.props;
            handleSelectComboType && handleSelectComboType(type, isCanMultiple);
    }

    render() {
        const {m, n, isCanMultiple, selectTypeArr} = this.props;
        // console.log(selectTypeArr);
        let comboFormat = m === 1 ? '单关' : m + 'X' + n;
        let showTxt = m === 1 ? '单关' : m + '串' + n;
        let isSelected = selectTypeArr.indexOf(comboFormat) !== -1;
        let imgUrl = isSelected ? require('../../../../images/selected.png') : require('../../../../images/unselected.png');

        return (
            <TouchableOpacity style={styles.btnCnt} activeOpacity={1}
                              onPress={this.handleSelectComboType.bind(this, comboFormat, isCanMultiple)}>
                <ImageBackground style={styles.img} source={imgUrl} resizeMode="contain">
                    <Text style={[styles.txt, isSelected ? styles.selTxt : null]}>{showTxt}</Text>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    btnCnt: {
        paddingBottom: 5
    },
    img: {
        width: Dimensions.get('window').width / 3 - 10,
        height: 28,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    txt: {
        color: Color.tipsTextGrey,
        fontSize: FontSize.FONT_14,
        backgroundColor: 'transparent'
    },
    selTxt: {
        color: Color.MainColor
    },
});