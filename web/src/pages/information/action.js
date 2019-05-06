/**
 * Created by ljx on 2018/4/17.
 */
require('./style.scss');
require('plugin/swiper/css/swiper.css');
var pageIds = require("constants/articleConfig");
var $ = require("jquery");
var Swiper = require('plugin/swiper/js/swiper.js');
var getStaticCMSNews = require("services/getStaticCMSNews.js");
var PAGESIZE = 6; // 每次加载的新闻条数
var PAGEINDEX = 0; // 起始的index
var HOT_NEWS_NODEID = [pageIds.HOT_NEWS_NODEID];                // 热门
var INFORMATION_MATCH_PAGEID = [                                // 赛事分析
    pageIds.PREMIER_LEAGUE_NODEID,
    pageIds.SPANISH_LIGA_NODEID,
    pageIds.SERIE_A_NODEID,
    pageIds.BUNDESLIGA_NODEID,
    pageIds.FRENCH_ARMOR_NODEID,
    pageIds.CHAMPIONS_NODEID
];
var INFORMATION_SPECIAL_PAGEID = [pageIds.EXPERT_NODEID];       // 专家预测
var INFORMATION_OUTHOOD_PAGEID = [pageIds.OFFSITELACE_NODEID];  // 场外花边

var ops = {
    "hot": HOT_NEWS_NODEID,
    "match": INFORMATION_MATCH_PAGEID,
    "expert": INFORMATION_SPECIAL_PAGEID,
    "outhood": INFORMATION_OUTHOOD_PAGEID
};

$(function () {
    initData();
});

