import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Switch
} from 'react-native';
import { connectComponentAction } from "../../../../../reduxCfg";
import action from "./action";
import { BgColor, headerBorderColor } from '../../../../../constants/color';
import * as storeKey from "../../../../../constants/storeKeys";

class ScoreTipsRange extends Component {

    static defaultProps = {
        item : {},
        isShowRanking : true,
        isShowRedYellowCard : true,
        isPushMyFavouriteGame : true
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { item } = this.props;
        if (item.item.type === 4) {
            this.props.getPushDeviceStatus();
        }
    }

    render() {
        const {
            item,
            isShowRanking,
            isShowRedYellowCard,
            isPushMyFavouriteGame,
            updateShowRanking,
            updateShowRedYellowCard,
            updatePushMyFavouriteGame
        } = this.props;
        return (
            <View style={styles.container}>
                <Switch style={styles.switch}
                        value={item.item.type !== 4 ? (item.index === 5 ? isShowRanking : isShowRedYellowCard)
                                              : isPushMyFavouriteGame}
                        onValueChange={() => {
                            item.item.type !== 4 ? (item.index === 5 ? updateShowRanking(isShowRanking) : updateShowRedYellowCard(isShowRedYellowCard))
                                           : updatePushMyFavouriteGame(isPushMyFavouriteGame)
                        }}

                        disabled={false}
                />
            </View>
        );
    }
}
export default connectComponentAction(action, storeKey.SCORE_SETTING_TIPS_RANGE)(ScoreTipsRange)

const styles = StyleSheet.create({

    container : {
        flex : 1,
        backgroundColor : '#ffffff',
        flexDirection : 'row',
        justifyContent : 'flex-end',
        alignItems : 'center'
    },
    switch : {
        height : 37,
        width : 54,
        marginRight : 12,
        marginTop : 10,
        marginBottom : 3
    }
});