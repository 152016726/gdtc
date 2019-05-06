/**
 * Created by mac-ddt on 2017/6/21.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import _ from 'lodash';

export default class HeaderButton extends Component {
    static defaultProps = {
        content: [],  //渲染数据
    };

    _onPress() {
        const {navigation} = this.props;
        navigation.setParams({
            isShowMethod: !navigation.state.params.isShowMethod
        });
    }

    render() {
        const {content} = this.props;
        const {sort, isShowMethod} = this.props.navigation.state.params || {};
        const disabled = content.length <= 1;
        const title = sort ? content.filter((cnt) => {
            return cnt.sort === sort
        })[0].text : content[0].text;
        const uri = require('../../images/downArrow.png');
        return (
            <TouchableOpacity style={[styles.header, {marginLeft: disabled ? 0 : 18}]} disabled={disabled}
                              activeOpacity={1} onPress={this._onPress.bind(this)}>
                <Text style={styles.title}>{title}</Text>
                {!disabled &&
                <Image style={[styles.icon, isShowMethod ? styles.rotateIcon : '']} resizeMode="contain" source={uri}/>}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flex:1,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        position: 'relative',
        marginHorizontal: 4,
        width: 12,
        height: 12,
    },
    rotateIcon: {
        transform: ([{rotate: '180deg'}])
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
    }
});