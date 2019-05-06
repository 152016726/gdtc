import React, {Component} from 'react';
import {
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as CommonColor from '../../../../../../constants/color';
import * as FONT_SIZE from '../../../../../../constants/fontSize';

export default class Player extends Component {
    static defaultProps = {
        position: '',             //场上位置
        playerId: '',             //球员ID
        playerCnShort: '',        //球员名字
        shirtnumber: '',          //球衣号码
        imgUrl: ''                //球员相片
    };

    /**
     * 点击球员事件
     */
    handlePress() {
        const {playerid} = this.props;
        console.log(playerid);
    }

    render() {
        const {name, position, playerId, playerCnShort, shirtnumber, imgUrl,} = this.props;
        let picUrl = imgUrl === '' ? require('./images/noImg.png') : imgUrl;
        return (
            <TouchableOpacity style={styles.container} activeOpacity={1}>
                <Image source={picUrl} resizeMode="contain" style={styles.img}/>
                <Text style={styles.commonPadding}>{shirtnumber}</Text>
                <Text>{playerCnShort}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: CommonColor.awardBorederColor,
        borderBottomWidth: 1,
        paddingHorizontal: 20,
        backgroundColor: CommonColor.BgColorWhite
    },
    img: {
        width: 31,
        height: 31,
        marginRight: 10
    },
    commonPadding: {
        paddingRight: 20,
        fontSize: FONT_SIZE.FONT_12
    }
});
