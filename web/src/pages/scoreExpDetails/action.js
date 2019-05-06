/**
 * Created by Administrator on 2017/12/13.
 */
import './style.scss';
import 'babel-polyfill';
import Vue from 'vue';
import '../../component/scoreDetailsHeader';
import '../../component/exponent/detail/common';
import util from '@easylotto/util';


window.onload = function () {
    let {vid, cid, type, home, away, cname} = util.getUrlVars();
    home = decodeURI(home);
    away = decodeURI(away);
    cname = decodeURI(cname);
    new Vue({
        el: '#root',
        data: {
            vid,
            cid,
            type,
            home,
            away,
            cname
        }
    });
};



