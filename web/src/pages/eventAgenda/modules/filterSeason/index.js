import Vue from 'vue';
import './index.scss';
import template from './index.template';
import '../../components/selections';
import getSeasons from 'services/getSeasonList';

module.exports = Vue.component('filter-season', {
    data() {
        return {
            seasonList: [],
            seasonName: ''
        }
    },
    template,
    props: {
        lid: {default: ''},
        name: {default: ''},
        seasonId: {default: ''}
    },
    watch:{
      lid(val){
          getSeasons.getData({
              lid: val
          }).then(rsp => {
              this.seasonList = rsp.data.list.map(item=>{
                  if(item.seasonId === this.seasonId){
                      this.seasonName = item.seasonName;
                      this.$emit('setSeasonName', item.seasonName);
                  }
                  item.name = item.seasonName;
                  item.id = item.seasonId;
                  return item
              });
          }, rej => {
              this.seasonList = [];
              console.log(rej.rspMsg);
          })
      }
    },
    methods: {
        /**
         * 更改正在展示的赛季
         * @param val
         */
        changeSeasonObj(val) {
            this.$emit('setSeasonId', val.seasonId);
            this.$emit('setSeasonName', val.seasonName);
            this.seasonName = val.seasonName;
        }
    },
    created() {
        getSeasons.getData({
            lid: this.lid
        }).then(rsp => {
            this.seasonList = rsp.data.list.map(item=>{
                if(item.seasonId === this.seasonId){
                    this.seasonName = item.seasonName
                }
                item.name = item.seasonName;
                item.id = item.seasonId;
                return item
            });
        }, rej => {
            console.log(rej.rspMsg);
        })
    }
});