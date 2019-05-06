/**
 * Created by mac-ddt on 2017/6/21.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ListView,
    Dimensions,
    Animated,
    ImageBackground
} from 'react-native';
import * as color from '../../constants/color'

export default class HeaderSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            heightValue: new Animated.Value(0),
        }
    }

    handlePress(rowID) {
        const {onPress} = this.props;
        onPress(rowID);
    };

    _hide() {
        const {onPress} = this.props;
        onPress();
    }

    _renderRow(rowData, sectionID, rowID,) {
        const {sort} = this.props;
        const uri = rowData.sort === sort ? require('../../images/sel.png') : require('../../images/unsel.png');

        return (
            <TouchableOpacity activeOpacity={1} style={styles.cell} onPress={() => (this.handlePress(rowID))}>
                <ImageBackground style={styles.img} resizeMode="stretch" source={uri}>
                    <Text style={[styles.txt , rowData.sort === sort ? styles.selTxt :styles.unSelTxt]}>{rowData.text}</Text>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    componentWillReceiveProps(nextProps) {
        const {isShowMethod} = this.props;
        if (nextProps.isShowMethod !== isShowMethod && nextProps.isShowMethod === true) {
            Animated.timing(this.state.heightValue, {
                toValue: this.contentHeight,
                duration: 300
            }).start();
        } else if (nextProps.isShowMethod !== isShowMethod && nextProps.isShowMethod === false) {
            Animated.timing(this.state.heightValue, {
                toValue: 0,
                duration: 300
            }).start();
        }
    }

    render() {
        const {content, isShowMethod} = this.props;
        this.contentHeight = Math.ceil(content.length / 3) * 50 + 20;
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        let dataSource = ds.cloneWithRows(content);
        return (
            <View style={[styles.container, {height: isShowMethod ? Dimensions.get('window').height : 0}]}>
                <Animated.View style={{height: this.state.heightValue}}>
                    <ListView
                        bounces={false}
                        dataSource={dataSource}
                        renderRow={this._renderRow.bind(this)}
                        contentContainerStyle={[styles.listViewStyle, {height: this.contentHeight}]}
                    />
                </Animated.View>

                {isShowMethod && <TouchableOpacity style={[styles.mask, {
                    height: Dimensions.get('window').height - this.contentHeight,
                    top: this.contentHeight
                }]} activeOpacity={1} onPress={this._hide.bind(this)}/>}
            </View>
        )
    }

}
//样式
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,.1)',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 100,
        width: Dimensions.get('window').width,
    },
    mask: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        position: 'absolute',
        top: 170,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 140,
    },
    listViewStyle: {
        width: Dimensions.get('window').width,
        height: 200,
        padding: 10,
        backgroundColor: 'rgb(245,245,245)',
        flexDirection: 'row', //设置横向布局
        flexWrap: 'wrap'    //设置换行显示
    },
    cell: {
        width: (Dimensions.get('window').width - 20) / 3, //cell的宽度
        height: 50
    },
    img: {
        width: (Dimensions.get('window').width - 20) / 3 - 10,
        height: 40,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt:{
        fontSize: Dimensions.get('window').width <= 320 ? 15 : 16,
        backgroundColor: 'transparent'
    },
    unSelTxt: {
        color: 'rgb(153,153,153)',
    },
    selTxt: {
        color: 'rgb(233,129,55)'
    }
});