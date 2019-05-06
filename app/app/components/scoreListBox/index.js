/**
 * Created by oWEn on 2018/8/27.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableWithoutFeedback, Image
} from 'react-native';
import * as colorConf from '../../constants/color';
import ScoreListBoxItem from "./component/item";
import upImg from './images/up.png';
import downImg from './images/down.png';

let _arrWeekCn = [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六',
];

export default class ScoreListBox extends Component {
    getDateText(date, weekCode) {
        return `${date.substr(-4, 2)}月${date.substr(-2, 2)}日 ${_arrWeekCn[weekCode]}`;
    }

    onPressHandle() {
        let {index, onPressHandle} = this.props;
        onPressHandle(index);
    }

    render() {
        const {data = {}, navHandle, show} = this.props;
        return (
            <View>
                <TouchableWithoutFeedback onPress={this.onPressHandle.bind(this)}>
                    <View style={styles.title}>
                        <View style={styles.itemTitleBorderLine} />
                        <View style={styles.itemTitleInfo}>
                            <View style={styles.itemTitle}>
                                <Text style={styles.itemTitleText}>{this.getDateText(data.vsDate, data.week)}</Text>
                            </View>
                            <View style={styles.itemTitle}>
                                <Text
                                    style={[styles.itemTitleText, styles.fontSmall]}>{data.list && data.list.length}场比赛已开奖</Text>
                            </View>
                        </View>
                        <Image source={show ? upImg : downImg}
                               style={{width: 12, height: 7}}/>
                    </View>
                </TouchableWithoutFeedback>
                {
                    show ? <ScoreListBoxItem navHandle={navHandle} data={data.list || []}/> :
                        null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        height: 30,
        width: 'auto',
        paddingVertical: 5,
        paddingHorizontal: 12,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colorConf.BorderColor
    },
    itemTitleBorderLine: {
        backgroundColor: colorConf.MainColor,
        width: 3,
        height: 15,
        marginRight: 8
    },
    itemTitleInfo: {
        flex: 1,
        flexDirection: 'row'
    },
    itemTitle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemTitleText: {
        color: '#333',
        fontSize: 14
    },
    fontSmall: {
        fontSize: 12,
        color: '#777',
        textAlign: 'left',
        paddingLeft: 8
    },
    line: {
        height: 1,
        backgroundColor: colorConf.BorderColor
    }
});
