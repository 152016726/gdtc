/**
 * 页码控制器
 * Created by easyLottoMac_Feng on 2019/3/27.
 */
import './style.scss';
import Vue from 'vue';
import template from './index.template';

module.exports = Vue.component('page-burster-view', {
    data() {
        return {
            numArr: [],         // 展示的页码
            pageNum: 0,         // 页码
            pageCell: 0,        // 有多少条页码
            isShow: true,       // 是否展示页码
            isProp: false,      // 是否显示上十页按钮
            isNext: false,      // 是否显示下十页按钮
            activeVal: 1,       // 当前选中的页码
            tenNum: 0,          // 当前页码的条数
            tenNumPage: 0       // 页码条数  --10页为一条
        }
    },
    template,
    props: {
        totalNumber: {           // 列表总条数
            default: '1009'
        },
        pageSize: {              // 每页展示的条数
            default: '16'
        },
        isShowResult: {          // 是否展示结果
            default: false
        },
        callBackHandle: {}       // 页码选中回调
    },
    created() {
        this.pageCell = Math.ceil(this.totalNumber / this.pageSize);     // 计算页码数
        this.tenNumPage = Math.floor(this.pageCell / 10);                // 计算页码条数 10页为一条
        this.setNumArr(this.tenNumPage, false);
    },
    methods: {
        /**
         * 点击页码回调
         */
        changePageButton() {
            this.callBackHandle && this.callBackHandle(this.activeVal);
        },
        /**
         * 页数按钮事件
         * @param val 页码
         */
        clickHandel(val) {
            this.activeVal = val;
            this.changePageButton();
        },
        /**
         * 上十页按钮事件
         */
        propHandel() {
            this.isNext = true;
            this.tenNum--;
            this.activeVal = (this.tenNum * 10) + 1;
            this.isProp = this.tenNum >= 1;
            this.setNumArr();
        },
        /**
         * 下十页的按钮事件
         */
        nextHandel() {
            this.isProp = true;
            this.tenNum++;
            this.activeVal = (this.tenNum * 10) + 1;
            this.isNext = this.tenNum !== this.tenNumPage;
            this.setNumArr();
        },
        /**
         * 首页按钮事件
         */
        firstHandel() {
            this.tenNum = 0;
            this.activeVal = 1;
            this.isProp = false;
            this.setNumArr();
        },
        /**
         * 尾页按钮事件
         */
        lastPageHandel() {
            let {tenNumPage, pageCell, setNumArr} = this;
            let lastPageNum = ((pageCell / 10) * 10) % 10;      // 计算最后的页码
            if (tenNumPage > 1) {                               // 当页码大于1时释放上十页按钮并重置当前页码条数
                this.isProp = true;
                this.tenNum = tenNumPage;
            }
            this.activeVal = (this.tenNum * 10) + lastPageNum;
            setNumArr();
        },
        /**
         * 计算页码
         * @param tenNumPage   页码总数
         * @param flag         是否调用回调
         */
        setNumArr(tenNumPage = this.tenNumPage, flag = true) {
            let {pageCell, tenNum, changePageButton} = this;
            let sNumArr = [];
            if (tenNumPage <= 0) {      // 当页码条数只有一条时逻辑
                for (let i = 1; i <= pageCell; i++) {
                    sNumArr.push(i);
                }
            } else {                     // 当页码条数大于一条时逻辑
                this.isNext = true;
                if (tenNum === tenNumPage) {                // 当时最后一条页码时逻辑
                    let aNum = pageCell % 10;               // 获取最后一页的页码列表数
                    for (let i = 1; i <= aNum; i++) {
                        let bNum = (tenNum * 10) + i;
                        sNumArr.push(bNum);
                    }
                    this.isNext = false;
                } else {
                    for (let i = 1; i <= 10; i++) {
                        let cNum = (tenNum * 10) + i;
                        sNumArr.push(cNum);
                    }
                }
            }
            this.numArr = sNumArr;
            flag && changePageButton();
        }
    }
});
