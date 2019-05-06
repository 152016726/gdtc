import {Component} from "react";
import {
    Text,
    View,
    StyleSheet, Dimensions
} from "react-native";
import React from "react";
import ComboButton from '../comboButton'

export default class ComboContent extends Component {
    static defaultProps = {
        data: [],                             // 渲染的数据
        handleSelectComboType: () => {
        },        //选择的过关方式方法
        title: '',                            //头部文字
        isCanMultiple: '',                    //是否能多选
        selectTypeArr: '',                     //当前选择的过关方式
    };

    render() {
        const {data, handleSelectComboType, title, isCanMultiple, selectTypeArr} = this.props;
        return (
            <View>
                <View style={styles.title}><Text>{title}</Text></View>
                <View style={styles.comboContainer}>
                    {
                        data.map((item, index) => {
                            return <ComboButton key={index}
                                                {...item}
                                                isCanMultiple={isCanMultiple}
                                                handleSelectComboType={handleSelectComboType}
                                                selectTypeArr={selectTypeArr}/>
                        })
                    }
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    title: {
        paddingVertical: 5
    },
    comboContainer: {
        width: Dimensions.get('window').width,
        height: 'auto',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
});