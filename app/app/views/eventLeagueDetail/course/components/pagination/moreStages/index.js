/**
 * Created by marcus on 2018/12/9.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import * as CommonColor from '../../../../../../constants/color';
import * as CommonFont from '../../../../../../constants/fontSize';
import up from '../images/up.png';
import down from '../images/down.png';

const rowWidth = Dimensions.get('window').width;

export default class MoreStages extends Component{

    render(){
        const {show = true, maskPress, itemClick, arr, pageY} = this.props;
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={show}
                onRequestClose={maskPress}
            >
                <TouchableWithoutFeedback onPress={maskPress}>
                    <View style={[styles.mask,{marginTop: pageY}]}>
                        <View style={styles.container}>
                            {
                                arr.map((item, index) => {
                                    return <TouchableOpacity
                                                 style={styles.itemStyle}
                                                 key={item+index}
                                                 onPress={()=>{
                                                    itemClick(item, index);
                                                 }}
                                            >
                                                <Text style={styles.itemText}>
                                                    {item.stageName}
                                                </Text>
                                            </TouchableOpacity>
                                })
                            }
                        </View>
                        <View style={styles.touchIcon}>
                            <Text style={styles.iconText}>收起</Text>
                            <Image source={up}
                                   style={styles.icon}
                                   resizeMode={'contain'}>
                            </Image>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    mask:{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    container:{
        width: rowWidth,
        backgroundColor: CommonColor.BgColorWhite,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    itemStyle:{
        height: 40,
        width: rowWidth/3,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: CommonColor.BorderColor,
        borderRightWidth: 1,
        borderRightColor: CommonColor.BorderColor
    },
    itemText:{
        fontSize: CommonFont.FONT_14,
        color: CommonColor.teamRateGrey
    },
    touchIcon:{
        height: 28,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: CommonColor.BgColorWhite
    },
    iconText:{
        fontSize: CommonFont.FONT_13,
        color: CommonColor.SelfOrange
    },
    icon:{
        width: 12,
        height: 7
    }
});