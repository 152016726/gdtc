/**
 * Created by oWEn on 2018/9/3.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Alert,
    TouchableOpacity
} from 'react-native';
import FilterListButton from './button'
import * as colorConf from '../../constants/color'

let _globalSelectedArrInit = {}; //保存全部页面的selectedArr(初始化时的状态，用于还原)
let _globalSelectedArr = {};     //保存全部页面的selectedArr

export default class FilterList extends Component {
    constructor(props) {
        super(props);
        if (_globalSelectedArr[props.type] && props.dataKey === _globalSelectedArr[props.type].dataKey) { //_globalSelectedArr存在该组件数据
            let arr = _globalSelectedArr[props.type].arr[props._index];
            let selectedAll = this.checkIsSelectAll(props.data, arr);
            this.state = {
                data: props.data,
                selectedArr: arr,
                selectedAll: selectedAll
            };
        }
        //以下都是第一加载该组件时初始化selectedArr和selectedAll
        else if (props.isSingle) { //单选
            if (props.initArr) {
                this.state = {
                    data: props.data,
                    selectedArr: [props.initArr[0]] //管理选中类型的数组
                };
            }
            else {
                this.state = {
                    data: props.data,
                    selectedArr: [props.data[0][props.idName]] //管理选中类型的数组
                };
            }
        }
        else if (props.max !== null) { //有设置最大选中数（暂时没有全选反选按钮）
            if (props.initArr) {
                this.state = {
                    data: props.data,
                    selectedArr: props.initArr.slice(0, props.max)
                };
            }
            else {
                this.state = {
                    data: props.data,
                    selectedArr: props.data.slice(0, props.max).map(ele => ele[props.idName])
                };
            }
        }
        else {
            if (!props.initArr) { //没有传initArr
                if (props.initSelectedAll) { //默认全选
                    this.state = {
                        data: props.data,
                        selectedArr: props.data.map(ele => ele[props.idName]),
                        selectedAll: true
                    };
                }
                else {
                    this.state = {
                        data: props.data,
                        selectedArr: [],
                        selectedAll: false
                    };
                }

            } else {
                let selectedAll = this.checkIsSelectAll(props.data, props.initArr);
                this.state = {
                    data: props.data,
                    selectedArr: props.initArr,
                    selectedAll: selectedAll
                };
            }
        }
    }

    static defaultProps = {
        title: '',                //标题
        initArr: null,            //初始化选中数据
        initSelectedAll: true,    //默认选中全部
        dataKey: null,            //只要和上次的值不同，就会初始化selectedArr而不是使用_globalSelectedArr，建议用Symbol或者时间戳
        isSingle: false,          //是否只能单选，单选不显示全选和反选, 会忽略max和min
        data: [],                 //按钮数据(用于初始化)
        countPerRow: 4,           //每行显示多少个按钮
        checkAllBtn: false,       //是否显示全选按钮
        invertBtn: false,         //是否显示反选按钮
        textName: 'text',         //显示文字的key值
        idName: 'id',             //每个格子使用的id
        type: null,               //用于销毁时在全局储存selectArr
        _index: 0,                //属于页面的多个FilterList序列号，用于储存selectArr
        max: null,                //最大选中数
        min: null,                //最小选中数
        onChanged: () => {        //值改变后回调
        },
        onPress: () => {          //按钮点击回调
        },
        onCheckAll: () => {       //点击全选回调
        },
        onInvertCheck: () => {    //点击反选回调
        },
        onDidMount: () => {       //渲染完后回调
        }
    }

    componentDidMount() {
        let {onDidMount} = this.props;
        this.setGlobalSelectedArr(_globalSelectedArrInit); //记录初始化时的状态
        onDidMount && onDidMount(this.state.selectedArr);
    }

    componentWillUnmount() {
        this.setGlobalSelectedArr(_globalSelectedArr); //记录离开时的状态
    }

    setGlobalSelectedArr(obj) {
        let {type, _index, dataKey} = this.props;
        if (obj[type]) {
            obj[type].arr[_index] = this.state.selectedArr;
        }
        else {
            obj[type] = {arr: [this.state.selectedArr]};
        }
        obj[type].dataKey = dataKey;
    }


    /**
     * 检查是不是选择全部
     * @param data
     */
    checkIsSelectAll(data, selectedArr) {
        let {idName} = this.props;
        let selectedAll = true;
        data.forEach(ele => { //检查是不是全选
            let selected = false;
            selectedArr.forEach(ele_i => {
                if (ele[idName] === ele_i) {
                    selected = true;
                }
            });
            if (!selected) {
                selectedAll = false
            }
        });
        return selectedAll;
    }

    /**
     * 检查是min和max
     */
    checkMinAndMax(arrLen) {
        let pass = true;
        let {max, min} = this.props;
        if (max === null && min === null) {
            return true
        }
        if (typeof(max) === 'number' && arrLen > max) {
            pass = false;
            Alert.alert(`最多只能选择${max}个`);
        }
        else if (typeof(min) === 'number' && arrLen < min) {
            pass = false;
            Alert.alert(`最少选择${min}个`);
        }
        return pass;
    }


    modifyArr(arr) {
        let {countPerRow} = this.props,
            result = [];
        for (var i = 0, len = arr.length; i < len; i += countPerRow) {
            result.push(arr.slice(i, i + countPerRow));
        }
        return result;
    }
    /**
     * 点击触发
     */
    checkBtn(id) {
        let {isSingle} = this.props;
        let {selectedArr, data} = this.state;
        let index = selectedArr.indexOf(id);
        let arr = [];
        if (isSingle) { //单选
            arr = [id];
            this.setState({
                selectedArr: arr
            });
            return arr;
        }
        else if (index === -1) {
            let mn = this.checkMinAndMax(selectedArr.length + 1);
            if (!mn) {
                return selectedArr;
            }
            arr = [...selectedArr, id];
            let selectedAll = this.checkIsSelectAll(data, arr);
            this.setState({
                selectedArr: arr,
                selectedAll
            })
        }
        else {
            let mn = this.checkMinAndMax(selectedArr.length - 1);
            if (!mn) {
                return selectedArr;
            }
            arr = [...selectedArr];
            arr.splice(index, 1);
            this.setState({
                selectedArr: arr,
                selectedAll: false
            })
        }
        return arr;
    }

    /**
     * 点击全选
     */
    checkAll() {
        let {idName} = this.props,
            {data} = this.state,
            arr = [];
        data.forEach((ele) => {
            arr.push(ele[idName]);
        });
        this.setState({
            selectedArr: arr,
            selectedAll: true
        });
        return arr;
    }

    /**
     * 点击反选
     */
    invertCheck() {
        let {idName} = this.props,
            {selectedArr, data} = this.state,
            arr = [];
        data.forEach((ele) => {
            if (selectedArr.indexOf(ele[idName]) === -1) {
                arr.push(ele[idName]);
            }
        });
        this.setState({
            selectedArr: arr,
            selectedAll: false
        });
        return arr;
    }

    /**
     * 渲染title
     */
    renderTitle() {
        let {title} = this.props;
        if (title !== '') {
            return <View style={styles.title}>
                <Text style={styles.titleText}>{title}</Text>
            </View>
        }
        else {
            return null
        }
    }

    /**
     * 渲染每一行
     */
    renderRow(arr) {
        let {countPerRow} = this.props;
        arr = this.modifyArr(arr);
        return arr.map((ele, index) => {
            return <View style={styles.row} key={index}>
                {this.renderGrid(ele)}
                {
                    arr.length - 1 == index ? this.renderEmptyGrid(countPerRow - ele.length) : null
                }
            </View>
        })

    }

    /**
     * 渲染空格子，主要是为了排版
     */
    renderEmptyGrid(count) {
        let arr = new Array(count);
        arr.fill('');
        return arr.map((ele, index) => {
            return <View key={index} style={styles.grid}></View>
        })
    }

    /**
     * 渲染选项按钮
     */
    renderGrid(arr) {
        let {onPress, textName, idName, onChanged} = this.props;
        let {selectedArr} = this.state;
        return arr.map((ele, index) => {
            let checked = selectedArr.indexOf(ele[idName]) !== -1;
            let config = {
                checked,
                text: ele[textName],
                onPress: () => {
                    let arr = this.checkBtn(ele[idName]);
                    onPress(arr, ele);  //外部onPress回调
                    onChanged(arr, ele);
                }
            };
            return <FilterListButton key={index} {...config} />
        })
    }

    /**
     * 渲染全选和反选按钮
     */
    renderButtons() {
        let {checkAllBtn, invertBtn, onCheckAll, onInvertCheck, onChanged, isSingle, max, min} = this.props;
        let {selectedAll} = this.state;
        if (isSingle || max !== null || min !== null) return;
        return <View style={styles.buttons}>
            {
                checkAllBtn ? <TouchableOpacity
                    onPress={() => {
                        let arr = this.checkAll();
                        onCheckAll(arr);
                        onChanged(arr);
                    }}
                    style={[styles.gridInner, styles.btn, selectedAll ? styles.orangeBtn : null]}>
                    <Text style={[styles.gridText, selectedAll ? styles.orangeBtnText : null]}>全选</Text>
                </TouchableOpacity> : null
            }
            {
                invertBtn ? <TouchableOpacity
                    onPress={() => {
                        let arr = this.invertCheck();
                        onInvertCheck(arr);
                        onChanged(arr);
                    }}
                    style={[styles.gridInner, styles.btn, selectedAll ? null : styles.orangeBtn]}>
                    <Text style={[styles.gridText, selectedAll ? null : styles.orangeBtnText]}>反选</Text>
                </TouchableOpacity> : null
            }
        </View>
    }

    render() {
        let {data} = this.state;
        return (
            <View>
                {
                    this.renderTitle()
                }
                <View style={styles.list}>
                    {
                        this.renderRow(data)
                    }
                </View>
                {
                    this.renderButtons()
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        padding: 12,
        backgroundColor: '#fff'
    },
    titleText: {
        color: '#333333',
        fontSize: 14
    },
    list: {
        padding: 6
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    grid: {
        flex: 1,
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 3,
        paddingBottom: 3
    },
    checked: {
        fontSize: 20
    },
    gridInner: {
        borderWidth: 1,
        borderColor: '#999999',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5
    },
    gridInnerChecked: {
        borderColor: colorConf.MainColor
    },
    gridText: {
        color: '#999999',
        fontSize: 15
    },
    emptyGrid: {
        flex: 1,
        padding: 12
    },
    buttons: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: colorConf.BorderColor,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btn: {
        width: 88,
        marginLeft: 12
    },
    orangeBtn: {
        backgroundColor: colorConf.MainColor,
        borderColor: colorConf.MainColor
    },
    orangeBtnText: {
        color: '#ffffff'
    }
});