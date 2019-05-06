import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    Text,
    Modal,
    TouchableOpacity,
    Linking
} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import { connectReducerComponent } from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '../../constants/storeKeys'
import config from '../../config';

class AboutUs extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title : "关于我们",
        }
    };

    constructor(props){
        super(props);
        this.state={
          show:false,
        };
    }

    componentWillMount() {
        this.props.getData();
    }

    handleCall(url) {
        // console.log(url);
        if (url && url !== '') {
            Linking.canOpenURL(url).then(supported => {
                // console.log(supported);
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log('Don\'t know how to open URI: ' + url);
                }
            });
        }
    }

    /**
     * 隐藏放大的图片
     */
    hideImgHandle() {
        this.setState({
            show: false
        })
    }

    render() {
        const images = [{
            url: 'http://jc.gdlottery.cn/app/gdlottery.png',
        } ]

        return (
            <View style={styles.container}>
                <View style={styles.top}>
                    <Image style={styles.img} source={require('./images/logo.png')}/>
                </View>
                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.items}>
                        <Text style={styles.leftTxt}>当前版本</Text>
                        <Text style={styles.rightTxt}>{config.version}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.items}>
                        <Text style={styles.leftTxt}>新版更新</Text>
                        <Text style={styles.rightTxt}>{this.props.version === '1.0' ? '暂无数据' : 'v' + this.props.version}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.items}
                                      onPress={this.handleCall.bind(this, 'tel:95086')}>
                        <Text style={styles.leftTxt}>客服电话</Text>
                        <Text style={[ styles.rightTxt, styles.phone ]}>95086</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.ImageBox}
                                      onPress={()=>{this.setState({show:true})}}>
                        <View style={styles.contentBox}>
                            <Image style={styles.imgLogo} source={require('./images/xinx.png')}/>
                            <Text style={styles.contentText}>公示信息</Text>
                        </View>
                        <View style={styles.gongShiImg}>
                            <Image style={styles.gongShiSize}
                                   source={require('../../images/gongShi.jpg')}
                                   resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.hitImg}>点击查看大图 >></Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.rulesBox}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('UserAgreement')
                    }}>
                        <Text style={styles.rulesText}>《用户服务协议》</Text>
                    </TouchableOpacity>
                    <Text style={styles.andText}>和</Text>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('Privacy')
                    }}>
                        <Text style={styles.rulesText}>《隐私保护指引》</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height : 50, marginBottom : 15 }}>
                    <Text style={styles.companyText}>广东体育彩票管理中心 版权所有</Text>
                    <Text style={styles.copyRight}>Copyright
                        © 2019 GuangDong Sports Lottery Management Center., LLC.All Right Reserved.</Text>
                </View>
                <Modal animationType={"slide"}
                       transparent={true}
                       visible={this.state.show}
                       onRequestClose={() => {
                       }}>
                    <ImageViewer
                        imageUrls={images}
                        onClick={() => {this.hideImgHandle()}}
                    />
                </Modal>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    container : {
        flex : 10,
        flexDirection : 'column',
        backgroundColor : '#F5F5F5'
    },
    top : {
        flex : 3,
        alignItems : 'center',
        justifyContent : 'center'
    },
    img : {
        width: 86,
        height: 95
    },
    bottom : {
        flex : 7
    },
    items : {
        flexDirection : 'row',
        alignItems : 'center',
        width : '100%',
        height : 44,
        backgroundColor : '#ffffff',
        paddingHorizontal : 15,
        borderBottomWidth : 1,
        borderColor : '#f5f5f5',
        justifyContent : 'space-between'
    },
    marginBottom : {
        marginBottom : 10
    },
    phone : {
        color : '#2B75B3'
    },
    leftTxt : {
        color : '#333333',
        fontSize : 16
    },
    rightTxt : {
        color : "#999999",
        fontSize : 14
    },
    ImageBox:{
        height : 200,
        marginLeft : 15,
        marginRight : 15,
        flexDirection : 'column'
    },
    contentBox:{
        flexDirection : 'row',
        marginTop : 10
    },
    imgLogo:{
        height : 16,
        width : 16
    },
    contentText:{
        marginLeft : 3,
        fontSize : 16,
        color : '#333333'
    },
    gongShiImg:{
        marginTop : 12,
        height : 100,
        width : 141
    },
    gongShiSize:{
        height : 100,
        width : 141
    },
    hitImg: {
        marginTop : 12,
        fontSize : 14,
        color : '#EB812A'
    },
    rulesBox:{
        height : 30,
        paddingBottom : 10,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center'
    },
    rulesText:{
        color : '#2B75B3',
        fontSize : 12
    },
    andText:{
        color : '#999999',
        fontSize : 12
    },
    companyText:{
        color : '#999999',
        fontSize : 12,
        justifyContent : 'center',
        textAlign : 'center',
        alignItems : 'center'
    },
    copyRight:{
        marginLeft : 15,
        marginRight : 15,
        color : '#999999',
        fontSize : 12,
        justifyContent : 'center',
        textAlign : 'center',
        alignItems : 'center' }
});

export default connectReducerComponent(storeKey.ABOUT_US_STORE, reducer, state, action)(AboutUs)