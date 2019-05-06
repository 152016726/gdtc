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
import getRecentCombatGains from '../../../../services/getRecentCombatGains';

export default class RecentCombatGains extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            originHomeData: [],  // 主队原始数据
            homeData: [],       // 主队
            originAwayData: [],  // 客队原始数组
            awayData: [],       // 客队
            filterArr: [],      // 过滤数组
            isAutoShort: true   // 是否缩略默认为true
        };
      }

    componentWillReceiveProps(nextProps) {
        const {vid} = this.props;
        if(nextProps.vid !== this.props.vid || nextProps.vsDate !== this.props.vsDate){
            getRecentCombatGains.getData({
                vid,
                field: '1'
            }).then(rsp=> {
                this.setState({
                    homeData: rsp.data.list,
                    originHomeData: rsp.data.list
                })
            }, rej=> {
                console.log(rej.rspMsg);
            });

            getRecentCombatGains.getData({
                vid,
                field: '2'
            }).then(rsp=> {
                this.setState({
                    awayData: rsp.data.list,
                    originAwayData: rsp.data.list
                })
            }, rej=> {
                console.log(rej.rspMsg);
            })
        }
    }

    requestRsp(item, isAdd= true){
        const {originHomeData, originAwayData} = this.state;
        let filterArr = this.state.filterArr;
        isAdd && item.step === '1' && filterArr.push("1");
        isAdd && item.step === '2' && filterArr.push("2");
        !isAdd && item.step === '1' && filterArr.splice(filterArr.indexOf('1'),1);
        !isAdd && item.step === '2' && filterArr.splice(filterArr.indexOf('2'),1) &&
        this.setState({
            isAutoShort: true
        });
        this.setState({
            homeData: originHomeData,
            awayData: originAwayData
        });
        filterArr.forEach(item=> {
            if(item === '1'){
                this.getSameHomeAndAwayResult()
            }else if(item === '2'){
                this.getRecentTwentyMatches()
            }
        });
        this.setState({
            filterArr
        })
    }

    /**
     * 同主客筛选
     */
    getSameHomeAndAwayResult(){
        const {homeData, awayData} = this.state;
        const {homeTid, awayTid} = this.props;
        let hData= [];
        let aData= [];
        homeData.forEach(item=>{
            if(item.homeTid === homeTid){
                hData.push(item)
            }
        });
        awayData.forEach(item=>{
            if(item.awayTid === awayTid){
                aData.push(item)
            }
        });
        this.setState({
            homeData: hData,
            awayData: aData
        })
    }

    /**
     * 获取近20场
     */
    getRecentTwentyMatches(){
        let homeData = this.state.homeData;
        let awayData = this.state.awayData;
        this.setState({
            isAutoShort: false
        });
        homeData.length > 20 && this.setState({
            homeData: homeData.slice(0,20)
        });
        awayData.length > 20 && this.setState({
            awayData: awayData.slice(0,20)
        });
    }

    renderTable(){
        const {homeData, awayData, isAutoShort} = this.state;
        const { homeName, awayName, homeTid, awayTid, awayIcon, homeIcon} = this.props;
        const chooseArr = [
            {text: '同主客', step: '1'},
            {text: '近20场', step: '2'}
        ];

        if(homeData.length === 0 || awayData.length === 0){
            return <View></View>
        }else{
            return(
                <ToggleItem
                    cls={{marginTop: 15}}
                    title={<Text style={styles.contentTitleStyle}>近期战绩</Text>}
                    titleRight={<ItemChooses
                        data={chooseArr}
                        onTouch={(item, isAdd)=>this.requestRsp(item, isAdd)}
                    />
                }
                    content={
                    <View>
                        <View style={styles.shadowStyle}></View>
                        <View style={styles.headerTitleView}>
                            <Image source={homeIcon}
                                   style={styles.teamIcon}
                            />
                            <Text style={[styles.titleTxt]}>
                                {homeName}
                            </Text>
                        </View>
                        {
                            homeData.length>0 && <Combat
                                data={isAutoShort ? homeData.slice(0,10) : homeData}
                                tid={homeTid}
                            />
                        }
                        <View style={styles.line}></View>
                        <View style={styles.headerTitleView}>
                            <Image source={awayIcon}
                                   style={styles.teamIcon}
                            />
                            <Text style={[styles.titleTxt]}>
                                {awayName}
                            </Text>
                        </View>
                        {
                            awayData.length>0 && <Combat
                                data={isAutoShort ? awayData.slice(0,10) : awayData}
                                tid={awayTid}
                            />
                        }
                    </View>
                }
                />
            )
        }

    }

    render(){
        return(
            <View>
                {this.renderTable()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    line:{
        height: 5,
        backgroundColor: CommonColor.BorderColor
    },
    headerTitleView:{
        flexDirection: 'row',
        backgroundColor: CommonColor.BgColor,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderColor: CommonColor.BorderColor,
        height: 30,
        marginLeft: 10
    },
    contentTitleStyle:{
        fontSize: fontSize.FONT_16,
        color: CommonColor.contentText,
        marginLeft: 20
    },
    titleTxt:{
        fontSize: fontSize.FONT_14,
        color: CommonColor.teamRateGrey,
        backgroundColor: 'transparent'
    },
    shadowStyle:{
        height:1,
        shadowColor:CommonColor.SpiltLineColor,
        shadowOffset:{width:6},
        shadowRadius:20,
        elevation:10
    },
    teamIcon:{
        width: 19,
        height: 19,
        marginRight: 11
    }
});