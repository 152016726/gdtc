/**
 * Created by easyLottoMac_Feng on 2018/12/10.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {MainColor} from "~/constants/color";
import {FONT_18} from "~/constants/fontSize";

export default class SelectHeaderTitle extends Component {
    static defaultProps = {
        statusNum: 0,               // 选中的索引值
        configData: [],             // 需要渲染的数据
        headerCallBack: null        // 回调返回
    };

    render() {
        const {statusNum = 0, configData, headerCallBack} = this.props;
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <View style={styles.titleBoxSty}>
                    {
                        configData.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.handleSty,
                                        {backgroundColor: statusNum === item.idType ? '#ffffff' : MainColor}
                                    ]}
                                    onPress={() => headerCallBack(item)}
                                    key={index}>
                                    <Text style={{
                                        color: statusNum === item.idType ? MainColor : '#ffffff',
                                        fontSize: FONT_18
                                    }}>
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    titleBoxSty: {
        flexDirection: 'row',
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#ffffff'
    },
    handleSty: {
        paddingVertical: 4,
        paddingHorizontal: 10
    }
});