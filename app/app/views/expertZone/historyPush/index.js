/**
 * Created by marcus on 2019/1/2.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    Dimensions
} from 'react-native';
import * as CommonColor from '~/constants/color';
import * as CommonFont from '~/constants/fontSize';
import ExpertItemHeader from '../components/itemHeader';
import DatePicker from 'react-native-datepicker';
import dateIcon from './images/dateIcon.png';
import getExpertCommend from '~/services/getExpertCommend';
import ExpertRecommend from '~/components/expertRecommend';

const rowWidth = Dimensions.get('window').width;


export default class HistoryPush extends Component{
    static defaultProps={
        type: ''      // 荐单类型
    }

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            data: [],             // 推荐单list
            date: this.getDate(), // 日期
            totalWin: 0,          // 总胜推单数
            totalDraw: 0,         // 总平推单数
            totalDefeat: 0,       // 总输推单数
            config: {             // 配置
                "isHistory": true,
                "pageIndex": 0,
                "pageSize": 9999999
            }
        };
      }

    componentWillMount() {
        const {type} = this.props;
        this.getInitData({type})
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.type !== this.props.type){
            this.getInitData({type: nextProps.type});
        }else if(nextProps.eid !== this.props.eid){
            this.getInitData({eid: nextProps.eid});
        }
    }

    /**
     * 获取当天日期
     * @returns {string}  返回格式 yyyy-mm-dd
     */
    getDate(){
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let strDate = date.getDate();
        if(month >= 1 && month <= 9){
            month= "0" + month;
        }
        if(strDate >= 0 && strDate <= 9){
            strDate = "0" + strDate;
        }
        return year + '-' + month + '-' + strDate
    }

    /**
     * 初始化推荐单
     * @param obj
     */
    getInitData(obj={}){
        const {config} = this.state;
        const {eid ,type} = this.props;
        getExpertCommend.getData(Object.assign({}, config, {eid, type}, obj)).then(rsp=> {
            console.log(rsp);
            let totalWin=0,totalDraw=0,totalDefeat=0;
            rsp.data.list.forEach(item=> {
                if(item.state === '2'){
                    totalWin++
                }else if(item.state === '3'){
                    totalDefeat++
                }else if(item.state === '4'){
                    totalDraw++
                }
            });
            this.setState({
                data: rsp.data.list,
                totalWin,
                totalDraw,
                totalDefeat
            })
        }, rej=> {
            console.log(rej.rspMsg);
        })
    }

    /**
     * 通过指定日期筛选推荐单
     * @param date
     */
    onDateChange(date){
        const {type} = this.props;
        const {config} = this.state;
        this.setState({
            date,
            config: Object.assign({}, config, {date})
        },()=>{
            this.getInitData({type})
        });
    }

    /**
     * 渲染推荐单
     * @returns {XML}
     */
    renderItems(){
        const {data} = this.state;
        const {navigation} = this.props;
        return <FlatList
            data={data}
            renderItem={({item})=> <ExpertRecommend
                            rid={item.rid}
                            eid={item.eid}
                            showTitle={false}
                            type={item.type}
                            state={item.state}
                            events={item.events}
                            result={item.result}
                            navigation={navigation}
                        />}
            keyExtractor={(item, index) => index+'id'}
            removeClippedSubviews={false}
            scrollEnabled={false}
            ItemSeparatorComponent={this.borderBottomList}
        />
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

    render(){
        const {data, totalDefeat, totalDraw, totalWin, date} = this.state;
        return(
            <View>
                <ExpertItemHeader
                    cls={styles.titleContent}
                    titleLeft={<Text style={styles.titleFont}>
                        历史晒单共{data.length}场({totalWin}胜 {totalDraw}平 {totalDefeat}负)
                    </Text>}
                    titleRight={<DatePicker
                        style={{width: 30}}
                        date={date}
                        mode="date"
                        format="YYYY-MM-DD"
                        hideText={true}
                        iconSource={dateIcon}
                        customStyles={{
                            dateIcon:{
                                height: 18,
                                width: 18
                            },
                            btnTextConfirm:{color:CommonColor.MainColor}
                        }}
                        onDateChange={date=> {this.onDateChange(date)}}
                    >
                    </DatePicker>}
                    color={CommonColor.ExpertHistoryScore}
                />
                {data.length === 0 ? <View style={styles.contentCenter}>
                    <Text style={styles.noneOrder}>暂无历史晒单</Text>
                </View> : this.renderItems()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    titleContent:{
        backgroundColor: CommonColor.BgColor
    },
    titleFont:{
        fontSize: CommonFont.FONT_16,
        color: CommonColor.ExpertHistoryScore
    },
    lineS:{
        width: rowWidth,
        height: 5,
        backgroundColor: CommonColor.BgColor
    },
    noneOrder:{
        marginVertical: 20,
        fontSize: CommonFont.FONT_14,
        color: CommonColor.teamRateGrey
    },
    contentCenter:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: CommonColor.BgColorWhite,
        borderRadius: 6
    }
});