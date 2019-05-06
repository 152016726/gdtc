/**
 * Created by marcus on 2019/1/4.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';

export default class TabSelections extends Component{

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            defaultIndex: 0,
            strArr: props.data
        };
    }

    /**
     * 选择榜单类型
     * @param index  索引
     */
    choosePlay(index){
        const {pressEvent} = this.props;
        this.setState({
            defaultIndex: index,
            strArr: this.state.strArr.concat([])
        });
        pressEvent && pressEvent(index)
    }

    /**
     * 渲染榜头
     * @param item
     * @param index
     * @returns {XML}
     */
    renderItem(item, index){
        const {itemStyle,  activeStyle, fontStyle, activeFont, lastStyle} = this.props;
        return <TouchableOpacity
            style={[
                itemStyle,
                index === this.state.defaultIndex ? activeStyle : null,
                (this.state.strArr.length === index + 1) && lastStyle
            ]}
            key={index}
            onPress={()=> this.choosePlay(index)}
            activeOpacity={1}
        >
            <Text style={[
                fontStyle,
                index === this.state.defaultIndex ? activeFont : null
            ]}>
                {item}
            </Text>
        </TouchableOpacity>
    }

    /**
     * 渲染榜单选择栏
     * @returns {Array}
     */
    renderList(){
        const {strArr} = this.state;
        const {renderBottom} = this.props;
        return <FlatList
            horizontal={true}
            data={strArr}
            renderItem={({item, index}) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index+'id'}
            // ItemSeparatorComponent={()=> renderBottom && renderBottom()}
            removeClippedSubviews={false}
            scrollEnabled={false}
            showsVerticalScrollIndicator = {false}
            showsHorizontalScrollIndicator={false}
        />
    }

    render(){
        const {containerStyle} = this.props;
        return (
            <View style={containerStyle}>
                {this.renderList()}
            </View>
        )
    }
}