/**
 * Created by oWEn on 2018/8/30.
 */
import React, {Component} from 'react';
import datepickerImg from '../../images/datepicker.png'
import matchtypeImg from '../../images/matchtype.png'
import {
    View,
    Image,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
export default class AwardHeaderRight extends Component {

    render() {
        let {navHandle,showPicker} = this.props;
        return <View style={styles.wrapper}>
            <TouchableWithoutFeedback style={styles.btn} onPress={showPicker}>
                    <Image
                        style={styles.btnImage}
                        source={datepickerImg}
                    />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback  style={styles.btn} onPress={navHandle}>
                    <Image
                        style={styles.btnImage}
                        source={matchtypeImg}
                    />
            </TouchableWithoutFeedback>
        </View>
    }
};

const styles = StyleSheet.create({
    wrapper:{
        width: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 15
    },
    btn:{
        padding: 2
    },
    btnImage:{
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
});
