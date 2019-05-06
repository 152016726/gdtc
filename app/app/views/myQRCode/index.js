import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground
} from 'react-native';
import TouchableOpacity from "react-native-gesture-handler/touchables/TouchableOpacity";
export default class MyQRCode extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title : "我的二维码",
        }
    };

    render() {
        return (
        <View style={{flex:1,backgroundColor:'#F5F5F5'}} >
            <View style={styles.container}>
                <View style={{marginTop:20,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Image style={{height:12,width:50}} source={require('./images/left.png')}/>
                    <Text style={{height:20,width:175,fontSize:15,color:'#333333',fontFamily:'PingFang-SC-Regular'}}> 广东体彩站点业主二维码 </Text>
                    <Image style={{height:12,width:50}} source={require('./images/right.png')}/>
                </View>
                <ImageBackground style={{justifyItems:'center',alignItems:'center',marginLeft:36,marginRight:36,marginTop:18,height:376,width:284}} source={require('./images/border.png')}>

                </ImageBackground>
                <View style={{justifyContent:'center',alignItems:'center',marginTop:10,flexDirection:'row'}}>
                    <Text style={{justifyItems:'center',alignItems:'center',textAlign:'center',fontsize:14,color:'#333333'}}>投注站编号：</Text>
                    <Text style={{justifyItems:'center',alignItems:'center',textAlign:'center',fontsize:14,color:'#EB812A'}}>1234567</Text>
                </View>
            </View>
        </View>
            );
    }
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor:'#FFFFFF',
        height:472,
        width:355,
        margin:10
    },
});