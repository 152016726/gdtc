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

export default class SectionTime extends Component{

    render(){
        const {data = []} = this.props;
        return (
            <View style={styles.container}>
                <Text style={[
                    styles.contentTxt, {fontSize: CommonFont.FONT_12}]}>
                    {data[0]}
                </Text>
                <Text style={[
                styles.contentTxt, {fontSize: CommonFont.FONT_12}]}>
                    {data[1]}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentTxt:{
        fontSize: CommonFont.FONT_14,
        color: CommonColor.playIntroduceContent,
        backgroundColor:'transparent'
    }
});