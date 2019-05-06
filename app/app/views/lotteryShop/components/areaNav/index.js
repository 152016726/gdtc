/**
 * Created by marcus on 2018/11/22.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as CommonColor from '~/constants/color';
import * as CommonFont from '~/constants/fontSize';
import down from './images/down.png';

const rowWidth = Dimensions.get('window').width;
export default class AreaNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showList: false,
            areaSelect: ''
        };
    }

    static defaultProps = {
        city: '',
        areas: []
    };

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.city !== nextProps.city) {
            this.setState({
                areaSelect: nextProps.areas[0].name
            });
        }
    }

    _onPress() {
        let {showList} = this.state;
        this.setState({
            showList: !showList
        });
    }

    /**
     * 点击区
     */
    changeArea(ele) {
        const {changeAreaState} = this.props;
        this.setState({
            showList: false,
            areaSelect: ele.name
        });
        changeAreaState && changeAreaState(ele);
    }

    render() {
        const {city, areas = []} = this.props;
        const {showList, areaSelect} = this.state;
        return (
            <View style={styles.box}>
                <View style={styles.titleContainer}>
                    <Text
                        style={styles.currentArea}>当前: {city + areaSelect}</Text>
                    <TouchableOpacity style={styles.pressArea} onPress={this._onPress.bind(this)}>
                        <Text style={styles.labelTxt}>切换区/县</Text>
                        <Image
                            source={down}
                            style={styles.icon}
                            resizeMode={'contain'}/>
                    </TouchableOpacity>
                </View>
                {showList && <View style={styles.areaList}>
                    {
                        areas.map((ele, index) =>
                            <View style={styles.areaListBox} key={index}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.changeArea(ele)
                                    }}
                                    style={[styles.btn, ele.id === areaSelect.id && styles.btnActive]}
                                    key={index}>
                                    <Text style={[styles.areaListBoxText, ele.name.length > 7 && styles.smallFont]}>
                                        {ele.name}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        width: rowWidth,
        backgroundColor: CommonColor.BgColorWhite
    },
    titleContainer: {
        width: rowWidth - 30,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    currentArea: {
        paddingLeft: 12,
        fontSize: CommonFont.FONT_16,
        color: CommonColor.playIntroduceContent
    },
    pressArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 12,
        height: 6
    },
    labelTxt: {
        fontSize: CommonFont.FONT_14,
        color: CommonColor.DarkGrey,
        marginRight: 6
    },
    areaList: {
        padding: 6,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    areaListBox: {
        width: '33.33333%',
        padding: 6,
    },
    areaListBoxText: {
        fontSize: 14
    },
    btn: {
        borderColor: CommonColor.headerBorderColor,
        borderWidth: 1,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4

    },
    btnActive: {
        backgroundColor: CommonColor.BgColor
    },
    smallFont: {
        fontSize: 11
    }
});