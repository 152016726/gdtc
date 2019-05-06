/**
 * Created by liuhaifeng on 16/8/10.
 */
import {
    Platform,
    Dimensions,
    PixelRatio
} from 'react-native'
// import Dimensions from 'Dimensions'//ReactDimensions
// import PixelRatio from 'PixelRatio'//ReactPixelRatio

export let width;   //屏幕宽
export let height;  //屏幕高度
export let ratio;   //像素比例
export let land = false;  //是否横屏

// iPhoneX Xs
const X_WIDTH = 375;
const X_HEIGHT = 812;

// iPhoneXR XsMax
const XR_WIDTH = 414;
const XR_HEIGHT = 896;

// screen
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ANDROID_NAV_H = 20; //安卓导航栏高
const IPHONEX_TAB_H = 34; //苹果下巴高

export default {
    init(isLand) {
            land = isLand;
            width = SCREEN_WIDTH;
            if(Platform.OS !== 'ios'){
                height = SCREEN_HEIGHT-ANDROID_NAV_H;
            }else{
                height = this.isIphoneX() || this.isIphoneXR() ? SCREEN_HEIGHT - IPHONEX_TAB_H : SCREEN_HEIGHT;
            }
            ratio = PixelRatio.get() / 2;

    },
    //判断是否为iphoneX或Xs
    isIphoneX() {
        return (
            Platform.OS === 'ios' &&
            ((SCREEN_HEIGHT === X_HEIGHT && SCREEN_WIDTH === X_WIDTH) ||
            (SCREEN_HEIGHT === X_WIDTH && SCREEN_WIDTH === X_HEIGHT))
        );
    },
    //判断是否为iphoneXR或XsMAX
    isIphoneXR() {
        return (
            Platform.OS === 'ios' &&
            ((SCREEN_HEIGHT === XR_HEIGHT && SCREEN_WIDTH === XR_WIDTH) ||
            (SCREEN_HEIGHT === XR_WIDTH && SCREEN_WIDTH === XR_HEIGHT))
        );
    },
    setHeight(h) {
        height = h;
    },
    setWidth(w) {
        width = w;
    },
    getHeight(){
        return height;
    },
    getWidth(){
        return width;
    }

}