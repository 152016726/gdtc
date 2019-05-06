/**
 * Created by mac-ddt on 2018/8/10.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    ScrollView
} from 'react-native';
import {connectReducerComponent} from '../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../constants/storeKeys';
import * as CommonColor from '../../constants/color';

class Test extends Component{

    static navigationOptions = ({navigation})=>{
        return {
            title: "玩法介绍",
            headerBackTitle: ''
        }
    };

    render(){
        return <ScrollView style = {styles.container}>
                    <Text style = {styles.title}>一、玩法说明</Text>
                    <View style = {styles.content}>
                        <Text style = {styles.contentFont}>目前竞彩足球共有5种玩法，分别是“胜平负”“让球胜平负”“比分”“进球数”“半全场”。</Text>
                        <Text style = {styles.contentFont}>竞猜的比赛由国家体育总局体育彩票管理中心选定并向社会公布。竞彩足球的比赛对阵主队在前，客队在后。</Text>
                        <Text style = {styles.contentFont}>1.胜平负：竞猜两支球队，在90分钟内(含伤停补时，不含加时)的胜平负结果。 投注选项有3、1、0(胜、平、负) 。</Text>
                        <Text style = {styles.contentFont}>2.让球胜平负：竞猜两支球队让球以后，在90分钟内(含伤停补时，不含加时)的胜平负结果。 投注选项有3、1、0(胜、平、负) 。</Text>
                        <Text style = {styles.contentFont}>3.比分：竞猜两支球队在在90分钟内(含伤停补时，不含加时)的比分。 投注选项有1:0 2:0 3:0等31种选项。</Text>
                        <Text style = {styles.contentFont}>4.总进球：竞猜两支球队在90分钟内(含伤停补时，不含加时)的总进球数量。 投注选项有0、1、2、3、4、5、6、7+ 。</Text>
                        <Text style = {styles.contentFont}>5.半全场：竞猜两支球队在上半场45分钟(含伤停补时，不含加时)和全场90分钟内(含伤停补时)的胜平负结果。 投注选项有3-3、3-1、3-0等9种选项。</Text>
                        <Text style = {styles.contentFont}>注：&lt;1&gt;让球：让球值为负数表示主队让客队多少球，正数表示客队让主队多少球，让球值一旦确定就不再调整。</Text>
                        <Text style = {styles.contentFont}>例如：皇马-1 VS巴萨，表示皇马让1球，皇马以1球以上战胜巴萨时，赛果为3。皇马以1球战胜巴萨时，赛果为1。当皇马负、打平巴萨时，赛果为0。</Text>
                    </View>
                    <Text style = {styles.title}>二、过关方式</Text>
                    <View style = {styles.content}>
                        <Text style = {styles.contentFont}>彩民选择1种投注结果的为单式投注；选择2种或2种以上投注结果的为复式投注。</Text>
                        <Text style = {styles.contentFont}>彩民选择1场比赛进行投注的为单场投注；选择2场或2场以上比赛进行串联投注的为过关投注。在过关投注中，所选比赛的结果全部竞猜正确才能中奖。</Text>
                        <Text style = {styles.contentFont}>其中，胜平负玩法和让球胜平负玩法过关最高上限是8串1，比分玩法和半全场玩法过关最高上限是4串1，进球数玩法过关最高上限是6串1。</Text>
                    </View>
                    <Text style = {styles.title}>三、奖金计算</Text>
                    <View style = {styles.content}>
                        <Text style = {styles.contentFont}>1.竞彩足球的过关投注奖金，在销售过程中，该奖金会根据销售等情况进行实时的调整；购买方案的中奖金额以完成投注最终出票时刻的奖金为准，不受投注完成后奖金调整的影响。 投注页面的奖金也仅供参考。</Text>
                        <Text style = {styles.contentFont}>2.中奖奖金=单注奖金*倍数；单注奖金=2*所选比赛的奖金连乘。</Text>
                        <Text style = {styles.contentFont}>例如：用户购买2场比赛2串1过关并且中奖，出票时的奖金分别是1.68和3.95，倍数为100倍，单注奖金=2x1.68x3.95=13.27元,方案总奖金=13.27x100倍=1327元</Text>
                        <Text style = {styles.contentFont}>3.最高奖金</Text>
                        <Text style = {styles.contentFont}>单注彩票最高限额：</Text>
                        <Text style = {styles.contentFont}>（1）选择单场投注的，单注最高奖金限额为500万元；</Text>
                        <Text style = {styles.contentFont}>（2）选择2-3场过关投注的，单注最高奖金限额20万元；</Text>
                        <Text style = {styles.contentFont}>（3）选择4-5场过关投注的，单注最高奖金限额50万元；</Text>
                        <Text style = {styles.contentFont}>（4）选择6-8场过关投注的，单注最高奖金限额100万元。</Text>
                        <Text style = {styles.contentFont}>根据法律规定，彩票的奖金收入属偶然所得，如果单注彩票的中奖金额超过10000元（不含10000元）人民币，中奖者需要按照相关规定缴纳中奖金额20%的个人所得税。</Text>
                    </View>
                    <Text style = {styles.title}>四.无效比赛处理</Text>
                    <View style = {styles.content}>
                        <Text style = {styles.contentFont}>根据竞彩的游戏规则，对于取消场次的投注做如下处理：</Text>
                        <Text style = {[styles.contentFont,styles.bottomDistance]}>涉及取消场次的投注均视为正确，投注胜、平、负等各种结果的奖金值均视为按1/元(即2/注)计算。</Text>
                    </View>
            </ScrollView>


    }
    
}

const styles = StyleSheet.create({
   container:{
       flex:1,
       backgroundColor:CommonColor.BgColorWhite,
       paddingHorizontal:12
   },
    title:{
        height:38,
        lineHeight:38,
        color:CommonColor.playIntroduceTitle,
        fontSize:16
    },
    contentFont:{
        color:CommonColor.playIntroduceContent,
        fontSize:12,
        lineHeight:18,
        marginBottom:20
    },
    bottomDistance:{
        marginBottom:15
    }
});

export default connectReducerComponent(storeKey.INTRODUCTION, reducer, state, action)(Test)