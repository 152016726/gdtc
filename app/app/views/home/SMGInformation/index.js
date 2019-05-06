/**
 * Created by mac-ddt on 2018/8/24.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import InformationList from '../../../components/informationLIst';
import {FONT_18} from '../../../constants/fontSize';
import {MainColor, BorderColor, BgColorWhite, contentText} from  '../../../constants/color';
import {connectReducerComponent} from "../../../reduxCfg";
import * as storeKey from "../../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";

class SMGInformation extends Component{
    /**
     * tab栏 render
     * @returns {*}
     */
    renderTabTitle(){
        const {activeIndex, changeTitleTab} = this.props;
        let tabTitle = ['竞彩资讯', '专家分析'];
        return(
            <View style={styles.tabTitle}>
                {tabTitle.map((tabT,index)=>{
                    return(
                        <TouchableOpacity onPress={()=>changeTitleTab(index)}
                                          key={index}>
                            <Text style={[
                                styles.tabTitleText,
                                index === activeIndex && styles.tabTitleActiveText
                            ]}>
                                {tabT}
                            </Text>
                            {
                                index === activeIndex ?
                                    <Image style={styles.imageS}
                                           source={require('../images/markingLine.png')}/>:
                                    <Text style={styles.Texts}/>
                            }
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    render(){
        const {information, expertsList, navigation, activeIndex, isFooterIF, isFooterEx, isLoadingEx, isLoadingIF} = this.props;
        let listData = activeIndex ? expertsList: information;
        let isFooter = activeIndex ? isFooterEx: isFooterIF;
        let isLoading = activeIndex ? isLoadingEx: isLoadingIF;
        return(
            <View style={{backgroundColor: BgColorWhite}}>
                {this.renderTabTitle()}
                <InformationList flatListData={listData}
                                 navigation={navigation}
                                 isFooter={isFooter}
                                 isLoading={isLoading}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabTitle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: BorderColor
    },
    tabTitleText: {
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 6,
        fontSize: FONT_18,
        color: contentText
    },
    tabTitleActiveText: {
        color: MainColor
    },
    informationList:{
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: BorderColor
    },
    imageS: {
        width: 98, 
        height: 6,
        resizeMode: 'contain'
    },
    Texts: {
        width: 98,
        height: 6
    }
});
export default connectReducerComponent(storeKey.HOME_SMG_STORE, reducer, state, action)(SMGInformation)