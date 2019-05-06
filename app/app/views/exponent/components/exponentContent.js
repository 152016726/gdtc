import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import OddTrendText from '../../../components/oddTrendText'
import * as FONT_SIZE from "../../../constants/fontSize";

let textCfg = {
    ah: ['初盘', '主队', '让球', '客队'],
    wdw: ['初盘', '主胜', '平局', '客胜']
};

class Line extends Component {
    static defaultProps = {
        title: '',           //头部标题
        data: ''             //数据
    };

    render() {
        const {data, type} = this.props;
        if (type === 'ah') {
            return <View style={styles.rightSide}>
                <View style={[styles.inner]}>
                    <OddTrendText text={'初盘'} styleCustomText={[styles.txtColor]}/>
                    <OddTrendText text={data.homeOddsInit}/>
                    <OddTrendText text={data.handicapInit}/>
                    <OddTrendText text={data.awayOddsInit}/>
                </View>
                <View style={[styles.inner, styles.bgColor]}>
                    <OddTrendText text={'即时'} styleCustomText={[styles.txtColor, styles.currentColor]}/>
                    <OddTrendText text={data.homeOddsCurr} type={data.homeTrend}/>
                    <OddTrendText text={data.handicapCurr} type={data.handTrend}/>
                    <OddTrendText text={data.awayOddsCurr} type={data.awayTrend}/>
                </View>
            </View>
        }
        else if (type === 'wdw') {
            return <View style={styles.rightSide}>
                <View style={[styles.inner]}>
                    <OddTrendText text={'初盘'} styleCustomText={[styles.txtColor, styles.currentColor]}/>
                    <OddTrendText text={data.homeOddsInit}/>
                    <OddTrendText text={data.drawOddsCurr}/>
                    <OddTrendText text={data.awayOddsInit}/>
                </View>
                <View style={[styles.inner, styles.bgColor]}>
                    <OddTrendText text={'即时'} styleCustomText={[styles.txtColor]}/>
                    <OddTrendText text={data.homeOddsCurr} type={data.homeTrend}/>
                    <OddTrendText text={data.drawOddsCurr} type={data.drawTrend}/>
                    <OddTrendText text={data.awayOddsCurr} type={data.awayTrend}/>
                </View>
            </View>
        }
        else return null;
    }
}

export default class ExponentContent extends Component {
    static defaultProps = {
        company: []      //公司
    };

    renderTitle() {
        let {type} = this.props;
        return <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
                <Text style={styles.titleTxt}>公司</Text>
            </View>
            <View style={styles.headerRight}>
                {
                    (textCfg[type] || []).map((txt, index) => {
                        return <View key={index}>
                            <Text style={[styles.titleTxt, index === 0 && styles.hideTxt]}>{txt}</Text>
                        </View>
                    })
                }
            </View>
        </View>
    }

    renderColumn() {
        const {company, type, onPress} = this.props;
        return company.map((item, k) => {
            let isLast = k === company.length - 1;
            return (
                <TouchableOpacity onPress={()=>{
                    onPress(item.cid);
                }} key={k} style={styles.content}>
                    <View style={[styles.leftSide, isLast && styles.noBorder]}>
                        <Text>{item.companyCnShort}</Text>
                    </View>
                    <View style={styles.rightSide}>
                        <Line type={type} data={item}/>
                    </View>
                </TouchableOpacity>
            )
        })
    }

    render() {
        let {company} = this.props;
        return (<View>
            <View style={styles.title}>
                {this.renderTitle()}
            </View>
            <View style={styles.contentWrapper}>
                {company.length === 0 ? <View style={styles.tips}><Text  style={styles.tipsText}>暂无指数数据</Text></View> : this.renderColumn()}
            </View>
        </View>)
    }
}

const styles = StyleSheet.create({
    title: {
        flex: 1,
        height: 30,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#f2f2f2',
        borderTopWidth: 1,
        borderColor: '#ccc'
    },
    titleTxt: {
        color: '#777777'
    },
    txtColor:{
        color: '#333333'
    },
    contentWrapper: {
        borderColor: '#ccc',
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    tips: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipsText: {
      color: '#999'
    },
    content: {
        flex: 1,
        height: 80,
        flexDirection: 'row'
    },
    leftSide: {
        flex: 3,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderColor: '#ccc',
        borderRightWidth: 1,
        borderBottomWidth: 1
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row'
    },
    headerLeft: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderRightWidth: 1,
    },
    headerRight: {
        flex: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    noBorder: {
        borderBottomWidth: 0
    },
    rightSide: {
        flex: 7,
        height: 80,
        flexDirection: 'column'
    },
    inner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#ffffff'
    },
    bgColor: {
        backgroundColor: '#f7f7f7'
    },
    currentColor: {
        color: '#da573a'
    },
    hideTxt: {
        color: "transparent"
    }

});