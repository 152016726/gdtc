/**
 * Created by mac-ddt on 2017/6/20.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ListView,
    Dimensions,
    Image
} from 'react-native';
import * as fontSize from '../../constants/fontSize'
import * as color from '../../constants/color'

export default class DrawerView extends Component {

    _renderRow(rowData,sectionID,rowID){
        const {popScreen,closeDrawer} = this.props;
        let onPress;
        switch (rowData){
            case '首页' :
                onPress = ()=>{popScreen('Navigation/BACK')};
                break;
            case '选号投注' :
                break;
            case '玩法介绍' :
                break;
            case '投注记录' :
                onPress = ()=>{
                    popScreen('Navigation/BACK');
                    popScreen('Navigation/NAVIGATE','PurchaseRecord');
                };
                break;
            case '开奖信息' :
                onPress = ()=>{popScreen('Navigation/NAVIGATE','LotteryNotice')};
                break;
            default:
                break;
        }
        return(
            <TouchableOpacity style={styles.btn}
                              onPress={()=>{
                                        closeDrawer();
                                        onPress&&onPress();
                              }}
            >
                {rowID=='0'?
                <Image style={styles.btnImg} resizeMode="contain" source={require('../../images/list_gohome.png')}/>:
                <Image style={styles.pointImg} resizeMode="stretch" source={require('../../images/list_point.png')}/>}
                <Text style={styles.txt}>{rowData}</Text>
                <View style={styles.line}/>
            </TouchableOpacity>
        )
    }
    render(){
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        let dataSource = ds.cloneWithRows(['首页','选号投注','玩法介绍','投注记录','开奖信息']);
        return(
            <View style={{flex:1,backgroundColor:color.KBackgroundColor,justifyContent:'center'}}>
                <ListView bounces={false}
                          style={styles.list}
                          initialListSize={10}
                          enableEmptySections={true}
                          dataSource={dataSource}
                          removeClippedSubviews={false}
                          renderRow={this._renderRow.bind(this)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    list:{
        marginLeft:20,
        marginTop:20,
    },
    btn:{
        height:44,
        flex:1,
        flexDirection:'row',
        alignItems:'center'
    },
    btnImg:{
        width:24,
        height:24,
        margin:3,
    },
    pointImg:{
        width:2,
        height:2,
        margin:3,
    },
    txt:{
        textAlign:'center',
        backgroundColor:'transparent',
        fontSize:fontSize.FONT_M,
        color:color.KBlackFontColor
    },
    line:{
        position:'absolute',
        bottom:0,
        height:1,
        backgroundColor:color.KGrayLineColor,
        width:Dimensions.get('window').width,
    }

});