/**
 * Created by mac-ddt on 2018/8/27.
 */
import React, {Component} from 'react';
import {
    View
} from 'react-native';

import {connectReducerComponent} from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../constants/storeKeys';
import InformationList from '../../components/informationLIst';
import {BgColor, BgColorWhite} from '../../constants/color';

export class PlayingSkills extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: '玩法技巧'
        }
    };

    componentWillMount() {
        this.props.reqData();
    }

    render() {
        const {informationList, navigation, pullUpLoad, refreshHandle, isFooter} = this.props;
        return (
            <View style={{backgroundColor: BgColor, marginTop: 10, flex: 1}}>
                <InformationList flatListData={informationList}
                                 pullUpLoad={pullUpLoad}
                                 navigation={navigation}
                                 isFooter={isFooter}
                                 refreshHandle={refreshHandle}/>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.PSKILLS_STORE, reducer, state, action)(PlayingSkills)