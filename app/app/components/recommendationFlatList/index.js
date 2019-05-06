/**
 * Created by easyLottoMac_Feng on 2019/1/5.
 */
import React, {Component} from 'react';
import {
    View,
    FlatList, StyleSheet
} from 'react-native';
import ExpertRecommend from '../expertRecommend';
import {BgColor, contentText} from "~/constants/color";

export default class RecommendationFlatList extends Component {
    static defaultProps = {
        flatListData: []
    };

    constructor(props) {
        super(props);
        this.state = {
            MaxHeight: 0
        }
    }


    /**
     * 渲染最新推荐的子列表
     * @returns {*}
     */
    renderNewRecItem(item, index) {
        let {navigation} = this.props;
        return (
            <View style={styles.newRecItemBoxSty}
                  key={index}>
                <ExpertRecommend
                    rid={item.rid}
                    eid={item.eid}
                    type={item.type}
                    icon={item.webApiPath + item.icon}
                    state={item.state}
                    events={item.events}
                    result={item.result}
                    navigation={navigation}
                    nickname={item.nickname}
                    comboWin={item.comboWin}
                    fiveWinrate={item.fiveWinrate}/>
            </View>
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
        const {flatListData} = this.props;
        return (
            <FlatList
                data={flatListData}
                extraData={flatListData}
                renderItem={({item, index}) => this.renderNewRecItem(item, index)}
                ItemSeparatorComponent={this.borderBottomList}
                keyExtractor={(item, index) => index.toString()}
                refreshing={false}
                onRefresh={() => this._refreshHandle()}
                onScroll={(e) => this._scrollHandle(e.nativeEvent)}
                scrollEventThrottle={1}/>
        )
    }
}
const styles = StyleSheet.create({
    newRecItemBoxSty: {
        backgroundColor: '#ffffff'
    },
    lineS: {
        height: 5,
        backgroundColor: BgColor
    }
});