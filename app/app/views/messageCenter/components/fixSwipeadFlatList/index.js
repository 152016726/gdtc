/**
 * Created by easyLottoMac_Feng on 2019/3/6.
 */
import { SwipeableFlatList, FlatList } from 'react-native'
import React from 'react'

export default class FixSwipeadFlatList extends SwipeableFlatList {
    render(){
        return (
            <FlatList
                {...this.props}
                ref={ref => {
                    this._flatListRef = ref;
                }}
                extraData={this.state}
                onScroll={this._onScroll}
                renderItem={this._renderItem}
            />
        );
    }
}