function initData() {
    // header的active效果
    $(".navigation li:eq(2)", "#header").addClass('active');
    // banner轮播
    setBanner();
    // 竞彩图集
    // setPhotoList();
    // 热门
    loadHot();
    // 热门资讯
    setStaticData(HOT_NEWS_NODEID, PAGEINDEX, $(".unfold", ".information .item:eq(0)"));
    // 赛事分析
    setStaticData(INFORMATION_MATCH_PAGEID, PAGEINDEX, $(".unfold", ".information .item:eq(1)"));
    // 专家预测
    setStaticData(INFORMATION_SPECIAL_PAGEID, PAGEINDEX, $(".unfold", ".information .item:eq(2)"));
    // 场外花边
    setStaticData(INFORMATION_OUTHOOD_PAGEID, PAGEINDEX, $(".unfold", ".information .item:eq(3)"));
    // 热门资讯,赛事分析,专家预测,场外花边的Tab切换
    toggleDiv('topic', 'news');
    // 热门资讯,赛事分析,专家预测,场外花边的加载更多
    $(".unfold", ".information .item").on('click', function (e) {
        e.preventDefault();
        var self = $(this);
        var tag = self.attr("tag");
        var ids = ops[tag];
        var index = Math.ceil(self.parent().prev().children('li').length / 6);
        setStaticData(ids, index, self);
    });
    // 积分排名的Tab切换
    toggleDiv('teamRank', 'teamLeagueRank');

    /**
     * description          Tab切换
     * @param elementID     Tab元素ID
     * @param subElementID  Tab对应content的ID
     */
    function toggleDiv(elementID, subElementID) {
        var ele = "#" + elementID + ' a';
        $(ele).each(function (i) {
            $(this).on("click", function (e) {
                e.preventDefault();
                $(ele).removeClass("active").eq(i).addClass("active");                  // title类名改变
                setTimeout(function () {                                               // content类名改变
                    $("#" + subElementID).find(".item").removeClass("active").eq(i).addClass("active");
                }, 200)
            })
        });
    }

    /**
     * description  后台获取数据，加载至content中
     * @param id    id
     * @param index pageIndex
     * @param self  被点击的.unfold元素
     */
    function setStaticData(ids, index, $el) {
        getStaticCMSNews.getData({"nodeIds": ids, "pageIndex": index, "pageSize": PAGESIZE}).then(function (reqData) {
            var list = reqData.data.list;
            var strData = loadMoreArticles(list);
            $el.parent().prev().append(strData.join(" "));
            if (list.length < PAGESIZE) {
                $el.parent().html('<span>没有更多资讯</span>');
            }
        }, function (rsp) {
            console.log(rsp);
        })
    }

    /**
     * description 点击加载更多
     * @param data 后台给的数据
     * @returns {*}
     */
    function loadMoreArticles(data) {
        return data.map(function (item, index) {
            // 链接跳转
            var link = item.link ? item.link : "#:;";
            // 图片
            var titleImage = !!item.titleImage ? item.titleImage : "";
            // 粗体
            var titleIsBolder = item.titleIsBolder === 'true' ? "bold" : "";
            // 斜体
            var titleIsEm = item.titleIsEm === 'true' ? "italic" : "";
            // 颜色
            var titleColor = !!item.titleColor ? "color:" + item.titleColor : "";
            // 分割线
            var line = index !== data.length - 1 ? "<div class='line'> </div>" : "";
            // 标签/关键字
            var label = !!item.label ? "<div class='fl'><i className='tag'>标签：</i> <em className='league'> " + item.label + " </em></div>" : '';
            // 日期
            var date = item.publishDate ? item.publishDate.split(" ")[0].slice(5) : '';
            // 时间
            var time = item.publishDate ? item.publishDate.split(" ")[1].slice(0, 5) : '';
            // 跳转方式
            var targetType = item.link ? '_blank' : '_self';
            var article = [
                "<li class='clearfix'>",
                    "<a class='avatar fl' target=" + targetType + " href=" + link + ">",
                        "<i style='background: url(" + titleImage + ") no-repeat;background-size:cover;'></i>",
                    "</a>",
                    "<div class='content fl'>",
                        "<h2>",
                            "<a target=" + targetType + " href=" + link + " class=" + titleIsBolder + " " + titleIsEm + " style=" + titleColor + ";>" + item.title + "</a>",
                        "</h2>",
                        "<p>",
                            "<a target=" + targetType + " title=" + item.description + " href=" + link + ">" + item.description + "</a>",
                        "</p>",
                        label,
                        "<div class='fr'>",
                            "<i class='date'>" + date + "</i><i class='time'>" + time + "</i>",
                        "</div>",
                    "</div>",
                "</li>",
                line
            ].join("");
            return article
        })
    }

    /**
     * 接口生成头条下的热门栏
     */
    function loadHot() {
        getStaticCMSNews.getData({"nodeIds": HOT_NEWS_NODEID, "pageIndex": PAGEINDEX, "pageSize": PAGESIZE}).then(function (reqData) {
            var list = reqData.data.list;
            $(".bold", ".information .teamsInfo .hot").html(loadTitles(list[0], true));
            $(".articleContent", ".information .teamsInfo .hot").html(list.map(function (val, index) {
                if (index === 0) {
                    return;
                }
                return loadTitles(val, false)
            }).join(""))
        }, function (rsp) {
            console.log(rsp);
        })
    }

    /**
     * description     热门的titles
     * @param ops      后台返回的每一行title
     * @param isSetTop 是否置顶
     * @returns {string}
     */
    function loadTitles(ops, isSetTop) {
        var titleIsBolder = ops.titleIsBolder === 'true' ? 'bold' : '';
        var titleIsEm = ops.titleIsEm === 'true' ? 'italic' : '';
        var titleColor = ops.titleColor ? 'color:' + ops.titleColor : '';
        var targetType = ops.link ? '_blank' : '_self';
        return [
            isSetTop ? "" : "<li>",
            "<a target=" + targetType + " title=" + ops.title + " href=" + ops.link + " class=" + titleIsBolder + " " + titleIsEm + " style=" + titleColor + ";>",
            isSetTop ? "" : "<i></i>",
            ops.title,
            "</a>",
            isSetTop ? "" : "</li>",
        ].join("")
    }

    /**
     * description banner轮播
     */
    function setBanner() {
        var mySwiper = new Swiper('.swiper-container', {
            pagination: '.pagination',
            loop: true,
            autoplay: 5000,
            speed: 3000,
            grabCursor: true,
            paginationClickable: true
        });
        // 设置轮播的页码
        var paginations = $(".swiper-pagination-switch", ".swiper-container .pagination");
        paginations.each(function (i) {
            paginations.eq(i).html(i + 1);
        });
    }

    /**
     * description 竞彩图集
     */
    // function setPhotoList() {
    //     var photoSwiper = new Swiper('#photoContainer', {
    //         loop: true,
    //         speed: 1000,
    //         slidesPerView: 3,
    //         grabCursor: true
    //     });
    //     // 向左切换
    //     $(".leftBtn", ".photoList").on('click', function (e) {
    //         e.preventDefault();
    //         photoSwiper.swipePrev()
    //     });
    //
    //     // 向右切换
    //     $(".rightBtn", ".photoList").on('click', function (e) {
    //         e.preventDefault();
    //         photoSwiper.swipeNext()
    //     });
    //
    //     // 滑入，滑出轮播跟着停止，启动
    //     $("#photobox").mouseover(function () {
    //         photoSwiper.stopAutoplay();
    //     }).mouseout(function () {
    //         photoSwiper.startAutoplay();
    //     });
    // }
}