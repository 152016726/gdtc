import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Utils from '../../../common/js/util';
import { FONT_9, FONT_10, FONT_11, FONT_12, FONT_13, FONT_14 } from '../../../constants/fontSize';
import AttentionDataManager from '../../../dataManager/attentionDataManager';
import ActionProgressDialog from '../../../components/actionProgressDialog';

const yellowStar = require('../../../images/score_Yellow_Star.png');
const grayStar = require('../../../images/score_Gray_Star.png');

let _arrWeekCn = [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六',
];

export default class MatchFavourite extends Component {
    static defaultProps = {
        tabIndex : 0,  //默认tabPageIndex
        item : {},
        index : 0,
        updateAddAttention:()=>{}
    };

    constructor(props) {
        super(props);
        this.state = {
            isFavourite : this.props.item.isFavourite,
            week : '',
            number : ''
        }
    }

    componentWillMount() {
        const { item } = this.props;
        let weekCode = parseInt(item.completeNo.substr(item.completeNo.length - 4, 1), 10);    // 赛事所属周几
        let week = _arrWeekCn[weekCode];
        this.setState({
            week : week,
            number : item.completeNo.slice(9)
        });
    }

    componentWillReceiveProps(nextProps) {
        const { item, tabIndex, index } = this.props;
        if (nextProps.item !== item) {
            this.setState({ isFavourite : nextProps.item.isFavourite
            });
        }
    }

    render() {
        const { item, tabIndex, index } = this.props;
        return (
            <TouchableOpacity style={styles.container}
                              onPress={() => {
                                  tabIndex === 1 ? () => {
                                  } : this.handleAttentionMatch(item);
                              }}>
                <View style={styles.leftFirstBox}>
                    <Text style={[ styles.leftFirstTitle, { color : '#' + item.leagueColor } ]}>{item.leagueShortName}</Text>
                    <Text style={styles.leftFirstTime}>{item.vsDate.slice(10, 16)}</Text>
                </View>
                <View style={styles.leftStarBox}>
                    {tabIndex === 1 ? <View /> : <Image style={styles.leftStarSize} source={this.state.isFavourite ? yellowStar : grayStar}/>}
                </View>
                <View style={styles.leftDateBox}>
                    <Text style={styles.leftDate}>{_arrWeekCn[parseInt(item.completeNo.substr(item.completeNo.length - 4, 1), 10)] + item.completeNo.slice(9)}</Text>
                </View>
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}/>
            </TouchableOpacity>
        );
    }

    /**
     * 收藏按钮
     * @param item 赛事信息
     */
    handleAttentionMatch() {
        const { item, handleAttentionDataLenth, updateAddAttention } = this.props;
        if (this.state.isFavourite) {
            //删除
            // AttentionDataManager.put(item, false);
            updateAddAttention(item.vid,false);
            this.progressDialog.toast('已取消关注');
            this.setState({ isFavourite : false });
        } else {
            //收藏
            // AttentionDataManager.put(item, true);
            updateAddAttention(item.vid,true);
            this.progressDialog.toast('关注成功');
            this.setState({ isFavourite : true });
        }
        //更新关注提示数量
        handleAttentionDataLenth(this.state.isFavourite);
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1.8,
    },
    leftFirstBox : {
        marginTop : 5,
        flexDirection : 'row',
        flex : 3,
        alignItems : 'center',
        justifyContent : 'space-between'
    },
    leftFirstTitle : {
        fontFamily : 'PingFang-SC-Regular',
        fontSize : FONT_11,
        marginLeft : 10
    },
    leftFirstTime : {
        fontFamily : 'PingFang-SC-Regular',
        fontSize : FONT_11,
        color : '#AAAAAA',
    },
    leftStarBox : {
        flex : 3,
        top : 5,
        marginLeft : 20
    },
    leftStarSize : {
        height : 18,
        width : 18
    },
    leftDateBox : {
        flex : 3,
        marginLeft : 10,
        marginBottom : 5,
        justifyContent : 'flex-end'
    },
    leftDate : {
        fontFamily : 'PingFang-SC-Regular',
        fontSize : FONT_10,
        color : '#AAAAAA'
    }
});