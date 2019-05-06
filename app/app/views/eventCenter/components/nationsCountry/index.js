/**
 * Created by marcus on 2018/11/29.
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
import * as CommonColor from '../../../../constants/color';
import * as CommonFont from '../../../../constants/fontSize';

const rowWidth = Dimensions.get('window').width;

export default class NationsCountry extends Component{

    render(){
        const {navigation, dataList, vid, opsName, cls, gotoTab} = this.props;
        return(
            <ScrollView>
                <View style={styles.container}>
                    {!!dataList && dataList.map((item, index) => {
                        return <TouchableOpacity key={item.name+index} style={[styles.btns, cls]} onPress={() => gotoTab ? gotoTab(item) : navigation.navigate('EventLeagueInfo',{item, vid})}>
                            <Text style={styles.fonts}>{opsName ? item[opsName] : item.name}</Text>
                        </TouchableOpacity>
                    })}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 6
    },
    btns:{
        width: (rowWidth - 12)/4 - 12,
        height: 40,
        marginVertical: 5,
        marginHorizontal: 6,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: CommonColor.BgColorWhite,
        borderWidth: 1,
        borderColor: '#dedede'
    },
    fonts:{
        fontSize: CommonFont.FONT_15,
        color: CommonColor.contentText
    }
});