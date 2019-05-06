/**
 * ShareDialog
 */
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import Dialog from '../dialog';
import { MainColor } from '../../constants/color';
import PropTypes from 'prop-types';

const imgSource = [ require('../../images/umeng_socialize_wechat.png'),
    require('../../images/umeng_socialize_wxcircle.png'),
    require('../../images/umeng_socialize_qq.png'),
    require('../../images/umeng_socialize_sina.png') ];

export default class ShareDialog extends Dialog {

    bindingData; //绑定的数据对象；非强制

    static propTypes = {
        actions : PropTypes.arrayOf(PropTypes.object).isRequired,
        showCloseButton : PropTypes.bool,
        onClose : PropTypes.func,
    };

    static defaultProps = {
        // animationType:'slide',
        contentStyle : {
            justifyContent : 'flex-end',
            padding : 0,
            backgroundColor : 'rgba(0,0,0,0.5)'
        },
        showCloseButton : false,
        onClose : () => {
        },
    };

    show(data) {
        this.bindingData = data;
        super.show();
    }

    renderContent() {
        const { actions, showCloseButton } = this.props;
        return (
            <View style={{ justifyContent : 'flex-end', flexDirection : 'column' }}>
                <View style={styles.container}>
                    {actions.map((action, index) => this._renderActionItem(action, index))}
                </View>
                <View>
                    {showCloseButton && this._renderCloseButton()}
                </View>
            </View>
        );
    }

    _renderCloseButton() {
        const { onClose } = this.props;
        return (
            <View style={{ flexDirection : 'row', justifyContent : 'flex-end' }}>
                <TouchableOpacity
                    style={styles.deleteBox}
                    activeOpacity={0.5}
                    onPress={() => {
                        this.dismiss();
                        onClose()
                    }}>
                    <View style={{ alignItems : 'center', justifyContent : 'center' }}>
                        <Text style={styles.deleteText}>取消</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _renderActionItem(action, index) {
        return (
            <TouchableOpacity
                key={index}
                style={styles.item}
                activeOpacity={0.5}
                onPress={() => this._onPressItem(action)}
            >
                <ImageBackground style={{ height : 50, width : 50 }} source={require('../../images/circle_50.png')}>
                    <Image style={{ height : 50, width : 50 }} source={imgSource[ index ]}/>
                </ImageBackground>
                <View style={{ alignItems : 'center', justifyContent : 'center' }}>
                    <Text style={styles.text}>{action.text}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _onPressItem(action) {
        this.dismiss();
        action.onPress(this.bindingData);
    }

}

const styles = StyleSheet.create({
    container : {
        height : 101,
        flexDirection : 'row',
        alignItems : 'stretch',
        backgroundColor : '#F5F5F5'
    },
    item : {
        flex : 1,
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center',
        paddingVertical : 10,
        borderTopWidth : StyleSheet.hairlineWidth,
        borderColor : 'white'
    },
    text : {
        paddingTop : 10,
        fontSize : 12,
        color : '#333333',
    },
    deleteBox : {
        flex : 1,
        backgroundColor : '#FFFFFF',
        height : 60,
        paddingVertical : 2,
        paddingHorizontal : 14
    },
    deleteText : {
        textAlign : 'center',
        color : MainColor,
        fontSize : 14,
        lineHeight : 40
    }
});