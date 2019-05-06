/**
 * Created by easyLottoMac_Feng on 2019/1/3.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    Dimensions,
    StyleSheet
} from 'react-native';
import ExpertAvatar from "../expertAvatar";
import {SpiltLineColor} from "~/constants/color";
import {FONT_16} from "~/constants/fontSize";

const s_w = Dimensions.get('window').width;
const collectionPadding = 10;
const itemLineCount = 4;
const itemWidth = Math.floor((s_w - collectionPadding * 2) / itemLineCount);

export default class ExpertList extends Component {
    static defaultProps = {
        title: '',          // 标题名字
        expertList: [],     // 专家信息列表
        isFooter: false

    };

    constructor(props) {
        super(props);
        this.state = {
            MaxHeight: 0
        }
    }

    /**
     * 渲染 item 模块
     * @param item
     * @param index
     * @returns {*}
     */
    renderItem(item, index) {
        const {navigation} = this.props;
        let status = '5中' + (Math.round(5 * item.fiveWinrate));
        return (
            <View style={styles.expertListSty}
                  key={index}>
                <ExpertAvatar
                    navigation={navigation}
                    id={item.eid}
                    direction='column'
                    release={item.isSendToday}
                    uri={item.webApiPath + item.icon}
                    name={item.nickname}
                    status={status}/>
            </View>
        )
    }

    /**
     * 列表头部
     * @returns {*}
     */
    headerComponent() {
        const {title} = this.props;
        return (
            <View style={styles.bestExpertTitle}>
                <Text style={styles.titleLeftIcon}/>
                <Text style={styles.titleTextSty}>{title}</Text>
            </View>
        )
    }

    /**
     * 下拉刷新的功能
     */
    _refreshHandle() {
        const {refreshHandle} = this.props;
        this.setState({ //重置最大高度
            MaxHeight: 0
        });
        refreshHandle && refreshHandle();
    }

    /**
     * 上拉加载更多功能
     * @param eNative
     * @private
     */
    _scrollHandle(eNative) {
        let {MaxHeight} = this.state;
        const {pullUpLoad, isFooter} = this.props;
        let contentHeight = eNative.contentOffset.y + eNative.layoutMeasurement.height; //获取页面的高度
        //确保只有滑到页面底部才开始重新请求数据且只请求一次
        if (parseInt(contentHeight) === parseInt(eNative.contentSize.height) && eNative.contentSize.height > MaxHeight) {
            this.setState({
                MaxHeight: eNative.contentSize.height   //记录每一次请求数据前的最大高度
            });
            if (!isFooter) { //若文章已滑到底，则不再请求数据
                pullUpLoad && pullUpLoad();
            }
        }
    }

    render() {
        const {expertList} = this.props;
        return (
            <FlatList
                data={expertList}
                extraData={expertList}
                ListHeaderComponent={() => this.headerComponent()}
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                numColumns={itemLineCount}
                columnWrapperStyle={styles.columnWSty}
                renderItem={({item, index}) => this.renderItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews={false}
                onScroll={(e) => this._scrollHandle(e.nativeEvent)}
                scrollEventThrottle={1}
                refreshing={false}
                onRefresh={() => this._refreshHandle()}/>
        )
    }
}

const styles = StyleSheet.create({
    bestExpertTitle: {
        paddingVertical: 14,
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 24,
        borderColor: SpiltLineColor
    },
    columnWSty: {
        paddingHorizontal: 10
    },
    titleLeftIcon: {
        width: 4,
        height: 16,
        backgroundColor: '#DE1D30',
        marginRight: 8
    },
    titleTextSty: {
        color: '#DE1D30',
        fontSize: FONT_16
    },
    expertListSty: {
        width: itemWidth,
        alignItems: 'center',
        marginBottom: 24
    }
});