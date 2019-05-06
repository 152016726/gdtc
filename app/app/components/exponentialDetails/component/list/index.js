import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import gridConf from "../../gridConf";
import OddTrendText from "../../../oddTrendText";
import ScoreScrollView from '../../../../views/scoreDetails/components/scoreScrollView'
import * as ColorCof from '../../../../constants/color'

export default class ExponentialDetailsList extends Component {
    static defaultProps = {
        data: [],    //显示的tab数组
        type: ''
    };

    modifyTime(data) {
        return Date.prototype.parseISO8601(data).format('MM-dd hh:mm');
    }

    /**
     * 渲染提示
     */
    renderTips(tips) {
        return <View style={styles.noList}><Text style={styles.noListText}>{tips}</Text></View>;
    }

    /**
     * 渲染列表
     */
    renderList() {
        let {data = {}, type} = this.props;
        let list = data.data || [];
        let conf = gridConf[type];
        return list.map((ele, index) => <View
            style={[styles.fr, index % 2 === 1 && styles.bgGray]} key={index}>
            {
                conf.map((ele_c, index_c) => <OddTrendText key={index_c}
                                                           type={ele_c.typeKey === 'time' ? 'g' : ele[ele_c.typeKey]}
                                                           text={ele_c.typeKey === 'time' ? this.modifyTime(ele[ele_c.key]) : ele[ele_c.key]}
                                                           flex={ele_c.flex}/>)
            }
        </View>)
    }

    render() {
        let {data = {}, style} = this.props;
        let list = data.data || [];
        let loading = data.loading;
        return <View style={style}>
            <ScoreScrollView>
                {
                    (list.length === 0 && loading === false) ? this.renderTips('暂无数据') : this.renderList()
                }
            </ScoreScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    fr: {
        flexDirection: 'row',
        height: 50
    },
    noList: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200
    },
    noListText: {
        fontSize: 14,
        color: '#999999'
    },
    bgGray: {
        backgroundColor: ColorCof.BgColor
    }
});
