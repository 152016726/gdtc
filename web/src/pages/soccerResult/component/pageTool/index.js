/**
 * Created by feng on 2018/06/07.
 */
require('./style.scss');
var $ = require('jquery');
var avalon = require('avalon2');
var search = require('../../search')
var vm = avalon.define({
    $id: "pageTool",
    init: function () {
        console.log("init selPan");
    }
});

var vm = avalon.component('ms-page-tool', {
    template: require('./view.html'),
    defaults: {
        allMarkets: 0,
        allNum: 66,
        pageSize: 30,
        numArr: [{
            id: 1,
            active: true
        }, {
            id: 2,
            active: false
        }, {
            id: 3,
            active: false
        }, {
            id: 4,
            active: false
        }, {
            id: 5,
            active: false
        }, {
            id: 6,
            active: false
        }, {
            id: 7,
            active: false
        }, {
            id: 8,
            active: false
        }, {
            id: 9,
            active: false
        }, {
            id: 10,
            active: false
        }],
        show: false,
        isProp: false,
        isNext: true,
        activeClass: "active",
        lastNum: 521,
        onReady: function (e) {
            this.changePageButton();
            e.vmodel.$watch('allMarkets', function () {
                this.changePageButton();
            });
        },
        isShow(){
            if (this.allNum <= 1) {
                return false;
            }
            else {
                return this.show;
            }
        },
        changePageButton() {
            //根据赛事计算分页器的码数：每页显示30条
            this.allNum = Math.ceil(this.allMarkets / this.pageSize);
            //当分页不足10页时的处理
            if (this.allNum < 10) {
                this.isNext = false;
                this.isProp = false;
                var aNum = this.allNum;
                this.setPageNum(aNum, false, false, true);
            }
            //记录分页器倒数第二页的页码数
            this.lastNum = Math.floor(this.allNum / 10) * 10 + 1;
        },
        //首页按钮
        firstHandel: function () {
            this.isProp = false;
            var aNum = 10;
            if (this.allNum > 10) {
                this.isNext = true;
            } else {
                aNum = this.allNum;
                this.isNext = false;
            }
            this.setPageNum(aNum);
        },
        //上十页按钮
        propHandel: function () {
            this.isNext = true;
            var bNum = this.numArr[0].id - 10;
            var aNum = 10;
            if (bNum === 1) {
                this.isProp = false;
            }
            this.setPageNum(aNum, bNum);
        },
        //每一页的按钮
        clickHandel: function (obj, el) {
            var numArr = this.numArr;
            for (var i = 0; i < numArr.length; i++) {
                numArr[i].active = false;
                if (numArr[i].id === obj.id) {
                    this.updatePageIndex(i);
                    numArr[i].active = true;
                }
            }
        },
        //下十页的按钮
        nextHandel: function () {
            this.isProp = true;
            var firstNum = this.numArr[0].id + 10;
            var bNum = this.lastNum;
            var aNum = 10;
            if (bNum === firstNum) {
                this.isNext = false;
                if (this.allNum % 10 != 0) {
                    aNum = this.allNum % 10
                }
            }
            this.setPageNum(aNum, firstNum);
        },
        //尾页按钮
        lastPageHandel: function () {
            if (this.allNum > 10) {
                this.isProp = true;
                this.isNext = false;
                var bNum = this.lastNum;
                var aNum = this.allNum % 10;
                if (aNum === 0) {
                    aNum = 10;
                }
                this.setPageNum(aNum, bNum, true);
            } else {
                var numArr = this.numArr;
                for (var i = 0; i < numArr.length; i++) {
                    numArr[i].active = false;
                    if (i === numArr.length - 1) {
                        this.updatePageIndex(i);
                        numArr[i].active = true;
                    }
                }
            }
        },
        /**
         * @param aNum:分页器的当前总数
         * @param bNum：分页器的第一页的页码
         * @param last: 是否显示最后一页
         * @param last: 是否改变search模块的pageIndex
         */
        setPageNum: function (aNum, bNum, last, noChangePageIndex) {
            var numObj = {};
            var numArr = [];
            for (var i = 0; i < aNum; i++) {
                numObj = {};
                if (bNum) {
                    numObj.id = bNum + i;
                } else {
                    numObj.id = i + 1;
                }
                numObj.active = false;
                if (last) {
                    if (i === (aNum - 1)) {
                        !noChangePageIndex && this.updatePageIndex(i);
                        numObj.active = true;
                    }
                } else {
                    if (i === 0) {
                        !noChangePageIndex && this.updatePageIndex(i);
                        numObj.active = true;
                    }
                }
                numArr.push(numObj);
            }
            this.numArr = numArr;
        },
        updatePageIndex(i) {
            search.tplModel.setParam([{type: 0, pageIndex: i}, search.model]);
            search.reRender();
        }
    }
});

module.exports = {
    vm
};