/**
 * Created by marcus on 2019/1/2.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    Dimensions
} from 'react-native';
import * as CommonColor from '~/constants/color';
import * as CommonFont from '~/constants/fontSize';
import ExpertItemHeader from '../components/itemHeader';
import { VictoryPie, VictoryLegend } from 'victory-native';

const rowWidth = Dimensions.get('window').width-40;
const _colorArr = ['#ed9853', '#53abed', '#31d586', '#f38771'];
const _typeArr = ['周命中率', '月命中率'];
const _percentArr = [{x:'50%', y:'28%'}, {x:'50%', y:'28%'}, {x:'50%', y:'40%'}, {x:'50%', y:'40%'}];   // 饼图的top,left百分比

export default class ExpertScore extends Component{
    static defaultProps={
        weekHitRate: 0,             // 周胜率
        monthHitRate: 0,            // 月胜率
        fiveWinrate: 0,             // 近5场
        comboWin: 0                 // 连胜场次
    };

    /**
     * 每一个饼图
     * @param item      战绩
     * @param index     索引
     * @param textList  文本list
     * @returns {XML}
     */
    renderItem(item, index, textList){
        return (<View style={{position: 'relative'}}>
            <View style={[{position: 'absolute', width: (rowWidth-24)/4, top: _percentArr[index].y, left: _percentArr[index].x, marginLeft: '-35%'}, styles.container]}>
                <Text style={styles.textStyle}>{textList[index]}</Text>
                <Text style={styles.textStyle}>{_typeArr[index]}</Text>
            </View>
            <VictoryPie
                padding={{ top: 0, left: 0 }}
                colorScale={['#d8d8d8', _colorArr[index]]}
                data={[
                {x: '', y: 1-item},
                {x: textList[index], y: +item}
            ]}
                innerRadius={28}
                height={78}
                width={(rowWidth-24)/4}
            />
        </View>);
    }

    /**
     * 渲染专家战绩
     * @returns {XML}
     * @private
     */
    _renderScores(){
        const {weekHitRate, monthHitRate, fiveWinrate, comboWin} = this.props;
        const textList = [
            parseInt(100*weekHitRate)+'%',
            parseInt(100*monthHitRate)+'%',
            "近5中"+fiveWinrate*5,
            comboWin+'连胜'
        ];
        let comboRate = 0;
        if(+comboWin > 5){
            comboRate = 1;
        }
        else{
            comboRate = comboWin/5;
        }
        const dataList = [
            weekHitRate,
            monthHitRate,
            fiveWinrate,
            comboRate
        ];
        return <FlatList
            style={styles.content}
            horizontal={true}
            data={dataList}
            alwaysBounceVertical={false}
            renderItem={({item, index}) => this.renderItem(item, index, textList)}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={false}
            ItemSeparatorComponent={this.borderBottom}
            scrollEnabled={false}
        />
    }

    borderBottom(){
        return (<View style={{width: 8, height: 78}}/>)
    }

    render(){
        const {isExpert} = this.props;
        return(
            <View>
                <ExpertItemHeader
                    cls={styles.titleContent}
                    titleLeft={<Text style={styles.titleFont}>
                        {isExpert ? '我的晒单' : '晒单情况'}
                    </Text>}
                    color={CommonColor.ExpertScore}
                />
                <View style={styles.container}>
                    {this._renderScores()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: CommonColor.BgColorWhite,
        justifyContent:'center',
        alignItems: "center"
    },
    titleContent:{
        backgroundColor: CommonColor.BgColorWhite,
        borderBottomWidth: 1,
        borderBottomColor: CommonColor.SpiltLineColor
    },
    titleFont:{
        fontSize: CommonFont.FONT_16,
        color: CommonColor.ExpertScore
    },
    content:{
        width: rowWidth,
        paddingVertical: 16,
        backgroundColor: CommonColor.BgColorWhite
    },
    itemStyle:{
        width: (rowWidth-24)/4,
        height: 78,
        justifyContent: 'center',
        alignItems: "center"
    },
    itemFont:{
        fontSize: CommonFont.FONT_14,
        color: CommonColor.contentText
    },
    textStyle:{
        fontSize: CommonFont.FONT_12,
        fontWeight: 'normal',
        color: CommonColor.contentText
    }
});