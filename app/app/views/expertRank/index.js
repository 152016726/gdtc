/**
 * Created by marcus on 2019/1/4.
 */
import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, FlatList} from 'react-native';
import {connectReducerComponent} from '../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '~/constants/storeKeys';
import * as CommonColor from '~/constants/color';
import * as CommonFont from '~/constants/fontSize';
import Headerleft from '~/components/headerLeft';
import TabSelections from '~/components/tabSelections';
import getExpertGetExperts from '~/services/getExpertGetExperts';
import TeamTable from '~/components/teamTable';
import ExpertAvatar from '~/components/expertAvatar';

const rowWidth = Dimensions.get('window').width;
let _strArr = ['周榜', '月榜'];
const _titleArr = ['排名', '昵称', '命中率', '胜', '负', '近况', '连胜'];
const _flexArr = [2, 6, 3, 2, 2, 4, 2];
const _viewStyle = {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: CommonColor.headerBorderColor,
    backgroundColor: CommonColor.BgColorWhite
};
const _fontStyle = {
    fontSize: CommonFont.FONT_14,
    color: CommonColor.contentText
};
const _headerViewStyle = {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAE6BE'
};
const _headerFontStyle = {
    fontSize: CommonFont.FONT_13,
    color: CommonColor.contentText
};
const _pageIndex = 0; // 起始排名索引
const _pageSize = 20; // 返回排名数量

class ExpertRank extends Component{
    static navigationOptions = ({navigation}) => {
        const {handleGoBack = null, title} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        return {title, headerLeft}
    };

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            data: [],       // 展示的排名数据
            dateState: 0    // 排名的优先展示值  0: 按周  1:按月
        };
      }

    componentWillMount() {
        const {navigation} = this.props;
        this.getInitData();
        navigation.setParams({
            title: '排行榜',
            handleGoBack: () => {navigation.goBack()}
        })
    }

    getInitData(){
        const {dateState} = this.state;
        getExpertGetExperts.getData({
            orderBy: dateState,
            pageIndex: _pageIndex,
            pageSize: _pageSize
        }).then(rsp=> {
            let content = this.filterData(rsp.data.list);
            let header = this.setHeader();
            content.unshift(header);
            this.setState({
                data: content
            })
        },rej=> {
            console.log(rej);
        })
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

    filterData(arr){
        const {dateState} = this.state;
        const {navigation} = this.props;
        return arr.map((item, index)=> {
            const rate = dateState === 0 ? item.weekHitRate : item.monthHitRate; // 胜率
            const win = dateState === 0 ? item.weekWin : item.monthWin;          // 胜场
            const defeat = dateState === 0 ? item.weekDefeat : item.monthDefeat; // 负场
            return [
                // 排名
                {
                    text: index+1,
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[0]},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    fontStyle: _fontStyle
                },
                // 昵称
                {
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[1], alignItems: 'flex-start'},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    customView: <View style={styles.iconStyle}>
                        <ExpertAvatar
                            uri={item.webApiPath+item.icon}
                            width={31}
                            id={item.eid}
                            name={item.nickname}
                            release={item.isSendToday}
                            navigation={navigation}
                            direction={"row"}
                        />
                    </View>
                },
                // 命中率
                {
                    text: parseInt(100 * rate)+'%',
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[2]},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    fontStyle: _fontStyle
                },
                // 胜
                {
                    text: win,
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[3]},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    fontStyle: _fontStyle
                },
                // 负
                {
                    text: defeat,
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[4]},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    fontStyle: _fontStyle
                },
                // 近况
                {
                    text: '近5中'+ item.fiveWinrate * 5,
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[5]},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    fontStyle: _fontStyle
                },
                // 连胜
                {
                    text: item.comboWin,
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[6]},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    fontStyle: _fontStyle
                }

            ]
        })
    }

    /**
     * 设置内容的头部
     */
    setHeader(){
        return _titleArr.map((item, index)=> {
            return {
                text: item,
                viewStyle: Object.assign({}, _headerViewStyle, {flex: _flexArr[index]}),
                fontStyle: _headerFontStyle
            }
        })
    }

    /**
     * 每一行数组对象组成的data,渲染在页面形成表格
     * @param data
     * @returns {XML}
     */
    renderInfo(data){
        return <FlatList
            style={{ width: rowWidth, backgroundColor: CommonColor.BgColorWhite}}
            data={data}
            renderItem={({item}) => <TeamTable data={item}/>}
            keyExtractor={(item, index) => index+'id'}
            removeClippedSubviews={false}
            scrollEnabled={false}
        />
    }

    /**
     * 切换排名
     * index  排名的优先展示值
     */
    toggleRank(index){
        const {dateState} = this.state;
        dateState !== index && this.setState({
            dateState: index
        },()=> {
            this.getInitData()
        })
    }

    render(){
        const {data} = this.state;
        return (
            <ScrollView>
                <View style={styles.container}>
                    <TabSelections
                        data={_strArr}
                        containerStyle={styles.rank}
                        itemStyle={styles.itemStyle}
                        fontStyle={styles.fontStyle}
                        activeFont={styles.activeFont}
                        lastStyle={styles.lastStyle}
                        renderBottom={this.borderBottomList}
                        pressEvent={(index)=> this.toggleRank(index)}
                    />
                    {this.renderInfo(data)}
                </View>
            </ScrollView>
        )
    }
}

export default connectReducerComponent(storeKey.EXPERT_RANK_STORE, reducer, state, action)(ExpertRank)

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CommonColor.BgColor
    },
    rank:{
        height: 36,
        marginVertical: 10,
        borderRadius: 4,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: CommonColor.headerBorderColor,
        backgroundColor: CommonColor.BgColorWhite
    },
    itemStyle:{
        height: 36,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: CommonColor.headerBorderColor
    },
    fontStyle:{
        fontSize: CommonFont.FONT_15,
        color: CommonColor.contentText
    },
    activeFont:{
        color: CommonColor.SelfOrange
    },
    lastStyle:{
        borderRightColor: 'transparent'
    },
    lineS:{
        width: 1,
        height: 36,
        backgroundColor: CommonColor.headerBorderColor
    },
    iconStyle:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});