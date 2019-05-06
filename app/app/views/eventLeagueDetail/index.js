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
    TextInput,
    TouchableOpacity,
    FlatList
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import TabBar from '../../components/ScrollTabBar';
import Headerleft from '../../components/headerLeft';
import HeaderRight from '../../components/headerRight';
import Course from './course';
import IntegralView from './integralView';
import FormatView from './formatView';

const tabNames= ['赛程',"积分","赛制"];

class EventCenter extends Component{

    static navigationOptions = ({navigation})=>{
        const {
            handleGoBack = null,
            title,
            handleGoRight = null
        } = navigation.state.params || {};
        let headerLeft = <Headerleft
                            handleGoBack={handleGoBack}
                            img={require('../../images/back.png')}
                        />;
        let headerRight = <HeaderRight
                            others={
                                    <View style={styles.league}>
                                        <Text style={styles.leagueText}>赛季</Text>
                                    </View>
                            }
                            cls={{
                                width: 48,
                                borderWidth: 1,
                                borderColor: CommonColor.BgColorWhite
                            }}
                            onPress={handleGoRight}
                        />;
        return {title, headerLeft, headerRight}
    };

    componentWillMount() {
        const {navigation, seasonName, shortName} = this.props;
        // 设置头部
        navigation.setParams({
            title:  seasonName + shortName,
            handleGoBack: ()=> navigation.goBack(),
            handleGoRight: ()=> this.handleGoRight()
        });
    }


    /**
     * 跳转至赛季选择
     */
    handleGoRight(){
        const {navigation} = this.props;
        navigation.navigate('Seasons',{
            setHeader(title){
                navigation.setParams({
                    title
                })
            }
        })
    }
    
    render(){
        const {id, seasonId, stageId, roundId} = this.props;
        return(
            <ScrollableTabView
                renderTabBar={()=> <TabBar
                                    tabNames={tabNames}
                                    cls={{paddingBottom: 0,height: 40}}
                                />}
                onChangeTab={(obj)=>{console.log(obj.i);}}
            >
                <Course
                    tabLabel={tabNames[0]}
                    id={id}
                    seasonId={seasonId}
                    stageId={stageId}
                    roundId={roundId}
                />
                <IntegralView
                    tabLabel={tabNames[1]}
                    lId={id}
                    seasonId={seasonId}
                />
                <FormatView tabLabel={tabNames[2]}
                            lid={id}
                            seasonId={seasonId}
                />
            </ScrollableTabView>
        )
    }
}
export default connectReducerComponent(storeKey.EVENTLEAGUEDETAIL_STORE, reducer, state, action)(EventCenter);

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
    },
    league:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    leagueText:{
        fontSize: CommonFont.FONT_16,
        color: CommonColor.BgColorWhite
    }
});