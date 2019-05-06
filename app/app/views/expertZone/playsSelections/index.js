/**
 * Created by marcus on 2019/1/2.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import * as CommonColor from '~/constants/color';
import * as CommonFont from '~/constants/fontSize';
import TabSelections from '~/components/tabSelections';
import LatestPush from '../latestPush';
import HistoryPush from '../historyPush';

const rowWidth = Dimensions.get('window').width-40;
const _strArr = ['全部', '胜平负2串1', '单关', '总进球'];

export default class PlaysSelections extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            type: 0
        };
      }

    /**
     * 分割线 render
     * @returns {*}
     */
    borderBottomList() {
        return (
            <View style={styles.lineS}/>
        )
    }

    /**
     * 改变荐单类型
     * @param type 荐单类型
     * @private
     */
    _onPress(type){
        this.setState({
            type
        })
    }


    render(){
        const {eid, navigation} = this.props;
        const {type} = this.state;
        return(
            <View>
                <View style={styles.content}>
                    <TabSelections
                        data={_strArr}
                        containerStyle={styles.container}
                        itemStyle={styles.itemStyle}
                        activeStyle={styles.activeStyle}
                        fontStyle={styles.fontStyle}
                        activeFont={styles.activeFont}
                        renderBottom={this.borderBottomList}
                        pressEvent={(type)=> this._onPress(type)}
                    />
                </View>
                <LatestPush
                    eid={eid}
                    type={type}
                    navigation={navigation}
                />
                <HistoryPush
                    eid={eid}
                    type={type}
                    navigation={navigation}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    content:{
        justifyContent:'center',
        alignItems: "center",
        marginTop: 20,
        marginBottom: 2
    },
    lineS:{
        width: 1,
        height: 30,
        backgroundColor: CommonColor.MainColor
    },
    container:{
        width: rowWidth,
        height: 30,
        borderWidth: 1,
        borderColor: CommonColor.MainColor
    },
    itemStyle:{
        width: rowWidth/4,
        height: 30,
        backgroundColor: CommonColor.BgColorWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: CommonColor.MainColor
    },
    activeStyle:{
        backgroundColor: CommonColor.MainColor,
        borderRightColor: 'transparent'
    },
    fontStyle:{
        fontSize: CommonFont.FONT_13,
        color: CommonColor.MainColor
    },
    activeFont:{
        color: CommonColor.BgColorWhite
    }
});