/**
 * Created by marcus on 2018/12/14.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions
} from 'react-native';
import * as CommonColor from '../../../../constants/color';
import * as fontSize from '../../../../constants/fontSize';
import ToggleItem from '../../../../components/toggleItem';
import Combat from '../components/combat';
import ItemChooses from '../components/itemChooses';
import getPastCombatGains from '../../../../services/getPastCombatGains';

export default class PastCombatGains extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            originData: [],         // 接口返回的原始数据
            rspData: [],            // 显示的数据
            isEmpty: false          // 是否为空
        };
      }

    componentWillMount() {
        const {vid} = this.props;
        getPastCombatGains.getData({vid}).then((rsp)=> {
            if(rsp.data.list.length === 0){
                this.setState({
                    isEmpty: true
                })
            }else{
                this.setState({
                    originData: rsp.data.list,
                    rspData: rsp.data.list
                });
            }

        },rej=> {
            this.setState({
                isEmpty: true
            });
            console.log(rej.rspMsg);
        });
    }

    /**
     * 底部总结栏
     * @returns {XML}
     */
    bottomTotalView(){
        const {rspData} = this.state;
        let resultStr = '';
        rspData.forEach(item=> {
            resultStr += item.result.wdw;
        });
        return <View style={styles.totalTxt}>
                    <Text>共{rspData.length}场,胜</Text>
                    <Text style={{color:CommonColor.DarkerRedColor}}>
                        {resultStr.split('3').length-1}
                    </Text>
                    <Text>平</Text>
                    <Text style={{color:CommonColor.BlueColor}}>
                        {resultStr.split('1').length-1}
                    </Text>
                    <Text>负</Text>
                    <Text style={{color:CommonColor.DarkerGreenColor}}>
                        {resultStr.split('0').length-1}
                    </Text>
                    <Text> 胜率</Text>
                    <Text style={{color:CommonColor.DarkerRedColor}}>
                        {Number((resultStr.split('3').length-1)/rspData.length*100).toFixed(0)+'%'}
                    </Text>
                </View>
    }

    /**
     * 动态请求数据
     * @param item
     * @param isAdd
     */
    requestRsp(item, isAdd=true){
        isAdd && this.getSameHomeAndAwayResult();
        !isAdd && getPastCombatGains.getData({vid: item.vid}).then((rsp)=> {
            this.setState({
                rspData: rsp.data.list
            })
        },rej=> {
            console.log(rej.rspMsg);
        });
    }

    /**
     * 获取同主客的比赛信息
     */
    getSameHomeAndAwayResult(item, flag=true){
        const {homeTid, awayTid} = this.props;
        const {rspData, originData} = this.state;
        if(!flag){
            // 取消主客相同
            this.setState({
                rspData: originData
            })
        }else{
            // 主客相同
            let filterList = [];
            rspData.forEach(tabs=> {
                if(tabs.homeTid === homeTid && tabs.awayTid === awayTid){
                    return filterList.push(tabs)
                }
            });
            this.setState({
                rspData: filterList
            })
        }
    }

    render(){
        const {rspData, isEmpty} = this.state;
        const {vid, homeTid} = this.props;
        const chooseArr = [{vid, isSameField: true, text: '主客相同'}];
        return(
            <View>
                {isEmpty ? <View></View> : <ToggleItem
                    cls={{marginTop: 15}}
                    title={<Text style={styles.contentTitleStyle}>对赛往绩</Text>}
                    titleRight={<ItemChooses
                        data={chooseArr}
                        onTouch={(item, isAdd)=>this.requestRsp(item, isAdd)}
                    />
                }
                    content={
                    rspData.length > 0 && <View>
                            <Combat data={rspData} tid={homeTid}/>
                            {this.bottomTotalView()}
                        </View>
                    }
                />}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    halfScore: {
        color: CommonColor.tipsTextGrey,
        fontSize: fontSize.FONT_10
    },
    lineS: {
        height: 1,
        backgroundColor: CommonColor.BgColor
    },
    contentTitleStyle:{
        fontSize: fontSize.FONT_16,
        color: CommonColor.contentText,
        marginLeft: 20
    },
    totalTxt: {
        flexDirection: 'row',
        backgroundColor: CommonColor.BgColorWhite,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: CommonColor.BorderColor,
        height: 30
    },
    center:{
        alignItems: 'center',
        justifyContent: 'center',
    }
});