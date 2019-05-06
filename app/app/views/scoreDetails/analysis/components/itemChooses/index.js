/**
 * Created by marcus on 2018/12/20.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as CommonColor from '../../../../../constants/color';
import * as fontSize from '../../../../../constants/fontSize';

export default class ItemChooses extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            indexArr: []
        };
      }

    /**
     * 设置默认选中项
     * @param index
     * @private
     */
    _onPress(index){
        let arr = this.state.indexArr;
        arr.push(index);
        this.setState({
            indexArr: arr
        })
    }

    _delPress(index){
        let arr = this.state.indexArr;
        arr.splice(arr.indexOf(index), 1);
        this.setState({
            indexArr: arr
        })
    }
    /**
     * 渲染选项
     * @param data
     * @returns {*}
     */
    renderItems(){
        const {onTouch, data} = this.props;
        const {indexArr} = this.state;
        return data.map((item, index)=> {
            return <TouchableOpacity
                key={index}
                style={[styles.itemStyle, indexArr.indexOf(index) !== -1 ? styles.itemChooseStyle : null]}
                onPress={()=>{
                    if(indexArr.indexOf(index) === -1){
                        this._onPress(index);
                        onTouch(item)
                    }else{
                        onTouch(item, false);
                        this._delPress(index)
                    }
                }}
            >
                <Text style={[styles.itemTextStyle, indexArr.indexOf(index) !== -1 ? styles.itemChooseTextStyle : null]}>
                    {item.text}
                </Text>
            </TouchableOpacity>
        })
    }

    render(){
        return(
            <View style={styles.container}>
                {this.renderItems()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemStyle:{
        height: 24,
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e1e1e1',
        borderRadius: 12,
        marginRight: 16
    },
    itemTextStyle:{
        fontSize: fontSize.FONT_12,
        color: CommonColor.teamRateGrey
    },
    itemChooseStyle:{
        backgroundColor: CommonColor.MainColor
    },
    itemChooseTextStyle:{
        color: CommonColor.BgColorWhite
    }
});