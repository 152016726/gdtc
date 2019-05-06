/**
 * Created by marcus on 2018/11/27.
 */
import React, {Component} from 'react';
import {View,Text,Image, Dimensions, StyleSheet, TouchableOpacity, TextInput, Alert, Platform} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import Headerleft from '../../components/headerLeft';

const rowWidth = Dimensions.get('window').width-30;

class Feedback extends Component{

    static navigationOptions = ({navigation})=>{
        const {handleGoBack = null,title} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        return {title, headerLeft}
    };

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text: ''
        };
      }

    componentWillMount(){
        let self = this;
        const {navigation} = self.props;
        navigation.setParams({
            title: '意见反馈',
            handleGoBack: self.goBack.bind(self)
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (Platform.OS === 'ios') {
            if (this.state.text !== nextState.text) {
                return false;
            }
        }
        return true;
    };

    /**
     * 返回上一级
     */
    goBack() {
        this.props.navigation.goBack();
    }

    /**
     * 提交
     */
    _OnPress(){
        if(this.state.text === ''){
            Alert.alert("请填写反馈信息!")
        }else{
            this.setState({
                text: ''
            },() => {
                Alert.alert("反馈成功!")
            })
        }
    }

    render(){
        const {text} = this.state;
        return(
            <View style={styles.container}>
                <View style={styles.input}>
                    <TextInput
                        style={styles.areaStyle}
                        placeholder={'请输入您的反馈内容'}
                        placeholderTextColor={'#BFBFBF'}
                        multiline={true}
                        onChangeText={(text) => this.setState({text})}
                        value={text}/>
                </View>
                <View style={styles.connect}>
                    <Text style={styles.tips}>留下你的QQ联系方式,以便我们排查问题.</Text>
                </View>
                <TouchableOpacity style={styles.btn} onPress={this._OnPress.bind(this)}>
                    <Text style={styles.submit}>提交</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.FEEDBACK_STORE, reducer, state, action)(Feedback);

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: CommonColor.BgColor,
        alignItems: 'center'
    },
    input:{
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: CommonColor.BgColorWhite,
        width: rowWidth,
        height: 88,
        borderRadius: 5
    },
    areaStyle:{
        height: 72,
        fontSize: CommonFont.FONT_14
    },
    connect:{
        width: rowWidth,
        height:28,
        justifyContent: 'center'
    },
    tips:{
        fontSize: CommonFont.FONT_12,
        color: CommonColor.ShadowGrey
    },
    btn:{
        marginVertical: 16,
        height: 40,
        width: rowWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CommonColor.SelfOrange,
        borderRadius: 5
    },
    submit:{
        fontSize: CommonFont.FONT_14,
        color: CommonColor.BgColorWhite
    }
});