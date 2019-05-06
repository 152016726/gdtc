import Vue from 'vue';
import template from './index.template'
import './index.scss'
import pushClient from '@easylotto/push_client'
import util from '@easylotto/util'
import LiveItem from './components/liveItem'

let off = null;
let timer = null;
let LiveWords = Vue.component('live-words-vue', {
    props: {
        infoList: {
            default: Array       //文字直播列表
        },
        isLiveWords: {
            default: Boolean    //是否有文字直播
        }
    },
    template: template,
    /**
     * 页面加载完成
     */
    created() {
        this.bindLiveInfoUpdate();
    },
    mounted() {
        /*   //TEST CODE
           let count = 0;
           timer = setInterval(() => {
               count += 5;
               this.onEventTextUpdate({
                   text: '欢迎来到广东竞彩网的直播间',
                   time: count
               })
           }, 5000)*/
    },
    updated() {
        // console.log('updated....')
    },
    watch: {
        isLiveWords() {
            return this.infoList.length > 0
        },
        vid(val) {
            this.vid = val;
        }
    },
    /**
     * 组件销毁解绑push
     */
    destroyed() {
        off && off();
        // timer && clearInterval(timer);
    },
    methods: {
        /**
         * 绑定push更新
         */
        bindLiveInfoUpdate() {
            const {vid} = util.getUrlVars();
            // console.log(vid);
            off = pushClient.onEventTextUpdate( vid || '', this.onEventTextUpdate.bind(this))
        },
        /**
         * 更新视图
         * @param data
         */
        onEventTextUpdate(data) {
            let now = new Date();
            let min = now.getMinutes();
            let hours = now.getHours();
            min = min < 10 ? '0' + min : min;
            let newObj = {
                text: data.text,
                time: Math.ceil(data.time / 60),
                sysTime: `${hours}:${min}`
            };
            // console.log(newObj);
            this.infoList.unshift(newObj);
        }
    }
});

module.exports = LiveWords;