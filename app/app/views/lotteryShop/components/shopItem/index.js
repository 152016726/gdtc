/**
 * Created by marcus on 2018/11/22.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet,
    ImageBackground
} from 'react-native';
import * as CommonColor from '../../../../constants/color';
import * as CommonFont from '../../../../constants/fontSize';
import call from './images/call.png';
import position from './images/position.png';
import right from './images/right.png';

const rowWidth = Dimensions.get('window').width;

export default class ShopItem extends Component{
        // static defaultProps = {
        //     index: '1',
        //     num: '1101020',
        //     distance: '1.19km',
        //     address: '广州市海珠区广州大道南368号368大厦'
        // };

        goToShopDetail(item){
            const {navigation} = this.props;
            navigation.navigate('LotteryShopDetail',{item});
        }

        render(){
            const {value, order} = this.props;
            // console.log(value, order, '门店');
            const {address, dotNumer, phone, distance=''} = value;
            return(
                <View style={styles.box}>
                    <TouchableOpacity style={styles.container} onPress={() => this.goToShopDetail(value)}>
                        <View style={styles.shopNumber}>
                            <Text style={styles.numberTxt}>{order+1}.{dotNumer}</Text>
                            <View style={styles.shopDistance}>
                                <Text style={styles.distanceTxt}>{distance}</Text>
                            </View>
                        </View>
                        <View style={styles.shopInfo}>
                            <View style={styles.info}>
                                <View style={styles.infoItem}>
                                    <Image
                                        source={position}
                                        style={styles.icon}
                                        resizeMode={'contain'}/>
                                    <Text style={styles.infoText} numberOfLines={1}>
                                        {address}
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Image
                                        source={call}
                                        style={styles.icon}
                                        resizeMode={'contain'}/>
                                    <Text style={styles.infoText}>{phone}</Text>
                                </View>
                            </View>
                            <View style={styles.more}>
                                <Text style={styles.moreText}>详情</Text>
                                <Image
                                    source={right}
                                    style={styles.right}
                                    resizeMode={'contain'}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
}

const styles = StyleSheet.create({
    box:{
        width: rowWidth,
        backgroundColor: CommonColor.BgColorWhite,
        paddingBottom: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container:{
        width: rowWidth - 30,
        justifyContent: 'center'
    },
    shopNumber:{
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    numberTxt:{
        alignItems: 'center',
        color: CommonColor.playIntroduceContent,
        fontSize: CommonFont.FONT_16
    },
    shopDistance:{
        height: 40,
        justifyContent: 'flex-end'
    },
    distanceTxt:{
        fontSize: CommonFont.FONT_12,
        color: CommonColor.playIntroduceContent
    },
    icon:{
        width: 10,
        height: 12
    },
    info:{
        flex: 88
    },
    infoItem:{
        height: 18,
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoText:{
        marginLeft: 9,
        fontSize: CommonFont.FONT_12,
        color: CommonColor.DarkGrey
    },
    shopInfo:{
        height:32,
        flexDirection:'row'
    },
    more:{
        flex:12,
        height:34,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    moreText:{
        fontSize: CommonFont.FONT_12,
        color: '#3EB5E5'
    },
    right:{
        marginLeft: 6,
        width: 12,
        height: 12
    }
});