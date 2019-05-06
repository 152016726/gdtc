/**
 * Created by feng on 2018/06/01.
 */
var tplModel = require('modules/tplModel');
var getSoccerResult = require('services/getSoccerResult.js');
var getLeagueByTime = require('services/getLeagueByTime.js');
var marketItem = require('../marketItem');
var $ = require('jquery');
var medianHour = 10;
var medianMin = 30;
var onDayTs = 1000 * 60 * 60 * 24
let innerFn = {
    /**
     * 将数组分为按日期分组
     */
    initList: function (arr) {
        let _arr = [];           //按日期分类的赛事数组
        arr.forEach((ele) => {
            let hadVsDate = false;
            let date = this.getYMD(ele.vsDate, ele.completeNo);
            _arr.forEach((_ele) => {
                if (_ele.vsDate === date) {
                    _ele.list = _ele.list || [];
                    _ele.list.push(ele);
                    hadVsDate = true;
                }
            });
            if (!hadVsDate) {
                _arr.push({
                    vsDate: date,
                    list: [
                        ele
                    ]
                })
            }
        });
        //console.log(_arr);
        _arr = this.sortArr(_arr);
        return {
            arr: _arr
        };
    },
    /**
     * 排列数组
     */
    sortArr(arr) {
        let _arr = [];
        arr.sort((a, b) => {
            let aTS = new Date(a.vsDate).getTime();
            let bTS = new Date(b.vsDate).getTime();
            if (aTS > bTS) {
                return -1;
            }
            else {
                return 1;
            }
        });
        arr.forEach((ele) => {
            let list = ele.list;
            let arrNormal = [];
            let arrDelay = [];
            list.sort((a, b) => {
                let aNum = new Date(a.vsDate).format('yyMMddhhmm') + a.completeNo.substr(-3);
                let bNum = new Date(b.vsDate).format('yyMMddhhmm') + b.completeNo.substr(-3);
                return bNum - aNum;
            });
            list.forEach((ele_c, index_c) => {
                let completeNo = ele_c.completeNo;
                let strYear = completeNo.substr(0, 4);
                let strMonth = completeNo.substr(4, 2);
                let strDay = completeNo.substr(6, 2);
                let betDate = new Date(strYear, parseInt(strMonth, 10) - 1, strDay, medianHour, medianMin);
                let betTS = betDate.getTime();
                let vsDateTS = new Date(ele_c.vsDate).getTime();
                if ((vsDateTS - betTS) > onDayTs) {
                    //console.log(ele_c.homeShortName + ele_c.vsDate + '/' + completeNo);
                    arrDelay.push(ele_c);
                }
                else {
                    arrNormal.push(ele_c);
                }
            });
            _arr = _arr.concat(arrDelay.concat(arrNormal));
        });
        return _arr;
    },
    /**
     * 截取年月日字符串
     */
    getYMD(vsDate, completeNo) {
        let weekCode = Date.prototype.parseISO8601(vsDate).format('yyyyMMdd') + parseInt(completeNo.substr(completeNo.length - 4, 1), 10);    // 赛事所属周几
        return weekCode
    }
}
var model = new tplModel({
    model: {
        liansaiInfo: [],               //联赛数据,
        leagueCheckedText: '全部联赛',  //选择的联赛名
        leagueChecked: ['-1'],         //选择的联赛id数组
        start_date: '',                //开始时间
        end_date: '',                  //结束时间
        count: '',                     //有*场赛事符合要求
        updateString: '',              //更新时间
        isSingle: false,               //是否仅显示单固场次
        pageIndex: 0,                  //int 起始文章索引, 必填
        pageSize: 30                   //返回文章的数量, 必填
    },
    initDate: function () {
        if (this.model.start_date === '' && this.model.end_date === '') {
            // 今天时间
            var nowDate = new Date();
            var nowMsec = nowDate.getTime();
            // 7天前的时间
            var startDate = new Date(nowMsec - 3 * 86400000);

            this.model.start_date = this.setDate(startDate);
            this.model.end_date = this.setDate(nowDate);
        }
    },
    setDate: function (date) {
        var yy = date.getFullYear();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        mm = mm > 9 ? mm : ('0' + mm);
        dd = dd > 9 ? dd : ('0' + dd);
        return yy + '-' + mm + '-' + dd;
    },
    ajaxData: function (param) {
        var def = $.Deferred();
        var oParam;
        oParam = param[1];
        param = param[0];
        def.promise();
        //通过接口更新数据
        if (param.type === 0) {
            var obj = {
                leagueId: oParam.leagueChecked || this.model.leagueChecked,
                from: oParam.start_date || this.model.start_date,
                to: oParam.end_date || this.model.end_date,
                isSingle: oParam.isSingle || this.model.isSingle,
                pageIndex: (param.pageIndex || oParam.pageIndex || this.model.pageIndex) + 1,
                pageSize: oParam.pageSize || this.model.pageSize
            };
            getSoccerResult.getData(obj).then(function (rsp) {
                var pageTool = avalon.vmodels['ms-page-tool'];
                var _obj = {};
                var list = (rsp.data.list.length !== 0 && rsp.data.list[0] !== '') ? rsp.data.list : [];
                list = innerFn.initList(list).arr;
                pageTool.show = true;
                pageTool.allMarkets = rsp.data.total;
                marketItem.reRender({
                    marketList: list
                }, true);
                Object.assign(_obj, oParam, {
                    count: rsp.data.total,
                    updateString: rsp.data.updateTime
                })
                def.resolve(_obj);
            }, function () {
                def.reject();
                console.log('数据请求失败');
            });
        }
        //更新联赛
        else if (param.type === 'league') {
            var obj = {
                from: param.from || this.model.start_date,
                to: param.to || this.model.end_date
            };
            getLeagueByTime.getData(obj).then(function (rsp) {
                var list = rsp.data.list;
                var _obj = {}
                list.unshift({leagueShortName: '全部联赛', leagueId: "-1"});
                Object.assign(_obj, oParam, {
                    liansaiInfo: list,
                    start_date: obj.from,
                    end_date: obj.to
                })
                def.resolve(_obj);
            }, function () {
                def.reject();
                console.log('数据请求失败');
            });
        }
        //其他静态更新
        else {
            return def.resolve(oParam);
        }
        return def;
    }
});

module.exports = model;