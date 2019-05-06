/**
 * Created by marcus on 2018/12/4.
 */
import React, {Component} from 'react';
import {View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import * as CommonColor from '../../../../constants/color';
import SeasonTab from './seasonTab';

const rowWidth = Dimensions.get('window').width;

export default class ScrollTabs extends Component{

    /**
     * description  赋值选中的index
     * @param index
     * @private
     */
    _onPress(index){
        // 再赋值给state
        const {data, updateState} = this.props;
        updateState({
            defaultTab: index,
            seasons: data.concat([])
        })
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
    
    renderItem(){
        const {data, defaultIndex} = this.props;
        return <FlatList data={data}
                         keyExtractor={(item, index) => index+'season'}
                         renderItem={(item, index) => <SeasonTab data={item} defaultIndex={defaultIndex} _onPress={this._onPress.bind(this)}/>}
                         ItemSeparatorComponent={this.borderBottomList}
                         scrollEventThrottle={1}
                />
    }
    
    render(){
        const {data} = this.props;
        return(
            <View style={styles.container}>
                {
                    data.length > 0 && <ScrollView>
                        {this.renderItem()}
                    </ScrollView>
                }
                { data.length === 0 && <Text style={{color: '#777777'}}>暂无数据</Text>}
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
    lineS:{
        height: 1,
        width: rowWidth - 15,
        marginLeft: 15,
        backgroundColor: CommonColor.BgColor
    }
});