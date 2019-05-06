import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
const Logo = require('../../../images/icon_jingzu.png');
const deleteIcon = require('../../../images/delete_icon.png');

export default class attentionItem extends Component {
    static defaultProps = {
        item : {},
        index : 0,
        handleGoToDetail : () => {
        },
        handleCancel : () => {
        },
        handleAttention : () => {
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            isAttention : true
        };
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.item !== this.props.item){
            this.setState({
                isAttention: true
            })
        }
    }

    render() {
        const { handleGoToDetail, handleCancel, handleAttention, item, index } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.headView}>
                    <Image style={styles.logo} source={{ uri : item.webApiPath+item.icon }}/>
                </View>
                <TouchableOpacity style={styles.contentBox} onPress={handleGoToDetail}>
                    <Text style={styles.nameText}>{item.nickname}</Text>
                    <Text style={styles.fansNum}>粉丝数:{item.attentionNumber}</Text>
                    <Text style={styles.address}>{item.summary}</Text>
                </TouchableOpacity>
                {this.state.isAttention ? <TouchableOpacity
                    style={styles.addedAttention}
                    onPress={
                        () => {
                            handleCancel();
                            this.setState({ isAttention : false })
                        }}
                >
                    <Text style={styles.addedText}>已关注</Text>
                </TouchableOpacity> :
                    <TouchableOpacity
                    style={styles.addAttention}
                    onPress={() => {
                        handleAttention();
                        this.setState({ isAttention : true })
                    }}>
                    <Text style={styles.addText}>+ 关注</Text>
                </TouchableOpacity>
                }
            </View> );
    }
}
const styles = StyleSheet.create({
    headView:{
        height : 68,
        width : 68,
        marginTop:10,
        marginLeft:10
    },
    container : {
        flex : 1,
        height : 90,
        backgroundColor : '#FFFFFF',
        flexDirection : 'row'
    },
    logo : {
        flex : 1,
        backgroundColor : '#FFFFFF',
        height : 68,
        width : 68,
        borderRadius : 34,
        overflow : 'hidden',
    },
    contentBox : {
        flex : 3,
        flexDirection : 'column',
        marginTop : 11,
        marginLeft : 10,
        marginBottom : 15
    },
    nameText : {
        color : '#333333',
        marginBottom : 5,
        fontSize : 16,
        fontFamily : 'PingFangSC-Medium'
    },
    fansNum : {
        color : '#666666',
        marginBottom : 3,
        fontSize : 14,
        fontFamily : 'PingFangSC-Regular'
    },
    address : {
        color : '#999999',
        marginBottom : 8,
        fontSize : 14,
        fontFamily : 'PingFangSC-Regular'
    },
    addAttention : {
        justifyContent : 'center',
        alignContent : 'center',
        flex : 1,
        marginTop : 15,
        marginRight : 10,
        backgroundColor : '#EB812A',
        height : 24,
        width : 61,
        borderRadius : 12
    },
    addText : {
        textAlign : 'center',
        color : '#FFFFFF',
        fontSize : 14,
        fontFamily : 'PingFangSC-Regular'
    },
    addedAttention : {
        justifyContent : 'center',
        alignContent : 'center',
        flex : 1,
        marginTop : 15,
        marginRight : 10,
        backgroundColor : '#FFFFFF',
        borderWidth : 1,
        borderColor : '#EB812A',
        height : 24,
        width : 61,
        borderRadius : 12
    },
    addedText : {
        textAlign : 'center',
        color : '#EB812A',
        fontSize : 14,
        fontFamily : 'PingFangSC-Regular'
    }
});