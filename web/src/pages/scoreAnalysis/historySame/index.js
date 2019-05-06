/**
 * 相同历史亚赔模块
 * Created by easyLottoMac on 2018/12/5.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../component/subTitleView';
import '../component/teamName';
import '../component/resultBtn';
import getHistorySame from 'services/getHistorySame';


module.exports = Vue.component('analysis-history-same', {
    data() {
        return {
            textStr: '相同历史亚赔',
            historyList: {},
            dataList: [                 // 渲染主客队信息
                {
                    title: 'home',
                    teamName: '',
                    teamShortName: ''
                },
                {
                    title: 'away',
                    teamName: '',
                    teamShortName: ''
                }
            ],
        }
    },
    template,
    props: {
        vid: {
            default: ''
        }
    },
    created() {
        let vid = this.vid;
        getHistorySame.getData({vid, count: '3'}).then(rsp => {
            let rspData = rsp.data;
            if(Object.getOwnPropertyNames(rspData).length) {
                for(let key in rspData) {
                    rspData[key].forEach(rspD =>{
                        let _vsDate = Date.prototype.parseISO8601(rspD.vsDate);
                        rspD.vsDate = _vsDate.format('yy-MM-dd');
                    })
                }
                this.historyList = rspData;
            }else {
                this.$store.dispatch('setHistorySame');
            }
        }, req => {
            this.$store.dispatch('setHistorySame');
        })
    },
    updated() {
        this.eventInfo = this.$store.state["eventInfo"];
        this.dataList.forEach(DL => {
            DL.teamName = this.eventInfo[DL.title + 'Name'];
            DL.teamShortName = this.eventInfo[DL.title + 'ShortName'];
        });
    }
});