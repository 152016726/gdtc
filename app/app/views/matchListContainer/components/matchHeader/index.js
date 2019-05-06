/**
 * Created by DDT on 2018/12/3.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import upImg from './images/up.png';
import downImg from './images/down.png';
import * as CommonColor from '~/constants/color';
import {contentText} from "../../../../constants/color";
import PropTypes from 'prop-types';

export default class matchHeader extends Component {
    static propTypes = {
        children: PropTypes.element
    };

    static defaultProps = {
        strDate: '',                // 比赛日期
        week: '',                   // 比赛周几
        count: 0,                   // 比赛场数
        isFocusEvent: false,        // 是否焦点赛事
        status: false,              // true取上标,false取下标
        onPress: ()=>{}             // 点击回调触发
    };

    // 下拉上收功能
    _onPressBtn() {
        const {onPress} = this.props;
        onPress && onPress();
    }

    render() {
        let {status, isFocusEvent, week, strDate, count} = this.props;
        let imgSource = status ? downImg : upImg;
        return <View style={isFocusEvent && styles.border_bottom}>
            <TouchableOpacity
                activeOpacity={1}
                style={styles.container}
                onPress={this._onPressBtn.bind(this)}>
                <View style={styles.titleContent}>
                    <View style={styles.header}>
                        <View style={styles.line}/>
                        {
                            !isFocusEvent && <View style={styles.txtCt}>
                                <Text style={styles.dateTxt}>{week}</Text>
                            </View>
                        }
                        <View style={styles.txtCt}>
                            <Text style={styles.dateTxt}>{strDate}</Text>
                        </View>
                        <View style={styles.txtCt}>
                            <Text style={styles.lastTxt}><Text style={styles.txtCount}>{count}</Text>场比赛可选</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.imgCt}>
                    <Image source={imgSource} style={styles.btnStyle}/>
                </View>
            </TouchableOpacity>
        </View>
    }
}

//样式表
const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: CommonColor.headerBorderColor,
        backgroundColor: CommonColor.DateBarColor,
        justifyContent: 'center'
    },
    border_bottom: {
        borderBottomWidth: 1,
        borderBottomColor: CommonColor.headerBorderColor,
    },
    bgColor: {
        backgroundColor: CommonColor.DateBarColor
    },
    titleContent:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingRight:40
    },
    imgCt: {
        width: 40,
        height: 40,
        position: 'absolute',
        right: 12,
        top: 15,
        alignItems: 'center'
    },
    btnStyle: {
        width: 12,
        height: 7
    },
    header: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: CommonColor.DateBarColor
    },
    line: {
        width: 10,
        height: 15,
        borderLeftWidth: 3,
        borderLeftColor: CommonColor.MainColor,
        marginLeft: 12
    },
    txtCt: {
        marginRight: 10
    },
    dateTxt: {
        color: contentText,
        fontSize: 13
    },
    lastTxt: {
        fontSize: 12,
        color: 'rgb(101,101,101)'
    },
    txtCount: {
        color: CommonColor.MainColor
    }
});