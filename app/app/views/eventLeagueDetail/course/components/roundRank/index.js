/**
 * Created by marcus on 2018/12/24.
 */
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import IntegralFlatList from '../../../../../components/integralFlatList';

export default class RoundRank extends Component{

    componentWillMount() {
        const {getStandingsInfo} = this.props;
        getStandingsInfo();
    }

    componentWillReceiveProps(nextProps) {
        const {getStandingsInfo} = this.props;
        if(nextProps.roundId !== this.props.roundId){
            // 初始化赛事阶段排名
            getStandingsInfo();
        }
    }

    render(){
        const {colorArr, dataList} = this.props;
        return (
            <IntegralFlatList
                colorsArr={colorArr}
                flatListData={dataList}
            />
        )
    }
}