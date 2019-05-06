/**
 *
 */

var tplModel = require('modules/tplModel');
var marketSort = require('constants/MarketSort');
var EventState = require('constants/eventState');
var _arrWeekCn = [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六',
];
var model = new tplModel({
    model: {
        marketList: [],
        marketNum: 0,
        marketSort,
        arrAbnormal: [EventState.CANCEL_MATCH, EventState.BREAK_OFF, EventState.UNDETERMINED, EventState.PUT_OFF, EventState.CUTTING_MATCH],
        getCompleteNo: function (completeNo) {
            let weekCode = parseInt(completeNo.substr(completeNo.length - 4, 1), 10);    // 赛事所属周几
            let week = _arrWeekCn[weekCode];
            return week + completeNo.substr(-3);
        },
        getSortDate: function (date) {
            return new Date(date).format('MM-dd hh:mm');
        },
        getOddsStr: function (odds, eventState) {
            if (odds === '0.00' || this.arrAbnormal.indexOf(eventState) !== -1) {
                return '--';
            }
            else {
                return odds;
            }
        },
        getScore: function (homeHalfScore, awayHalfScore, eventState) {
            if (this.arrAbnormal.indexOf(eventState) !== -1) {
                return '--';
            }
            else {
                return homeHalfScore + '-' + awayHalfScore;
            }
        },
        getHFResult: function (mk) {
            if (this.arrAbnormal.indexOf(mk.eventState) !== -1) {
                return '--';
            }
            return this.getResultByGoal(mk.homeHalfScore, mk.awayHalfScore) + '-' + this.getResultByGoal(mk.homeScore, mk.awayScore);
        },
        getResultByGoal(home, away, handicap, eventState) {
            home = parseInt(home);
            away = parseInt(away);
            handicap = parseInt(handicap);
            if (this.arrAbnormal.indexOf(eventState) !== -1) {
                return '--';
            }
            else if (!isNaN(handicap)) {
                home = home + handicap;
            }
            if (home > away) {
                return 3;
            }
            else if (home < away) {
                return 0;
            }
            else {
                return 1;
            }
        },
        getHandicapColorStyle(handicap) {
            handicap = parseInt(handicap);
            if (handicap > 0) {
                return 'f_win';
            }
            else if (handicap < 0) {
                return 'f_lose';
            }
            else return '';
        },
        /**
         * 计算总进球
         * @param homeGoal 主场进球
         * @param awayGoal 客场进球
         */
        getTotalGoal(homeGoal, awayGoal) {
            var tg = parseInt(homeGoal) + parseInt(awayGoal);
            if (tg > 6) {
                return '7+';
            }
            else {
                return tg;
            }
        }
    }
});

module.exports = model;