/**
 * Created by marcus on 2018/12/3.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    FlatList
} from 'react-native';
import * as CommonColor from '../../../../../constants/color';
import * as CommonFont from '../../../../../constants/fontSize';
import TeamTable from '../../../../../components/teamTable';
import SectionTime from './sectionTime';
import SectionStatus from './sectionStatus';
import SectionScore from './sectionScore';

const rowWidth = Dimensions.get('window').width;

const _titles = ['时间', '状态', '主队', '比分', '客队'];
const _flexArr = [21, 7.5, 26, 19.5, 26];
// 每行View样式
const _viewStyle = {
    flex: 1,
    height: 40,
    alignItems:'center',
    justifyContent:'center',
    borderBottomWidth: 1,
    borderColor: CommonColor.BorderColor
};
// 每行字体样式
const _fontStyle = {
    fontSize: CommonFont.FONT_14,
    color: CommonColor.contentText
};
// 头部View样式
const _headerViewStyle = {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAE6BE'
};
// 头部字体样式
const _headerFontStyle = {
    fontSize: CommonFont.FONT_13,
    color: CommonColor.contentText
};

export default class HistoryBattles extends Component{

    componentWillMount() {
        const {getMuseumMatchsInfo} = this.props;
        getMuseumMatchsInfo();
    }

    componentWillReceiveProps(nextProps) {
        const {getMuseumMatchsInfo} = this.props;
        if(nextProps.roundId !== this.props.roundId){
            // 初始化赛事阶段信息
            getMuseumMatchsInfo();
        }
    }

    /**
     * 按照比赛结果添加上对应的样式
     * @param arr
     */
    filterData(data){
        return data.map((item, index)=> {
            let {
                vsDate,
                awayShortName,
                homeShortName,
                awayGoalsScored,
                homeGoalsScored,
                awayHalftimeScored,
                homeHalftimeScored,
                eventState
            } = item;
            eventState = this.filterEventState(eventState);
            // 日期划分为两段   年月日 + 时分
            let dateText = vsDate ? [
                vsDate.split(" ")[0].slice(2),
                vsDate.split(" ")[1].slice(0,5)
            ] : '-';
            return [
                // 时间
                {
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[0]},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    customView: <SectionTime data={dateText}/>
                },
                // 状态
                {
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[1]},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    customView: <SectionStatus status={eventState}/>
                },
                // 主队
                {
                    text: homeShortName,
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[2], alignItems: 'flex-end'},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    fontStyle: _fontStyle
                },
                // 比分
                {
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[3]},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    customView: <SectionScore
                        eventState={eventState}
                        homeGoalsScored={homeGoalsScored}
                        awayGoalsScored={awayGoalsScored}
                        homeHalftimeScored={homeHalftimeScored}
                        awayHalftimeScored={awayHalftimeScored}
                    />
                },
                // 客队
                {
                    text: awayShortName,
                    viewStyle: Object.assign(
                        {},
                        _viewStyle,
                        {flex: _flexArr[4], alignItems: 'flex-start'},
                        index%2 === 0 ? null : {backgroundColor: '#FBFBFB'}
                    ),
                    fontStyle: _fontStyle
                }
            ]
        })
    }

    /**
     * 讲比赛状态过滤成3中:未完成(1),已完成(2),走地(3)
     * @param eventState
     * @returns {number}
     */
    filterEventState(eventState){
        if(eventState === '1' || eventState === '11' || eventState === '12'){
            return 1
        }else if(eventState === '0' || eventState === '9' || eventState === '13'){
            return 2
        }else if(eventState === '2' || eventState === '3' || eventState === '4' || eventState === '5' || eventState === '6' || eventState === '7' || eventState === '8' || eventState === '10'){
            return 3
        }
    }

    /**
     * 设置表头
     * @returns {Array}
     */
    setHeader(){
        return _titles.map((item, index)=> {
            return {
                text: item,
                viewStyle: Object.assign(
                    {},
                    _headerViewStyle,
                    {flex: _flexArr[index]},
                    index === 2 ? {alignItems: 'flex-end'} : null,
                    index === 4 ? {alignItems: 'flex-start'} : null
                ),
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
        // 设置内容
        let contentData = this.filterData(data);
        // 设置头部
        let headerData = this.setHeader();
        // 组成表格
        contentData.unshift(headerData);
        return <FlatList
            data={contentData}
            renderItem={({item}) => <TeamTable
                data={item}
                contentStyle={{
                    backgroundColor: CommonColor.BgColorWhite
                }}
            />}
            keyExtractor={(item, index) => index+'id'}
            removeClippedSubviews={false}
        />
    }


    render(){
        const {data} = this.props;
        return (
            <View style={styles.container}>
                {this.renderInfo(data)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        width: rowWidth,
        flexDirection: 'row',
        backgroundColor: CommonColor.BgColorWhite
    }
});