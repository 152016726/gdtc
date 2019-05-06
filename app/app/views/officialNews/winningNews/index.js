/**
 * Created by mac-ddt on 2018/8/27.
 */
import React, {Component} from 'react';
import {
    View
} from 'react-native';
import {connectReducerComponent} from '~/reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '~/constants/storeKeys';
import InformationList from '~/components/informationLIst';

export class WinningNews extends Component {
    componentWillMount() {
        this.props.reqData();
    }

    render() {
        const {informationList, navigation, pullUpLoad, refreshHandle, isFooter} = this.props;
        return (
            <View>
                <InformationList
                    flatListData={informationList}
                    pullUpLoad={pullUpLoad}
                    navigation={navigation}
                    isFooter={isFooter}
                    refreshHandle={refreshHandle}/>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.WINNING_STORE, reducer, state, action)(WinningNews)