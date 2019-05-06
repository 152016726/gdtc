import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { connectReducerComponent } from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../constants/storeKeys';
import Headerleft from '../../components/headerLeft'
import { FONT_12, FONT_14 } from '../../constants/fontSize';
import { BorderColor, BgColor, BgColorWhite, tipsTextGrey } from '../../constants/color';
import AttentionItem from './component/attentionItem';
import ActionProgressDialog from '../../components/actionProgressDialog';
import Account from '#/account';

const backImg = require('../../images/back.png');

class ExpertAttention extends Component {
    static navigationOptions = ({ navigation }) => {
        const { handleGoBack = null } = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={backImg}/>;
        return { title : "我的关注", headerLeft }
    };

    static defaultProps = {
        dataList : [], //展示数组
        listHeader : null, //列表的头部内容
        isFooter : false
    };

    constructor(props) {
        super(props);
        this.state = {
            MaxHeight : 0
        }
    }

    componentWillMount() {
        const { navigation } = this.props;
        this.props.reqData();
        navigation.setParams({
            handleGoBack : () => {
                this.handleGoBack()
            }
        });
    }

    /**
     * 返回
     */
    handleGoBack() {
        this.props.navigation.goBack();
    }

    /**
     * 删除
     */
    handleCancel(item) {
        this.props.cancelExpert(item.eid,()=>{this.progressDialog.toast('取消关注成功');});

    }

    /**
     * 跳转内页
     */
    handleGoToDetail(item) {
        let {navigation} = this.props;
        navigation.navigate('ExpertZone', {id:item.eid});
    }

    /**
     * 添加关注
     * @param item
     */
    handleAttention(item) {
        this.props.addExpert(item.eid,()=>{this.progressDialog.toast('关注成功');});

    }
    /**
     * 列表 render
     *
     */
    renderItem(item, index) {
        return (
            <AttentionItem index={index}
                           item={item}
                           handleGoToDetail={()=>this.handleGoToDetail(item)}
                           handleCancel={()=>this.handleCancel(item)}
                           handleAttention={()=>this.handleAttention(item)}
            />
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
        return (
            <View>
                <Text style={styles.footerSty}>
                    没有更多啦
                </Text>
            </View>
        )
    }

    /**
     * 下拉刷新的功能
     */
    _refreshHandle() {
        const { refreshHandle } = this.props;
        this.setState({ //重置最大高度
            MaxHeight : 0
        });
        refreshHandle && refreshHandle();
    }

    /**
     * 上拉加载更多功能
     * @param eNative
     * @private
     */
    _scrollHandle(eNative) {
        let { MaxHeight } = this.state;
        const { pullUpLoad, isFooter } = this.props;
        let contentHeight = eNative.contentOffset.y + eNative.layoutMeasurement.height; //获取页面的高度
        //确保只有滑到页面底部才开始重新请求数据且只请求一次
        if (contentHeight === eNative.contentSize.height && eNative.contentSize.height > MaxHeight) {
            this.setState({
                MaxHeight : eNative.contentSize.height   //记录每一次请求数据前的最大高度
            });
            if (!isFooter) { //若文章已滑到底，则不再请求数据
                pullUpLoad && pullUpLoad();
            }
        }
    }

    render() {
        const { dataList, listHeader, isFooter } = this.props;
        return (
        <View style={{flex:1}}>
            {dataList.length !== 0 ?
            <FlatList style={{ backgroundColor : BgColor }}
                      data={dataList}
                      keyExtractor={(item, index) => index.toString()}
                      ListHeaderComponent={() => listHeader || <View style={{ height : 0 }}/>}
                      renderItem={({ item, index }) => this.renderItem(item, index)}
                      ItemSeparatorComponent={this.borderBottomList}
                      ListFooterComponent={() => isFooter && this.renderFooter()}
                      onScroll={(e) => this._scrollHandle(e.nativeEvent)}
                      scrollEventThrottle={1}
                      refreshing={false}
                      onRefresh={() => this._refreshHandle()}
            />: <View style={{alignItems: 'center'}}>
            <View style={{marginTop: 130}}>
                <Image
                    style={styles.noRecIconSty}
                    source={require('../../images/no_recommend_icon.png')}/>
                <Text style={styles.tipsTextSty}>暂无关注</Text>
            </View>
        </View>}
            <ActionProgressDialog
                ref={progressDialog => this.progressDialog = progressDialog}/>
        </View>
        )
    }
}

export default connectReducerComponent(storeKey.EXPERT_ATTENTION_STORE, reducer, state, action)(ExpertAttention)

const styles = StyleSheet.create({
    informationList : {
        flexDirection : 'row',
        paddingVertical : 10,
        paddingHorizontal : 12,
        backgroundColor : BgColorWhite
    },
    lineS : {
        borderBottomWidth : 1,
        marginHorizontal : 12,
        borderColor : BorderColor
    },
    imageS : {
        width : 100,
        height : 75,
        resizeMode : 'stretch',
        borderRadius : 2
    },
    titleS : {
        fontSize : FONT_14,
        flexWrap : 'wrap',
        marginBottom : 5
    },
    rightBox : {
        justifyContent : 'space-between',
        paddingTop : 2,
        flex : 1
    },
    subTitleS : {
        fontSize : FONT_12,
        color : tipsTextGrey,
        flexWrap : 'wrap'
    },
    publishDataStyle : {
        textAlign : 'right',
        fontSize : FONT_12,
        color : tipsTextGrey
    },
    footerSty : {
        fontSize : FONT_12,
        color : '#D1D1D1',
        textAlign : 'center',
        padding : 12,
        backgroundColor : BgColor
    },
    noRecIconSty: {
        width: 84,
        height: 77
    },
    tipsTextSty: {
        color: tipsTextGrey,
        textAlign: 'center',
        marginTop: 12
    }
});