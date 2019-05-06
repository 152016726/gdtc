/**
 * Created by marcus on 2018/12/17.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

export default class TeamTable extends Component{

    /**
     * 渲染行数据
     * @returns {*}
     */
    renderData(){
        const {data} = this.props;
        return data.map((item, index)=> {
            const {viewStyle, fontStyle, color, text, customView} = item;
            return <View key={index} style={viewStyle}>
                    {
                        customView ? customView : <Text style={[fontStyle, color ? {color} : null]}>
                            {text}
                        </Text>
                    }
           </View>
        });
    }

    render(){
        const {contentStyle} = this.props;
        return(
            <View style={[styles.container, contentStyle ? contentStyle : {}]}>
                {this.renderData()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'center'
    }
});

