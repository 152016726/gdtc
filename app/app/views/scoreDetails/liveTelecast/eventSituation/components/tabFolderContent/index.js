/**
 * 头部折叠组件
 * 收起/展开内部内容
 * Created by DDT on 2018/10/17.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Animated
} from 'react-native';
import RotateView from '../../../../../../components/rotateView';


class TabFolderContent extends Component {
    static defaultProps = {
        title: '',      // 标题内容
        isShow: true,   // 是否显示内容
        change: false   // 改变标志，改变触发重计算高度
    };

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,     // 标题内容
            isShow: props.isShow,   // 是否显示内容
            contentHeight: 'auto',  // 当前内容高度
            innerHeight: 'auto',    // 内层高度，当指定高度后内层高度不变，防止内容压缩
            oriHeight: 0            // 内容原始高度
        }
    }

    /**
     * 触发点击显示和隐藏
     */
    handlePressButton() {
        let {isShow, oriHeight} = this.state;
        this.setState({
            isShow: !isShow
        });
        Animated.timing(
            this.state.contentHeight,
            {
                toValue: isShow ? 0 : oriHeight
            },
        ).start();
    }

    componentWillReceiveProps(nextPros){
        if(this.props.change !== nextPros.change){
            this.setState({
                oriHeight: 0,
                contentHeight: 'auto',
                innerHeight: 'auto'
            });
        }
    }

    /**
     * 内容定位页面后触发，用于获取真实容器高度
     * @param event
     * @private
     */
    _onLayout(event) {
        let {x, y, width, height} = event.nativeEvent.layout;
        let {contentHeight, oriHeight} = this.state;
        let {change} = this.props;
        // 只有初始化才记录初始高度
        if(oriHeight === 0){
            this.setState({
                contentHeight: new Animated.Value(height),
                innerHeight: height,
                oriHeight: height
            });
        }
    }

    render() {
        let {title, isShow, contentHeight, innerHeight} = this.state;
        // console.log(innerHeight);
        return <View style={styles.container}>
            <TouchableOpacity style={styles.titleStyle} onPress={this.handlePressButton.bind(this)}>
                <Text style={styles.textStyle}>{title}</Text>
                <RotateView isShow={isShow} startRange={'180deg'} endRange={'0deg'}>
                    <Image
                        style={styles.imgStyle}
                        source={require('./images/icon_down.png')}
                    />
                </RotateView>
            </TouchableOpacity>
            <Animated.View style={[styles.contentStyle, {height: contentHeight}]} onLayout={this._onLayout.bind(this)}>
                <View style={{height: innerHeight}}>
                    {this.props.children}
                </View>
            </Animated.View>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 18,
        paddingRight: 18,
        height: 40,
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 16
    },
    btnStyle: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgStyle: {
        width: 14,
        height: 8
    },
    contentStyle: {
        flex: 1,
        overflow: 'hidden'
    }
});

export default TabFolderContent;