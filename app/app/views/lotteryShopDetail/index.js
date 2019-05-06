/**
 * Created by marcus on 2018/11/26.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList
} from 'react-native';
import {connectReducerComponent} from "../../reduxCfg";
import * as storeKey from "../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import * as CommonColor from '../../constants/color';
import * as CommonFont from '../../constants/fontSize';
import ShopInfo from './components/shopInfo';
import PersonInfo from './components/personInfo';
import Headerleft from '../../components/headerLeft';
import left from './images/moreLeft.png';
import right from './images/moreRight.png';

class LotteryShopDetail extends Component{

    static navigationOptions = ({navigation})=>{
        const {handleGoBack = null,title} = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        return {title, headerLeft}
    };

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            item:{}
        };
      }

    componentWillMount() {
        let {item} = this.props.navigation.state.params || {};
        const {navigation} = this.props;
        navigation.setParams({
            title: '彩店详情',
            handleGoBack: ()=>{navigation.goBack()}
        });
        if(item){
            this.setState({
                item
            })
        }
    }

    render(){
        const {item} = this.state;
        const {dotNumer, address, distance='', maxBonus, contact, phone, codeImg} = item;
        return(
            <View style={styles.box}>
                <ShopInfo
                    address={address}
                    dotNumer={dotNumer}
                    distance={distance}
                    maxBonus={maxBonus}/>
                <View style={styles.division}>
                    <Image
                        source={left}
                        style={styles.divisionImg}
                        resizeMode={'contain'}/>
                    <Text style={styles.divisionText}>更多信息</Text>
                    <Image
                        source={right}
                        style={styles.divisionImg}
                        resizeMode={'contain'}/>
                </View>
                <PersonInfo
                    contact={contact}
                    phone={phone}
                    codeImg={codeImg}/>
            </View>
        )
    }
}

export default connectReducerComponent(storeKey.LOTTERY_SHOP_DETAIL_STORE, reducer, state, action)(LotteryShopDetail);

const styles = StyleSheet.create({
    box:{
        flex: 1,
        backgroundColor: CommonColor.BgColor,
        alignItems: "center"
    },
    division:{
        height: 48,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    divisionImg:{
        width: 30,
        height: 10
    },
    divisionText:{
        marginHorizontal: 20,
        fontSize: CommonFont.FONT_16,
        color: CommonColor.SelfSuccessTextColor
    }
});