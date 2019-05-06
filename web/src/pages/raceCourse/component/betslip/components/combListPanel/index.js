import "./index.scss";
import Vue from "vue";
import template from "./index.template";
import "../checkBox";

let betslip = Vue.component('combListPanel', {
    template: template,
    data() {
        return {
            checkedArr: [],   //保存已选择的数据
        }
    },
    props: {
        show: {
            default: false
        },
        list: {
            default: function () {
                return [];
            }
        },
        toggleWin: {}       //控制窗口隐藏显示
    },
    computed: {
        /**
         * 将数据按m值分组
         */
        listSorted: function () {
            let arr = [];
            let mSticknStrArr = [];
            this.list.forEach((ele_l) => {
                let exist = false;
                if(mSticknStrArr.indexOf(ele_l.text)=== -1){
                    mSticknStrArr.push(ele_l.text);
                    arr.forEach((ele_a) => {
                        if (ele_a.m == ele_l.data.m) {
                            ele_a.arr.push(ele_l);
                            exist = true;
                        }
                    });
                    if (!exist) {
                        arr.push({
                            m: ele_l.data.m,
                            arr: [ele_l]
                        })
                    }
                }
            });
            return arr;
        }
    },
    methods: {
        /**
         * 排列每行checkbox
         */
        sortList(arr) {
            arr.sort((a, b) => {
                return a.data.n - b.data.n;
            });
            return arr;
        }
    }
});

module.exports = betslip;