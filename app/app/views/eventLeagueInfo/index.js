/**
 * Created by marcus on 2018/11/28.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import * as CommonColor from '../../constants/color';
import Headerleft from '../../components/headerLeft';
import NationsCountry from '../eventCenter/components/nationsCountry';
import getLeagueInfo from '../../services/getLeagueInfo';

const rowWidth = Dimensions.get('window').width;

class EventLeagueInfo extends Component{

    static navigationOptions = ({navigation})=>{
        const {handleGoBack = null,title} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        return {title, headerLeft}
    };

    componentWillMount() {
        let self = this;
        const {navigation, changeState} = self.props;
        let {item, vid} = this.props.navigation.state.params || {};
        navigation.setParams({
            title: item.name+'-赛事资料库',
            handleGoBack: ()=>{navigation.goBack()}
        });
        // 通过接口获取数据
        getLeagueInfo.getData({
            fid: vid,
            sid: item.id
        }).then(rsp=>{
            changeState({
                dataList: rsp.data.list
            });
        },rej=>{
            console.log(rej.rspMsg);
        })
    }

    gotoTab(leagueInfo){
        const {updateNextState, navigation, updateSeasonState} = this.props;
        const {id, name, shortName, color, system, seasonId, seasonName, stageId, stageName, roundId, roundName} = leagueInfo;
        // 更新赛程页state里的leagueInfo
        updateNextState({
            id,
            name,
            shortName,
            color,
            system,
            seasonId,
            seasonName,
            stageId,
            stageName,
            roundId,
            roundName
        });
        // 更新赛季页state里的leagueInfo
        updateSeasonState({
            id,
            shortName,
            seasonId
        });
        navigation.navigate('EventLeagueDetail')
    }
    
    render(){
        const {navigation, dataList} = this.props;
        return(
            <ScrollView>
                <NationsCountry
                    navigation={navigation}
                    dataList={dataList}
                    opsName={'shortName'}
                    cls={{width: (rowWidth-12)/3-12}}
                    gotoTab={(item)=>this.gotoTab(item)}/>
            </ScrollView>
        )
    }
}
export default connectReducerComponent(storeKey.EVENTLEAGUEINFO_STORE, reducer, state, action)(EventLeagueInfo);

const styles = StyleSheet.create({
    container:{
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: CommonColor.BgColor,
        backgroundColor: CommonColor.BgColorWhite
    },
    lineStyle:{
        backgroundColor: CommonColor.SelfOrange
    }
});