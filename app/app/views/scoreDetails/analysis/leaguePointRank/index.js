/**
 * Created by marcus on 2018/12/14.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    Dimensions
} from 'react-native';
import * as CommonColor from '../../../../constants/color';
import * as fontSize from '../../../../constants/fontSize';
import TeamTable from '../../../../components/teamTable';
import ToggleItem from '../../../../components/toggleItem';
import getLeaguePointRank from '../../../../services/getLeaguePointRank';

// 每列flex占比
const flexArr = [3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3];
// 每行的View样式
const viewStyle = {
    height: 40,
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
const titles = ['全场', '赛', '胜', '平', '负', '得', '失', '净', '得分', '排名', '胜率'];
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
// 排列的公共属性名
const propertyList = ['VersusCount', 'Win', 'Draw', 'Defeat','Goal', 'Lose', 'GD', 'Point', 'Rank'];

export default class LeaguePointRank extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            homeData: [],   // 主队
            awayData: [],   // 客队
            isEmpty: false   // 是否为空
        };
      }

    componentWillMount() {
        const {vid} = this.props;
        getLeaguePointRank.getData({vid}).then(rsp=> {
            if(Object.getOwnPropertyNames(rsp.data.home).length === 0 || Object.getOwnPropertyNames(rsp.data.away).length === 0){
                this.setState({
                    isEmpty: true
                })
            }else{
                this.setState({
                    homeData: this.setTableData([
                        this.setContentObj(rsp.data.home, 'total'),   // 主队总
                        this.setContentObj(rsp.data.home, 'home'),    // 主队主场
                        this.setContentObj(rsp.data.home, 'away'),    // 主队客场
                        this.setContentObj(rsp.data.home, 'six')     // 主队客场
                    ]),
                    awayData: this.setTableData([
                        this.setContentObj(rsp.data.away, 'total'),   // 客队总
                        this.setContentObj(rsp.data.away, 'home'),    // 客队主场
                        this.setContentObj(rsp.data.away, 'away'),    // 客队客场
                        this.setContentObj(rsp.data.away, 'six')     // 客队客场
                    ])
                });
            }
        },rej=>{
            this.setState({
                isEmpty: true
            });
            console.log(rej.rspMsg);
        })
    }

    /**
     * 通过key中的字符串筛选获取分别的对象
     * @param data
     * @param str
     * @returns {{}}
     */
    setHandicapText(data, str){
        let obj = {};
        for(let key in data){
            if(key.indexOf(str) !== -1){
                obj[key]= data[key];
            }
        }
        return obj;
    }

    /**
     * 整合请求到的数据结合对应的样式撮合成一个对象,各个独享聚合成一个数组形成表格的一行
     * @param obj
     * @param str
     * @returns {Array}
     */
    setRowData(obj, str){
        let rowList = [];
        if(str === 'six'){
            obj[str+propertyList[0]] = 6;
        }
        propertyList.forEach((item,index)=> {
            rowList[index] = {
                text: obj[str+item],
                viewStyle: Object.assign({}, viewStyle, {flex: flexArr[index+1]}),
                fontStyle
            }
        });
        rowList.push({
            text: (obj[str+propertyList[1]]/obj[str+propertyList[0]]*100).toString().match(/^\d+(?:\.\d{0,1})?/),
            viewStyle: Object.assign(
                {},
                viewStyle,
                {
                    flex: flexArr[flexArr.length-1],
                    alignItems: 'flex-end',
                    paddingRight: 10
                }
            ),
            fontStyle
        });
        return rowList
    }

    /**
     * 获取筛选后合并的数据对象
     * @param data
     * @param str
     * @returns {*}
     */
    setContentObj(data, str){
        return this.setRowData(
            this.setHandicapText(data, str),
            str
        )
    }

    /**
     * 整合行数据'总','主','客'添加在第一列形成表格
     * @param list
     */
    setTableData(list){
        let textArr = ["总", '主', "客", "近"];
        list.forEach((item,index)=>{
            item.unshift({
                text: textArr[index],
                viewStyle: Object.assign(
                    {},
                    viewStyle,
                    {
                        flex: flexArr[0],
                        alignItems: 'flex-start',
                        paddingLeft: 10
                    }
                ),
                fontStyle: fontStyle,
                color: CommonColor.teamRateGrey
            });
        });
        list.unshift(this.setHeader());
        return list;
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
                    index === 0 ? {alignItems: 'flex-start', paddingLeft: 10} : null,
                    index === titles.length-1 ? {alignItems: 'flex-end', paddingRight: 10} : null
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
            keyExtractor={(item, index) => index+"id"}
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
        const { homeName, awayName, homeIcon, awayIcon} = this.props;
        if(!isEmpty){
            return <ToggleItem
                        cls={{marginTop: 15}}
                        title={<Text style={styles.contentTitleStyle}>联赛积分排名</Text>}
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
        }else{
            return <View></View>
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
    contentTitleStyle:{
        fontSize: fontSize.FONT_16,
        color: CommonColor.contentText,
        marginLeft: 20
    },
    line:{
        height: 5,
        backgroundColor: CommonColor.BorderColor
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