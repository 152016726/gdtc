/**
 * Created by mac-ddt on 2017/6/9.
 */
import React from 'react';
import { Platform } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'; //https://reactnavigation.org/docs/intro/
import * as KColor from '../constants/color'
import * as routes from './routes'
import Screen from '../modules/screen';
//配置不需要头部高度页面
let noHeightPageConfig = ['ScoreDetails'];    //比分详情等。。。。
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 56;

let headerConfig = (({navigation}) => {
    const {index, routeName} = navigation.state;
    let h = (index === 0 || noHeightPageConfig.indexOf(routeName) !== -1) ? 0 : 40;
    return (
        {
            headerStyle: {
                backgroundColor: '#eb812b',
                height: h,
                marginTop:Platform.OS === 'ios' ? (Screen.isIphoneXR()||Screen.isIphoneX() ? -44 : -20) : 0,
                borderBottomWidth: 0
            },
            headerTitleStyle: {
                flex: 1,
                alignItems: 'center',
                textAlign: 'center',
                fontSize: 18,
                color: KColor.BgColorWhite
            },
            headerBackTitleStyle: {
                color: '#fff'
            },
            headerTitleContainerStyle:{
                left: TITLE_OFFSET,
                right: TITLE_OFFSET,
            },
            headerTintColor: '#fff',
            headerBackTitle: null,
    // headerLeft:navigation.state.routeName!== 'Main'?<BackButton navigation={navigation}/>:<View/>,
        }

    )
});

export const MainNavigator = createAppContainer(createStackNavigator(routes.navRoutes, {defaultNavigationOptions: headerConfig,}));