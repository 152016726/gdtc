/**
 * Created by marcus on 2018/11/27.
 */
import React, {Component} from 'react';
import {View,Text,Image, Dimensions, StyleSheet, TouchableOpacity, TextInput, Platform} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import Headerleft from '../../components/headerLeft';
import HeaderRight from '../../components/headerRight';
import WordCount from './wordCount'
import Account from '#/account';
import updateInfo from "../../services/getUserUpdateInfo";

const rowWidth = Dimensions.get('window').width-24;
const _maxChars = 35;   // 可输入字符数

class Summary extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            textNum: _maxChars    // 可输入多少个字
        };
      }

    WordCount;

    static navigationOptions = ({navigation}) => {
        const {handleClick = null, handleGoBack = null} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} text={"取消"} cls={{width: 40}}/>;
        let headerRight = <HeaderRight onPress={handleClick} text={"完成"} cls={{width: 40}}/>;
        return {title: "个人简介", headerLeft,headerRight}
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (Platform.OS === 'ios') {
            if (this.props.summary !== nextProps.summary) {
                return false;
            }
        }
        return true;
    };

    componentWillMount(){
        const {navigation, resetSummary, updateState, summary} = this.props;
        if(navigation.state.params){
            this.setState({
                textNum: _maxChars - navigation.state.params.summary.length
            });
            updateState({
                summary: navigation.state.params.summary
            })
        }
        navigation.setParams({
            handleGoBack: ()=>{this.goBack()},
            handleClick:()=>{
                this.updateData()
            }
        });
    }

    /**
     * 更新个人数据
     */
    updateData(){
        const {summary, resetSummary} = this.props;
        updateInfo.getData({summary}).then(rsp=> {
            resetSummary({summary});
            Account.updateAccountInfo({summary});
            this.goBack()
        }, rej=>{
            console.log(rej,'更改简介失败');
        });
    }

    updateWordCount(text){
        this.wordCount.setState({text});
    }

    /**
     * 返回上一级
     */
    goBack() {
        this.props.navigation.goBack();
    }

    /**
     * summary 变化
     * @param val
     */
    onChangeText(val){
        const {updateState} = this.props;
        updateState({summary: val})
    }
    
    render(){
        const {summary} = this.props;
        return (
            <View style={styles.container}>
                <TextInput
                    ref="myInput"
                    style={styles.input}
                    underlineColorAndroid = {'transparent'}
                    keyboardType="default"
                    autoFocus={true}
                    multiline={true}
                    numberOfLines={2}
                    maxLength={_maxChars}
                    onChangeText={(val)=> {
                        this.updateWordCount(val);
                        this.onChangeText(val)
                    }}
                    value={summary}>
                </TextInput>
                <View style={styles.tipView}>
                    <WordCount max={_maxChars}
                               ref={ref => {
                                    this.wordCount = ref
                                }}
                               text={summary}
                    />
                </View>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.SUMMARY_STORE, reducer, state, action)(Summary);

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: CommonColor.BgColor,
        paddingLeft: 12
    },
    input:{
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: CommonColor.BgColorWhite,
        width: rowWidth,
        height: 60,
        borderWidth: 1,
        textAlignVertical: 'top',
        borderColor: CommonColor.BorderColor,
        borderRadius: 5
    },
    tipView:{
        position: 'absolute',
        right: 18,
        top: 55
    }
});