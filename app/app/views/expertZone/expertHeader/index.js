/**
 * Created by marcus on 2019/1/2.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import avatar from './images/avatar.png';
import release from './images/release.png';
import together from './images/together.png';
import * as CommonColor from '~/constants/color';
import * as CommonFont from '~/constants/fontSize';
import getExpertHandleInterestedExperts from '~/services/getExpertHandleInterestedExperts';
import Account from '#/account';

const rowWidth = Dimensions.get('window').width-40;

export default class ExpertHeader extends Component{
    static defaultProps = {
        isAttention: false,                // 关注状态
        lid: '',                           // 专家id
        uri: '',                           // 头像图片地址
        name: '',                          // 用户昵称
        attentionNumber: '',               // 粉丝数
        summary: ''                        // 简介
    };

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isAttention: props.isAttention
        };
      }

      componentWillMount(){
          const {isAttention} = this.props;
          this.setState({
              isAttention: isAttention === 'true'
          })
      }

    componentWillReceiveProps(nextProps){
        if(nextProps.isAttention !== this.props.isAttention){
            this.setState({
                isAttention: nextProps.isAttention === 'true'
            })
        }
    }

    /**
     * toggle关注状态
     */
    focusTouched(){
        getExpertHandleInterestedExperts.getData({
            eid: this.props.lid,
            isAttention: !this.state.isAttention
        }).then(rsp=> {
            const {attentionNumber}=Account.getAccountInfo();
            if(this.state.isAttention){
                Account.updateAccountInfo({
                    attentionNumber: +attentionNumber - 1
                });
                this.props.updatePersonal({
                    attentionNumber: +attentionNumber - 1
                });
            }else{
                Account.updateAccountInfo({
                    attentionNumber: +attentionNumber + 1
                });
                this.props.updatePersonal({
                    attentionNumber: +attentionNumber + 1
                });
            }
            this.setState({
                isAttention: !this.state.isAttention
            })
        }, rej=> {
            console.log(rej.rspMsg);
            if(rej.rspMsg === 'logout'){
                this.props.navigation.navigate('Login')
            }
        })
    }

    /**
     * 关注的View
     * @returns {XML}
     */
    focusedView(){
        const {isAttention} = this.state;
        return (
            <TouchableOpacity
                style={[styles.self, isAttention ? styles.isFoucusedBg : null]}
                activeOpacity={1}
                onPress={() => this.focusTouched()}>
                <Text style={[styles.edit, isAttention ? styles.isAttentionFont : null]}>
                    {isAttention ? '已关注' : '关注 +'}
                </Text>
            </TouchableOpacity>
        )
    }

    render(){
        const {lid, id, uri, webApiPath, name, attentionNumber, summary} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.avatarView}>
                        <Image
                            source={ uri ? {uri: webApiPath+uri} : avatar}
                            style={styles.avatar}
                            resizeMode="cover"/>
                    </View>
                    <View style={styles.info}>
                        <View style={styles.marginView}>
                            <Text style={styles.name}>{name}</Text>
                        </View>
                        <View style={styles.marginView}>
                            <Text style={styles.fans}>
                                关注数:
                            </Text>
                            <Text style={styles.fans}>
                                {attentionNumber}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.selfView}>
                        {id === lid ? null : this.focusedView()}
                    </View>
                </View>
                <View style={styles.introduceView}>
                    <Text style={styles.fans}>
                        简介:
                    </Text>
                    <Text style={[styles.fans, {marginRight: 30}]}>
                        {summary}
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        paddingVertical: 15,
        marginBottom: 10,
        backgroundColor: CommonColor.BgColorWhite,
        justifyContent:'center',
        alignItems: "center"
    },
    content:{
        flexDirection: 'row',
        width: rowWidth,
        justifyContent: 'center',
        alignItems: "center"
    },
    avatarView:{
        width: 64,
        height: 64,
        marginRight: 9,
        justifyContent:'center',
        alignItems: "center"
    },
    avatar:{
        width: 62,
        height: 62,
        borderRadius: 31,
        borderWidth: 1,
        borderColor: '#F2F2F2',
    },
    info:{
        flex: 80,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    selfView:{
        flex: 20,
        height: 24
    },
    self:{
        height: 24,
        borderRadius: 12,
        backgroundColor: CommonColor.MainColor,
        borderWidth: 1,
        borderColor: CommonColor.MainColor,
        justifyContent:'center',
        alignItems: "center"
    },
    nameStyle:{
        flexDirection:'row',
        alignItems: "center"
    },
    name:{
        color: CommonColor.contentText,
        fontSize: CommonFont.FONT_16
    },
    marginView:{
        marginTop: 12,
        flexDirection:'row'
    },
    fans:{
        color: CommonColor.contentText,
        fontSize: CommonFont.FONT_14
    },
    edit:{
        color: CommonColor.SelfWhite,
        fontSize: CommonFont.FONT_14
    },
    introduceView:{
        flexDirection: 'row',
        width: rowWidth,
        marginTop: 15,
        marginBottom: 18
    },
    isFoucusedBg:{
        backgroundColor: CommonColor.BgColorWhite
    },
    isAttentionFont:{
        color: CommonColor.MainColor
    },
    iconStyle:{
        width: 22,
        height: 12
    },
    icon:{
        width: 11,
        height: 6
    }
});