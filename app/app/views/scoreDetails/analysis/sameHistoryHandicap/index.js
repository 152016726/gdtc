/**
 * Created by marcus on 2018/12/14.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions
} from 'react-native';
import * as CommonColor from '../../../../constants/color';
import * as fontSize from '../../../../constants/fontSize';
import TeamTable from '../../../../components/teamTable';
import ToggleItem from '../../../../components/toggleItem';
import getSameHistoryHandicap from '../../../../services/getSameHistoryHandicap';

// 每列flex占比
const flexArr = [2, 2, 3, 2, 3, 2, 2];
// 每行的View样式
const viewStyle = {
    height: 48,
    backgroundColor: CommonColor.BgColorWhite,
    alignItems: 'center',
    justifyContent: 'center'
};
// 每行字体样式
const fontStyle = {
    fontSize: fontSize.FONT_12,
    color: CommonColor.contentText
};
// 头部的文字list
const titles = ['日期', '赛事', '主队', '初盘', '客队', '比分', '让球'];
// 表格头View样式
const headerViewStyle = {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CommonColor.BgColor
};
// 表格头font样式
const headerFontStyle = {
    fontSize: fontSize.FONT_12,
    color: CommonColor.teamRateGrey
};

export default class SameHistoryHandicap extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            homeData: [],      // 主队数据
            awayData: [],      // 客队数据
            isEmpty: false     // 是否为空
        };
      }

    componentWillMount() {
        const {vid} = this.props;
        getSameHistoryHandicap.getData({
            vid
         }).then(rsp=> {
            if(Object.getOwnPropertyNames(rsp.data).length === 0 || rsp.data.home.length === 0 || rsp.data.away.length === 0){
                this.setState({
                    isEmpty: true
                })
            }else{
                let homeContentData = this.filterData(rsp.data.home);
                let awayContentData = this.filterData(rsp.data.away);
                let headerData = this.setHeader();
                homeContentData.unshift(headerData);
                awayContentData.unshift(headerData);
                this.setState({
                    homeData: homeContentData,
                    awayData: awayContentData
                });
            }
        }, rej=> {
            this.setState({
                isEmpty: true
            });
            console.log(rej.rspMsg);
        })
    }

    /**
     * 按照比赛结果添加上对应的样式
     * @param arr
     */
    filterData(arr){
        return arr.map(item=> {
            let dateArr = item.vsDate.split('-');
            let scoreStyle = <View style={{flexDirection: 'row'}}>
                <Text style={[
                        {color: CommonColor.contentText},
                        {fontSize: fontSize.FONT_14}
                    ]}
                >
                    {item.homeGoalsScored}
                </Text>
                <Text style={[
                        {color: CommonColor.contentText},
                        {fontSize: fontSize.FONT_14}
                    ]}
                >
                    -
                </Text>
                <Text style={[
                        {color: CommonColor.contentText},
                        {fontSize: fontSize.FONT_14}
                    ]}
                >
                    {item.awayGoalsScored}
                </Text>
            </View>;
            return [
                // 日期
                {
                    text: dateArr[1]+'-'+dateArr[2],
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[0], paddingLeft: 10}),
                    fontStyle: fontStyle,
                    color: CommonColor.teamRateGrey
                },
                // 联赛
                {
                    text: item.leagueShortName,
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[1]}),
                    fontStyle: fontStyle
                },
                // 主队
                {
                    text: item.homeShortName.substring(0, 6),
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[2], alignItems: 'flex-end'}),
                    fontStyle: fontStyle
                },
                {
                    text: item.handicap,
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[3]}),
                    fontStyle: fontStyle
                },
                // 客队
                {
                    text: item.awayShortName.substring(0, 6),
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[4], alignItems: 'flex-start'}),
                    fontStyle: fontStyle
                },
                // 比分
                {
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[5]}),
                    customView: scoreStyle
                },
                // 让球
                {
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[6], paddingRight: 10}),
                    customView: <View style={styles.center}>
                        <Text style={{color: CommonColor.contentText}}>
                            {this.filterResult(item.result)}
                        </Text>
                    </View>
                }
            ]
        })
    }

    /**
     * 赛果筛选
     * @param str
     * @returns {string}
     */
    filterResult(str){
        let result = '';
        switch (str){
            case '3':
                result = '赢';
                break;
            case '1':
                result = '平';
                break;
            case '0':
                result = '输';
                break;
            default:
                break;
        }
        return result
    }

    /**
     * 设置表头
     * @returns {Array}
     */
    setHeader(){
        return titles.map((item,index)=> {
            return {
                text: item,
                viewStyle: Object.assign(
                    {},
                    headerViewStyle,
                    {flex: flexArr[index]},
                    index === 2 ? {alignItems: 'flex-end'} : null,
                    index === 4 ? {alignItems: 'flex-start'} : null,
                    index === 0 ? {paddingLeft: 10} : null,
                    index === titles.length-1 ? {paddingRight: 10} : null
                ),
                fontStyle: headerFontStyle
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
            data={data}
            renderItem={({item}) => <TeamTable
                data={item}
                contentStyle={{
                    backgroundColor: CommonColor.BgColorWhite
                }}
            />}
            keyExtractor={(item, index) => index+'id'}
            ItemSeparatorComponent={this.borderBottomList}
            removeClippedSubviews={false}
            scrollEnabled={false}
        />
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
     * 最终在页面渲染表格前的判断操作
     * @returns {*}
     */
    renderTable(){
        const {homeData, awayData, isEmpty} = this.state;
        const { homeName, awayName, awayIcon, homeIcon} = this.props;
        if(isEmpty){
            return <View></View>
        }else{
            return (
                <View>
                    <ToggleItem
                        cls={{marginTop: 15}}
                        title={<Text style={styles.contentTitleStyle}>相同历史盘口</Text>}
                        content={
                        <View>
                            <View style={styles.shadowStyle}></View>
                            <View style={styles.headerTitleView}>
                                <Image source={homeIcon}
                                       style={styles.teamIcon}
                                />
                                <Text style={[styles.titleTxt]}>
                                    {homeName}
                                </Text>
                            </View>
                            {this.renderInfo(homeData)}
                            <View style={styles.line}></View>
                            <View style={styles.headerTitleView}>
                                <Image source={awayIcon}
                                       style={styles.teamIcon}
                                />
                                <Text style={[styles.titleTxt]}>
                                    {awayName}
                                </Text>
                            </View>
                            {this.renderInfo(awayData)}
                        </View>
                    }
                    />
                </View>
            )
        }
    }

    render(){
        return(
            <View>
                {this.renderTable()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    center:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    lineS:{
        height: 1,
        backgroundColor: CommonColor.BgColor
    },
    line:{
        height: 5,
        backgroundColor: CommonColor.BorderColor
    },
    contentTitleStyle:{
        fontSize: fontSize.FONT_16,
        color: CommonColor.contentText,
        marginLeft: 20
    },
    headerTitleView:{
        flexDirection: 'row',
        backgroundColor: CommonColor.BgColor,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderColor: CommonColor.BorderColor,
        height: 30,
        marginLeft: 10
    },
    titleTxt:{
        fontSize: fontSize.FONT_14,
        color: CommonColor.teamRateGrey,
        backgroundColor: 'transparent'
    },
    shadowStyle:{
        height:1,
        shadowColor:CommonColor.SpiltLineColor,
        shadowOffset:{width:6},
        shadowRadius:20,
        elevation:10
    },
    teamIcon:{
        width: 19,
        height: 19,
        marginRight: 11
    }
});