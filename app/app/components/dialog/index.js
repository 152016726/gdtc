
import React, { Component } from 'react';
import { Modal, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

export default class Dialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : false
        };
    }

    renderContent() {
        console.warn('子类请重写 "renderContent" 方法');
    }

    render() {
        let { animationType, contentStyle, closeOnTouchOutside = true } = this.props;
        return (
            <Modal
                visible={this.state.visible}
                transparent={true}
                animationType={animationType || "fade"}
                onRequestClose={() => false}>
                <TouchableWithoutFeedback onPress={closeOnTouchOutside ? this.dismiss.bind(this) : null}>
                    <View style={[ styles.container, contentStyle ]}>
                        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                            {this.renderContent()}
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    show() {
        this.setState({ visible : true });
    }

    dismiss() {
        this.setState({ visible : false });
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'rgba(0,0,0,0.4)',
        padding : 24,
        justifyContent : 'center',
    }
});

