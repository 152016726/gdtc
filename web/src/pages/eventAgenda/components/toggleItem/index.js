import './index.scss';
import Vue from 'vue';
import template from './index.template';
import unfold from '../../images/unfold.png';
import fold from '../../images/fold.png';
import getLeaguesService from 'services/getLeagues';

module.exports = Vue.component('toggle-item', {
    data() {
        return {
            subList: [],                 // 联赛列表
            unfold,                      // 展开
            fold,                        // 闭合
            isFold: false                // 是否闭合
        }
    },
    props: {
        fid: {default: ""},                  // 默认的一级ID
        sid: {default: ""},                  // 默认的二级ID
        lid: {default: ""},                  // 默认的三级ID
        event: {default: {id: '', name: ''}}
    },
    template,
    methods: {
        /**
         * 更改默认展示的二级列表id(sid)
         */
        getSubList() {
            this.isFold = !this.isFold;
            if (this.isFold) {
                this.$emit('setDefaultSid', this.event.id);
            }
        },
        /**
         * 设置默认选中的联赛
         * @param item
         */
        setDefaultInfo(item) {
            this.$emit('setDefaultInfo',item);
        }
    },
    mounted() {
        if (this.sid === this.event.id) {
            this.isFold = true;
        }
    },
    created() {
        getLeaguesService.getData({
            "fid": this.fid,
            "sid": this.event.id
        }).then(rsp => {
            this.subList = rsp.data.list;
        }, rej => {
            console.log(rej.rspMsg);
        })
    }
});