/**
 * Created by marcus on 2018/12/3.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    ListView
} from 'react-native';
import * as CommonColor from '../../../../../../constants/color';
import * as CommonFont from '../../../../../../constants/fontSize';

export default class SectionScore extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            type: ''
        };
      }

    render(){
        const {
            homeGoalsScored, 
            awayGoalsScored, 
            homeHalftimeScored, 
            awayHalftimeScored, 
            eventState
        } = this.props;
        return (
            <View style={styles.container}>
                <Text
                    style={[styles.contentTxt,{color:CommonColor.FinalMatchColor}]}>
                    {eventState === 1 ? '' : homeGoalsScored}-{eventState === 1 ? '' : awayGoalsScored}
                </Text>
                <Text style={[
                    styles.contentTxt,
                    {color:CommonColor.NotStartMatchColor, fontSize: CommonFont.FONT_12}]}>
                    ({eventState === 1 ? '' : homeHalftimeScored}-{eventState === 1 ? '' : awayHalftimeScored})
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentTxt:{
        fontSize: CommonFont.FONT_14,
        color: CommonColor.playIntroduceContent,
        backgroundColor:'transparent'
    }
});