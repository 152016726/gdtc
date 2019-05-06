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
    ScrollView,
    TouchableOpacity,
    findNodeHandle,
    UIManager
} from 'react-native';
import * as CommonColor from '../../../../../constants/color';
import * as CommonFont from '../../../../../constants/fontSize';
import more from './images/more.png';
import MoreStages from './moreStages';

const LEN = 4 ; // 数组长度大于4时才能有展开,收起功能

export default class Pagination extends Component{

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isMask: false,          // 是否展示遮罩(更多)
            pageY: 0
        };
      }
    
    componentWillMount(){
        const { getStages} = this.props;
        getStages();
    }

    componentWillReceiveProps(nextProps) {
        const {getStages} = this.props;
        if(nextProps.seasonId !== this.props.seasonId){
            // 重新获取赛事阶段信息
            getStages();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.seasonId !== this.props.seasonId || nextProps.defaultStageIndex !== this.props.defaultStageIndex || nextState.isMask !== this.state.isMask || nextProps.stageList !== this.props.stageList){
            return true;
        }else{
            return false;
        }
    }
    
    /**
     * 渲染联赛阶段
     */
    renderItem(){
        const {_clickStage, defaultStageIndex, stageList} = this.props;
        return stageList.map((item, index)=>{
                return <TouchableOpacity
                            key={index}
                            style={styles.items}
                            onPress={()=>_clickStage(item, index)}
                        >
                            <Text style={[styles.itemStyle, defaultStageIndex === index ? {color: CommonColor.contentText} : null]}>
                                {item.stageName}
                            </Text>
                        </TouchableOpacity>
            })
    }

    /**
     * 展开收起遮罩
     */
    toggleMask(){
        const handle = findNodeHandle(this.refs.scroll);
        const {isMask} = this.state;
        UIManager.measure(handle, (x, y, width, height, pageX, pageY)=> {
            this.setState({
                pageY,
                isMask: !isMask
            })
        });
    }

    render(){
        const {isMask, pageY} = this.state;
        const {_clickStage, stageList} = this.props;
        // 联赛阶段更多配置项
        let conf = {
            arr: stageList,
            show: isMask,
            maskPress: ()=> this.toggleMask(),
            itemClick: (id, index)=>{
                _clickStage(id, index);
                this.toggleMask()
            }
        };
        return (
            <View>
                <ScrollView
                    ref="scroll"
                    style={styles.scrollViewStyle}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {this.renderItem()}
                </ScrollView>
                {
                    stageList.length > LEN && <TouchableOpacity
                                        style={styles.more}
                                        activeOpacity={1}
                                        onPress={()=> this.toggleMask()}
                                    >
                                        <Text style={styles.moreText}>更多</Text>
                                        <Image source={more}
                                               style={styles.moreIcon}
                                               resizeMode={'contain'}>
                                        </Image>
                                    </TouchableOpacity>
                }
                <MoreStages {...conf} pageY={pageY}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollViewStyle:{
        backgroundColor: CommonColor.BgColorWhite
    },
    items:{
        height: 40,
        justifyContent:'center',
        alignItems:'center'
    },
    itemStyle:{
        paddingHorizontal: 14,
        fontSize: CommonFont.FONT_14,
        color: CommonColor.tipsTextGrey
    },
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
    },
    more:{
        position: 'absolute',
        top: 2,
        right: 0,
        height: 36,
        width: 64,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        borderLeftWidth: 2,
        borderLeftColor: CommonColor.headerBorderColor,
        backgroundColor: CommonColor.BgColorWhite
    },
    moreText:{
        fontSize: CommonFont.FONT_12,
        color: CommonColor.SelfOrange
    },
    moreIcon:{
        marginLeft: 3,
        width: 13,
        height: 13
    }
});