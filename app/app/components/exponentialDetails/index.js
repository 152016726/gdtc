import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import ExponentialDetailsTab from "./component/tab";
import ExponentialDetailsList from "./component/list";
import getExponentialListDetail from "../../services/getExponentialListDetail"
import gridConf from "./gridConf";

let BT = 'bt';
export default class ExponentialDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: {} //保存所有右侧详情页数据,第二次点击的时候不会切换
        }
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        let {type} = this.props;
        if (type !== BT) {
            this.bindFocusLoadEvent();
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeCid !== this.props.activeCid) {
            this.updateListDataIfNoData(nextProps.activeCid);
        }
    }

    renderTitleText() {
        let {type} = this.props;
        let arr = gridConf[type] || [];
        return <View style={styles.titleRight}>
            {
                arr.map((ele, index) =>
                    <View key={index} style={[styles.titleBox, {flex: ele.flex}]}>
                        <Text style={styles.titleText}>{ele.text}</Text>
                    </View>)
            }
        </View>
    }

    renderTitle() {
        let {type} = this.props;
        return <View style={styles.title}>
            <View style={[styles.titleLeft, styles.titleBox]}>
                <Text style={styles.titleText}>
                    {type === BT ? '明细' : '公司'}
                </Text>
            </View>
            {
                this.renderTitleText()
            }
        </View>
    }

    /**
     * 绑定切换到该页面到事件, 切换页面时不会触发componentDidMount
     */
    bindFocusLoadEvent() {
        this.props.navigation.addListener(
            'didFocus',
            () => {
                this.updateListDataIfNoData();
            }
        );
    }

    /**
     * listData没有数据时，这里请求数据
     */
    updateListDataIfNoData(aCid) {
        let {activeCid} = this.props;
        let {listData} = this.state;
        if (!listData[`cid${aCid || activeCid}`]) {
            this.updateListData(aCid || activeCid);
        }
    }

    /**
     * 更新右边listData
     */
    updateListData(cid) {
        let {type, vid} = this.props;
        let {listData} = this.state;
        if (type !== BT && !listData.hasOwnProperty(`cid${cid}`)) {
            listData[`cid${cid}`] = {loading: true, data: []};
            if (this._isMounted) {
                this.setState({
                    listData
                });
            }
            getExponentialListDetail.getData({
                vid,
                cid: cid,
                market: type
            }).then((rsp) => {
                let arrInit = [{ //亚指和欧指的初赔
                    homeOddsCurr: rsp.data[type].homeOddsInit,
                    drawOddsCurr: rsp.data[type].drawOddsInit,
                    awayOddsCurr: rsp.data[type].awayOddsInit,
                    handicapCurr: rsp.data[type].handicapInit,
                    updateTimeCurr: rsp.data[type].updateTimeInit
                }];
                listData[`cid${cid}`] = {data: rsp.data[type].list.concat(arrInit), loading: false};
                if (this._isMounted) {
                    this.setState({
                        listData
                    });
                }
            })
        }
    }

    /**
     * 点击回调
     */
    pressCbSelf(cid) {
        let {pressCb} = this.props;
        //this.updateListData(cid);
        pressCb(cid);
    }

    render() {
        let {data = [], activeCid, type, detailInitData} = this.props;
        let {listData} = this.state;
        if (type === BT) {
            listData = detailInitData;
        }
        let conf = {
            data,
            activeCid,
            pressCb: this.pressCbSelf.bind(this),
            style: styles.tabs
        };
        return (
            <View style={styles.wrapper}>
                {
                    this.renderTitle()
                }
                <View style={styles.main}>
                    <ExponentialDetailsTab {...conf} />
                    <ExponentialDetailsList type={type} data={listData[`cid${activeCid}`] || {}} style={styles.list}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    main: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        flex: 1
    },
    title: {
        flexDirection: 'row'
    },
    titleLeft: {
        flex: gridConf.main.left
    },
    titleRight: {
        flex: gridConf.main.right,
        flexDirection: 'row'
    },
    titleBox: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        lineHeight: 30,
        color: '#777777'
    },
    tabs: {
        flex: gridConf.main.left,
        borderRightWidth: 1,
        borderRightColor: '#999999',
        height: '100%'
    },
    list: {
        flex: gridConf.main.right,
        height: '100%'
    }
});