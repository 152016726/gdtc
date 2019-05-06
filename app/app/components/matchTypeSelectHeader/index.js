/**
 * Created by owen on 2018/12/29.
 */
import React, {Component} from 'react';
import {
    Text, View
} from 'react-native';
import * as colorConf from '~/constants/color.js'


export default class MatchTypeSelectHeader extends Component {
    static defaultProps = {
        count: 0
    }

    render() {
        let {count} = this.props;
        return <View style={styles.title}><Text style={styles.titleText}>共有<Text
            style={styles.mainColor}>{count}</Text>场比赛</Text></View>
    }
}
const styles = {
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 24
    },
    titleText: {
        color: '#666666'
    },
    mainColor: {
        color: colorConf.MainColor
    }
};