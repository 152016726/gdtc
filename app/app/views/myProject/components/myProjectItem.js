import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
const Logo = require('../../../images/icon_jingzu.png');
const deleteIcon = require('../../../images/delete_icon.png');

export default class myProjectItem extends Component {
    static defaultProps = {
        item : {},
        index : 0,
        handleGoToDetail : () => {
        },
        handleDelete : () => {
        }
    };

    handleOvertime() {
        const { item } = this.props;
        return Date.prototype.parseISO8601(item.deadline) > new Date();
    }

    render() {
        const { handleGoToDetail, handleDelete, item } = this.props;
        let isOverTime = this.handleOvertime();
        let overTime = isOverTime? (item.deadline.substr(0,16)+'过期') : '已过期';
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={Logo}/>
                <TouchableOpacity style={styles.itemAll} onPress={() => handleGoToDetail(item)}>
                    <View style={styles.contentTop}>
                        <Text style={styles.contentTitle}>{'方案' + item.id}</Text>
                        <Text style={styles.contentDate}>{overTime}</Text>
                    </View>
                    <View style={styles.contentBottom}>
                        <View style={styles.contentBottomDetail}>
                            <Text style={styles.contentBottomMSN}>{item.stickWay}</Text>
                            <Text style={styles.contentBottomMultiple}>{item.multiple + '倍'}</Text>
                        </View>
                        <View style={styles.contentBottomRight}>
                            <Text style={styles.contentBottomBonus}>{item.money + '元'}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.itemRight} onPress={() => handleDelete(item)}>
                    <View style={styles.itemLine}/>
                    <Image style={styles.itemDelete} source={deleteIcon}/>
                </TouchableOpacity>
            </View> );
    }
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        height : 66,
        backgroundColor : 'white',
        flexDirection : 'row'
    },
    logo : {
        flex : 0.5,
        height : 30,
        width : 30,
        marginLeft : 15,
        marginTop : 18,
        marginBottom : 18
    },
    itemAll : {
        flex : 4,
        flexDirection : 'column',
        height : 46,
        marginLeft : 12,
        marginTop : 10,
        marginRight : 12,
        marginBottom : 10
    },
    contentTop : {
        justifyContent : 'space-between',
        flexDirection : 'row'
    },
    contentTitle : {
        textAlign : 'left',
        fontSize : 16,
        color : '#333333',
        fontFamily : 'PingFang-SC-Regular'
    },
    contentDate : {
        fontSize : 14,
        color : '#333333',
        fontFamily : 'PingFang-SC-Regular'
    },
    contentBottom : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        marginTop : 10,
        marginBottom : 10
    },
    contentBottomDetail : {
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    contentBottomMSN : {
        textAlign : 'left',
        marginRight : 11,
        fontSize : 12,
        color : '#666666',
        fontFamily : 'PingFang-SC-Regular'
    },
    contentBottomMultiple : {
        textAlign : 'left',
        fontSize : 12,
        color : '#666666',
        fontFamily : 'PingFang-SC-Regular'
    },
    contentBottomRight : {
        flexDirection : 'row',
        justifyContent : 'flex-end',
        alignContent : 'flex-end'
    },
    contentBottomBonus : {
        fontSize : 12,
        color : '#999999',
        fontFamily : 'PingFang-SC-Regular'
    },
    itemRight : {
        flex : 1,
        flexDirection : 'row'
    },
    itemLine : {
        backgroundColor : '#E6E6E6',
        height : 46,
        width : 1,
        marginLeft : 1,
        marginTop : 10,
        marginBottom : 10
    },
    itemDelete : {
        height : 18,
        width : 16,
        justifyContent : 'center',
        alignContent : 'center',
        marginLeft : 15,
        marginRight : 15,
        marginTop : 24,
        marginBottom : 24
    }
});