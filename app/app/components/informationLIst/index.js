/**
 * Created by mac-ddt on 2018/8/27.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableHighlight
} from 'react-native';
import {
    FONT_12,
    FONT_16
} from '~/constants/fontSize';
import {
    BgColor,
    BorderColor,
    contentText,
    tipsTextGrey,
    BgColorWhite
} from '~/constants/color';

const DEFAULTIMG = require('../../images/default_info_icon.jpg');   // 默认图片路径
const FALISTHEIGHT = Dimensions.get('window').height - 165;

export default class InformationList extends Component {
    static defaultProps = {
        flatListData: [],   // 展示的赛事信息数组
        listHeader: null,   // 列表的头部内容
        isFooter: false,    // 是否显示到底提示语
        isLoading: false,   // 是否显示加载状态的提示语
        InfoImgUrl: ''      // 图片路径
    };

    constructor(props) {
        super(props);
        this.state = {
            MaxHeight: 0
        }
    }

    /**
     * 静态页跳转
     * @param item
     */
    informationHandle(item) {
        this.props.navigation.navigate('StaticPage', {item});
    }

    /**
     * 列表 render
     *
     */
    informationList(item) {
        const {InfoImgUrl} = this.props;
        let sourceUrl = item.titleImage && item.titleImage !== 'null' ? {uri: item.titleImage} : DEFAULTIMG;
        if (InfoImgUrl) {
            sourceUrl = InfoImgUrl;
        }
        return (
            <TouchableHighlight
                underlayColor='rgba(0, 0, 0, 0.2)'
                onPress={() => {
                    this.informationHandle(item)
                }}>
                <View style={styles.informationList}>
                    <View style={{marginRight: 10}}>
                        <Image
                            style={styles.imageS}
                            source={sourceUrl}/>
                    </View>
                    <View style={styles.rightBox}>
                        <View>
                            <Text style={styles.titleS}
                                  numberOfLines={2}
                                  ellipsizeMode='tail'>
                                {item.title}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.publishDataStyle}>
                                {item.publishDate.substring(5, 16)}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
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
        let {isFooter, isLoading, flatListData} = this.props;
        isLoading = isLoading || this.state.isLoading;
        let isNoData = false;
        if (flatListData.length <= 0) {
            isNoData = true;
            isFooter = false;
            isLoading = false;
        }
        return (
            <View>
                {
                    isFooter && <Text style={styles.footerSty}>
                        没有更多啦
                    </Text>
                }
                {
                    isLoading && <Text style={styles.footerSty}>
                        正在加载...
                    </Text>
                }
                {
                    isNoData && <Text style={[styles.footerSty, styles.noDataSty]}>
                        暂无相关资讯
                    </Text>
                }
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
        if (isFooter) {
            this.setState({
                isLoading: false
            })
        } else {
            this.setState({isLoading: (eNative.contentOffset.y + eNative.layoutMeasurement.height) > eNative.contentSize.height});
        }
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
        const {flatListData, listHeader, cls = null} = this.props;
        return (
            <FlatList
                style={[{backgroundColor: BgColorWhite}, cls && cls]}
                data={flatListData}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => listHeader || <View style={{height: 0}}/>}
                renderItem={({item, index}) => this.informationList(item, index)}
                ItemSeparatorComponent={this.borderBottomList}
                ListFooterComponent={() => this.renderFooter()}
                onScroll={(e) => this._scrollHandle(e.nativeEvent)}
                scrollEventThrottle={1}
                refreshing={false}
                onRefresh={() => this._refreshHandle()}
                extraData={flatListData}
                alwaysBounceVertical={false}
            />
        )
    }
}

const styles = StyleSheet.create({
    informationList: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: BgColorWhite
    },
    lineS: {
        borderBottomWidth: 1,
        marginHorizontal: 12,
        borderColor: BorderColor
    },
    imageS: {
        width: 100,
        height: 75,
        resizeMode: 'stretch',
        borderRadius: 2,
        borderColor: BorderColor,
        borderWidth: 1
    },
    titleS: {
        fontSize: FONT_16,
        flexWrap: 'wrap',
        color: contentText,
        marginBottom: 5
    },
    rightBox: {
        justifyContent: 'space-between',
        paddingTop: 2,
        flex: 1
    },
    subTitleS: {
        fontSize: FONT_12,
        color: tipsTextGrey,
        flexWrap: 'wrap'
    },
    publishDataStyle: {
        textAlign: 'right',
        fontSize: FONT_12,
        color: tipsTextGrey
    },
    footerSty: {
        fontSize: FONT_12,
        color: '#666666',
        textAlign: 'center',
        padding: 12,
        backgroundColor: BgColor
    },
    noDataSty: {
        height: FALISTHEIGHT,
        lineHeight: FALISTHEIGHT,
    }
});
