import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../components/eventHeader';
import getEventCenterServices from 'services/getEventCenter';
import getAllContent from 'services/getMuseumGetAllContinent';
import getHotLeagues from 'services/getHotLeagues';
import '../eventNations';
import _ from 'lodash';

let eventView = Vue.component('event-view', {
    data(){
        return {
            continentList: [],              // 一级列表
            countryList: [],               // 二级列表
            fid: -1,                       // 一级id
            activeIndex: '',              // 正在展示的行
            hotLeagueList:[]              // 热门赛事
        }
    },
    template,
    created(){
        // 获取一级列表
        getAllContent.getData().then(rsp=> {
            rsp.data.list.unshift({id: this.fid, name: '全部赛事'});
            this.continentList = rsp.data.list;
        },rej=> {
            console.log(rej.rspMsg);
        });
        // 根据一级列表id获取二级List
        getEventCenterServices.getData({id: this.fid}).then(rsp=>{
            let list = [];
            let arr = [];
            rsp.data.list.forEach((item, index)=>{
                if(index%6 === 0){
                    if(index !== 0){
                        list.push(arr)
                    }
                    arr = [item];
                }else{
                    arr.push(item);
                    if(index === rsp.data.list.length -1){
                        list.push(arr)
                    }
                }
            });
            this.countryList = list;
        }, rej=> {
            console.log(rej.rspMsg);
        });
        // 获取热点赛事
        getHotLeagues.getData().then(rsp=>{
            this.hotLeagueList = rsp.data.list;
        }, rej=>{
            console.log(rej.rspMsg);
        });
    },
    methods: {
        /**
         * 设置activeIndex
         */
        setActiveSort(val){
            this.activeIndex = val;
        },
        /**
         * 通过id获取二级列表
         * @param id
         */
        setCountryList(id){
            this.fid = id;
            this.activeIndex = '';
            getEventCenterServices.getData({id}).then(rsp=>{
                let list = [];
                let arr = [];
                rsp.data.list.forEach((item, index)=>{
                    if(index%6 === 0){
                        if(index !== 0){
                            list.push(arr)
                        }
                        arr = [item];
                    }else{
                        arr.push(item);
                        if(index === rsp.data.list.length -1){
                            list.push(arr)
                        }
                    }
                });
                this.countryList = list;
            }, rej=> {
                console.log(rej.rspMsg);
            })
        }
    }
});

module.exports = eventView;