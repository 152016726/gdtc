import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import BetButton from '../betButton'
import WDWInner from '../WDWInner'
import games from "@easylotto/bet";

const BETBOXHEIGHT = 72;            // outcome 的高

export default class BetWDW extends Component {
    /**
     * 获取是否选中状态
     * @param vid
     * @param sort
     * @param outcomeName
     * @returns {boolean}
     */
    getSelectStatus(vid, sort, outcomeName){
        let outcomeList = games.Betslip.getChooseOutcomes();
        return outcomeList.indexOf(`${vid}#${sort}#${outcomeName}`) !== -1;
    }

    /**
     * 处理显示数据
     * @param index
     * @param sort
     */
    initName(index, sort) {
        const {event} = this.props;
        // console.log(event);
        let _props = {};
        let mkt = event.showMarkets[sort];
        let vid = event.vid;
        switch (index) {
            case 0 :
                _props.text = event.homeShortName;
                _props.rate = event.showMarkets[sort].homeOdds;
                _props.flexVal = 3.5;
                _props.outcomeName = 'homeOdds';
                _props.isSelected = this.getSelectStatus(vid, sort, 'homeOdds');
                break;
            case 1 :
                _props.text = "VS";
                _props.rate = mkt.drawOdds;
                _props.flexVal = 2.5;
                _props.outcomeName = 'drawOdds';
                _props.isSelected = this.getSelectStatus(vid, sort, 'drawOdds');
                break;
            case 2:
                _props.text = event.awayShortName;
                _props.rate = event.showMarkets[sort].awayOdds;
                _props.flexVal = 3.5;
                _props.outcomeName = 'awayOdds';
                _props.isSelected = this.getSelectStatus(vid, sort, 'awayOdds');
                break;
            default:
                break;
        }
        return _props;
    }

    /**
     * 渲染按钮
     * @returns {any[]}
     */
    renderButtons() {
        const {sort} = this.props;
        let WDWOpts = [
            '主胜',
            '平',
            '客胜'
        ];
        let num = 5;
        return WDWOpts.map((name, index) => {
            const {event, outcomeCount} = this.props;
            if (index === WDWOpts.length - 1) {
                num = 0;
            }
            let props = this.initName(index, sort);
            let cls = {
                flex: props.flexVal,
                height: BETBOXHEIGHT,
                marginRight: num,
                borderWidth: 1,
                borderColor: 'rgb(209,209,209)'
            };
            return (<BetButton key={index}
                               vid={event.vid}
                               homeRank={event.homeLeagueRank}
                               courtRank={event.awayLeagueRank}
                               sort={sort}
                               cls={cls}
                               name={name}
                               num={index}
                               outcomeCount={outcomeCount}
                               {...props}
                               ContentElement={WDWInner}/>)
        })
    }

    render() {
        const {sort, event} = this.props;
        return (
            <View style={styles.container}>
                {
                    sort === "hwdw" && <View style={styles.hicap}>
                        <View>
                            <Text style={styles.txt}>让球</Text>
                        </View>
                        <View>
                            <Text style={styles.txt}>{event.showMarkets[sort].handicap}</Text>
                        </View>
                    </View>
                }
                <View style={styles.content}>
                    {this.renderButtons()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: BETBOXHEIGHT,
        flexDirection: "row"
    },
    hicap: {
        flex: 7,
        height: BETBOXHEIGHT,
        backgroundColor: 'rgb(127,211,63)',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    txt: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 10
    },
    content: {
        flex: 93,
        flexDirection: "row",
        height: BETBOXHEIGHT,
        justifyContent: 'flex-end'
    }
});