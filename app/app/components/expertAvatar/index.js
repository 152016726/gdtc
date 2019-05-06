/**
 * Created by owen on 2018/12/29.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as colorConf from '~/constants/color.js'
import avatarImg from './images/avatar.png'
import _ from 'lodash'


export default class expertAvatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selfStyle: _.merge({}, styles, props.customStyles) //组件实际使用的样式
        }
    }

    static defaultProps = {
        uri: '',
        width: 65,            //图片宽度，高度
        id: '',               //专家id
        name: null,             //专家姓名
        release: null,        //当天是否有发单
        status: null,         //状态(几种几)
        navigation: null,     //必须从外面传入,否则点击头像没有跳转
        direction: 'column',  //column垂直显示,row水平显示
        customStyles: {}      //自定义样式, 按照styles进行覆盖
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.customStyles !== this.props.customStyles) {
            this.setState({
                selfStyle: _.merge({}, styles, this.props.customStyles)
            });
        }
    }

    /**
     * 跳转页面，navigation必须从外面传入
     */
    goPage() {
        let {id, navigation} = this.props;
        navigation && navigation.navigate('ExpertZone', {id});
    }

    render() {
        let {uri, width, name, release, status, direction} = this.props;
        let {selfStyle} = this.state;
        return <View style={[selfStyle.wrapper, direction === 'column' ? {width: width + 18} : {flexDirection: 'row'}]}>
            <View style={[direction === 'column' ? {alignItems: 'center'} : {flexDirection: 'row'}]}>
                <TouchableOpacity onPress={() => this.goPage()}
                                  style={[{alignItems: 'center'}, direction === 'column' ? null : {flexDirection: 'row'}]}>
                    <View style={[selfStyle.avatarWrapper, {width: width, height: width}]}>
                        <Image
                            style={[selfStyle.avatar, {width: width - 2, height: width - 2, borderRadius: (width - 2 ) / 2}]}
                            source={{uri}}
                            defaultSource={avatarImg} //默认图片
                        />
                        {
                            release === 'true' && <View style={selfStyle.release}/>
                        }
                    </View>
                    {
                        (direction === 'row' && !name) ? null : <View style={selfStyle.textBox}>
                            <Text style={selfStyle.text}>{name}</Text>
                        </View>
                    }
                </TouchableOpacity>
            </View>
            {status && <View style={[selfStyle.textBox, selfStyle.status]}>
                <Text
                    style={[selfStyle.text, selfStyle.statusText]}>{status}</Text>
            </View>}
        </View>
    }
}

const styles = {
    wrapper: {
        position: 'relative',
        alignItems: 'center'
    },
    avatarWrapper: {
    },
    avatar: {
        borderWidth: 1,
        borderColor: '#f2f2f2',
        marginTop: 1,
        marginLeft: 1
    },
    textBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 28,
        paddingHorizontal: 4
    },
    text: {
        color: '#333333',
        fontSize: 13
    },
    release: {
        width: 6,
        height: 6,
        backgroundColor: colorConf.DarkerRedColor,
        borderRadius: 3,
        position: 'absolute',
        top: 0,
        right: 0
    },
    status: {
        backgroundColor: colorConf.MainColor,
        borderRadius: 10,
        height: 18,
        paddingHorizontal: 6,
        overflow: 'hidden',
        minWidth: 40
    },
    statusText: {
        color: '#ffffff'
    },
    flexDirectionRow: {
        flexDirection: 'row'
    }
};