/**
 * Created by easyLottoMac on 2018/11/15.
 */
import './style.scss';
import '../../common/js/common';
import 'plugin/swiper/css/swiper.css';
import shopInformation from './shopInformation';
import store from '@easylotto/store';
import {DOT_INFO} from 'constants/localStoreKeys';

window.onload = function () {
    init();

    function init() {
        // let userInfo = {
        //     dotNumer: '01323',
        //     address: '天河区中山大道五六七信街道宛道宛道宛溪df新村门门门面房20号',
        //     phone: '020-87654321',
        //     starLevel: '5',
        //     contact: '刘先生',
        //     maxBonus: '1000万',
        //     qrCode: 'http://localhost:3003/pages/SMGShopDetails/images/codeImg.png',
        //     pictures: [
        //         'http://localhost:3003/pages/SMGShopDetails/images/bigImage.png',
        //         'http://localhost:3003/pages/SMGShopDetails/images/bigImage_1.jpg',
        //         'http://localhost:3003/pages/SMGShopDetails/images/bigImage_2.jpg',
        //         'http://localhost:3003/pages/SMGShopDetails/images/bigImage_3.jpg',
        //         'http://localhost:3003/pages/SMGShopDetails/images/bigImage_4.jpg',
        //         'http://localhost:3003/pages/SMGShopDetails/images/bigImage.png',
        //     ]
        // };
        // // 将数据写进 localStorage 里面
        // store.set(DOT_INFO, userInfo);
        shopInformation.render('#SMGContainer')
    }
};

