/**
 * Created by marcus on 2018/12/3.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    ListView
} from 'react-native';
import * as CommonColor from '../../../../../../constants/color';
import * as CommonFont from '../../../../../../constants/fontSize';

export default class SectionStatus extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            type: '',
            txt: '-'
        };
      }

    componentWillMount() {
        const {status} = this.props;
        if(status === 1){
            this.setState({
                type: 1,
                txt: '未'
            });
        }else if(status === 2){
            this.setState({
                type: 2,
                txt: '完'
            });
        }else if(status === 3){
            this.setState({
                type: 3,
                txt: '走'
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const {status} = nextProps;
        if(status === 1){
            this.setState({
                type: 1,
                txt: '未'
            });
        }else if(status === 2){
            this.setState({
                type: 2,
                txt: '完'
            });
        }else if(status === 3){
            this.setState({
                type: 3,
                txt: '走'
            });
        }
    }
    
    render(){
        const {txt, type} = this.state;
        return (
            <Text style={type === 2 ? styles.final : styles.notStart }>
                {txt}
            </Text>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentTxt:{
        fontSize: CommonFont.FONT_14,
        color: CommonColor.playIntroduceContent,
        backgroundColor:'transparent'
    },
    final:{
        color:CommonColor.FinalMatchColor
    },
    notStart:{
        color:CommonColor.NotStartMatchColor
    }
});