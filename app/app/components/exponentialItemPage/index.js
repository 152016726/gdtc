import {createAppContainer,createMaterialTopTabNavigator} from "react-navigation";
import List from "./list";
import Detail from "./detail";

let pageConf = {
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {                       //标签栏的样式设置如下
        style: {                            //整体标签栏样式设置
            display: 'none'
        }
    }
};
export const ExponentialItemPage = createAppContainer(createMaterialTopTabNavigator(
    {
        List: {screen: List},
        Detail: {screen: Detail}
    },
    {
        ...pageConf,
        initialRouteName: 'List'
    }
));

export const ExponentialItemPageInitDetail = createAppContainer(createMaterialTopTabNavigator(
    {
        List: {screen: List},
        Detail: {screen: Detail}
    },
    {
        ...pageConf,
        initialRouteName: 'Detail'
    }
));

export const ExponentialItemPageJustDetail =createAppContainer(createMaterialTopTabNavigator(
    {
        Detail: {screen: Detail}
    },
    {
        ...pageConf,
        initialRouteName: 'Detail'
    }
));


