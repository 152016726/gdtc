/**
 * Created by mac-ddt on 2017/6/7.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';
import Screen from '../../modules/screen'
import * as KFontSize from '../../constants/fontSize';
import Account from '#/account';

export default class TabBar extends Component {

    render() {
        const {navigation} = this.props;
        const {index} = navigation.state;
        // console.log(navigation.state);
        let routeName;
        switch (index) {
            case 0:
                routeName = 'Home';
                break;
            case 1:
                routeName = 'Score';
                break;
            case 2:
                routeName = 'ExpertHome';
                break;
            case 3:
                routeName = 'Personal';
                break;
            default:
                routeName = false;
                break;
        }

        return (
            <View style={styles.container}>
                <Button navigation={navigation} curRoute={routeName} route='Home' title="首页"
                        uri={require('../images/home_icon_no_select.png')}
                        selectedUri={require('../images/icon_home_selected.png')}/>
                <Button navigation={navigation} curRoute={routeName} route='Score' title="比分"
                        uri={require('../images/icon_score_unselected.png')}
                        selectedUri={require('../images/icon_score_selected.png')}/>
                <Button navigation={navigation} curRoute={routeName} route='ExpertHome' title="晒单"
                        uri={require('../images/expert_no_select.png')}
                        selectedUri={require('../images/expert_select.png')}/>
                <Button navigation={navigation} curRoute={routeName} route='Personal' title="我的"
                        uri={require('../images/myIcon_no_select.png')}
                        selectedUri={require('../images/myIcon_select.png')}/>
            </View>
        )
    }
}

class Button extends Component {
    _onPress() {
        const {route, navigation} = this.props;
        const {loginStatus = 0} = Account.getAccountInfo() || {};
        // 如果是未登陆的时候点击晒单页面则强制性跳至登陆页
        if(route === 'ExpertHome' && !loginStatus) {
            navigation.navigate('Login', {fromView: 'ExpertHome'});
            return;
        }
        navigation.navigate(route);
    }

    render() {
        const {curRoute, route, uri, selectedUri, title} = this.props;
        const selected = (curRoute === route);
        return (
            <TouchableOpacity style={{flex: 1}} onPress={this._onPress.bind(this)}>
                <View style={styles.button}>
                    <Image resizeMode="contain" style={styles.icon} source={selected ? selectedUri : uri}/>
                    <Text style={selected ? styles.label : styles.label02}>{title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        width: Screen.width,
        height: 49,
        flexDirection: 'row',
        alignItems: 'stretch',
        shadowColor: '#b2b2b2',
        shadowOffset: {
            width: 1,
            height: 0
        },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 4
    },
    button: {
        backgroundColor: 'transparent',
        width: Screen.width / 5,
        height: 49,
        justifyContent: 'space-around',
        alignItems: 'stretch'
    },
    icon: {
        marginTop: 2,
        height: 23,
        width: Screen.width / 5,
        alignSelf: 'stretch'
    },
    label: {
        marginBottom: 2,
        textAlign: 'center',
        color: '#eb812b',
        fontSize: KFontSize.FONT_10
    },
    label02: {
        marginBottom: 2,
        textAlign: 'center',
        color: '#a8a8a8',
        fontSize: KFontSize.FONT_10
    }
})