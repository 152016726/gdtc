/**
 * Created by Roger(ljx) on 2018/8/30.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Dimensions
} from 'react-native';
import upImg from './images/up.png';
import downImg from './images/down.png';
import * as CommonColor from '../../constants/color';
import PropTypes from 'prop-types';

export default class ToggleItem extends Component {
    static propTypes = {
        children: PropTypes.element
    };

    static defaultProps = {
        times: 200,              // 动画持续时间
        isFocusEvent: false,     // 是否焦点赛事
        isFirst: false,          // 是否第一场赛事,
        content:null,            // 内容
        title:null,              // 头部左边内容
        titleRight:null,         // 头部右边内容
        cls: '',                 // 大盒子添加的样式
        subCls: ''               // 头部添加的样式
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            status: false,  // true取上标,false取下标
            isHide: false  // 控制比赛内容是否隐藏
        };
    }

    // 下拉上收功能
    _onPressBtn() {
        // 改变图标
        this.setState({
            status: !this.state.status
        });
        // 隐藏与展示内容
        if (!this.state.status) {
            this.setState({
                isHide: true
            });
        } else {
            this.setState({
                isHide: false
            });
        }
        // 动画配置
        LayoutAnimation.configureNext(LayoutAnimation.create(this.props.times,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.opacity
        ));
    }

    render() {
        const {title, titleRight,content, isFocusEvent, isFirst, cls, subCls} = this.props;
        //是否需要显示title
        let isShowTitle = isFocusEvent ? isFirst : true;
        let imgSource = this.state.status ? downImg : upImg;
        return <View style={[isFocusEvent ? styles.border_bottom : '', cls]}>
                {
                    isShowTitle &&
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.container, subCls]}
                        onPress={this._onPressBtn.bind(this)}>
                        <View style={styles.titleContent}>
                            {title}
                            {titleRight}
                        </View>
                        <View style={styles.imgCt}>
                            <Image source={imgSource} style={styles.btnStyle}/>
                        </View>
                    </TouchableOpacity>
                }
                {this.state.isHide ? null : content}
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
    }
});