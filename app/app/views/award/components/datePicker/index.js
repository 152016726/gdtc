import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    DatePickerIOS,
    TouchableWithoutFeedback,
    DatePickerAndroid
} from 'react-native';
import {connectComponentAction} from "../../../../reduxCfg";
import downImg from '../../images/down.png'
import commonFn from '../../common'
import action from "./action";
import * as storeKeys from "../../../../constants/storeKeys";


class AwardDatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datePickerIOSVisi: false, //显示IOS日期器
            startText: null,     //起始日期显示文字
            endText: null,       //截止日期
            selectType: 0            //点击的类型，0是起始日期，1是截止日期
        }
    }

    static defaultProps = {
        onCancel: () => { //取消回调
        },
        onConfirm: () => { //确认回调
        },
        initDate: ''        //初始时间
    };

    componentDidUpdate() {
        this.setDialogToggle();
    }

    setDialogToggle() {
        let {show, onCancel, onConfirm} = this.props;
        let {datePickerIOSVisi, startText, endText} = this.state;
        let initDateText = this.getInitDateText();
        let conf = {
            title: show ? <Text>日期筛选</Text> : '',
            content: <View style={styles.wrapper}>
                <TouchableWithoutFeedback
                    onPress={this.showPicker.bind(this, 0)}>
                    <View style={styles.select}>
                        <Text>{startText ? startText : initDateText}</Text>
                        <Image source={downImg} style={styles.downImg}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.separator}><Text>-</Text></View>
                <TouchableWithoutFeedback
                    onPress={this.showPicker.bind(this, 1)}
                >
                    <View style={styles.select}>
                        <Text>{endText ? endText : initDateText}</Text>
                        <Image source={downImg} style={styles.downImg}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>,
            show,
            maskPress: () => {
                this.hidePicker();
            },
            onCancel,
            onConfirm: () => {
                let {startText, endText} = this.state;
                startText = startText || initDateText;
                endText = endText || initDateText;
                this.setState({
                    startText,
                    endText
                });
                onConfirm(startText, endText);
            },
            showOtherContent: datePickerIOSVisi,
            otherContent: <View style={styles.datePickerWrapper}>
                <DatePickerIOS
                    mode='date'
                    style={styles.datePickerIOS}
                    date={this.getPickerDate.call(this)}
                    onDateChange={this.setDate.bind(this)}
                />
            </View>
        };
        this.props.updateCommonDialog(conf);
    }

    getTextKey(type) {
        return type === 0 ? 'startText' : 'endText';
    }

    /**
     * 显示日期
     * @param type {Number}0是起始日期，1是截止日期
     */
    showPicker(type) {
        this.setState({
            selectType: type
        }, () => {
            let key = this.getTextKey(type);
            let text = this.state[key];
            let initDate = this.getPickerDate();
            let dateObj = commonFn.getDateObj(initDate.getTime());
            let obj = {}
            if (!text) {
                obj = {
                    [key]: `${dateObj.y}-${dateObj.m}-${dateObj.d}`
                }
            }
            this.setState(obj, function () {
                if (Platform.OS === 'android') { //安卓
                    this.showPickerAndroid(type);
                }
                else { //IOS
                    this.setState({
                        datePickerIOSVisi: true
                    })
                }
            });
        })
    }

    hidePicker() {
        this.setState({
            datePickerIOSVisi: false
        })
    }

    /**
     * android进行创建时间日期选择器
     */
    async showPickerAndroid(type) {
        let initDate = this.getPickerDate();
        let key = this.getTextKey(type);
        let text = this.state[key];
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                // 要设置默认值为今天的话，使用`new Date()`即可。
                mode: 'spinner',
                date: text ? new Date(text) : new Date(parseInt(initDate))
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                //this.setDate(new Date(`${year}/${month + 1}/${day}`)); //非调试模式yyyy-MM-dd格式有bug！！！
                this.setDate(new Date(year, month, day));
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }

    setDate(date) {
        let dateObj = commonFn.getDateObj(date.getTime());
        let {selectType} = this.state;
        let key = this.getTextKey(selectType);
        this.setState({
            [key]: `${dateObj.y}-${dateObj.m}-${dateObj.d}`
        });
    }

    /**
     * 获取输入框的值
     */
    getPickerDate() {
        let date;
        let {initDate} = this.props;
        let {startText, endText, selectType} = this.state;
        let dateText = selectType === 0 ? startText : endText;
        if (/^\d+-\d+-\d+$/.test(dateText)) {
            date = new Date(dateText);
        }
        else if (initDate) {
            date = initDate;
        }
        else {
            date = new Date();
        }
        return date;
    }

    getInitDateText() {
        let {initDate} = this.props;
        if (initDate !== '') {
            let dateObj = commonFn.getDateObj(initDate.getTime());
            return `${dateObj.y}-${dateObj.m}-${dateObj.d}`;
        }
        else {
            return ''
        }
    }

    render() {
        return false;
    }
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        zIndex: 9999,
        paddingTop: 30,
        paddingBottom: 30,
        flexDirection: 'row'
    },
    datePickerWrapper: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        flex: 1,
        justifyContent: 'flex-end'
    },
    datePickerIOS: {
        backgroundColor: '#ffffff'
    },
    select: {
        flex: 1,
        height: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d1d1',
        padding: 10
    },
    separator: {
        paddingLeft: 15,
        paddingRight: 15,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    downImg: {
        width: 13,
        height: 8
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    }
});

export default connectComponentAction(action, storeKeys.DATE_PICKER_STORE)(AwardDatePicker);