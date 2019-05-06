import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { connectReducerComponent } from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../constants/storeKeys';
import Headerleft from '../../components/headerLeft'
import { FONT_12, FONT_14 } from '../../constants/fontSize';
import { BorderColor, BgColor, BgColorWhite, tipsTextGrey } from '../../constants/color';
import MyProjectItem from './components/myProjectItem';

const backImg = require('../../images/back.png');

class MyProject extends Component {
    static navigationOptions = ({ navigation }) => {
        const { handleGoBack = null } = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={backImg}/>;
        return { title : "竞彩方案", headerLeft }
    };

    static defaultProps = {
        dataList : [], //展示的赛事信息数组
        listHeader : null, //列表的头部内容
        isFooter : false
    };

    constructor(props) {
        super(props);
        this.state = {
            MaxHeight : 0
        }
    }

    componentWillMount() {
        this.props.reqData();
        const { navigation } = this.props;
        navigation.setParams({
            handleGoBack : () => {
                this.handleGoBack()
            }
        });
    }

    /**
     * 返回
     */
    handleGoBack() {
        this.props.navigation.goBack();
    }

    /**
     * 删除
     */
    handleDelete(item) {
        this.props.handleDelete(item.id);
    }

    /**
     * 跳转内页
     */
    handleGoToDetail(item) {
        const { navigation } = this.props;
        navigation.navigate('SolutionIntro',{item});
    }

    /**
     * 列表 render
     *
     */
    renderItem(item, index) {
        return (
            <MyProjectItem index={index} item={item} handleGoToDetail={this.handleGoToDetail.bind(this)} handleDelete={this.handleDelete.bind(this)}/>
        )
    }

    /**
     * 分割线 render
     * @returns {*}
     */
    borderBottomList() {
        return (
            <View style={styles.lineS}/>
        )
    }

    /**
     * 底部提示语 render
     * @returns {*}
     */
    renderFooter() {
        return (
            <View>
                <Text style={styles.footerSty}>
                    没有更多啦
                </Text>
            </View>
        )
    }

    /**
     * 下拉刷新的功能
     */
    _refreshHandle() {
        const { refreshHandle } = this.props;
        this.setState({ //重置最大高度
            MaxHeight : 0
        });
        refreshHandle && refreshHandle();
    }

    /**
     * 上拉加载更多功能
     * @param eNative
     * @private
     */
    _scrollHandle(eNative) {
        let { MaxHeight } = this.state;
        const { pullUpLoad, isFooter } = this.props;
        let contentHeight = eNative.contentOffset.y + eNative.layoutMeasurement.height; //获取页面的高度
        //确保只有滑到页面底部才开始重新请求数据且只请求一次
        if (contentHeight === eNative.contentSize.height && eNative.contentSize.height > MaxHeight) {
            this.setState({
                MaxHeight : eNative.contentSize.height   //记录每一次请求数据前的最大高度
            });
            if (!isFooter) { //若文章已滑到底，则不再请求数据
                pullUpLoad && pullUpLoad();
            }
        }
    }

    render() {
        const { dataList, listHeader, isFooter } = this.props;
        return (
            <FlatList style={{ backgroundColor : BgColor }}
                      data={dataList}
                      keyExtractor={(item, index) => index.toString()}
                      ListHeaderComponent={() => listHeader || <View style={{ height : 0 }}/>}
                      renderItem={({ item, index }) => this.renderItem(item, index)}
                      ItemSeparatorComponent={this.borderBottomList}
                      ListFooterComponent={() => isFooter && this.renderFooter()}
                      onScroll={(e) => this._scrollHandle(e.nativeEvent)}
                      scrollEventThrottle={1}
                      refreshing={false}
                      onRefresh={() => this._refreshHandle()}
            />
        )
    }
}

export default connectReducerComponent(storeKey.MY_PROJECT, reducer, state, action)(MyProject)

const styles = StyleSheet.create({
    informationList : {
        flexDirection : 'row',
        paddingVertical : 10,
        paddingHorizontal : 12,
        backgroundColor : BgColorWhite
    },
    lineS : {
        borderBottomWidth : 1,
        marginHorizontal : 12,
        borderColor : BorderColor
    },
    imageS : {
        width : 100,
        height : 75,
        resizeMode : 'stretch',
        borderRadius : 2
    },
    titleS : {
        fontSize : FONT_14,
        flexWrap : 'wrap',
        marginBottom : 5
    },
    rightBox : {
        justifyContent : 'space-between',
        paddingTop : 2,
        flex : 1
    },
    subTitleS : {
        fontSize : FONT_12,
        color : tipsTextGrey,
        flexWrap : 'wrap'
    },
    publishDataStyle : {
        textAlign : 'right',
        fontSize : FONT_12,
        color : tipsTextGrey
    },
    footerSty : {
        fontSize : FONT_12,
        color : '#D1D1D1',
        textAlign : 'center',
        padding : 12,
        backgroundColor : BgColor
    }
});