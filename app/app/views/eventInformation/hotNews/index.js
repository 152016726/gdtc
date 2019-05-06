/**
 * Created by mac-ddt on 2018/8/27.
 */
import React,{Component} from 'react';
import {
    View
} from 'react-native';

import {connectReducerComponent} from '../../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../../constants/storeKeys';
import InformationList from '../../../components/informationLIst';
import {BgColorWhite, BgColor} from '../../../constants/color';

export class HotNews extends Component{

    componentWillMount(){
        this.props.reqData();
    }
    
    render(){
        const {informationList, navigation, refreshHandle, pullUpLoad, isFooter} = this.props;
        return(
            <View style={{backgroundColor: BgColorWhite}}>
                <InformationList flatListData={informationList}
                                 navigation={navigation}
                                 pullUpLoad={pullUpLoad}
                                 isFooter={isFooter}
                                 refreshHandle={refreshHandle}/>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.HOTNEWS_STORE, reducer, state, action)(HotNews)