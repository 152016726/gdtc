/**
 * Created by owen on 2018/8/10.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity, Image
} from 'react-native';
import {connectReducerComponent} from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../constants/storeKeys'
import getDotCityAndArea from '~/common/js/getDotCityAndArea'

class CitySelect extends Component {
    static navigationOptions = ({navigation}) => {
        // let {navHandle, showPicker} = navigation.state.params || {};
        return {
            title: "选择城市"
        }
    };

    componentDidMount() {
        let {changeSomeProps} = this.props;
        getDotCityAndArea.getData().then(rsp => {
            changeSomeProps({
                cityList: rsp.citys,
                cityObj: rsp.citys[0]
            })
        });
    }

    /**
     * 选择市
     */
    setCity(cityObj) {
        let {changeSomeProps, navigation} = this.props;
        let cbFn = navigation.getParam('cbFn');
        changeSomeProps({
            cityObj
        });
        cbFn(cityObj);
        navigation.goBack();
    }

    /**
     * 按拼音渲染列表
     */
    renderInner(data, index) {
        let {cityList} = this.props;
        return <View>
            <Text style={styles.itemTitle}>{data.key}</Text>
            <View style={styles.innerItemBox}>
                <TouchableOpacity onPress={() => {
                    this.setCity(data);
                }}
                                  style={[styles.innerItem, (index === cityList.length - 1) && styles.noBorder]}
                                  key={index}>
                    <Text style={styles.innerItemText}>{data.name}</Text>
                </TouchableOpacity>
            </View>
        </View>
    }

    render() {
        let {cityObj, cityList} = this.props;
        return <View style={styles.wrapper}>
            <View>
                <Text style={styles.itemTitle}>当前定位城市</Text>
                <View style={styles.innerItemBox}>
                    <View style={[styles.innerItem, styles.noBorder]}>
                        <View style={styles.imgWrapper}>
                            <Image style={styles.img} source={require('./images/location.png')} resizeMode='contain'/>
                        </View>
                        <Text style={styles.innerItemText}>{cityObj.name}</Text>
                    </View>
                </View>
            </View>
            <FlatList
                style={styles.flatList}
                data={cityList}
                keyExtractor={(item, index) => index.toString()}
                extraData={cityList}
                removeClippedSubviews={true}
                renderItem={({item, index}) => {
                    return this.renderInner(item, index)
                }}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    itemTitle: {
        lineHeight: 25,
        paddingHorizontal: 15,
        color: '#999999',
        fontSize: 13
    },
    innerItemBox: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 15
    },
    innerItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ededed',
        flexDirection: 'row'
    },
    noBorder: {
        borderBottomWidth: 0
    },
    imgWrapper: {
        paddingVertical: 17.5
    },
    img: {
        width: 12,
        height: 15,
        marginRight: 5
    },
    innerItemText: {
        lineHeight: 50,
        color: '#333333',
        fontSize: 15
    },
    flatList: {
        flex: 1
    }
});
export default connectReducerComponent(storeKey.CITY_SELECT_STORE, reducer, state, action)(CitySelect)