/**
 * Created by easyLottoMac on 2018/10/23.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity, Dimensions
} from 'react-native';
import ScoreFlatList from '../../components/scoreFlatList';
import {FONT_12, FONT_14} from '~/constants/fontSize';
import {BorderColor, BgColor, BgColorWhite, tipsTextGrey} from '~/constants/color';
import {
    DEVICER_TYPE,
    SPANISH_LIGA_NODEID,
    PREMIER_LEAGUE_NODEID,
    SERIE_A_NODEID,
    BUNDESLIGA_NODEID,
    FRENCH_ARMOR_NODEID,
    CHAMPIONS_NODEID,
    EXPERT_NODEID,
    PAGE_SIZE
} from "../../../../constants/articleConfig";
import getInformationList from "~/services/getInformationList";

const s_h = Dimensions.get('window').height;

const _NODEIDS = [          // 请求的文章列表 nodeId
    PREMIER_LEAGUE_NODEID,  // 英超
    SPANISH_LIGA_NODEID,    // 西甲
    SERIE_A_NODEID,         // 意甲
    BUNDESLIGA_NODEID,      // 德甲
    FRENCH_ARMOR_NODEID,    // 法甲
    CHAMPIONS_NODEID,       // 欧冠
    EXPERT_NODEID           // 专家预测
];


export default class Recommend extends Component {
    static defaultProps = {
        homeName: '',                           // 主队队名
        awayName: ''                            // 客队队名
    };

    constructor(props) {
        super(props);
        this.state = {
            MaxHeight: 0,                       // 记录页面的最大高度
            flatListData: [],                   // 展示的赛事信息数组
            listHeader: null,                   // 列表的头部内容
            isFooter: true,                     // 数据是否已加载完
            pageIndexNum: 0,                    // 请求数据的页码
            isLoading: false                    // 是否是加载中的状态
        }
    }

    componentWillMount() {
        this.getDataList();
    }

    /**
     * 接口请求
     */
    getDataList(MaxHeight = 0) {
        let {flatListData, pageIndexNum} = this.state;
        const {homeName, awayName, navigation, vsDate} = this.props;
        //当从首页的资讯按钮直接进入会获取不到头部的队名，所以需要使用跳转的时候传递
        let _homeName = navigation.state.params.homeName || homeName || '';
        let _awayName = navigation.state.params.awayName || awayName || '';
        let _vsDate = navigation.state.params.vsDate || vsDate || '';
        let endDate = Date.prototype.parseISO8601(_vsDate);
        // 资讯起始日期（默认为三天前的日期）
        let startDate = new Date(endDate.getTime() - (24 * 3600 * 1000 * 3));
        let rspObj = {
            nodeIds: _NODEIDS,                              // 请求竞彩资讯文章列表
            deviceType: DEVICER_TYPE,                       // 设别类型
            keyWords: _homeName + ' ' + _awayName,          // 关键字
            pageIndex: pageIndexNum,                        // 页码
            from: startDate.getTime(),                      // 起始日期
            to: endDate.getTime(),                          // 结束日期
            pageSize: PAGE_SIZE                             // 每次请求的文章条数
        };
        flatListData = pageIndexNum === 0 ? [] : flatListData;
        getInformationList.getData(rspObj).then((rsp) => {
            if (rsp.data.list.length > 0) {
                this.setState({
                    flatListData: flatListData.concat(rsp.data.list),
                    pageIndexNum: ++pageIndexNum,           // 记录当前页码
                    MaxHeight: MaxHeight,
                    isFooter: rsp.data.list.length < PAGE_SIZE  // 若条数不足请求条数则显示到底提示
                });
            } else {// 当资讯文章已加载完
                this.setState({
                    pageIndexNum: pageIndexNum,
                    MaxHeight: 0,
                    isFooter: true
                })
            }
        })
    }

    /**
     * 静态页跳转
     * @param item 文章信息
     */
    informationHandle(item) {
        this.props.navigation.navigate('StaticPage', {item});
    }

    /**
     * 列表 render
     *
     */
    informationList(item) {
        return (
            <TouchableOpacity style={styles.informationList}
                              onPress={() => {
                                  this.informationHandle(item)
                              }}>
                <View style={{marginRight: 10}}>
                    <Image style={styles.imageS}
                           source={{uri: item.titleImage}}/>
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
            </TouchableOpacity>
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
        const {flatListData, isLoading} = this.state;
        let isFooter = false;
        return (
            <View>
                {
                    isFooter && <Text style={styles.footerSty}>
                        没有更多相关资讯
                    </Text>
                }
                {
                    flatListData.length <= 0 && <Text style={[styles.footerSty, styles.emptySt]}>
                        暂无更多相关资讯
                    </Text>
                }
                {
                    isLoading && <Text style={styles.footerSty}>
                        正在加载...
                    </Text>
                }
            </View>
        )
    }

    /**
     * 上拉加载更多功能
     * @param eNative
     * @private
     */
    _scrollHandle(eNative) {
        let {MaxHeight, isFooter, flatListData} = this.state;
        let contentHeight = eNative.contentOffset.y + eNative.layoutMeasurement.height; //获取页面的高度
        // console.log(isFooter);
        if (isFooter || flatListData.length <= 0) {
            this.setState({
                isLoading: false
            })
        } else {
            this.setState({isLoading: (eNative.contentOffset.y + eNative.layoutMeasurement.height) > eNative.contentSize.height});
        }
        //确保只有滑到页面底部才开始重新请求数据且只请求一次
        if ((contentHeight === eNative.contentSize.height &&
            eNative.contentSize.height > MaxHeight)
            && !isFooter) {
            MaxHeight = eNative.contentSize.height;
            this.getDataList(MaxHeight);
        }
    }

    render() {
        const {flatListData} = this.state;
        return (
            <ScoreFlatList
                style={styles.SFBoxSty}
                data={flatListData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => this.informationList(item, index)}
                ItemSeparatorComponent={this.borderBottomList}
                ListFooterComponent={() => this.renderFooter()}
                scrollHandle={(e) => this._scrollHandle(e)}
                scrollEventThrottle={1}
            />
        )
    }
}

const styles = StyleSheet.create({
    SFBoxSty: {
        backgroundColor: BgColor,
        marginTop: 2
    },
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
        borderRadius: 2
    },
    titleS: {
        fontSize: FONT_14,
        flexWrap: 'wrap',
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
        color: tipsTextGrey,
    },
    footerSty: {
        alignItems: 'center',
        fontSize: FONT_12,
        color: '#D1D1D1',
        textAlign: 'center',
        padding: 12,
        backgroundColor: BgColor
    },
    emptySt: {
        lineHeight: s_h - 360,
        color: tipsTextGrey,
        fontSize: FONT_14
    }
});
