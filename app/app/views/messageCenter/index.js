/**
 * Created by easyLottoMac_Feng on 2019/3/5.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import HeaderLeft from "~/components/headerLeft";
import {MainColor} from "~/constants/color";
import config from '~/config';

class MessageCenter extends Component {
    static navigationOptions = ({navigation}) => {
        const {
            clearHandle = null,  // 头部事件回调
        } = navigation.state.params || {};
        let headerLeft = <HeaderLeft handleGoBack={() => navigation.goBack()} img={require('../../images/back.png')}/>;
        let headerRight =
            <TouchableOpacity
                onPress={clearHandle}
                style={styles.titleRightSty}>
                <Text style={styles.titleRightTextSty}>清空</Text>
            </TouchableOpacity>;
        return {
            title: '消息中心',
            headerLeft,
            headerRight
        }
    };

    componentWillMount() {
        const {navigation, getFlatData} = this.props;
        navigation.setParams({
            clearHandle: () => this.clearHandle()
        });
        getFlatData();
    }

    /**
     * 头部清空按钮事件
     */
    clearHandle() {
        let {clearHandle} = this.props;
        Alert.alert(
            '',
            '是否需要清空消息列表',
            [{text: '否', onPress: () => null, style: 'cancel'},
             {text: '是', onPress: () => clearHandle()}]
        );
    }

    /**
     * 链接跳转
     * @param item 信息内容
     */
    linkJumpHandle(item) {
        this.props.navigation.navigate('StaticPage', {item, isFromMessage: true});
        this.props.updateRead(item);
    }

    /**
     * 渲染列表
     * @param item
     * @param index
     * @returns {*}
     * @private
     */
    _renderItem(item, index) {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.itemSty}
                onPress={() => this.linkJumpHandle(item)}>
                <View style={styles.itemTopSty}>
                    <View style={styles.itemTopLeftSty}>
                        <Text style={styles.activeTextSty}>活动</Text>
                        <Text style={styles.itemTitleSty}>{item.title}</Text>
                    </View>
                    <View style={styles.itemTopRightSty}>
                        <View>
                            <Text style={styles.itemTimeSty}>{item.publishDate.substring(5, 16)}</Text>
                        </View>
                        {item.isRead === 'false' && <View style={styles.noReadIconSty}/>}
                    </View>
                </View>
                <View style={styles.itemBottomBoxSty}>
                    <View style={{flex: 12}}>
                        <Image
                            style={styles.itemImageSty}
                            source={{url:config.staticResourceHost + item.titleImage}}/>
                    </View>
                    <View style={{flex: 55}}>
                        <Text
                            style={styles.itemBottomRightSty}>
                            {item.description}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * 渲染列表都不展示未读信息模块
     * @returns {*}
     */
    renderHeader() {
        let {unreadNews} = this.props;
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 16}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 13}}>有</Text>
                    <Text style={{color: MainColor, fontSize: 15}}>{unreadNews}</Text>
                    <Text style={{fontSize: 13}}>条未读信息</Text>
                </View>
            </View>
        )
    }

    render() {
        let {flatData} = this.props;
        return <View style={styles.contentBox}>
            {
                flatData.length > 0 ? <FlatList
                        data={flatData}
                        extraData={flatData}
                        ListHeaderComponent={() => this.renderHeader()}
                        alwaysBounceVertical={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => this._renderItem(item, index)}
                    /> :
                    <View style={styles.emptyBox}>
                        <View style={{alignItems: 'center'}}>
                            <Image
                                style={styles.emptyImageSty}
                                source={require('../lotteryShopImgManage/images/empty.png')}
                            />
                            <Text style={styles.emptyTextSty}>暂无消息</Text>
                        </View>
                    </View>
            }
        </View>
    }
}

export default connectReducerComponent(storeKey.MESSAGECENTER_STORE, reducer, state, action)(MessageCenter);

const styles = StyleSheet.create({
    contentBox: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 12
    },
    titleRightSty: {
        paddingRight: 12
    },
    titleRightTextSty: {
        color: '#ffffff',
        fontSize: 16
    },
    itemSty: {
        padding: 8,
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        borderRadius: 6
    },
    itemTopSty: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemTopLeftSty: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemTopRightSty: {
        flexDirection: 'row'
    },
    itemTimeSty: {
        color: '#999999',
        fontSize: 12,
        marginRight: 2
    },
    noReadIconSty: {
        alignItems: 'center',
        borderRadius: 3,
        width: 6,
        height: 6,
        backgroundColor: '#F7AA9E'
    },
    activeTextSty: {
        color: '#FFFFFF',
        backgroundColor: '#FF8566',
        fontSize: 9,
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginRight: 6,
        borderRadius: 2
    },
    itemTitleSty: {
        fontSize: 16,
        color: '#333333'
    },
    itemImageSty: {
        width: '100%',
        height: '100%',
        borderRadius: 2
    },
    itemBottomBoxSty: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
        height: 60,
        marginTop: 10,
        flex: 1
    },
    itemBottomRightSty: {
        paddingLeft: 10,
        paddingTop: 6,
        fontSize: 14,
        color: '#333333',
        flexWrap: 'wrap'
    },
    deleteIconSty: {
        height: 103,
        width: 64,
        paddingRight: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyImageSty: {
        width: 131,
        height: 84
    },
    emptyTextSty: {
        fontSize: 16,
        color: '#D1D1D1',
        marginTop: 12
    }
});