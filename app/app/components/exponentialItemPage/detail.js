import React from 'react';
import ExponentialDetails from "../exponentialDetails";
import getExponentialListDetail from "../../services/getExponentialListDetail";
import getExponentialList from "../../services/getExponentialList"

let BT = 'bt';
let btTabData = [
    {
        companyCnShort: '主',
        cid: '1'
    },
    {
        companyCnShort: '平',
        cid: '2'
    },
    {
        companyCnShort: '客',
        cid: '3'
    }
];
export default class ExponentialItemPagelList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],          //假如不是从指数列表跳c转过来的，使用该属性
            detailInitData: {} //比分的初始数据
        }
    }

    _isMounted = false;

    /**
     * 必发直接在本组件请求接口，而不是通过之前的list传进来
     */
    componentDidMount() {
        let {screenProps} = this.props;
        let {type, getList} = screenProps;
        let {navigation} = this.props;
        this._isMounted = true;
        screenProps.navigation = navigation; //TODO 让顶部tab（亚盘、欧赔、必发）可以触发导航
        if (type === BT) {
            this.initData();
            navigation.setParams({
                activeCid: btTabData[0].cid
            });
        }
        else {
            getList.getData({
                vid: screenProps.vid,
                market: screenProps.type,
                isMain: false
            }).then(rsp => {
                //screenProps.dataBackUp = rsp.data && rsp.data[type] && rsp.data[type].list;
                if (this._isMounted) {
                    this.setState({
                        data: rsp.data[type].list
                    });
                }
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    pressList(index) {
        this.props.navigation.setParams({
            activeCid: index
        })
    }

    /**
     * 初始化必发数据
     */
    initData() {
        let {screenProps} = this.props;
        let {vid} = screenProps;
        this.setState({
            detailInitData: {
                cid1: {loading: true},
                cid2: {loading: true},
                cid3: {loading: true},
            }
        })
        getExponentialListDetail.getData({
            vid,
            market: screenProps.type
        }).then((rsp) => {
            let data = rsp.data;
            let {home, draw, away} = data[screenProps.type];
            this.setState({
                detailInitData: {
                    cid1: {loading: false, data: home},
                    cid2: {loading: false, data: draw},
                    cid3: {loading: false, data: away}
                }
            })
        });
    }

    render() {
        let {type, vid, dataBackUp, cid} = this.props.screenProps;
        let {navigation} = this.props;
        let {detailInitData, data} = this.state;
        let activeCid = navigation.getParam('activeCid') || cid || (data[0] && data[0].cid) || '';
        if (type === BT) {
            data = btTabData
        }
        return (
            <ExponentialDetails
                vid={vid}
                navigation={navigation}
                pressCb={this.pressList.bind(this)}
                detailInitData={detailInitData}
                activeCid={activeCid}
                data={data}
                type={type}
            />

        );
    }
}
