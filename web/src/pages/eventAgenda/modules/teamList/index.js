import Vue from 'vue';
import './index.scss';
import template from './index.template';
import '../../components/oddsResult';
import getMatchesService from 'services/getMatches';

module.exports = Vue.component('team-list',{
    data(){
        return{
            th: ['轮次', '时间', '主队', '比分', '客队', '竞彩终奖', '资料', '半场'],
            matchList: []
        }
    },
    template,
    props:{
        "lid": {default: ""},
        "seasonId": {default: ""},
        "stageId": {default: ""},
        "roundId": {default: ""}
    },
    watch:{
      roundId(val){
          getMatchesService.getData({
              lid: this.lid,
              seasonId: this.seasonId,
              stageId: this.stageId,
              roundId: val
          }).then(rsp=>{
              this.matchList = rsp.data.list.map(item=>{
                  item.eventState = this.filterEventState(item.eventState)
                  return item
              });
          }, rej=>{
              this.matchList = [];
              console.log(rej.rspMsg);
          })
      }
    },
    methods:{
        filterEventState(state){
            if(state === '1' || state === '11' || state === '12'){
                return 1
            }else if(state === '0' || state === '9' || state === '13'){
                return 2
            }else if(state === '2' || state === '3' || state === '4' || state === '5' || state === '6'
            || state === '7' || state === '8' || state === '10'){
                return 3
            }
        }
    },
    created(){
        getMatchesService.getData({
            lid: this.lid,
            seasonId: this.seasonId,
            stageId: this.stageId,
            roundId: this.roundId
        }).then(rsp=>{
            this.matchList = rsp.data.list.map(item=>{
                item.eventState = this.filterEventState(item.eventState)
                return item
            });
        }, rej=>{
            console.log(rej.rspMsg);
        })
    }
});