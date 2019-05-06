import Vue from 'vue';
import template from './index.template'
import dict from '@easylotto/dict';
import getAgainstStatistic from 'services/getAgainstStatistic';
import {
    CORNER_BALL,
    HALF_CORNER_BALL,
    YELLOW_CARD_ALL,
    RED_CARD_ALL,
    SHOTS,
    SHOT_ON_TARGET,
    ATTACK,
    DANGEROUS_ATTACK,
    FOULS,
    FREE_KICKS,
    POSSESSION,
    HALF_POSSESSION,
    OFFSIDE,
    PASSES,
    SHOT_SAVES,
    HEADER,
    TACKLES,
    THROW_IN,
    CROSSES,
    SHOT_WOOD_WORK,
    FIRST_KICK_OFF
} from 'constants/matchStatisticsType';
import './index.scss';
import '../components/linePercent';

// 获取字典的key
const _typeDictKey = 'matchStatisticsType';

/**
 * 初始化数据统计部分
 * @param data
 */
const initTeamData = (data)=>{
    let homeData = {};
    let awayData = {};
    let isNoData = true;
    if(data){
        for(let p in data){
            let prefix = '';
            let objSet = null;
            isNoData && (isNoData = false);
            // 主队参数
            if(p.indexOf('home') === 0){
                prefix = 'home';
                objSet = homeData;
                // 客队参数
            }else if(p.indexOf('away') === 0){
                prefix = 'away';
                objSet = awayData;
            }
            // 开始设置属性，非home、away属性不处理
            if(objSet){
                let key = p.replace(prefix, '');
                key = key.charAt(0).toLowerCase() + key.substr(1);
                objSet[key] = data[p];
            }
        }
    }
    return {
        homeData, awayData, isNoData
    };
};

let StrokeAnalysis = Vue.component('stroke-analysis', {
    data() {
        return{
            // 定义显示数据内容及显示顺序，通过map返回对象
            arrLineType: [
                CORNER_BALL,
                HALF_CORNER_BALL,
                YELLOW_CARD_ALL,
                RED_CARD_ALL,
                SHOTS,
                SHOT_ON_TARGET,
                ATTACK,
                DANGEROUS_ATTACK,
                FOULS,
                FREE_KICKS,
                POSSESSION,
                HALF_POSSESSION,
                OFFSIDE,
                PASSES,
                SHOT_SAVES,
                HEADER,
                TACKLES,
                THROW_IN,
                CROSSES,
                SHOT_WOOD_WORK
            ].map((item) => {
                return {
                    type: item,
                    text: dict.getDictText(_typeDictKey, item)
                };
            }),
            homeData: {},
            awayData: {}
        };
    },
    template: template,
    props: {
        vid: {
            default: '' // 赛事id
        }
    },
    /**
     * 页面加载完成
     */
    created() {
        let vid = this.vid;
        if(vid !== '') {
            getAgainstStatistic.getData({vid}).then(rsqTechData => {
                let obj = initTeamData(rsqTechData.data);
                this.homeData = obj.homeData;
                this.awayData = obj.awayData;
                // 无数据回调
                if(obj.isNoData){
                    this.$emit('updateNoStrokeData');
                }
            });
        }
    },
    methods: {}
});

module.exports = StrokeAnalysis;