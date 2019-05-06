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
import NationsCountry from './components/nationsCountry';
import TabBar from '../../components/ScrollTabBar';
import Headerleft from '../../components/headerLeft';

class EventCenter extends Component{

    static navigationOptions = ({navigation})=>{
        const {handleGoBack = null,title} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        return {title, headerLeft}
    };

    componentWillMount() {
        const {navigation, initNations} = this.props;
        navigation.setParams({
            title: '资料库',
            handleGoBack: ()=>{navigation.goBack()}
        });
        // 初始化数据
        initNations()

    }

    render(){
        const {nations, nationsNames, navigation, dataList} = this.props;
        return(
                <ScrollableTabView style={styles.container}
                                   locked={false}
                                   renderTabBar={() => <TabBar tabNames={nationsNames}
                                   cls={{paddingBottom: 0,height: 44}}/>}
                                   onChangeTab={(obj)=>{
                                       console.log(obj.i);
                                   }}>
                    {
                        nations.map((item, index) => {
                            return <NationsCountry navigation={navigation} 
                                                   tabLabel={item.name} key={index}
                                                   dataList={dataList[index]} vid={item.id}/>
                        })
                    }
                </ScrollableTabView>
        )
    }
}
export default connectReducerComponent(storeKey.EVENTCENTER_STORE, reducer, state, action)(EventCenter);

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: CommonColor.BgColor
    },
    lineStyle:{
        backgroundColor: CommonColor.SelfOrange
    }
});