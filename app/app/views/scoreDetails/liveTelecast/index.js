/**
 * Created by easyLottoMac on 2018/10/16.
 */
import React,{Component} from 'react';
import {
    Text,
    View
} from 'react-native';

import {connectReducerComponent} from '../../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../../constants/storeKeys';
import TabViewCustom from '../../../components/tabViewCustom';
import EventSituation from './eventSituation';
import FirstStart from './firstStart';
import WordsLiveBroadcast from './wordsLiveBroadcast';


class LiveTelecast extends Component{
    static defaultProps = {
        tabNames: ['赛况', '首发', '文字']
    };

    static navigationOptions = ({navigation})=>{
            return {
                title: '直播'
            }
     };
    render(){
        let {tabNames,vid,homeName,awayName} = this.props;
        return (
            <View style={{flex: 1}}>
                <TabViewCustom
                    tabNames={tabNames}
                >
                    <EventSituation
                        tabLabel="page1"
                        vid={vid}
                        homeName={homeName}
                        awayName={awayName}
                    >
                        page1
                    </EventSituation>
                    <FirstStart tabLabel="page2" vid={vid}>page2</FirstStart>
                    <WordsLiveBroadcast tabLabel="page3" vid={vid}>page3</WordsLiveBroadcast>
                </TabViewCustom>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SCORE_DETAILS_LIVE_STORE, reducer, state, action)(LiveTelecast)