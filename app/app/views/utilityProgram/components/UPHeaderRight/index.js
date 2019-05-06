/**
 * Created by easyLottoMac_Feng on 2018/12/10.
 */
import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';

export default class UPHeaderRight extends Component {
    render() {
        let {showPicker = null, navHandle = null} = this.props;
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={showPicker}>
                    <Image
                        style={styles.btnImage}
                        source={require('../../images/datepicker.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={navHandle}>
                    <Image
                        style={styles.btnImage}
                        source={require('../../images/matchtype.png')}
                    />
                </TouchableOpacity>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    wrapper: {
        width: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 15
    },
    btn: {
        padding: 2
    },
    btnImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
});