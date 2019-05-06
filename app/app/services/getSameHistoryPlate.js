/**
 * Created by marcus on 2018/12/14.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'museum/getLeagues';

module.exports = {
    getData: function (data) {
        // return service.getData(action, data || {}, {});
        return new Promise((res, rej)=>{
            res({
                "home": [
                    {
                        "vid": "int 赛事id",
                        "vsDate": "string 比赛时间",
                        "leagueId": "int 联赛id",
                        "leagueName": "string 联赛名",
                        "leagueColor": "string 联赛颜色",
                        "leagueShortName": "string 联赛名简称",
                        "homeTid": "int 主队id",
                        "homeName": "string 主队名",
                        "homeShortName": "string 主队名简称",
                        "homeGoalsScored": "int 主队90分钟得分",
                        "awayTid": "int 客队id",
                        "awayName": "string 客队名",
                        "awayShortName": "string 客队名简称",
                        "awayGoalsScored": "int 客队90分钟得分",
                        "handicap": "int 盘口 1为主队受让一球 -1主队为让一球",
                        "result": "int 亚指赛果, 3: 主胜; 1: 走水; 0: 主负"
                    }
                ],
                "away": [
                    {
                        "vid": "int 赛事id",
                        "vsDate": "string 比赛时间",
                        "leagueId": "int 联赛id",
                        "leagueName": "string 联赛名",
                        "leagueColor": "string 联赛颜色",
                        "leagueShortName": "string 联赛名简称",
                        "homeTid": "int 主队id",
                        "homeName": "string 主队名",
                        "homeShortName": "string 主队名简称",
                        "homeGoalsScored": "int 主队90分钟得分",
                        "awayTid": "int 客队id",
                        "awayName": "string 客队名",
                        "awayShortName": "string 客队名简称",
                        "awayGoalsScored": "int 客队90分钟得分",
                        "handicap": "int 盘口 1为主队受让一球 -1主队为让一球",
                        "result": "int 亚指赛果, 3: 主胜; 1: 走水; 0: 主负"
                    }
                ]
            },rsp=> rej(rsp));
        })
    }
};