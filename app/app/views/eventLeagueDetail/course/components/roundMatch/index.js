/**
 * Created by marcus on 2018/12/13.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import * as CommonColor from '../../../../../constants/color';
import * as CommonFont from '../../../../../constants/fontSize';
import up from './images/up.png';
import down from './images/down.png';

const LEN = 4 ; // 数组长度大于4时才能有展开,收起功能

export default class RoundMatch extends Component{
   
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isGroup: false        // 是否展开收起
        };
    }

    componentWillMount() {
        const {getRoundsInfo} = this.props;
        getRoundsInfo();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.stageId !== this.props.stageId || nextProps.defaultGroupIndex !== this.props.defaultGroupIndex|| nextState.isGroup !== this.state.isGroup || nextState.staticGroupIndex !== this.props.staticGroupIndex){
            return true;
        }else{
            return false;
        }
    }
    componentWillReceiveProps(nextProps) {
        const {getRoundsInfo} = this.props;
        if(nextProps.stageId !== this.props.stageId){
            // 初始化赛事阶段信息
            getRoundsInfo();
        }
    }

    /**
     * 渲染轮次或者分组
     */
    renderGroup(){
        const {isGroup} = this.state;
        const {_clickGroup, defaultGroupIndex, groupList, staticGroupIndex} = this.props;
        let arr;
        // 轮次或者分组的长度大于LEN则有展开收起的状态栏
        if(groupList.length > LEN){
            arr = isGroup ? groupList : groupList.slice(0,LEN);
        }else{
            arr = groupList;
        }

        return arr.map((item, index)=>{
            return <View style={styles.groups} key={index}>
                <TouchableOpacity
                    style={[
                                styles.groupStyle,
                                defaultGroupIndex === index ? {borderColor: CommonColor.SelfOrange} : null]}
                    onPress={()=> _clickGroup(item, index)}
                >
                    <Text style={[
                                styles.groupFont,
                                staticGroupIndex < index ? {color: CommonColor.ShadowGrey} : null,
                                defaultGroupIndex === index ? {color: CommonColor.SelfOrange} : null,
                                staticGroupIndex > index ? {color: CommonColor.contentText} : null
                                ]}
                    >
                        {item.roundName}
                    </Text>
                </TouchableOpacity>
            </View>
        })
    }

    /**
     * 如果是轮次则在后加上'轮'字
     */
    changeText(str){
        return (+str)-0 >= 0 ? str+'轮' : str;
    }

    /**
     * 展开收起分组
     */
    toggleGroups(){
        const {isGroup} = this.state;
        this.setState({
            isGroup: !isGroup
        })
    }
    
    render(){
        const {isGroup} = this.state;
        const {groupList, defaultGroupIndex} = this.props;
        return(
            <View style={styles.content} >
                <View style={styles.groupTitle}>
                    <Text style={styles.titleFont}>
                        进行到{(groupList.length >0 && groupList[defaultGroupIndex]) ? this.changeText(groupList[defaultGroupIndex].roundName) : '-'}
                    </Text>
                </View>
                <View style={styles.groupContent}>
                    { this.renderGroup() }
                </View>
                {
                    groupList.length > LEN && <TouchableOpacity
                        style={styles.touchIcon}
                        onPress={this.toggleGroups.bind(this)}
                    >
                        <Text style={styles.iconText}>
                            {isGroup ? '收起' : '展开'}
                        </Text>
                        <Image
                            source={isGroup ? up : down}
                            style={styles.icon}
                            resizeMode={'contain'}
                        >
                        </Image>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content:{
        backgroundColor: CommonColor.BgColor,
        borderBottomWidth: 1,
        borderBottomColor: CommonColor.BorderColor
    },
    groupTitle:{
        height: 35,
        justifyContent: 'center',
        paddingHorizontal: 12
    },
    titleFont:{
        fontSize: CommonFont.FONT_13,
        color: CommonColor.tipsTextGrey
    },
    groupContent:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 5
    },
    groups:{
        width: '25%',
        padding: 5
    },
    groupStyle:{
        height: 36,
        justifyContent:'center',
        alignItems:'center',
        borderWidth: 1,
        borderColor: CommonColor.BorderColor,
        backgroundColor: CommonColor.BgColorWhite
    },
    groupFont:{
        fontSize: CommonFont.FONT_14,
        color: CommonColor.flatColor
    },
    touchIcon:{
        height: 35,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
    },
    iconText:{
        fontSize: CommonFont.FONT_13,
        color: CommonColor.NotStartMatchColor
    },
    icon:{
        marginLeft: 6,
        width: 12,
        height: 7
    }
});