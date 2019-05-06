/**
 * Created by owen on 2018/8/10.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import {connectReducerComponent} from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../constants/storeKeys'
import FilterList from '../../components/filterList'
import * as colorConf from '../../constants/color'
import * as sundry from '../../constants/sundry'

let idNameObj = {oddIdName: 'id', mcIdName: 'lid', eoIdName: 'id', ecIdName: 'id'};
let pageStore = {};


class MatchTypeSelect extends Component {
    static navigationOptions = ({navigation}) => {
        let {_cbFn, title} = navigation.state.params;
        return {
            title: title ? title : "赛事筛选",     //title可以在筛选页传过来
            headerRight: <TouchableWithoutFeedback>
                <View>
                    <Text onPress={_cbFn} style={styles.headerBtn}>
                        确定
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        }
    }

    componentWillMount() {
        this.initPageData();
        this.initNavigationParams();
    }

    /**
     * 离开页面时记录页面信息
     */
    componentWillUnmount() {
        let {type, timeStamp} = this.props.navigation.state.params || {};
        let arr = type.split('#');
        let store = this.getStoreValue();
        pageStore[arr[0]] = {
            timeStamp,
            store
        };
    }

    /**
     * 获取每个页面应该备份的value
     */
    getStoreValue() {
        let {type} = this.props.navigation.state.params || {};
        let {matchTypeVal, oddsVal, companyVal} = this.props;
        if (type === 'award' || type === 'score') {
            return {
                matchTypeVal
            }
        }
        else if (type === 'matchList') {
            return {
                oddsVal,
                matchTypeVal
            }
        }
        else if (type === 'exponent#match' || type === 'exponent#company') {
            return {
                oddsVal,
                matchTypeVal,
                companyVal
            }
        }
    }

    /**
     * 初始化navigation的params
     */
    initNavigationParams() {
        let {navigation} = this.props;
        navigation.setParams({
            _cbFn: this.topNavBtnClick.bind(this)
        });
    }

    /**
     * 初始化页面的筛选值
     */
    initPageData() {
        let {changeSomeProps} = this.props;
        let obj = this.getinitPageData();
        changeSomeProps(obj);
    }

    /**
     * 获取初始化值，为防止页面初始化时改变props异步带来的数据不同步
     */
    getinitPageData(){
        let {type, count} = this.props.navigation.state.params || {};
        let arr = type.split('#');
        let haveToInitPage = this.haveToInitPage();
        let obj = {
            matchTypeVal: [],
            oddsVal: [],
            companyVal: []
        };
        if(!haveToInitPage){
            Object.assign(obj, pageStore[arr[0]].store);
        }
        if(count){  //假如跳转时带了cout过来，会甚至
            obj.matchCanSelect = count
        }
        return obj;
    }
    /**
     * 检测是否需要初始化页面设置
     */
    haveToInitPage() {
        let {type, timeStamp} = this.props.navigation.state.params || {};
        let arr = type.split('#');
        if (pageStore[arr[0]] && pageStore[arr[0]].timeStamp === timeStamp) {
            return false;
        }
        else {
            return true
        }
    }

    /**
     * 按确定按钮执行
     */
    topNavBtnClick() {
        this.props.navigation.goBack();
    }

    /**
     * 按按钮执行回调
     */
    btnCbHandle(arr) {
        let {navigation} = this.props;
        let cbFn = navigation.getParam('cbFn');
        cbFn(...arr);
    }

    /**
     * 按确定按钮执行
     */
    topNavBtnClick() {
        this.props.navigation.goBack();
    }


    oddCheckBtnCb(arr) {
        let {changeSomeProps, matchTypeVal} = this.props;
        changeSomeProps({
            oddsVal: arr
        });
        this.btnCbHandle([matchTypeVal, arr[0]]);
    }

    matchCheckBtnCb(arr) {
        let {changeSomeProps, oddsVal} = this.props;
        changeSomeProps({
            matchTypeVal: arr
        });
        this.btnCbHandle([arr, oddsVal[0]]);
    }

    eoCheckBtnCb(arr) {
        let {changeSomeProps, companyVal} = this.props;
        if (arr[0] === 'ah') { //切换到亚盘
            companyVal = sundry.EXPONENT_COMPANY_INIT_AH;
        }
        else {
            companyVal = sundry.EXPONENT_COMPANY_INIT_WDW;
        }
        this.exCmp.setState({  //改变公司筛选组件的选择的值
            selectedArr: companyVal
        });
        changeSomeProps({
            oddsVal: arr,
            companyVal
        });
        this.btnCbHandle([arr[0], companyVal]);
    }

    ecCheckBtnCb(arr) {
        let {changeSomeProps, oddsVal} = this.props;
        changeSomeProps({
            companyVal: arr
        });
        this.btnCbHandle([oddsVal[0], arr]);
    }

    /**
     * 筛选组件默认值设置
     * @param fn  使用默认全选使用该方法，该方法返回一个数组
     * @param arr 不使用默认全选的使用该数组
     */
    getInitData(fn, arr) {
        let haveToInitPage = this.haveToInitPage();
        if (haveToInitPage) {
            return fn();
        }
        else {
            return arr;
        }
    }

    /**
     * 根据不同类型渲染不同组件
     */
    renderFilterList() {
        //传参页面的类型，用来判断是否显示赔率区间选择（WDW，HWDW显示）
        let {type = '', sort} = this.props.navigation.state.params || {};
        if (type === 'award' || type === 'score') {
            let matchConf = this.getConf('matchConf');
            return <View>
                <FilterList {...matchConf} />
            </View>;
        }
        else if (type === 'matchList') {
            let oddConf = this.getConf('oddConf');
            let matchConf = this.getConf('matchConf');
            return <View>
                {
                    (sort == 'WDW' || sort == 'HWDW') && <FilterList {...oddConf} />
                }
                <FilterList {...matchConf} />
            </View>
        }
        else if (type === 'exponent#match' || type === 'exponent#company') {
            let matchConf = this.getConf('matchConf');
            let exponentOdds = this.getConf('exponentOddsConf');
            let exponentCompany = this.getConf('exponentCompanyConf');
            if (type === 'exponent#match') {
                return <View>
                    <View style={styles.hideView}>
                        <FilterList {...exponentOdds} />
                        <FilterList {...exponentCompany} />
                    </View>
                    <FilterList {...matchConf} />
                </View>
            }
            else if (type === 'exponent#company') {
                return <View>
                    <FilterList {...exponentOdds} />
                    <FilterList ref={(ref) => this.exCmp = ref} {...exponentCompany} />
                    <View style={styles.hideView}>
                        <FilterList {...matchConf} />
                    </View>
                </View>
            }
        }
    }

    /**
     * 获取不同组件的配置
     */
    getConf(confType) {
        let {oddsRangeList, changeSomeProps, oddsVal} = this.props;
        let  initPageData = this.getinitPageData();
        let {leagueList = [], exponentOddsList = [], exponentCompanyListAH = [], exponentCompanyListWDW = []} = this.props.navigation.state.params || {};
        if (confType == 'oddConf') {
            return {
                data: oddsRangeList,
                countPerRow: 4,
                title: '指数区间选择',
                textName: 'text',
                idName: idNameObj.oddIdName,
                initArr: this.getInitData(() => {
                    let arr = [];
                    oddsRangeList.forEach(ele => {
                        arr.push(ele[idNameObj.oddIdName]);
                    })
                    return arr;
                }, initPageData.oddsVal),
                isSingle: true,
                onCheckAll: (arr) => {
                    this.oddCheckBtnCb(arr);
                },
                onInvertCheck: (arr) => {
                    this.oddCheckBtnCb(arr);
                },
                onPress: (ele, arr) => {
                    this.oddCheckBtnCb(arr);
                },
                onDidMount: (arr) => {
                    changeSomeProps({
                        oddsVal: arr
                    });
                }
            };
        }
        else if (confType == 'matchConf') { //赛事筛选
            return {
                data: leagueList,
                countPerRow: 3,
                checkAllBtn: true,
                initArr: this.getInitData(() => {
                    let arr = [];
                    leagueList.forEach(ele => {
                        arr.push(ele[idNameObj.mcIdName]);
                    });
                    return arr;
                }, initPageData.matchTypeVal),
                idName: idNameObj.mcIdName,
                textName: 'lname',
                invertBtn: true,
                title: '赛事选择',
                onCheckAll: (arr) => {
                    this.matchCheckBtnCb(arr);
                },
                onInvertCheck: (arr) => {
                    this.matchCheckBtnCb(arr);
                },
                onPress: (ele, arr) => {
                    this.matchCheckBtnCb(arr);
                },
                onDidMount: (arr) => {
                    changeSomeProps({
                        matchTypeVal: arr
                    });
                }
            }
        }
        else if (confType == 'exponentOddsConf') {  //指数页面的赔率选择
            return {
                data: exponentOddsList,
                countPerRow: 3,
                title: '指数选择（单选）',
                textName: 'text',
                idName: idNameObj.eoIdName,
                initArr: this.getInitData(() => {
                    let arr = [];
                    exponentOddsList.forEach(ele => {
                        arr.push(ele[idNameObj.eoIdName]);
                    });
                    return arr;
                }, initPageData.oddsVal),
                isSingle: true,
                onCheckAll: (arr) => {
                    this.eoCheckBtnCb(arr);
                },
                onInvertCheck: (arr) => {
                    this.eoCheckBtnCb(arr);
                },
                onPress: (ele, arr) => {
                    this.eoCheckBtnCb(arr);
                },
                onDidMount: (arr) => {
                    changeSomeProps({
                        oddsVal: arr
                    });
                }
            };
        }
        else if (confType == 'exponentCompanyConf') {  //指数页面的公司选择
            return {
                data: oddsVal[0] === 'ah' ? exponentCompanyListAH : exponentCompanyListWDW,
                countPerRow: 3,
                min: 1,
                max: 3,
                title: '公司选择（多选,最多三家）',
                textName: 'text',
                idName: idNameObj.ecIdName,
                initArr: this.getInitData(() => {
                    let arr = [];
                    exponentCompanyListAH.forEach(ele => {
                        if (sundry.EXPONENT_COMPANY_INIT_AH.indexOf(ele.id) !== -1) {
                            arr.push(ele[idNameObj.ecIdName]);
                        }
                    });
                    return arr;
                }, initPageData.companyVal),
                onCheckAll: (arr) => {
                    this.ecCheckBtnCb(arr);
                },
                onInvertCheck: (arr) => {
                    this.ecCheckBtnCb(arr);
                },
                onPress: (ele, arr) => {
                    this.ecCheckBtnCb(arr);
                },
                onDidMount: (arr) => {
                    changeSomeProps({
                        companyVal: arr
                    });
                }
            };
        }
        else return {}
    }

    render() {
        let {matchCanSelect} = this.props;
        return <ScrollView>
            <View style={styles.title}><Text style={styles.titleText}>共有<Text
                style={styles.mainColor}>{matchCanSelect}</Text>场比赛</Text></View>
            {
                this.renderFilterList()
            }
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    hideView: {
        height: 0,
        overflow: 'hidden'
    },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 24
    },
    titleText: {
        color: '#666666'
    },
    mainColor: {
        color: colorConf.MainColor
    },
    fontSmall: {
        fontSize: 12,
        color: '#777'
    },
    headerBtn: {
        marginRight: 15,
        fontSize: 15,
        color: '#fff',
        padding: 4
    }
});
export default connectReducerComponent(storeKey.MATCH_TYPE_SELECT_STORE, reducer, state, action)(MatchTypeSelect)