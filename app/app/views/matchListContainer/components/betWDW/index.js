import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import BetButton from '../betButton'
import WDWInner from '../WDWInner'
import matchDataCenter from '#/matchDataCenter';
import * as MarketSort from '~/constants/MarketSort'

const BETBOXHEIGHT = 72;            // outcome 的高

export default class BetWDW extends Component {
    static defaultProps = {
        vid: '',        // 比赛vid
        sort: '',       // 显示的sort分类，可能是 min 混合过关，dg 单固
        currentKey: ''  // 当前改变的outcome的key
    };

    model = {};

    componentWillMount() {
        this.initModel();
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.vid !== this.props.vid) {
            this.initModel(nextProps);
        }
    }

    initModel(props) {
        let {vid} = (props || this.props);
        this.model.event = matchDataCenter.getEventObject(vid);
    }

    /**
     * 渲染按钮
     * @returns {any[]}
     */
    renderButtons() {
        const {event} = this.model;
        const {sort, currentKey} = this.props;
        let mkt = event.markets[sort];
        if (mkt) {
            let cls = {
                height: BETBOXHEIGHT,
                borderWidth: 1,
                borderColor: 'rgb(209,209,209)'
            };
            return mkt.outcomes.map((oc, index) => {
                let flexVal = oc.key === 'drawOdds' ? 2.5 : 3.5;
                let num = oc.key === 'awayOdds' ? 0 : 5;
                let text = this.getText(index, event);
                return <BetButton
                    vid={event.vid}
                    sort={sort}
                    key={`${event.vid}#${sort}#${oc.key}`}
                    betKey={`${event.vid}#${sort}#${oc.key}`}
                    text={text}
                    name={oc.title}
                    rate={oc.rate}
                    homeRank={event.homeLeagueRank}
                    courtRank={event.awayLeagueRank}
                    cls={Object.assign({}, cls, {
                        flex: flexVal,
                        marginRight: num
                    })}
                    num={index}
                    currentKey={currentKey}
                    ContentElement={WDWInner}
                />
            });
        } else {
            return <View> </View>;
        }
    }

    /**
     * 获取主客队名
     * @param index
     * @param event
     */
    getText(index, event) {
        let text;
        switch (index) {
            case 0:
                text = event.homeShortName;
                break;
            case 1:
                text = 'VS';
                break;
            case 2:
                text = event.awayShortName;
                break;
            default:
                text = ''
        }
        return text;
    }

    shouldComponentUpdate(nextProps) {
        let flag = false;
        for (let p in nextProps) {
            !flag && (flag = nextProps[p] !== this.props[p]);
        }
        return flag;
    }

    render() {
        const {event} = this.model;
        const {sort} = this.props;
        return (
            <View style={styles.container}>
                {
                    sort === "hwdw" &&
                    <View style={styles.hicap}>
                        <View>
                            <Text style={styles.txt}>让球</Text>
                        </View>
                        <View>
                            <Text style={styles.txt}>{event.markets[MarketSort.HANDICAP_WIN_DRAW_WIN].handicap}</Text>
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