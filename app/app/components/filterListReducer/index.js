/**
 * Created by oWEn on 2018/8/30.
 */
import React, {Component} from 'react';
import {connectReducerComponent} from '../../reduxCfg'
import * as storeKey from '../../constants/storeKeys'
import reducer from './reducer'
import state from './state'
import action from './action'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image
} from 'react-native';
import rightPng from './images/right.png';

let gridConf = {
    id: 'lid',
    text: 'lName'
}

class FilterList extends Component {
    changeCheck(id) {
        let {selectedArr, changeSomeState} = this.props;
        selectedArr = selectedArr.concat([])
        let index = selectedArr.indexOf(id);
        if (index === -1) {
            selectedArr.push(id);
        }
        else {
            selectedArr.splice(index, 1)
        }
        changeSomeState({
            selectedArr
        })
    }

    handlePress(ele) {
        let {onPress} = this.props;
        new Promise((resolve) => {
            this.changeCheck(ele[gridConf.id]);
            resolve();
        }).then(() => {
            onPress(ele, this.props.selectedArr); //外部onPress回调*/
        })
    }

    modifyArr(arr) {
        let {countPerRow} = this.props,
            result = [];
        for (var i = 0, len = arr.length; i < len; i += countPerRow) {
            result.push(arr.slice(i, i + countPerRow));
        }
        return result;
    }

    checkAll() {
        let {changeSomeState, data} = this.props,
            arr = [];
        data.forEach((ele) => {
            arr.push(ele[gridConf.id]);
        })
        changeSomeState({
            selectedArr: arr
        })
    }

    invertCheck() {
        let {selectedArr, data, changeSomeState} = this.props,
            arr = [];
        data.forEach((ele) => {
            if (selectedArr.indexOf(ele[gridConf.id]) === -1) {
                arr.push(ele[gridConf.id]);
            }
        })
        changeSomeState({
            selectedArr: arr
        })

    }

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

    renderEmptyGrid(count) {
        let arr = new Array(count);
        arr.fill('');
        return arr.map((ele, index) => {
            return <View key={index} style={styles.grid}></View>
        })
    }

    renderGrid(arr) {
        let {selectedArr} = this.props;
        return arr.map((ele, index) => {
            let checked = selectedArr.indexOf(ele[gridConf.id]) !== -1;
            return <View key={index} style={styles.grid}>
                <TouchableOpacity
                    onPress={() => {
                        this.handlePress(ele);
                    }}
                    style={[styles.gridInner, checked ? styles.gridInnerChecked : null]}>
                    <Text style={[styles.gridText, checked ? styles.gridTextChecked : null]}>{ele[[gridConf.text]]}</Text>
                    {checked ? <Image style={styles.gridImage} source={rightPng}/> : null}
                </TouchableOpacity>
            </View>
        })
    }

    renderButtons() {
        let {checkAllBtn, invertBtn} = this.props;
        if (checkAllBtn || invertBtn) {
            return <View style={styles.buttons}>
                <TouchableOpacity
                    onPress={() => {
                        this.checkAll();
                    }}
                    style={[styles.gridInner, styles.btn]}>
                    <Text style={styles.gridText}>全选</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.invertCheck();
                    }}
                    style={[styles.gridInner, styles.btn, styles.orangeBtn]}>
                    <Text style={[styles.gridText, styles.orangeBtnText]}>反选</Text>
                </TouchableOpacity>
            </View>
        }
        else {
            return null;
        }
    }

    render() {
        let {data} = this.props;
        return (
            <View>
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
;

let colorObj = {
    orange: '#eb812a'
}
const styles = StyleSheet.create({
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
        borderColor: '#999',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5
    },
    gridInnerChecked: {
        borderColor: colorObj.orange
    },
    emptyGrid: {
        flex: 1,
        padding: 12
    },
    gridText: {
        color: '#999',
        fontSize: 15
    },
    gridTextChecked: {
        color: colorObj.orange
    },
    gridImage: {
        position: 'absolute',
        width: 20,
        height: 18,
        right: 0,
        bottom: 0
    },
    buttons: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    btn: {
        width: 88,
        marginLeft: 12
    },
    orangeBtn: {
        backgroundColor: colorObj.orange,
        borderColor: colorObj.orange
    },
    orangeBtnText: {
        color: '#fff'
    }
});
export default connectReducerComponent(storeKey.FILTER_LIST_STORE, reducer, state, action)(FilterList)