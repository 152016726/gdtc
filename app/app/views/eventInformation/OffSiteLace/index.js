/**
 * Created by mac-ddt on 2018/8/27.
 */
import React,{Component} from 'react';

import {connectReducerComponent} from '../../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../../constants/storeKeys';

import InformationList from '../../../components/informationLIst';

export class OffSiteLace extends Component{

    componentWillMount(){
        this.props.reqData();
    }

    render(){
        const {informationList, navigation, pullUpLoad, refreshHandle, isFooter} = this.props;
        return(
            <InformationList flatListData={informationList}
                             navigation={navigation}
                             pullUpLoad={pullUpLoad}
                             isFooter={isFooter}
                             refreshHandle={refreshHandle}/>
        )
    }
}

export default connectReducerComponent(storeKey.SITELACE_STORE, reducer, state, action)(OffSiteLace)