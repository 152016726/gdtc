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
import getFutureThreeMatches from '../../../../services/getFutureThreeMatches';

// 每列flex占比
const flexArr = [2, 2, 3, 3, 1];
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
const titles = ['日期', '赛事', '主队',  '客队', '间隔'];
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

export default class FutureThreeMatches extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            homeData: [],      // 主队
            awayData: [],      // 客队
            isEmpty: false     // 是否为空
        };
      }

    componentWillMount() {
        const {vid} = this.props;
        getFutureThreeMatches.getData({
            vid
        }).then(rsp=> {
            if(rsp.data.home.length === 0 || rsp.data.away.length === 0){
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
        },rej=> {
            this.setState({
                isEmpty: true
            });
            console.log(rej.rspMsg);
        })
    }

    /**
     * 按照比赛结果添加上对应的样式
     * @param arr
     * @returns {*}
     */
    filterData(arr){
        const {homeTid, awayTid} = this.props;
        return arr.map(item=> {
            return [
                // 日期
                {
                    text: item.vsDate,
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
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[2]}),
                    fontStyle: fontStyle
                },
                // 客队
                {
                    text: item.awayShortName.substring(0, 6),
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[3]}),
                    fontStyle: fontStyle
                },
                // 间隔
                {
                    text: item.day,
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[4], paddingRight: 10}),
                    fontStyle: fontStyle
                }
            ]
        })
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
            return <ToggleItem
                cls={{marginTop: 15}}
                title={<Text style={styles.contentTitleStyle}>未来三场</Text>}
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