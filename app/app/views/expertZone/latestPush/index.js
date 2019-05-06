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
import getExpertCommend from '~/services/getExpertCommend';
import ExpertRecommend from '~/components/expertRecommend';

const rowWidth = Dimensions.get('window').width;

export default class LatestPush extends Component{
    static defaultProps={
        type: ''      // 荐单类型
    }

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            data: [],    // 最新推荐单list
            config: {    // 配置
                "isHistory": false,
                "pageIndex": 0,
                "pageSize": 9999999
            }
        };
      }

    componentWillMount() {
        this.getInitData()
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.type !== this.props.type){
            this.getInitData({type: nextProps.type});
        }else if(nextProps.eid !== this.props.eid){
            this.getInitData({eid: nextProps.eid});
        }
    }

    /**
     * 初始化推荐单
     * @param obj
     */
    getInitData(obj={}){
        const {config} = this.state;
        const {eid ,type} = this.props;
        getExpertCommend.getData(Object.assign({}, config, {eid, type}, obj)).then(rsp=> {
            this.setState({
                data: rsp.data.list
            })
        }, rej=> {
            console.log(rej.rspMsg);
        })
    }

    /**
     * 渲染推荐单
     * @returns {XML}
     * @private
     */
    renderItems(){
        const {data} = this.state;
        const {navigation} = this.props;
        
        return <FlatList
            data={data}
            renderItem={({item})=>  <ExpertRecommend
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
        const {data} = this.state;
        return(
            <View>
                <ExpertItemHeader
                    cls={styles.titleContent}
                    titleLeft={<Text style={styles.titleFont}>最新晒单</Text>}
                    color={CommonColor.MainColor}
                />
                {data.length === 0 ? <View style={styles.contentCenter}>
                    <Text style={styles.noneOrder}>今日尚未晒单</Text>
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
        color: CommonColor.MainColor
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