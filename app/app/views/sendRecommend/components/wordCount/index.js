import React, {Component} from 'react'
import {
    StyleSheet,
    Text
} from 'react-native';
import * as FontSize from '~/constants/fontSize';
import * as ColorConf from '~/constants/color';

export default class WordCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            max: props.max
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.text !== this.state.text) {
            this.setState({
                text: nextProps.text
            });
        }
    }

    render() {
        let {text, max} = this.state;
        return <Text style={styles.countText}>{max - text.length}</Text>
    }
}

const styles = StyleSheet.create({
    countText: {
        fontSize: FontSize.FONT_12,
        color: ColorConf.ShadowGrey
    }
});