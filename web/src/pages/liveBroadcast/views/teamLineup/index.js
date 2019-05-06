import Vue from 'vue';
import template from './index.template'
import './index.scss'
import './components/lineup'
import './components/playerList'
import getLineupList from 'services/getLineupList'
import _ from 'lodash'
import util from '@easylotto/util'

//阵型配置
let lineConfig = [
    'GK-L', 'GK-CL', 'GK-C', 'GK-CR', 'GK-R',
    'D1-L', 'D1-CL', 'D1-C', 'D1-CR', 'D1-R',
    'D2-L', 'D2-CL', 'D2-C', 'D2-CR', 'D2-R',
    'DM-L', 'DM-CL', 'DM-C', 'DM-CR', 'DM-R',
    'M-L', 'M-CL', 'M-C', 'M-CR', 'M-R',
    'AM-L', 'AM-CL', 'AM-C', 'AM-CR', 'AM-R',
    'A-L', 'A-CL', 'A-C', 'A-CR', 'A-R'
];

let TeamLineup = Vue.component('team-lineup-vue', {
    data() {
        return {
            formation: {},        //阵型对象
            playerList: [],       //主客球员列表
            homeLineCfg: [],      //主队阵容
            awayLineCfg: [],      //客队阵容
            vid: '',              //赛事ID
            homeFormation: '',    //主队阵型字符串
            awayFormation: ''     //客队阵型字符串
        };
    },
    template: template,
    /**
     * 页面加载完成
     * 获取整形数据
     */
    created() {
        const {vid} = util.getUrlVars();
        this.vid = vid;
        this.getTeamInfo();
    },
    methods: {
        /**
         * 获取阵型列表
         */
        getTeamInfo() {
            getLineupList.getData({vid: this.vid}).then((rsp) => {
                const {formationObj = {}, playerList = [], homeLineCfg, awayLineCfg, awayFormation, homeFormation} = this.getLineupFormat(rsp.data);
                this.formation = formationObj;
                this.playerList = playerList;
                this.awayLineCfg = awayLineCfg;
                this.homeLineCfg = homeLineCfg;
                this.homeFormation = homeFormation;
                this.awayFormation = awayFormation
            }, (rejectData) => {
                this.formation = {};
                this.playerList = [];
                this.awayLineCfg = [];
                this.homeLineCfg = [];
            })
        },
        /**
         * 获取主客阵型对象
         * @param data
         */
        getLineupFormat(data) {
            let formationObj = {};
            let playerList = {};
            let homeLineCfg = [];
            let awayLineCfg = [];
            let homeFormation = '';
            let awayFormation = '';
            for (let team in data) {
                if (data.hasOwnProperty(team)) {
                    let teamData = data[team] || {};
                    const {lineups = [], lineupsBench = [], coachCnShort, formation} = teamData;
                    team==='home' ? homeFormation = formation : awayFormation = formation;
                    if (lineups.length > 0 || lineupsBench.length > 0) {
                        playerList[team] = [];
                        let arr = [];
                        let lineObj;
                        let lineData = lineConfig.filter((list) => {
                            let flag = false;
                            for (let i = 0; i < teamData.lineups.length; i++) {
                                let item = teamData.lineups[i];
                                if (list === `${item.positionX}-${item.positionY}`) {
                                    flag = true;
                                    break;
                                }
                            }
                            return flag
                        });
                        lineObj = _.groupBy(lineData, (line) => {
                            return line.split('-')[0]
                        });
                        for (let val in lineObj) {
                            arr.push(lineObj[val])
                        }
                        // console.log(arr);
                        if (team === "home") {
                            homeLineCfg = arr;
                        } else {
                            awayLineCfg = arr;
                        }
                        formationObj[team] = lineups;
                        /* lineups.unshift({
                             playerCnShort: coachCnShort
                         });*/
                        playerList[team].push(lineups, lineupsBench);
                    }
                }
            }
            // console.log(homeLineCfg, awayLineCfg);
            return {
                formationObj,
                playerList,
                homeLineCfg,
                awayLineCfg,
                homeFormation,
                awayFormation
            };
        }
    }
});

module.exports = TeamLineup;