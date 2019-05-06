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
import HeaderLeft from "~/components/headerLeft"

let filterCmpArr;             //组件数组
let filterCmpOriSelectedArr;  //组件初始化选择
let loadedAllFilter;

class MatchTypeSelectVersion2 extends Component {
    static navigationOptions = ({navigation}) => {
        let {confirm, goBackFn, title, config = []} = navigation.state.params;
        let headerLeft = <HeaderLeft
            handleGoBack={() => {
                filterCmpArr.forEach((item, index) => {
                    item.setState({
                        selectedArr: filterCmpOriSelectedArr[index]
                    });
                    config[index].onChanged(filterCmpOriSelectedArr[index]);
                });
                goBackFn && goBackFn();
                navigation.goBack()
            }}
            img={require('../../images/back.png')}/>;
        return {
            title: title ? title : "赛事筛选",     //title可以在筛选页传过来
            headerLeft,
            headerRight: <TouchableWithoutFeedback>
                <View>
                    <Text onPress={() => {
                        confirm && confirm();
                        navigation.goBack();
                    }} style={styles.headerBtn}>
                        确定
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        }
    };

    componentWillMount() {
        filterCmpArr = [];
        filterCmpOriSelectedArr = [];
        loadedAllFilter = false;
    }

    componentDidMount() {
        let {changeSomeProps} = this.props;
        let {headerOps} = this.props.navigation.state.params || {};
        if (headerOps) {  //初始化头部插件传参
            changeSomeProps({
                headerOpsForProps: headerOps
            });
        }
    }

    /**
     * 执行页面传过来的原函数，获取返回的值
     */
    handleOnPress() {
        let {changeSomeProps} = this.props;
        let args = arguments;
        args = [].slice.call(args);
        let fnOnPress = args.shift(0);
        let result = fnOnPress.apply(fnOnPress, args);
        if (result) {
            changeSomeProps({
                headerOpsForProps: result
            })
        }
    }

    render() {
        let {headerOpsForProps} = this.props;
        let filterTypeCountObj = {};
        let {
            config = [],        //筛选组件配置
            type,               //页面类型，为唯一值，假如组件设置的type，采用组件的type，而不是全局设置的type
            dataKey,            //页面是否需要初始化选中值，只要和上次传的值不一样，就使用初始化，第一次默认使用
            Header = null,      //头部组件
            getAllFilterCb      //创建所有filter后的回调，返回所有filter
        } = this.props.navigation.state.params || {};
        return <ScrollView>
            {Header && <Header {...headerOpsForProps}/>}
            {
                config.map((ele, index) => {
                    let fnOnPress = ele.onPress;
                    let onChanged = ele.onChanged;
                    let onCheckAll = ele.onCheckAll;
                    let onInvertCheck = ele.onInvertCheck;
                    let onDidMount = ele.onDidMount;
                    let filterPageType = type;
                    let _index;
                    if (fnOnPress) {
                        ele.onPress = this.handleOnPress.bind(this, fnOnPress);
                    }
                    if (onChanged) {
                        ele.onChanged = this.handleOnPress.bind(this, onChanged);
                    }
                    if (onCheckAll) {
                        ele.onCheckAll = this.handleOnPress.bind(this, onCheckAll);
                    }
                    if (onInvertCheck) {
                        ele.onInvertCheck = this.handleOnPress.bind(this, onInvertCheck);
                    }
                    if (onDidMount) {
                        ele.onDidMount = this.handleOnPress.bind(this, onDidMount);
                    }
                    if (ele.type) {
                        filterPageType = ele.type;
                    }
                    if (filterTypeCountObj.hasOwnProperty(filterPageType)) {
                        filterTypeCountObj[filterPageType] += 1;
                        _index = filterTypeCountObj[filterPageType];
                    }
                    else {
                        filterTypeCountObj[filterPageType] = 0;
                        _index = filterTypeCountObj[filterPageType];
                    }
                    return <FilterList dataKey={dataKey}
                                       ref={(ref) => {
                                           if (ref) {
                                               filterCmpArr[index] = ref;
                                               if (!loadedAllFilter) {
                                                   filterCmpOriSelectedArr[index] = ref.state.selectedArr;
                                               }
                                               if (index === config.length - 1) {
                                                   getAllFilterCb && getAllFilterCb(filterCmpArr);
                                                   loadedAllFilter = true;
                                               }
                                           }
                                       }}
                                       _index={_index}
                                       type={filterPageType}
                                       key={index}
                                       {...ele}
                    />
                })
            }
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    headerBtn: {
        marginRight: 15,
        fontSize: 15,
        color: '#fff',
        padding: 4
    }
});
export default connectReducerComponent(storeKey.MATCH_TYPE_SELECT_STORE, reducer, state, action)(MatchTypeSelectVersion2)