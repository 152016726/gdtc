import Vue from 'vue';
import template from './index.template';
import './index.scss';
import {
    SUBSTITUTION_OF_PLAYERS,
    FULL_TIME_END
} from 'constants/matchEventType';
import typeImageMap from '../../typeImageMap';

let EventTimeSide = Vue.component('event-time-side', {
    data() {
        return {
            arrShow: ['showEvent', 'time', 'blank'],    // 显示class样式排序，控制主客显示逻辑
            objImg: {},
            subPlaysType: SUBSTITUTION_OF_PLAYERS       // 换人对应类别
        }
    },
    props: {
        time: {
            default: '0\''  // 发生时间
        },
        type: {
            default: ''     // 事件类别
        },
        isHome: {           // 是否主队
            default: false
        },
        person1: {          // 触发事件人
            default: ''
        },
        person2: {          // 接收事件人
            default: ''
        }
    },
    template: template,
    /**
     * 页面加载完成
     */
    created() {
        // 客时间反向输出
        if(!this.isHome){
            this.arrShow = this.arrShow.reverse();
        }
        this.objImg = typeImageMap[this.type];
    }
});

module.exports = EventTimeSide;