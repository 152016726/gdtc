import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as CommonColor from '../../../../../../constants/color';
import * as FONT_SIZE from '../../../../../../constants/fontSize';

export default class Lineup extends Component {
    static defaultProps = {
        title: '',                     ///头部文字
        isBtn: false,                  //是否需要按钮,
        handleSelectType: () => {
        }                              //点击事件
    };
    state = {
        curType: 'home'
    };

    /**
     * 切换主客方法
     */
    handleSelect(type) {
        const {curType} = this.state;
        const {handleSelectType} = this.props;
        if (curType === type) return false; else {
            this.setState({
                curType: type
            });
            handleSelectType(type)
        }
    }

    render() {
        const {curType} = this.state;
        const {isBtn, title} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.leftSide}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                {isBtn &&
                <View style={styles.rightSide}>
                    <TouchableOpacity style={[styles.btn, curType === 'home' ? styles.activeBg : {}]} activeOpacity={1}
                                      onPress={this.handleSelect.bind(this, 'home')}>
                        <Text style={[styles.txt, curType === 'home' ? styles.activeTxt : {}]}>主队</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, curType === 'away' ? styles.activeBg : {}]} activeOpacity={1}
                                      onPress={this.handleSelect.bind(this, 'away')}>
                        <Text style={[styles.txt, curType === 'away' ? styles.activeTxt : {}]}>客队</Text>
                    </TouchableOpacity>
                </View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 50,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    leftSide: {
        flex: 7
    },
    title: {
        fontSize: FONT_SIZE.FONT_16
    },
    rightSide: {
        flex: 3,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    btn: {
        width: 48,
        height: 24,
        backgroundColor: '#E1E1E1',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        overflow: 'hidden'
    },
    activeBg: {
        backgroundColor: CommonColor.ACTIVE_BG
    },
    txt: {
        color: CommonColor.flatColor,
        textAlign: 'center',
        lineHeight: 24,
        fontSize: FONT_SIZE.FONT_12
    },
    activeTxt: {
        color: CommonColor.BgColorWhite
    }
});