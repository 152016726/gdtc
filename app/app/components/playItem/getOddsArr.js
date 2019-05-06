import oddDealCtrl from "../../constants/oddDealCtrl";
import _ from "lodash";
import {
    WIN_DRAW_WIN,
    HANDICAP_WIN_DRAW_WIN,
    TOTAL_GOALS,
    CORRECT_SCORES,
    HALF_FULL_TIME
} from '../../constants/MarketSort';

let allOdds = oddDealCtrl.getOdds();

// 比分
let odds_CS_W = _.filter(allOdds[CORRECT_SCORES], function (o) {
    return o.type === 'W'
});
// 比分 赢
let odds_CS_W_row1 = odds_CS_W.splice(0, 7);
let odds_CS_W_row2 = odds_CS_W;
odds_CS_W_row2[odds_CS_W_row2.length - 1].flex = 2;
// 比分 平
let odds_CS_D = _.filter(allOdds[CORRECT_SCORES], function (o) {
    return o.type === 'D'
});
odds_CS_D[odds_CS_D.length - 1].flex = 3;
// 比分 输
let odds_CS_L = _.filter(allOdds[CORRECT_SCORES], function (o) {
    return o.type === 'L'
});
let odds_CS_L_row1 = odds_CS_L.splice(0, 7);
let odds_CS_L_row2 = odds_CS_L;
odds_CS_L_row2[odds_CS_L_row2.length - 1].flex = 2;


// 进球
let odds_TG = allOdds[TOTAL_GOALS];
let odds_TG_row1 = odds_TG.splice(0, 4);
let odds_TG_row2 = odds_TG;


//半全场
let odds_HFT = allOdds[HALF_FULL_TIME];
odds_HFT.push({isEmpty: true});
let odds_HFT_row1 = odds_HFT.splice(0, 5);
let odds_HFT_row2 = odds_HFT;

export default {
    odds_WDW: [allOdds[WIN_DRAW_WIN]],
    odds_HWDW: [allOdds[HANDICAP_WIN_DRAW_WIN]],
    odds_CS_W: [odds_CS_W_row1, odds_CS_W_row2],
    odds_CS_D: [odds_CS_D],
    odds_CS_L: [odds_CS_L_row1, odds_CS_L_row2],
    odds_TG: [odds_TG_row1, odds_TG_row2],
    odds_HFT: [odds_HFT_row1, odds_HFT_row2]
}