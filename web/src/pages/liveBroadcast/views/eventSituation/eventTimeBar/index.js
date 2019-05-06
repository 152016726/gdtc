        import Vue from 'vue';
import template from './index.template'
import getImportantVersusInfo from 'services/getImportantVersusInfo';
import './index.scss'
import '../components/eventTimeSide';
import {
    CORNER_BALL,
    DOUBLE_YELLOW_TO_RED,
    ENTER_THE_BALL,
    MISS_PENALTY_KICK,
    OOLONG_BALL,
    PENALTY_KICK,
    SUBSTITUTION_OF_PLAYERS
} from "constants/matchEventType";
import typeImageMap from '../typeImageMap';

// 定义底部显示内容及顺序
const _showType = [
    ENTER_THE_BALL,
    PENALTY_KICK,
    MISS_PENALTY_KICK,
    OOLONG_BALL,
    DOUBLE_YELLOW_TO_RED,
    SUBSTITUTION_OF_PLAYERS,
    CORNER_BALL
];

/**
 * 初始化事件数据部分
 * @param data
 */
const initEventsData = (data, oldEvents)=>{
    let events = oldEvents ? oldEvents.splice(0) : [];
    if(data && data.actions){
        data.actions.forEach((item) => {
            for(let p in item){
                if(p !== 'time'){
                    let prefix = '';
                    let isHome = false;
                    let person1 = '';
                    let person2 = '';
                    let type = '';
                    // 主队参数
                    if(p.indexOf('home') === 0){
                        prefix = 'home';
                        isHome = true;
                        // 客队参数
                    }else if(p.indexOf('away') === 0){
                        prefix = 'away';
                    }
                    if(prefix !== ''){
                        type = p.replace(prefix, '');
                        type = type.charAt(0).toLowerCase() + type.substr(1);
                        // 非换人
                        if(type !== 'substitution'){
                            person1 = item[p]['playerCnShort'] || '';
                        }else{
                            person1 = item[p]['in'];
                            person2 = item[p]['out'];
                        }
                    }
                    events.push({
                        time: Math.floor((item.time ? item.time : 0 )/60) + '\'',
                        type,
                        isHome,
                        person1,
                        person2
                    });
                }
            }
        });
    }
    return {
        events
    };
};

let EventTimeBar = Vue.component('event-time-bar', {
    data() {
        return{
            events: [],
            exampleList: _showType.map(type => typeImageMap[type])
        };
    },
    props: {
        vid: {
            default: '' // 赛事id
        }
    },
    template: template,
    /**
     * 页面加载完成
     */
    created() {
        let vid = this.vid;
        if(vid !== ''){
            getImportantVersusInfo.getData({ vid }).then(rsqLineData => {
                let data = initEventsData(rsqLineData.data);
                this.events = data.events;
                if(data.events.length === 0){
                    this.$emit('updateNoTimeData');
                }
            });
        }
    }
});

module.exports = EventTimeBar;