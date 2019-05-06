import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView
} from 'react-native';
import * as colorConf from "../../constants/color";
import imgRight from "../../images/right.png";
import OddTrendText from '../oddTrendText';
import getExponentialList from "../../services/getExponentialList"
import ScoreScrollView from "../../views/scoreDetails/components/scoreScrollView"

export default class ExponentialItemPagelList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    dataSurplus = [];  //剩余data，用于上拉加载
    updateData = true; //上拉刷新时是否更新data
    hadLoaded = false; //已经加载过数据
    timer = null;
    _isMounted = false;
    static defaultProps = {
        pageSize: 50
    };

    /**
     * react-native-scrollable-tab-view 第一次加载会加载当前页和next页，加载过后不会在摧毁？
     */
    componentDidMount() {
        this._isMounted = true
        this.props.screenProps.navigation = this.props.navigation; //TODO 让顶部tab（亚盘、欧赔、必发）可以触发导航
        this.initData();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    /**
     *  从本地更新获取data
     */
    getDataByDataSurplus() {
        let {dataSurplus} = this;
        let {pageSize} = this.props;
        let {data} = this.state;
        let arr = data.concat(dataSurplus.splice(0, pageSize));
        return arr;
    }

    /**
     * 请求接口
     */
    initData() {
        let {screenProps} = this.props;
        let {type, getList} = screenProps;
        getList.getData({
            vid: screenProps.vid,
            market: screenProps.type,
            isMain: false
        }).then(rsp => {
            this.hadLoaded = true;
            // screenProps.dataBackUp = rsp.data && rsp.data[type] && rsp.data[type].list;
            this.dataSurplus = rsp.data[type].list.concat([]);
            let arr = this.getDataByDataSurplus();
            if (this.dataSurplus.length !== 0) {
                this.setDataUpdataByTimer();
            }
            if (this._isMounted) {
                this.setState({
                    data: arr
                });
            }
        })
    }

    /**
     * 设置定时器加载全部数据
     */
    setDataUpdataByTimer() {
        this.timer = setTimeout(() => {
            let arr = this.getDataByDataSurplus();
            if (this._isMounted) {
                this.setState({
                    data: arr
                }, () => {
                    if (this.dataSurplus.length !== 0) {
                        this.setDataUpdataByTimer();
                    }
                    else {
                        clearTimeout(this.timer);
                        this.timer = null;
                    }
                })
            }
        }, 200);
    }

    /**
     * 点击跳转
     */
    pressList(index) {
        let {data = []} = this.state;
        this.props.navigation.navigate('Detail', {
            activeCid: index,
            //data
        });
    }


    /**
     * 渲染顶部标题
     */
    renderTitle(arr) {
        return <View style={[styles.row, styles.title]}>
            {
                arr.map((ele, index) => <View key={index} style={[styles.textWrapper, {flex: ele.flex}]}>
                    <Text style={[styles.textCommon, styles.textGray]}>{ele.text}</Text></View>)
            }
        </View>
    }

    /**
     * 渲染箭头图标
     */
    renderImageRight() {
        return <View style={styles.imageWrapper}>
            <Image source={imgRight} style={styles.imgRight}/>
        </View>
    }

    /**
     * 渲染亚盘列表
     */
    renderAOView() {
        let {data} = this.state;
        let arrFlex = [1, 2, 2];
        return <ScoreScrollView style={styles.wrapper}>
            {
                this.renderTitle(
                    [
                        {text: '公司', flex: arrFlex[0]},
                        {text: '初盘', flex: arrFlex[1]},
                        {text: '即时盘', flex: arrFlex[2]}
                    ])
            }
            {
                data.map((ele, index) =>
                    <TouchableOpacity onPress={() => {
                        this.pressList(ele.cid)
                    }} key={index} style={[styles.row]}>
                        <View style={[styles.textWrapper, styles.br, {flex: arrFlex[0]}]}>
                            <Text style={[styles.textCommon, styles.textCompany]}
                                  numberOfLines={2}
                                  ellipsizeMode='tail'>
                                {ele.companyCnShort}
                            </Text>
                        </View>
                        <View style={[styles.fr, styles.br, {flex: arrFlex[1]}]}>
                            <OddTrendText text={ele.homeOddsInit}/>
                            <OddTrendText text={ele.handicapInit}/>
                            <OddTrendText text={ele.awayOddsInit}/>
                        </View>
                        <View style={[styles.f2, styles.fr, {flex: arrFlex[2]}]}>
                            <OddTrendText text={ele.homeOddsCurr} type={ele.homeTrend}/>
                            <OddTrendText text={ele.handicapCurr} type={ele.handTrend}/>
                            <OddTrendText text={ele.awayOddsCurr} type={ele.awayTrend}/>
                        </View>
                        {
                            this.renderImageRight()
                        }
                    </TouchableOpacity>
                )
            }
        </ScoreScrollView>
    }

    /**
     * 渲染欧赔列表
     */
    renderEOView() {
        let {data = []} = this.state;
        let arrFlex = [1, 1, 1, 1, 1];
        return <ScoreScrollView style={styles.wrapper}>
            {
                this.renderTitle(
                    [
                        {text: '公司', flex: arrFlex[0]},
                        {text: '', flex: arrFlex[1]},
                        {text: '主胜', flex: arrFlex[2]},
                        {text: '平局', flex: arrFlex[3]},
                        {text: '客胜', flex: arrFlex[4]}
                    ])
            }
            {
                data.map((ele, index) =>
                    <TouchableOpacity onPress={() => {
                        this.pressList(ele.cid)
                    }} key={index} style={[styles.row]}>
                        <View style={{flex: arrFlex[0]}}>
                            <View style={[styles.textWrapper, styles.br]}>
                                <Text numberOfLines={2}
                                      ellipsizeMode='tail'
                                      style={[styles.textCommon, styles.textCompany]}>
                                    {ele.companyCnShort}
                                </Text>
                            </View>
                        </View>
                        <View style={{flex: arrFlex[1] + arrFlex[2] + arrFlex[3] + arrFlex[4]}}>
                            <View style={[styles.fr, styles.bb]}>
                                <View style={[styles.textWrapper, {flex: arrFlex[1]}]}>
                                    <Text style={[styles.textCommon]}>
                                        初盘
                                    </Text>
                                </View>
                                <OddTrendText flex={arrFlex[2]} text={ele.homeOddsInit}/>
                                <OddTrendText flex={arrFlex[2]} text={ele.drawOddsInit}/>
                                <OddTrendText flex={arrFlex[2]} text={ele.awayOddsInit}/>
                            </View>
                            <View style={[styles.fr]}>
                                <View style={[styles.textWrapper, {flex: arrFlex[1]}]}>
                                    <Text style={[styles.textCommon, styles.up]}>
                                        即盘
                                    </Text>
                                </View>
                                <OddTrendText flex={arrFlex[2]} text={ele.homeOddsCurr} type={ele.homeTrend}/>
                                <OddTrendText flex={arrFlex[2]} text={ele.drawOddsCurr} type={ele.drawTrend}/>
                                <OddTrendText flex={arrFlex[2]} text={ele.awayOddsCurr} type={ele.awayTrend}/>
                            </View>
                        </View>
                        {
                            this.renderImageRight()
                        }
                    </TouchableOpacity>
                )
            }
        </ScoreScrollView>
    }

    render() {
        let {data} = this.state;
        let {type} = this.props.screenProps;
        if (!this.hadLoaded) {
            return null;
        }
        if (data.length === 0) {
            return <View style={styles.noDataWarp}>
                <Text style={styles.noDataText}>暂无数据</Text>
            </View>;
        }
        else if (type === 'ah') {
            return this.renderAOView();
        }
        else if (type === 'wdw') {
            return this.renderEOView();
        }
        else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    noDataWarp: {
        paddingTop: 150,
        alignItems: 'center'
    },
    noDataText: {
        color: colorConf.tipsTextGrey
    },
    wrapper: {
        margin: 12
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
        paddingTop: 5,
        paddingBottom: 5
    },
    fr: {
        flexDirection: 'row'
    },
    title: {
        backgroundColor: 'transparent',
        marginBottom: 0,
        paddingRight: 18
    },
    textGray: {
        color: '#777777'
    },
    textWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textCompany: {
        fontSize: 13
    },
    textCommon: {
        fontSize: 12
    },
    br: {
        borderRightWidth: 1,
        borderRightColor: colorConf.BorderColor
    },
    bb: {
        borderBottomWidth: 1,
        borderBottomColor: colorConf.BorderColor
    },
    f1: {
        flex: 1
    },
    f2: {
        flex: 2
    },
    f3: {
        flex: 3
    },
    f4: {
        flex: 4
    },
    f7: {
        flex: 7
    },
    imageWrapper: {
        width: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgRight: {
        width: 6,
        height: 11
    },
    up: {
        color: colorConf.upColor
    },
    down: {
        color: colorConf.downColor
    }
});
