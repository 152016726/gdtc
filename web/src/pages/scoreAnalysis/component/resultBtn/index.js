/**
 * Created by easyLottoMac on 2018/12/4.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';

const ALLRESULT = {
    WDWRESULT:[                            // 胜平负赛果
        {text: '负', cla: 'loseColor', typeId: '0'},
        {text: '平', cla: 'flatColor', typeId: '1'},
        {text: '胜', cla: 'winColor', typeId: '3'}
    ],
    HWDWRESULT:[                            // 亚盘赛果
        {text: '输', cla: 'loseColor', typeId: '0'},
        {text: '走', cla: 'flatColor', typeId: '1'},
        {text: '赢', cla: 'winColor', typeId: '3'}
    ],
    OURESULT:[                             // 大小球赛果
        {text: '小', cla: 'loseColor', typeId: '0'},
        {text: '走', cla: 'flatColor', typeId: '1'},
        {text: '大', cla: 'winColor', typeId: '3'}
    ]
};
const RESULTARR = ['WDWRESULT', 'HWDWRESULT', 'OURESULT'];

module.exports = Vue.component('analysis-result-btn', {
    data() {
        return {
            clsSty: '',         // 文字显示样式
            resultText: ''      // 展示的文字
        }
    },
    props: {
        typeNum: {          // 0 => 胜负类型; 1 => 让球类型; 2 => 大小球类型; 3 => 盘口类型
            default: 0
        },
        resultNum: {        // 数值类型
            default: ''
        },
        isDefColor: {       // 默认展示颜色
            default: false
        }
    },
    template,
    created() {
        let resultObj = {};
        if (this.typeNum !== 3) {
            resultObj = ALLRESULT[RESULTARR[this.typeNum]].filter(rel=>{
                return rel.typeId === this.resultNum
            })[0];
            this.clsSty = resultObj && resultObj.cla;
            this.resultText = resultObj && resultObj.text;
        }
    }
});