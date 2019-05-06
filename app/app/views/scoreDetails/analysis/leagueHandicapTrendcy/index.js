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
    Dimensions,
    FlatList
} from 'react-native';
import * as CommonColor from '../../../../constants/color';
import * as fontSize from '../../../../constants/fontSize';
import getLeagueHandicapTrendcy from '../../../../services/getleagueHandicapTrendcy';
import TeamTable from '../../../../components/teamTable';
import ToggleItem from '../../../../components/toggleItem';

// 每列flex占比
const flexArr = [1, 1, 1, 1, 2, 1, 2, 1, 2];
// 每行View样式
const viewStyle = {
    backgroundColor: CommonColor.BgColorWhite,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40
};
// 每行字体样式
const fontStyle = {
    fontSize: fontSize.FONT_12,
    color: CommonColor.contentText
};
// 表格头的文字数组
const titles = ['全场', '赢盘', '走水', '输盘', '赢盘率', '大球', '大球率', '小球', '小球率'];
// 表格头View样式
const headerViewStyle = {
    backgroundColor: CommonColor.BgColor,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30
};
// 表格头font样式
const headerFontStyle = {
    fontSize: fontSize.FONT_12,
    color: CommonColor.teamRateGrey
};
// 排列的公共属性名
const propertyList = ['Win', 'Draw', 'Defeat', 'Over', 'Under'];

export default class LeagueHandicapTrendcy extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            homeData: [],    // 主队
            awayData: [],    // 客队
            homeLastSix: '', // 主队近6
            awayLastSix: '', // 客队近6
            isEmpty: false   // 是否为空
        };
      }

    componentWillMount() {
        const {vid} = this.props;
        getLeagueHandicapTrendcy.getData({vid}).then(rsp=> {
            if(Object.getOwnPropertyNames(rsp.data.home.hwdw).length === 0 || Object.getOwnPropertyNames(rsp.data.home.ou).length === 0 || Object.getOwnPropertyNames(rsp.data.away.hwdw).length === 0 || Object.getOwnPropertyNames(rsp.data.away.ou).length === 0){
                this.setState({
                    isEmpty: true
                })
            }else{
                this.setState({
                    homeData: this.setTableData([
                        this.setContentObj(rsp.data.home, 'total'),
                        this.setContentObj(rsp.data.home, 'home'),
                        this.setContentObj(rsp.data.home, 'away')
                    ]),
                    awayData: this.setTableData([
                        this.setContentObj(rsp.data.home, 'total'),
                        this.setContentObj(rsp.data.home, 'home'),
                        this.setContentObj(rsp.data.home, 'away')
                    ]),
                    homeLastSix: rsp.data.home.hwdw.lastSix + '-' + rsp.data.home.ou.lastSix,
                    awayLastSix: rsp.data.away.hwdw.lastSix + '-' + rsp.data.away.ou.lastSix
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
     * @returns {Array}
     */
    setRowData(obj, str){
        let rowList = [];
        propertyList.forEach(item=> {
            rowList.push({
                text: obj[str+item],
                viewStyle: Object.assign({}, viewStyle, {flex: 1}),
                fontStyle
            })
        });
        // 赢盘率
        let winRate = (
            +obj[str+'Win']/(
                (+obj[str+'Win']) +
                (+obj[str+'Draw']) +
                (+obj[str+'Defeat'])
            )*100
        ).toString().match(/^\d+(?:\.\d{0,1})?/);
        // 大球率
        let overRate = (
            (+obj[str+'Over'])/(
                (+obj[str+'Over'])+
                (+obj[str+'Under'])
            )*100
        ).toString().match(/^\d+(?:\.\d{0,1})?/);
        // 小球率
        let underRate = (100 - overRate).toString().match(/^\d+(?:\.\d{0,1})?/);

        // 插入赢盘率对象
        rowList.splice(-2, 0, {
            text: winRate,
            viewStyle: Object.assign(
                {},
                viewStyle,
                {flex: 2}
            ),
            fontStyle: fontStyle
        });
        // 插入大球率对象
        rowList.splice(-1, 0, {
            text: overRate,
            viewStyle: Object.assign(
                {},
                viewStyle,
                {flex: 2}
            ),
            fontStyle: fontStyle
        });
        // 插入小球率对象
        rowList.push({
            text: underRate,
            viewStyle: Object.assign(
                {},
                viewStyle,
                {
                    flex: 2,
                    alignItems: 'flex-end',
                    paddingRight: 10
                }
            ),
            fontStyle: fontStyle
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
            Object.assign(
                {},
                this.setHandicapText(data.hwdw, str),
                this.setHandicapText(data.ou, str)
            ),
            str
        )
    }

    /**
     * 整合行数据将'总','主','客'添加在第一列形成表格
     * @param list
     */
    setTableData(list){
        let textArr = ["总", '主', "客"];
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
                contentStyle={{backgroundColor: CommonColor.BgColorWhite}}
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
        const {homeData, awayData, isEmpty, homeLastSix, awayLastSix} = this.state;
        const { homeName, awayName, awayIcon, homeIcon} = this.props;
        let content ;
        if(!isEmpty){
            content = <ToggleItem
                    cls={{marginTop: 15}}
                    title={<Text style={styles.contentTitleStyle}>联赛盘路走势</Text>}
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
                            {this.renderLastSix(homeLastSix)}
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
                            {this.renderLastSix(awayLastSix)}
                        </View>
                    }
                />
        }else{
            content = <View></View>
        }
        return content
    }

    /**
     * 近6场
     * @param data
     * @returns {XML}
     */
    renderLastSix(data){
        let matchesList = data ? data.split("-")[0].split("") : [];
        let ballsList = data ? data.split("-")[1].split("") : [];
        return <View style={styles.lastSixView}>
            <Text style={{flex: 1, fontSize: fontSize.FONT_12}}>近六</Text>
            <View style={styles.lastSixResult}>
                {matchesList.map((item, index)=> {
                    return <Text
                        key={index}
                        style={[{color: this.filterScore(item)}, styles.marginText]}
                    >
                            {this.filterResult(item)}
                    </Text>
                })}
            </View>
            <View style={styles.lastSixResult}>
                {ballsList.map((item, index)=> {
                    return <Text
                        key={index}
                        style={[{color: this.filterScore(item)}, styles.marginText]}
                    >
                        {this.filterResult(item, false)}
                    </Text>
                })}
            </View>
        </View>
    }

    /**
     * 胜负平的颜色
     * @param str
     */
    filterScore(str){
        let result;
        switch (str){
            case '3':
                result = CommonColor.DarkerRedColor;
                break;
            case '1':
                result = CommonColor.BlueColor;
                break;
            case '0':
                result = CommonColor.DarkerGreenColor;
                break;
            default:
                break;
        }
        return result;
    }

    /**
     * 赛果对应的文字
     * @param str
     * @param isMatch
     * @returns {string}
     */
    filterResult(str, isMatch = true){
        let result = '';
        switch (str){
            case '3':
                result = isMatch ? '赢' : '大';
                break;
            case '1':
                result = isMatch ? '平' : '走';
                break;
            case '0':
                result = isMatch ? '输' : '小';
                break;
            default:
                break;
        }
        return result
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
    lastSixView:{
        height: 30,
        paddingHorizontal: 10,
        backgroundColor: CommonColor.BgColorWhite,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: CommonColor.BorderColor
    },
    lastSixResult:{
        flexDirection: 'row',
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    marginText:{
        marginHorizontal: 3,
        fontSize: fontSize.FONT_12,
    },
    teamIcon:{
        width: 19,
        height: 19,
        marginRight: 11
    }
});