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
import * as CommonColor from '../../../../../constants/color';
import * as fontSize from '../../../../../constants/fontSize';
import TeamTable from '../../../../../components/teamTable';

// 每列flex占比
const flexArr = [2, 2, 2, 2, 2, 2];
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
const titles = ['日期', '赛事', '主队', '比分', '客队', '让球'];
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

export default class Combat extends Component{

    /**
     * 按照比赛结果添加上对应的样式
     * @param arr
     */
    filterData(arr){
        const {tid} = this.props;

        return arr.map(item=> {
            let dateArr = item.vsDate.split('-');
            let scoreStyle = <View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[
                            {color: this.filterScore(item.result.wdw, tid === item.homeTid)},
                            {fontSize: fontSize.FONT_14}
                        ]}
                    >
                        {item.homeGoalsScored}
                    </Text>
                    <Text style={[
                            {color: item.result.wdw === '1' ? CommonColor.BlueColor : CommonColor.contentText},
                            {fontSize: fontSize.FONT_14}
                        ]}
                    >
                        -
                    </Text>
                    <Text style={[
                            {color: this.filterScore(item.result.wdw, tid === item.awayTid)},
                            {fontSize: fontSize.FONT_14}
                        ]}
                    >
                        {item.awayGoalsScored}
                    </Text>
                </View>
                <Text style={styles.halfScore}>
                    ({item.homeHalftimeScored}-{item.awayHalftimeScored})
                </Text>
            </View>;
            return [
                // 日期
                {
                    viewStyle: Object.assign({}, viewStyle, {flex: flexArr[0]}),
                    customView: <View style={[styles.center, {paddingLeft: 10}]}>
                        <Text style={{color: CommonColor.teamRateGrey}}>
                            {dateArr[0]}
                        </Text>
                        <Text style={{color: CommonColor.teamRateGrey}}>
                            {dateArr[1]}-{dateArr[2]}
                        </Text>
                    </View>
                },
                // 联赛
                {
                    text: item.leagueShortName,
                    viewStyle: Object.assign(
                        {},
                        viewStyle,
                        {flex: flexArr[1]}
                    ),
                    fontStyle: fontStyle
                },
                // 主队
                {
                    text: item.homeShortName,
                    viewStyle: Object.assign(
                        {},
                        viewStyle,
                        {flex: flexArr[2], alignItems: 'flex-end'}
                    ),
                    fontStyle: fontStyle,
                    color: (tid === item.homeTid && item.result.wdw === '3') || (tid !== item.homeTid && item.result.wdw === '0') ? CommonColor.DarkerRedColor : null
                },
                // 比分
                {
                    viewStyle: Object.assign(
                        {},
                        viewStyle,
                        {flex: flexArr[3]}
                    ),
                    customView: scoreStyle
                },
                // 客队
                {
                    text: item.awayShortName,
                    viewStyle: Object.assign(
                        {},
                        viewStyle,
                        {flex: flexArr[4], alignItems: 'flex-start'}
                    ),
                    fontStyle: fontStyle,
                    color: (tid === item.awayTid && item.result.wdw === '3') || (tid !== item.awayTid && item.result.wdw === '0') ? CommonColor.DarkerRedColor : null
                },
                // 让球
                {
                    viewStyle: Object.assign(
                        {},
                        viewStyle,
                        {flex: flexArr[5]}
                    ),
                    customView: <View style={[styles.center, {paddingRight: 10}]}>
                        <Text style={{color: this.filterScore(item.result.hwdw)}}>
                            {item.hwdw.handicap}
                        </Text>
                        <Text style={{color: this.filterScore(item.result.hwdw)}}>
                            {this.filterResult(item.result.hwdw)}
                        </Text>
                    </View>
                }
            ]
        })
    }

    /**
     * 赛果对应的文字
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
     * 比分的主客队颜色
     * @param str
     * @param isHome
     */
    filterScore(str, isHome = true){
        let result;
        switch (str){
            case '3':
                result = isHome ? CommonColor.DarkerRedColor : CommonColor.contentText;
                break;
            case '1':
                result = CommonColor.BlueColor;
                break;
            case '0':
                result = isHome ? CommonColor.contentText : CommonColor.DarkerRedColor;
                break;
            default:
                break;
        }
        return result;
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
                    index === titles.length-1 ? {paddingRight: 10} : null,
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
        const {data} = this.props;
        if(data.length > 0){
            let contentData = this.filterData(data);
            let headerData = this.setHeader();
            contentData.unshift(headerData);
            return <View>
                {this.renderInfo(contentData)}
            </View>
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
    halfScore: {
        color: CommonColor.tipsTextGrey,
        fontSize: fontSize.FONT_10
    },
    lineS: {
        height: 1,
        backgroundColor: CommonColor.BgColor
    },
    center:{
        alignItems: 'center',
        justifyContent: 'center'
    }
});