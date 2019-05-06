/**
 * Created by marcus on 2018/11/28.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {connectReducerComponent} from "~/reduxCfg";
import * as storeKey from "~/constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import HeaderLeft from '~/components/headerLeft';
import IntegralFlatList from '~/components/integralFlatList';
import {BgColorWhite, contentText, tipsTextGrey} from "~/constants/color";
import {FONT_15} from "~/constants/fontSize";

class IntegralView extends Component {

    static navigationOptions = ({navigation}) => {
        const {handleGoBack = null, title} = navigation.state.params || {};
        let headerLeft = <HeaderLeft handleGoBack={handleGoBack} img={require('~/images/back.png')}/>;
        return {title, headerLeft}
    };

    componentWillMount() {
        // 重置默认数据
        this.props.updateState({
            integralsArr:[],
            dataList: [],
            colorsArr: []
        });
        const {lId, seasonId} = this.props;
        // 数据请求
        this.props.getSeasonData(lId, seasonId);
    }

    componentWillReceiveProps(nextProps) {
        const {lId, seasonId} = nextProps;
        // 更新积分榜
        if((seasonId !== this.props.seasonId) || (lId !== this.props.lId)){
            this.props.getSeasonData(lId, seasonId);
        }
    }

    /**
     * 阶段联赛点击事件
     * @param item
     * @param index
     */
    selectIntegralHandle(item, index) {
        let {selectNum} = this.props;
        if (selectNum !== index) {
            this.props.getDataList(item);
            this.props.updateState({
                selectNum: index
            })
        }
    }

    renderSelectIntegral() {
        const {integralsArr, selectNum} = this.props;
        return (
            <View style={styles.ViewTitleSty}>
                <ScrollView
                    horizontal={true}
                    style={{flex: 1, paddingHorizontal: 12}}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.integralBoxSty}>
                        {
                            integralsArr.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => this.selectIntegralHandle(item, index)}
                                        key={index}>
                                        <Text style={[
                                            styles.titleTextSty,
                                            index === selectNum && styles.selectText
                                        ]}>
                                            {item.integralName}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }

    render() {
        const {dataList, colorsArr, integralsArr} = this.props;
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}>
                {integralsArr.length > 0 && this.renderSelectIntegral()}
                <IntegralFlatList
                    colorsArr={colorsArr}
                    flatListData={dataList}/>
            </ScrollView>
        )
    }
}

export default connectReducerComponent(storeKey.INTEGRALVIEW_STORE, reducer, state, action)(IntegralView);

const styles = StyleSheet.create({
    ViewTitleSty: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: BgColorWhite
    },
    titleTextSty: {
        color: tipsTextGrey,
        fontSize: FONT_15,
        marginRight: 20
    },
    selectText: {
        color: contentText
    },
    integralBoxSty: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});