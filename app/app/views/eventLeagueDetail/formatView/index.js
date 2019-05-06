/**
 * Created by easyLottoMac_Feng on 2018/12/5.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {BgColorWhite} from "~/constants/color";
import {FONT_16} from "~/constants/fontSize";
import getRuleForLeague from "~/services/getRuleForLeague";

export default class FormatView extends Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            system: ''  // 赛制
        };
      }

    componentWillMount() {
        const {lid, seasonId} = this.props;
        this.getSystemData({lid, seasonId})
    }

    componentWillReceiveProps(nextProps) {
        const {lid, seasonId} = nextProps;
        // 更新赛制
        if((seasonId !== this.props.seasonId) || (lid !== this.props.lid)){
            this.getSystemData({lid, seasonId});
        }
    }

    /**
     * 获取赛制信息
     * @param obj
     */
    getSystemData(obj){
        getRuleForLeague.getData(obj).then(rsp => {
            this.setState({
                system: rsp.data.system
            })
        }, rej => {
            console.log(rej.rspMsg);
        })
    }

    render() {
        const {system} = this.state;
        return (
            <View style={styles.contentSty}>
                <Text style={styles.textSty}>
                    <Text style={styles.indentSty}>缩进</Text>{system}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contentSty: {
        flex: 1,
        backgroundColor: BgColorWhite,
        padding: 12
    },
    indentSty: {
        width: 24,
        height: 15,
        color: '#ffffff'
    },
    textSty: {
        color: '#333333',
        lineHeight: 23,
        fontSize: FONT_16
    }
});