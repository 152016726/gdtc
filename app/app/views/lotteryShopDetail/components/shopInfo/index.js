/**
 * Created by marcus on 2018/11/26.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList
} from 'react-native';
import infoImg from '../../images/infoImg.png';
import threeStar from '../../images/threeStar.png';
import fourStar from '../../images/fourStar.png';
import fiveStar from '../../images/fiveStar.png';
import * as CommonColor from '../../../../constants/color';
import * as CommonFont from '../../../../constants/fontSize';

const rowWidth = Dimensions.get('window').width-20;

export default class ShopInfo extends Component{
    static defaultProps = {
            infoImg,
            dotNumer: 1101006,
            address: '广州市越秀区矿泉街沙涌南北站南路大塘基1号之3',
            distance: '1.19km',
            maxBonus: '1000万'
    };

    render(){
        const {infoImg, dotNumer, address, distance, maxBonus} = this.props;
        return(
            <View style={styles.info}>
                <View style={styles.container}>
                    <Image
                        source={infoImg}
                        style={styles.infoImg}
                        resizeMode={'stretch'}/>
                    <Text style={[styles.lgText, styles.title]}>中国体育彩票-门店编号{dotNumer}</Text>
                    <View style={styles.address}>
                        <Text style={styles.smText}>{distance}</Text>
                        <Text style={styles.line}> | </Text>
                        <Text style={styles.smText} numberOfLines={1}>{address}</Text>
                    </View>
                    <View style={styles.level}>
                        <Image
                            source={fourStar}
                            style={styles.levelImg}
                            resizeMode={'contain'}/>
                        <Text style={styles.levelText}>网点星级</Text>
                    </View>
                    <Text style={styles.smText}>中出最高奖金: {maxBonus}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    info:{
        width: rowWidth + 20,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: CommonColor.BgColorWhite
    },
    container:{
        width: rowWidth,
        justifyContent: 'center'
    },
    infoImg:{
        width: rowWidth,
        height: 200
    },
    title:{
        lineHeight: 32,
        fontWeight: 'bold'
    },
    line:{
        fontSize: CommonFont.FONT_12,
        color: '#A6A6A6'
    },
    address:{
        flexDirection: 'row',
        height: 22,
        alignItems: 'center'
    },
    level:{
        height: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    levelImg:{
        width: 71,
        height: 12
    },
    levelText:{
        marginLeft: 8,
        fontSize: CommonFont.FONT_12,
        color: CommonColor.ShadowGrey
    },
    award:{
        fontSize: CommonFont.FONT_12,
        color: CommonColor.playIntroduceContent
    },
    lgText:{
        fontSize: CommonFont.FONT_16,
        color: CommonColor.playIntroduceContent
    },
    smText:{
        fontSize: CommonFont.FONT_12,
        color: CommonColor.playIntroduceContent
    }
});