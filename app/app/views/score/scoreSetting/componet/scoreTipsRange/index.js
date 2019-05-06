import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { connectComponentAction } from "../../../../../reduxCfg";
import action from "./action";
import { BgColor, headerBorderColor } from '../../../../../constants/color';
import * as storeKey from "../../../../../constants/storeKeys";

const choose_ok = require('../../../../../images/choose_ok_orange.png');
const no_choose = require('../../../../../images/no_choose.png');

class ScoreTipsRange extends Component {

    static defaultProps ={
        allGame : true,
        favouriteGame : true,
    };

    constructor(props) {
        super(props);
    }


    render() {
        const {
            allGame,
            favouriteGame,
            updateAllGame,
            updateFavouriteGame
        } = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => {updateAllGame(allGame)}}>
                    <Image style={styles.buttonOne} source={allGame ? choose_ok : no_choose}/>
                </TouchableOpacity>
                <Text style={styles.buttonOneText}>全部</Text>
                <TouchableOpacity onPress={() => {updateFavouriteGame(favouriteGame)}}>
                    <Image style={styles.buttonTwo} source={favouriteGame ? choose_ok : no_choose}/>
                </TouchableOpacity>
                <Text style={styles.buttonTwoText}>我关注的比赛</Text>
            </View>
        );
    }
}
export default connectComponentAction(action, storeKey.SCORE_SETTING_TIPS_RANGE)(ScoreTipsRange)


const styles = StyleSheet.create({

    container:{
            flex : 1,
            backgroundColor : '#ffffff',
            flexDirection : 'row',
            justifyContent : 'flex-end',
            alignItems : 'center'
    },
    buttonOne:{
            height : 18,
            width : 18
    },
    buttonOneText:{
            fontSize : 13,
            fontFamily : 'PingFang-SC-Medium',
            color : '#333333',
            marginRight : 27,
            marginLeft : 9
    },
    buttonTwo:{
            height : 18,
            width : 18,
            marginRight : 8
    },
    buttonTwoText:{
            marginRight : 50,
            fontSize : 13,
            fontFamily : 'PingFang-SC-Medium',
            color : '#333333'
    }
});