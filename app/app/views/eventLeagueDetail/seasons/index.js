/**
 * Created by marcus on 2018/12/4.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {connectReducerComponent} from "../../../reduxCfg";
import * as storeKey from "../../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import ScrollTabs from '../components/scrollTabs';
import Headerleft from '../../../components/headerLeft';
import HeaderRight from '../../../components/headerRight';


class Seasons extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            initDefaultTab: props.defaultTab   // 初始化默认选中效果的Tab
        };
      }

    static navigationOptions = ({navigation})=>{
        const {
            handleGoBack = null,
            title,
            handleGoRight = null
        } = navigation.state.params || {};
        let headerLeft = <Headerleft
                            handleGoBack={handleGoBack}
                            img={require('../../../images/back.png')}
                        />;
        let headerRight = <HeaderRight
                            text={'确定'}
                            cls={{width: 48}}
                            onPress={handleGoRight}
                          />;
        return {title, headerLeft, headerRight}
    };

    componentWillMount() {
        const {navigation, getSeasonInfo} = this.props;
        // 初始化获取赛季列表
        getSeasonInfo();
        // 设置头部
        navigation.setParams({
            title: '选择赛季',
            handleGoBack: ()=> this.goback(),
            handleGoRight: ()=> this.goright()
        })
    }

    /**
     * 后撤
     */
    goback(){
        const {navigation, updateState} = this.props;
        const {initDefaultTab} = this.state;
        updateState({
            defaultTab: initDefaultTab
        });
        navigation.goBack()
    }

    /**
     * 确定
     */
    goright(){
        const {
            seasons,
            updateLastState,
            navigation,
            defaultTab,
            updateState,
            shortName
        } = this.props;
        // 上一级传过来的改变上一级eventLeagueDetail头部的方法
        let {setHeader} = this.props.navigation.state.params || {};
        setHeader(seasons[defaultTab].seasonName + shortName);
        // 改变上个页面eventLeagueDetail的state
        updateLastState({
            seasonName: seasons[defaultTab].seasonName,
            seasonId: seasons[defaultTab].seasonId
        });
        // 改变当前页面state
        updateState({
            seasonId: seasons[defaultTab].seasonId
        });
        navigation.goBack()
    }

    render(){
        const {seasons, defaultTab, updateState} = this.props;
        return (
            <View style={{flex: 1, backgroundColor: '#ffffff', alignItems: 'center'}}>
                <ScrollTabs 
                    data={seasons} 
                    defaultIndex={defaultTab}
                    updateState={updateState}
                />
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SEASONS_STORE, reducer, state, action)(Seasons);

