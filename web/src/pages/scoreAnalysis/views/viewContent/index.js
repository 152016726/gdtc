/**
 * Created by easyLottoMac on 2018/12/3.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../../component/subTitleView';
import '../../component/leftTabBar';
import '../../matchBefore';                  // 对赛往绩
import '../../pointRanking';                 // 联赛积分排名
import '../../recentRecord';                 // 近期战绩
import '../../leagueTrend';                  // 联赛盘路走势
import '../../historySame';                  // 相同历史亚赔
import '../../futureFive';                   // 未来五场
import util from "@easylotto/util";

module.exports = Vue.component('analysis-view', {
    data() {
        return {
            vid: '',
            titleHeight: 62
        }
    },
    template,
    created() {
        const {vid} = util.getUrlVars();
        this.vid = vid;
    },
    computed: {
        /**
         * 计算渲染左边导航栏
         * @returns {Array}
         */
        idDomArr() {
            let {
                hasMatchBeforeData,
                hasPointRankingData,
                hasRecentRecordData,
                hasLeagueTrendData,
                hasHistorySameData,
                hasFutureFiveData
            } = this.$store.state;
            let idDomArr = [];
            hasMatchBeforeData && idDomArr.push({idName: '#match-before', title: '往绩'});
            hasPointRankingData && idDomArr.push({idName: '#point-ranking', title: '积分'});
            hasRecentRecordData && idDomArr.push({idName: '#recent-record', title: '战绩'});
            hasLeagueTrendData && idDomArr.push({idName: '#league-trend', title: '盘路'});
            hasHistorySameData && idDomArr.push({idName: '#history-same', title: '亚赔'});
            hasFutureFiveData && idDomArr.push({idName: '#future-five', title: '未来'});
            // console.log(idDomArr);
            return idDomArr
        }
    }
});