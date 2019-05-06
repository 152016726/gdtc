/**
 * 赛事下放详情组件
 * Created by DDT on 2018/11/26.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import * as CommonColor from '~/constants/color'


export default class EventSummary extends Component {
    static defaultProps = {
        vid: '',        // 赛事vid
        homeOdds: '',   // 平均欧赔主
        drawOdds: '',   // 平均欧赔和
        awayOdds: '',   // 平均欧赔客
        handleDirectDetail(){}
    };

    render() {
        let {vid, homeOdds, drawOdds, awayOdds, handleDirectDetail} = this.props;
        homeOdds = homeOdds === '' ? '--' : homeOdds;
        drawOdds = drawOdds === '' ? '--' : drawOdds;
        awayOdds = awayOdds === '' ? '--' : awayOdds;
        return (
            <View style={styles.container}>
                <View style={styles.tblOuterContainer}>
                    <View style={styles.tblContainer}>
                        <View style={styles.colTitle}>
                            <Text style={styles.titleText}>平均欧指</Text>
                        </View>
                        <View style={styles.dataContainer}>
                            <View style={styles.rowContainer}>
                                <View style={styles.cellContainer}>
                                    <Text style={styles.titleText}>主</Text>
                                </View>
                                <View style={styles.cellContainer}>
                                    <Text style={styles.titleText}>和</Text>
                                </View>
                                <View style={[styles.cellContainer, styles.rightCell]}>
                                    <Text style={styles.titleText}>客</Text>
                                </View>
                            </View>
                            <View style={styles.rowContainer}>
                                <View style={[styles.cellContainer, styles.bottomCell]}>
                                    <Text style={styles.dataText}>{homeOdds}</Text>
                                </View>
                                <View style={[styles.cellContainer, styles.bottomCell]}>
                                    <Text style={styles.dataText}>{drawOdds}</Text>
                                </View>
                                <View style={[styles.cellContainer, styles.bottomCell, styles.rightCell]}>
                                    <Text style={styles.dataText}>{awayOdds}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.linkContainer}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={handleDirectDetail.bind(this, 0)}>
                        <Text style={styles.dataText}>亚指详情 >></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={handleDirectDetail.bind(this, 1)}>
                        <Text style={styles.dataText}>欧指详情 >></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={handleDirectDetail.bind(this, 2)}>
                        <Text style={styles.dataText}>同奖回查 >></Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        flexDirection: 'column',
        backgroundColor: CommonColor.headerBorderColor
    },
    tblOuterContainer: {
        borderColor: '#999999',
        borderBottomWidth: 1,
        paddingTop: 8,
        paddingBottom: 8,
        flex: 1
    },
    tblContainer: {
        flexDirection: 'row',
        flex: 1
    },
    colTitle: {
        flex: 2,
        borderColor: '#999999',
        borderRightWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dataContainer: {
        flex: 10
    },
    rowContainer: {
        flexDirection: 'row',
        height: 25
    },
    cellContainer: {
        flex: 1,
        borderColor: '#999999',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingTop: 5
    },
    rightCell: {
        borderRightWidth: 0
    },
    bottomCell: {
        borderBottomWidth: 0,
        justifyContent: 'flex-end',
        paddingTop: 0,
        paddingBottom: 5
    },
    titleText: {
        color: CommonColor.playIntroduceContent,
        fontSize: 12
    },
    dataText: {
        color: CommonColor.teamRateGrey,
        fontSize: 12
    },
    linkContainer: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    buttonStyle: {
        height: 30,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});