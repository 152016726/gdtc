/**
 * Created by easyLottoMac on 2018/10/16.
 */
import React, {Component} from 'react';
import {
    View
} from 'react-native';
import {connectReducerComponent} from '../../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../../constants/storeKeys';
import Intelligence from './intelligence';
import TabViewCustom from '../../../components/tabViewCustom';
import Recommend from './recommend';


class ScoreInformation extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: '资讯'
        }
    };

    render() {
        const {navigation, vid, homeName, awayName} = this.props;
        let tabNames = ["情报", "推荐"];
        return (
            <View>
                <Recommend navigation={navigation}
                           vid={vid}
                           homeName={homeName}
                           awayName={awayName}/>
                {/*<TabViewCustom tabNames={tabNames}>
                        <Intelligence tabLabel="page1"/>
                        <Recommend tabLabel="page2" navigation={navigation}/>
                    </TabViewCustom>*/}
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SCORE_DETAILS_information_STORE, reducer, state, action)(ScoreInformation)