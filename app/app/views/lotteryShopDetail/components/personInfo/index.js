/**
 * Created by marcus on 2018/11/26.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList
} from 'react-native';
import * as CommonColor from '../../../../constants/color';
import * as CommonFont from '../../../../constants/fontSize';
import code from '../../images/code.png';

const rowWidth = Dimensions.get('window').width-20;

export default class PersonInfo extends Component{
    static defaultProps = {
        contact: '',
        phone: '',
        codeImg: ""
    };

    render(){
        const {contact, phone, codeImg} = this.props;
        return (
            <View style={styles.qrcode}>
                <View>
                    <View style={styles.dirRow}>
                        <Text style={[styles.lgText,styles.textWidth]}>联系人</Text>
                        <Text style={styles.codeText}>{contact}</Text>
                    </View>
                    <View style={styles.dirRow}>
                        <View style={styles.telStyle}>
                            <Text style={styles.lgText}>电</Text>
                            <Text style={styles.lgText}>话</Text>
                        </View>
                        <Text style={styles.codeText}>{phone}</Text>
                    </View>
                    <View style={styles.dirRow}>
                        <Text style={[styles.lgText,styles.textWidth]}>二维码</Text>
                    </View>
                </View>
                <Image
                    source={codeImg}
                    style={styles.code}
                    resizeMode={'contain'}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    qrcode:{
        width: rowWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 109,
        paddingVertical: 15,
        paddingLeft: 12,
        paddingRight: 15,
        borderRadius: 4,
        backgroundColor: CommonColor.BgColorWhite
    },
    codeText:{
        marginLeft: 15,
        fontSize: CommonFont.FONT_16,
        color: CommonColor.ShadowGrey
    },
    textWidth:{
        width: 50
    },
    telStyle:{
        width: 50,
        justifyContent:'space-between',
        flexDirection: 'row'
    },
    code:{
        width: 79,
        height: 79
    },
    dirRow:{
        flexDirection: 'row',
        marginBottom: 12
    },
    lgText:{
        fontSize: CommonFont.FONT_16,
        color: CommonColor.playIntroduceContent
    }
});