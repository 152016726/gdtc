/**
 * Created by marcus on 2018/11/22.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    ScrollView,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import HeaderLeft from '../../components/headerLeft';
import AreaNav from './components/areaNav';
import ShopItem from './components/shopItem';
import searchIcon from './images/searchIcon.png';
import below from './images/below.png';
import getDotCityAndArea from '~/common/js/getDotCityAndArea'

const rowWidth = Dimensions.get('window').width - 30;

class LotteryShop extends Component {
    static navigationOptions = ({navigation}) => {
        const {handleGoBack = null, title} = navigation.state.params || {};
        let headerLeft = <HeaderLeft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        return {title, headerLeft}
    };

    componentWillMount() {
        const {navigation, getInformationList, changeSomeProps} = this.props;
        navigation.setParams({
            title: '竞彩店',
            handleGoBack: () => {
                navigation.goBack()
            }
        });
        getDotCityAndArea.getData().then(rsp => {
            let firstCity = rsp.citys[0];
            changeSomeProps({
                city: firstCity.name,
                areas: firstCity.areas
            });
            getInformationList(0, 0, {
                name:firstCity.name,
                area: firstCity.areas[0].name
            });
        });
    }

    /**
     * 改变城市回调
     */
    changeCity(cityObj) {
        this.props.changeCityState({
            city: cityObj.name,
            area: cityObj.areas[0].name,
            areas: cityObj.areas
        });
    }

    /**
     * 跳到城市列表页
     */
    goCitySelect() {
        let {navigation} = this.props;
        navigation.navigate('CitySelect', {
            cbFn: this.changeCity.bind(this)
        });
    }

    _renderItem() {
        const {information, navigation} = this.props;
        return (
            <View style={{alignItems: 'center'}}>
                <FlatList
                    data={information}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => <ShopItem navigation={navigation}
                                                             value={item}
                                                             order={index}/>}
                    ItemSeparatorComponent={this.borderBottomList}
                    ListFooterComponent={() => this.renderFooter()}
                    scrollEventThrottle={1}
                />
            </View>
        )
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

    /**
     * 底部提示语 render
     * @returns {*}
     */
    renderFooter() {
        const {isNoData} = this.props;
        return (
            <View style={styles.noDataSty}>
                {
                    isNoData && <Text style={styles.noDataTextSty}>暂无匹配网点</Text>
                }
            </View>
        )
    }

    render() {
        let {city, areas, onScrollHandle, changeAreaState, _onChangeText, getInformationList} = this.props;
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                onScroll={(e) => onScrollHandle(e.nativeEvent)}>
                <View style={styles.container}>
                    <View style={styles.topViewSty}>
                        <View style={styles.searchBtn}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.goCitySelect();
                                }}
                                style={styles.currentCity}>
                                <Text style={styles.cityName}>{city}</Text>
                                <Image
                                    source={below}
                                    style={styles.belowIcon}
                                    resizeMode={'contain'}/>
                            </TouchableOpacity>
                            <View style={styles.searchInfo}>
                                <Image
                                    source={searchIcon}
                                    style={styles.icon}
                                    resizeMode="contain"/>
                                <TextInput
                                    ref={input => this.input = input}
                                    style={styles.input}
                                    placeholder={"输入关键词/网点编号"}
                                    keyboardType="default"
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText={(text) => _onChangeText(text)}
                                >
                                </TextInput>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => getInformationList()}
                            style={styles.rightSelectSty}>
                            <Text style={styles.selectBtnSty} numberOfLines={1}>确定</Text>
                        </TouchableOpacity>
                    </View>
                    <AreaNav
                        city={city}
                        areas={areas}
                        changeAreaState={(obj) => changeAreaState(obj)}/>
                    <View style={styles.shop}>
                        <Text style={styles.shopText}>门店</Text>
                    </View>
                    {this._renderItem()}
                </View>
            </ScrollView>
        )
    }
}

export default connectReducerComponent(storeKey.LOTTERY_SHOP_STORE, reducer, state, action)(LotteryShop);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CommonColor.BgColor,
        alignItems: "center"
    },
    topViewSty: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 12
    },
    searchBtn: {
        flexDirection: 'row',
        flex: 5,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: CommonColor.BorderColor,
        borderRadius: 4,
        backgroundColor: CommonColor.BgColorWhite,
        justifyContent: 'center',
        alignItems: 'center'
    },
    currentCity: {
        flexDirection: 'row',
        flex: 25,
        height: 21,
        marginVertical: 7,
        borderRightWidth: 1,
        borderColor: CommonColor.BorderColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cityName: {
        fontSize: CommonFont.FONT_14,
        color: CommonColor.playIntroduceContent,
        marginRight: 8
    },
    rightSelectSty: {
        flex: 1,
        marginLeft: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectBtnSty: {
        backgroundColor: CommonColor.MainColor,
        fontSize: CommonFont.FONT_14,
        borderRadius: 4,
        height:35,
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: '#ffffff'
    },
    belowIcon: {
        width: 8,
        height: 6
    },
    searchInfo: {
        flexDirection: 'row',
        flex: 79,
        height: 21,
        marginVertical: 7,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: "center"
    },
    icon: {
        flex: 6,
        height: 21
    },
    input: {
        flex: 93,
        paddingLeft: 8,
        fontSize: CommonFont.FONT_14,
        height: 21,
        color: CommonColor.SelfInput,
        paddingVertical: 0
    },
    shop: {
        justifyContent: 'center',
        height: 28,
        width: rowWidth,
        alignItems: 'flex-start'
    },
    shopText: {
        fontSize: CommonFont.FONT_13,
        color: CommonColor.ShadowGrey
    },
    lineS: {
        height: 1,
        width: rowWidth + 15,
        marginLeft: 15,
        backgroundColor: CommonColor.BgColor
    },
    noDataSty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20
    },
    noDataTextSty: {
        fontSize: CommonFont.FONT_14,
        color: CommonColor.tipsTextGrey
    }
});