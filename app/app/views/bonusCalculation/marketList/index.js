/**
 * Created by mac-ddt on 2018/9/5.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    Dimensions
} from 'react-native';
import {FONT_12, FONT_16} from '../../../constants/fontSize';
import {BgColorWhite, BorderColor} from '../../../constants/color';
import BonusMarketList from '../../../components/bonusMarketList';
const s_h = Dimensions.get('window').height;

export default class MarketList extends Component{

    constructor(props){
        super(props);
        this.state = {
            marketLists:this.props.marketLists
        }
    }

    /**
     *
     * @param nextProps 最新的 props
     */
    componentWillReceiveProps(nextProps){
        this.setState({
            marketLists:nextProps.marketLists
        })
    }

    /**
     * 分割线
     * @returns {*}
     */
    borderBottomList(){
        return(
            <View style={styles.flatBorder}>
                <View style={styles.flatBorderLine}/>
            </View>
        )
    }

    /**
     * 渲染已选赛事列表
     * @param marketLists
     * @returns {*}
     */
    renderFlat(marketLists){
        const{delMarket, setDanHandle, selectMarket} = this.props;
        return(
            <View>
                <FlatList data={marketLists}
                          extraData={marketLists}
                          alwaysBounceVertical={false}
                          renderItem={({item, index})=>(
                              <BonusMarketList marketList={item}
                                               delMarket={(idNum)=>delMarket(idNum)}
                                               setDanHandle={(idNum, banker)=>setDanHandle(idNum, banker)}
                                               selectMarket={(idNum)=>selectMarket(idNum)}/>
                          )}
                          keyExtractor = {(item, index)=> index.toString()}
                          ItemSeparatorComponent = {this.borderBottomList}/>
            </View>
        )
    }

    render(){
        let {marketLists} = this.state;
        let defaultHeight = marketLists.length > 0 ? s_h - 360 : 86;
        return(
            <View>
                <View style={styles.batchImage}>
                    <Image source={require('../images/LeftRoundAngle.png')}
                           style={styles.roundAngle}/>
                    <Image source={require('../images/lineBg.png')}
                           style={styles.centerLine}/>
                    <Image source={require('../images/RightRoundAngle.png')}
                           style={styles.roundAngle}/>
                </View>
                <View style={[styles.marketListBox, {maxHeight: defaultHeight}]}>
                    {
                        marketLists.length > 0 ? this.renderFlat(marketLists):
                        <Text style={styles.noMarketText}>
                            请至少选择2场比赛(单关除外)
                        </Text>
                    }
                </View>
                <View style={styles.footBgS}>
                    <Image source={require('../images/footBg.png')}
                           style={styles.footImage}/>
                </View>
                <View style={styles.footTip}>
                    {
                        marketLists.length > 1 &&
                        <Text style={styles.footTipText}>
                            注：全场90分钟（含伤停补时，不含加时赛及点球大战），页面奖金仅供参考
                        </Text>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    batchImage: {
        flexDirection:'row',
        backgroundColor:BgColorWhite
    },
    roundAngle: {
        width: 8.5,
        height: 18
    },
    centerLine: {
        flex: 1,
        height: 18
    },
    marketListBox: {
        backgroundColor: BgColorWhite,
        marginHorizontal: 8.5
    },
    noMarketText: {
        fontSize: FONT_16,
        color: '#999999',
        lineHeight: 86,
        textAlign: 'center'
    },
    footBgS: {
        marginHorizontal: 8.5
    },
    footImage: {
        width: "100%",
        height: 16
    },
    footTip: {
        marginVertical: 20,
        marginHorizontal: 8.5
    },
    footTipText: {
        color: "#999999",
        fontSize:FONT_12
    },
    flatBorder: {
        height: 1,
        overflow: "hidden",
        paddingHorizontal: 28
    },
    flatBorderLine: {
        borderStyle:'dashed',
        borderWidth: 1,
        borderColor: BorderColor
    }
});