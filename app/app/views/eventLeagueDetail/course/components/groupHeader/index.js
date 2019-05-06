/**
 * Created by marcus on 2018/12/5.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as CommonColor from '../../../../../constants/color';
import * as CommonFont from '../../../../../constants/fontSize';

const rowWidth = Dimensions.get('window').width;

export default class GroupHeader extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            flag: true
        };
      }

   
    /**
     *  toggle显示排名还是队伍信息
     * @param flag  type:boolean
     * @private
     */
    _onPress(flag){
        const {updateState} = this.props;
        this.setState({
            flag: flag
        });
        updateState({
            isRankorTeam: flag
        })
    }

    changeText(str){
        return (+str)-0 >= 0 ? str+'轮' : str;
    }

    render(){
        const {data} = this.props;
        const {flag} = this.state;
        return(
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.rowBox}>
                        <View style={styles.line}></View>
                        <Text>
                            {(Object.keys(data).length === 0 || !data.roundName) ? '-' : this.changeText(data.roundName)}
                        </Text>
                    </View>
                    <View style={styles.rowBox}>
                        {
                            (data.isHasScoreboard === 'true') && <TouchableOpacity
                                style={[flag ? styles.touchStyle : styles.wTouchStyle, {marginRight: 10}]}
                                onPress={()=> this._onPress(false)}
                            >
                                <Text style={flag ? styles.fontStyle : styles.wFontStyle}>
                                    小组积分
                                </Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity
                            style={flag ? styles.wTouchStyle : styles.touchStyle}
                            onPress={()=> this._onPress(true)}
                        >
                            <Text style={flag ? styles.wFontStyle : styles.fontStyle}>
                                赛程赛果
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        height: 41,
        width: rowWidth,
        backgroundColor: CommonColor.BgColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content:{
        flex: 1,
        width: rowWidth - 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    rowBox:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    line:{
        width: 3,
        height: 15,
        marginRight: 6,
        backgroundColor: '#DE1D30'
    },
    groupName:{
        fontSize: CommonFont.FONT_16,
        color: CommonColor.contentText
    },
    touchStyle:{
        height: 24,
        width: 78,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CommonColor.BgColorWhite,
        borderWidth: 1,
        borderColor: CommonColor.BorderColor,
        borderRadius: 10
    },
    fontStyle:{
        fontSize: CommonFont.FONT_14,
        color: CommonColor.tipsTextGrey
    },
    wFontStyle:{
        fontSize: CommonFont.FONT_14,
        color: '#FFFFFF'
    },
    wTouchStyle:{
        height: 24,
        width: 78,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CommonColor.SelfOrange,
        borderWidth: 1,
        borderColor: CommonColor.SelfOrange,
        borderRadius: 10
    }
});