import Vue from 'vue';
import './index.scss';
import template from './index.template';
import '../../components/selections';
import getStandingsService from 'services/getStandings';

module.exports = Vue.component('rank-list', {
    data() {
        return {
            rankList: [],    // 队伍排名
            colorList: [],   // 颜色数组
            itemList: [
                {'name': '总积分榜', id: '1'},
                {'name': '阶段积分榜', id: '2'},
                {'name': '小组积分榜', id: '3'}
            ],
            th: ['排名', '球队', '场次', '胜', '平', '负', '进球', '失球', '净胜球', '积分']
        }
    },
    template,
    props: {
        type: {default: ''},
        seasonId: {default: ''},
        stageId: {default: ''},
        roundId: {default: ''}
    },
    watch:{
        /**
         * 监测赛季ID
         */
        seasonId(){
            this.initRankData()
        },
        /**
         * 监测阶段ID
         */
        stageId(){
            this.initRankData()
        },
        /**
         * 监测轮次ID
         */
        roundId(){
            this.initRankData()
        }
    },
    methods: {
        /**
         * 重新获取排行榜
         * @param obj
         */
        setData(obj){
            getStandingsService.getData(obj).then(rsp=>{
                this.rankList = rsp.data.list;
                this.colorList = rsp.data.colors;
            }, rej=>{
                this.rankList = [];
                this.colorList = [];
                console.log(rej.rspMsg);
            })
        },
        /**
         * 手动切换排行榜类型
         * @param val
         */
        toggleRank(val) {
            let id;
            if (val.id === '1') {
                id = this.seasonId;
            }else if(val.id === '2'){
                id = this.stageId;
            } else {
                id = this.roundId;
            }
            this.$emit('setType', val.id);
            this.setData({
                "type": val.id,
                id
            })
        },
        /**
         * 初始化积分榜信息
         */
        initRankData(){
            // 汇总请求总积分榜，阶段积分榜，小组积分榜的参数
            let dataList = [
                {
                    "type": '1',
                    "id": this.seasonId
                },
                {
                    "type": '2',
                    "id": this.stageId
                },
                {
                    "type": '3',
                    "id": this.roundId
                }
            ];
            // 都请求一遍获得promiseList
            let promiseArr = dataList.map(item=>{
                return new Promise((resolve, reject)=>{
                    getStandingsService.getData(item).then(rsp=>{
                        if(rsp.data.list.length > 0 && rsp.data.colors.length > 0){
                            resolve({
                                rankList: rsp.data.list,
                                colorList: rsp.data.colors,
                                type: item.type
                            })
                        }else{
                            resolve({})
                        }
                    }, rej=>{
                        reject({})
                    })
                })
            });
            // 根据请求的结果显示对应的积分榜
            Promise.all(promiseArr).then(rsp=>{
                let flag = true;
                rsp.forEach((item)=>{
                    if(Object.getOwnPropertyNames(item).length !== 0){
                        this.$emit('setType', item.type);
                        this.rankList = item.rankList;
                        this.colorList = item.colorList;
                        flag = false;
                        return
                    }
                });
                // 未获得任何积分榜则重置为空数组
                if(flag){
                    this.rankList = [];
                    this.colorList = [];
                }
            })
        }
    },
    created(){
        this.initRankData()
    }
});