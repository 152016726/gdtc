/**
 * Created by mac-ddt on 2018/8/23.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import Swiper from 'react-native-swiper';
import {BgColor} from '../../../constants/color';
import {FONT_16} from "../../../constants/fontSize";

const s_w = Dimensions.get('window').width;
const HEIGHT = Math.ceil((s_w * 9) / 16);

export default class MyBanner extends Component {
    // static propTypes = {
    //     styleCls: {},       // 样式
    //     bannerList: []      // 轮播图数据
    // };

    /**
     * 轮播图跳转静态页
     * @param item
     */
    imageHandle(item) {
        this.props.navigation.navigate('StaticPage', {item});
    }

    render() {
        const {styleCls, bannerList} = this.props;
        return (
            <View style={[styles.contentBox, !!styleCls && styleCls]}>
                {bannerList.length > 0 ?
                    <Swiper style={{backgroundColor: BgColor}}
                            horizontal={true}
                            dot={<View style={styles.dotStyle}/>}
                            activeDot={<View style={[styles.dotStyle, styles.activeDot]}/>}
                            paginationStyle={styles.dotBoxSt}
                            activeDotColor={'#ea6060'}
                            autoplay={true}
                            loop={true}
                            autoplayTimeout={5}>
                        {bannerList.map((obj, index) => {
                            return (
                                <TouchableWithoutFeedback style={styles.touchBox}
                                                          key={index}
                                                          onPress={() => this.imageHandle(obj)}>
                                    <View style={{flex: 1}}>
                                        <Image style={styles.imgSty}
                                               resizeMode={"stretch"}
                                               source={{uri: obj.image}}/>
                                        <View style={styles.titleTextBox}>
                                            <Text style={styles.titleText}>{obj.alt}</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    </Swiper> : <View style={{height: HEIGHT}}/>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contentBox: {
        height: HEIGHT,
        width: s_w,
        backgroundColor: BgColor
    },
    touchBox: {
        height: HEIGHT,
        width: s_w,
        position: 'relative'
    },
    imgSty: {
        backgroundColor: '#dbdbdb',
        height: HEIGHT,
        width: s_w
    },
    titleTextBox: {
        position: 'absolute',
        bottom: 0,
        width: s_w,
        paddingLeft: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(0, 0, 0, .2)'
    },
    titleText: {
        color: '#ffffff',
        fontSize: FONT_16
    },
    dotBoxSt: {
        justifyContent: 'flex-end',
        paddingRight: 7,
        bottom: 0
    },
    dotStyle: {
        backgroundColor: '#B2B2B2',
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
        marginTop: 18,
        marginBottom: 6
    },
    activeDot: {
        backgroundColor: '#ffffff'
    }
});
