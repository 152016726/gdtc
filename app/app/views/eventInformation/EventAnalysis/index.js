/**
 * Created by mac-ddt on 2018/8/27.
 */
import React,{Component} from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import {connectReducerComponent} from '../../../reduxCfg';
import AnalysisTabBar from './AnalysisTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../../constants/storeKeys';
import InformationList from '../../../components/informationLIst';
import {BgColor} from '../../../constants/color';

export class EventAnalysis extends Component{

    /**
     * 数据接口请求
     */
    componentWillMount(){
        this.props.reqTitleData();
    }

    render(){
        const {navigation, leagueMatch, changeTabHandle, pullUpLoad, refreshHandle} = this.props;
        return(
            <ScrollableTabView style={{backgroundColor: BgColor}}
                               renderTabBar={() => <AnalysisTabBar/>}
                               onChangeTab={(eObj)=>changeTabHandle(eObj)}
                               locked={true}>
                {
                    leagueMatch.map((lEvent, index)=>{
                        return(
                            <View tabLabel={lEvent.name}
                                  style={{backgroundColor: BgColor}}
                                  key={index}>
                                <InformationList flatListData={lEvent.content}
                                                 navigation={navigation}
                                                 pullUpLoad={pullUpLoad}
                                                 refreshHandle={refreshHandle}
                                                 isFooter={lEvent.isFooter}/>
                            </View>
                        )
                    })
                }
            </ScrollableTabView>
        )
    }
}

const styles = StyleSheet.create({

});

export default connectReducerComponent(storeKey.ANALYSIS_STORE, reducer, state, action)(EventAnalysis)