    /**
 * Created by oWEn on 2018/8/31.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import _ from 'lodash';
import {connectReducerComponent} from '../../reduxCfg';
import state from "./state";
import action from "./action";
import reducer from "./reducer";
import * as storeKey from "../../constants/storeKeys";

class CommonDialog extends Component {

    stylesObj = {
        mask: {
            flex: 1,
            justifyContent: 'center',
            padding: 16,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        win: {
            maxHeight:'80%',
            borderRadius: 8,
            alignItems: 'center',
            backgroundColor: '#fff'
        },
        title: {
            paddingTop: 10,
            paddingBottom: 10
        },
        titleTeam: {
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 120
        },
        titleTeamText: {
            textAlign: 'center',
            fontSize: 15,
            color: '#333'
        },
        titleTeamWrapper: {
            flexDirection: 'row',
            width: '100%'
        },
        vs: {
            paddingRight: 16,
            paddingLeft: 16,
            justifyContent: 'center'
        },
        vsText: {
            color: '#666',
            fontSize: 11
        },
        homeTag: {
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 10,
            color: '#999',
            paddingLeft: 4,
            paddingRight: 4,
            position: 'absolute',
            right: '100%',
            marginRight: 4
        },
        content: {
            width: '100%',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: '#f5f5f5'
        },
        buttons: {
            height: 44,
            width: '100%',
            flexDirection: 'row',
            borderRadius: 8,
            overflow: 'hidden'
        },
        btn: {
            height: 44,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
            borderRightColor: '#e6e6e6'
        },
        noBorderRight: {
            borderRightWidth: 0
        },
        btnText: {
            color: '#999999',
            fontSize: 15
        },
        btnConfirmText: {
            color: '#eb812a'
        }
    };

    /**
     * 渲染标题
     */
    renderTitle() {
        let {title} = this.props;
        if (typeof title === 'object') {
            //TODO 修改组件判断
            if (title.hasOwnProperty('home')) {
                let defConfig = {
                    home: '',
                    away: '',
                    neutral: false
                };
                title = Object.assign(defConfig, title);
                return <View style={this.styles.titleTeamWrapper}>
                    <View style={this.styles.titleTeam}>{title.neutral ? null :
                        <Text style={this.styles.homeTag}>主</Text>}
                        <Text
                            numberOfLines={2}
                            ellipsizeMode='tail'
                            style={this.styles.titleTeamText}>
                            {title.home}
                        </Text>
                    </View>
                    <View style={this.styles.vs}><Text style={this.styles.vsText}>VS</Text></View>
                    <View style={this.styles.titleTeam}>
                        <Text
                            numberOfLines={2}
                            ellipsizeMode='tail'
                            style={this.styles.titleTeamText}>
                            {title.away}
                        </Text>
                    </View>
                </View>
            }
            else {
                return title;
            }
        }
        else {
            return <Text style={[this.props.titleTeamText]}>{title}</Text>
        }
    }

    getButtonOps() {
        return {
            close: this.props.closeDialog
        };
    }

    /**
     * 渲染按钮
     * @param buttonns{Array} 数组格式：{text:String|Component,onPress:Function}
     */
    renderButtons() {
        let {onCancel, onConfirm, cancelBtnText, confirmBtnText, buttons} = this.props;
        let ops = this.getButtonOps();
        if (buttons.length === 0) { // 默认按钮
            return <View style={this.styles.buttons}>
                <TouchableOpacity style={[this.styles.btn]} onPress={() => {
                    onCancel(ops);
                }}>
                    <Text style={this.styles.btnText}>{cancelBtnText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[this.styles.btn, this.styles.noBorderRight]} onPress={() => {
                    onConfirm(ops)
                }}>
                    <Text style={[this.styles.btnText, this.styles.btnConfirmText]}>{confirmBtnText}</Text>
                </TouchableOpacity>
            </View>
        }
        else {
            return <View style={this.styles.buttons}>
                {
                    buttons.map((ele, index) => {
                        return <TouchableOpacity
                            style={[this.styles.btn, index === buttons.length - 1 ? this.styles.noBorderRight : null]}
                            key={index}
                            onPress={() => {
                                ele.onPress(ops);
                            }}>
                            <Text style={[this.styles.btnText]}>{ele.text}</Text>
                        </TouchableOpacity>
                    })
                }
            </View>
        }
    }

    render() {
        let {content, show, otherContent, showOtherContent, maskPress, title, customStyles = {}} = this.props;
        this.styles = StyleSheet.create(_.merge({}, this.stylesObj, customStyles));
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={show}
                onRequestClose={() => {
                }}
            >
                <TouchableWithoutFeedback onPress={maskPress}>
                    <View style={this.styles.mask}>
                        <View style={this.styles.win}>
                            {title !== '' && <View style={this.styles.title}>
                                {
                                    this.renderTitle.call(this)
                                }
                            </View>}
                            <ScrollView style={this.styles.content}>

                                {
                                    content
                                }
                            </ScrollView>
                            <View style={this.styles.buttons}>
                                {
                                    this.renderButtons()
                                }
                            </View>
                        </View>
                        {
                            showOtherContent ? otherContent : null
                        }
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

export default connectReducerComponent(storeKey.COMMON_DIALOG_STORE, reducer, state, action)(CommonDialog);