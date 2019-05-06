import oddDealCtrl from "./oddDealCtrl";
import _ from "lodash";
import {
    WIN_DRAW_WIN,
    HANDICAP_WIN_DRAW_WIN,
    TOTAL_GOALS,
    CORRECT_SCORES,
    HALF_FULL_TIME
} from './MarketSort';

let allOdds = oddDealCtrl.getOdds();

// 比分 赢
let odds_CS_W = _.filter(allOdds[CORRECT_SCORES], function (o) {
    return o.type === 'W'
});
// 比分 平
let odds_CS_D = _.filter(allOdds[CORRECT_SCORES], function (o) {
    return o.type === 'D'
});
// 比分 输
let odds_CS_L = _.filter(allOdds[CORRECT_SCORES], function (o) {
    return o.type === 'L'
});

module.exports = {
    odds_WDW: [allOdds[WIN_DRAW_WIN]],
    odds_HWDW: [allOdds[HANDICAP_WIN_DRAW_WIN]],
    odds_CS_W: [odds_CS_W],
    odds_CS_D: [odds_CS_D],
    odds_CS_L: [odds_CS_L],
    odds_TG: [allOdds[TOTAL_GOALS]],
    odds_HFT: [allOdds[HALF_FULL_TIME]]
};