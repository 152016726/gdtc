/**
 * Created by easyLottoMac_Feng on 2019/1/2.
 */
import React, {Component} from 'react';
import {
    View
} from 'react-native';
import {connectReducerComponent} from "~/reduxCfg";
import * as storeKey from "~/constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import HeaderLeft from "~/components/headerLeft";
import ExpertList from "~/components/expertList";

class ExpertGroup extends Component {
    static navigationOptions = ({navigation}) => {
        let headerLeft = <HeaderLeft handleGoBack={() => navigation.goBack()} img={require('../../images/back.png')}/>;
        return {
            title: '晒单团',
            headerLeft
        }
    };

    componentWillMount() {
        this.props.getExpertListData()
    }

    render() {
        const {expertList, navigation, refreshHandle, isFooter, pullUpLoad} = this.props;
        return (
            <View>
                <ExpertList
                    title='晒单团'
                    navigation={navigation}
                    expertList={expertList}
                    refreshHandle={refreshHandle}
                    pullUpLoad={pullUpLoad}
                    isFooter={isFooter}/>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.EXPERT_GROUP_STORE, reducer, state, action)(ExpertGroup)