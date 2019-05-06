/**
 * Created by easyLottoMac on 2018/10/16.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import {connectReducerComponent} from '../../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../../constants/storeKeys';
import TabViewCustom from '../../../components/tabViewCustom';
import {getConstructor} from './getCompanyData'
import {ExponentialItemPage, ExponentialItemPageInitDetail, ExponentialItemPageJustDetail} from '../../../components/exponentialItemPage';
let ahConstructor;
let wdwConstructor;

class Exponential extends Component {
    static defaultProps = {
        tabNames: ['亚指', '欧指', '必发']
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: '指数',
        }
    };

    componentWillMount(){
        ahConstructor = getConstructor();
        wdwConstructor = getConstructor();
    }
    changeTabCb({ref}){
        if (ref.props && ref.props.screenProps && ref.props.screenProps.navigation) {
            ref.props.screenProps.navigation.navigate('List');
        }
    }
    render() {
        let {tabNames, vid, secondLevelPageId, prevPage, cid} = this.props;
        return (
            <View style={{flex: 1}}>
                <TabViewCustom
                    tabNames={tabNames}
                    changeTabCb={this.changeTabCb}
                    prerenderingSiblingsNumber={0}
                    secondLevelPageId={secondLevelPageId}
                >
                    {/*亚盘*/}
                    {prevPage == 'exponent' ? <ExponentialItemPageInitDetail screenProps={{type: "ah", vid, cid, getList: ahConstructor}} tabLabel="ah"/> : <ExponentialItemPage screenProps={{type: "ah", vid, cid, getList: ahConstructor}} tabLabel="ah"/>}
                    {/*欧赔*/}
                    {prevPage == 'exponent' ? <ExponentialItemPageInitDetail screenProps={{type: "wdw", vid, cid, getList: wdwConstructor}} tabLabel="wdw"/> : <ExponentialItemPage screenProps={{type: "wdw", vid, cid, getList: wdwConstructor}} tabLabel="wdw"/>}
                    {/*必发*/}
                    <ExponentialItemPageJustDetail screenProps={{type: "bt", vid}} tabLabel="bt"/>
                </TabViewCustom>
            </View>
        )
    }
}

const styles = StyleSheet.create({});
export default connectReducerComponent(storeKey.SCORE_DETAILS_EXPONENTIAL_STORE, reducer, state, action)(Exponential)