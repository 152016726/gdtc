/**
 * Created by feng on 2018/06/01.
 */
require('./style.scss');
var $ = require('jquery');
var TplCompiler = require('modules/tplCompiler');
var Model = require('./model');
var layDate = require('plugin/laydate/laydate.js');
var view = new TplCompiler({
    tplModel: Model,
    template: require('./view.art'),
    events: {
        'click .lianSaiName': 'choseLianSaiHandle',
        'click .chose_allMarket': 'lianSaiHandle',
        'click .search_bth': 'searchHandle',
        'click #single_btn': 'singlehandle',
        'click .updata_btn': 'updatePage'
    },
    rendered: function () {
        var _this = this;
        var nowDate = new Date();
        var maxDate = Model.setDate(nowDate);
        var pageTool = avalon.vmodels['ms-page-tool'];
        //渲染完假如没有联赛数据，就请求接口拿数据
        if (this.model.liansaiInfo.length === 0) {
            this.tplModel.setParam([{
                type: 'league',
                from: _this.model.start_date,
                to: _this.model.end_date
            }, _this.model]);
            this.reRender();
        }
        //绑定查询日期选择功能
        lay('.data_input').each(function () {
            layDate.render({
                elem: this,
                theme: "#dbdb79",
                trigger: 'click',
                showBottom: false,
                max: maxDate,
                done: function (value, dateObj) {
                    var startDate = $('#start_time').val();
                    var endDate = $('#end_time').val();
                    var startDateTS = new Date(startDate).getTime();
                    var endDateTS = new Date(endDate).getTime();
                    var isStartTime = this.elem.hasClass('start_time');
                    var timeRange = 3 * 24 * 3600 * 1000;
                    //假如选择的开始日期大于结束日期，将开始日期和结束日期改为相同值
                    if (startDateTS > endDateTS) {
                        if (isStartTime) {
                            var nowDateTS = nowDate.getTime();
                            var startDateTSAdded = startDateTS + timeRange;
                            var tsValue = startDateTSAdded > nowDateTS ? nowDateTS : startDateTSAdded;
                            _this.model.start_date = startDate;
                            _this.model.end_date = _this.setDate(new Date(tsValue));
                        }
                        else {
                            _this.model.start_date = _this.setDate(new Date(endDateTS - timeRange));
                            _this.model.end_date = endDate;
                        }
                    }
                    //假如选择的开始日期与结束日期间隔大于7天
                    else if (endDateTS - startDateTS > timeRange) {
                        if (isStartTime) {
                            var nowDateTS = nowDate.getTime();
                            var startDateTSAdded = startDateTS + timeRange;
                            var tsValue = startDateTSAdded > nowDateTS ? nowDateTS : startDateTSAdded;
                            _this.model.start_date = startDate;
                            _this.model.end_date = _this.setDate(new Date(tsValue));
                        }
                        else {
                            _this.model.start_date = _this.setDate(new Date(endDateTS - timeRange));
                            _this.model.end_date = endDate;
                        }
                    }
                    else {
                        if (isStartTime) {
                            _this.model.start_date = startDate;
                        }
                        else {
                            _this.model.end_date = endDate;
                        }
                    }
                    //重新请求接口
                    _this.tplModel.setParam([{
                        type: 'league',
                        from: _this.model.start_date,
                        to: _this.model.end_date
                    }, _this.model]);
                    _this.reRender();
                }
            });
        });

        $(window).scroll(function () {
            var sh = $(window).scrollTop() - $('.market_content')[0].offsetTop - 1;
            if (sh <= 0) {
                $('#search').stop().css({top: 0, zIndex: 'initial'});
            } else {
                $('#search').css({zIndex: 999});
                $('#search').stop().animate({top: sh});
            }
        });

        $(document).click(function () {
            $('.liansaiList').slideUp();
        });
        pageTool.pageSize = this.model.pageSize;
    },
    updatePage: function () {
        location.href = './soccerResult.html';
    },
    choseLianSaiHandle: function (e) {
        // e.stopPropagation();
        var el = $(e.currentTarget);
        var str = el.text();
        var num = el.attr('data');
        this.model.leagueCheckedText = str;
        this.model.leagueChecked = [num];
        this.tplModel.setParam([{}, this.model]);
        this.reRender();
        $('.liansaiList').slideUp(300);
    },
    lianSaiHandle: function (e) {
        e.stopPropagation();
        $('.liansaiList').slideToggle();
        $('.layui-laydate').fadeOut(100);
    },
    searchHandle: function (e) {
        var start_date = this.model.start_date;
        var end_date = this.model.end_date;
        var isSingle = this.model.isSingle;
        this.tplModel.setParam([{
            type: 0,
            start_date,
            end_date,
            isSingle
        }, this.model]);
        this.reRender();

    },
    singlehandle: function (e) {
        var isSingle = !this.model.isSingle;
        this.model.isSingle = isSingle;
        this.tplModel.setParam([{type: 0, isSingle}, this.model]);
        this.reRender();
    },
    setDate: function (date) {
        var yy = date.getFullYear();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        mm = mm > 9 ? mm : ('0' + mm);
        dd = dd > 9 ? dd : ('0' + dd);
        return yy + '-' + mm + '-' + dd;
    }
});

module.exports = view;