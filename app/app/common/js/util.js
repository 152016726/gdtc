/**
 * 必不可少的全局通用方法，不需要把模块相关方法防于这里
 */
let weeks = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六'
};
const util = {
    sortCollection: function (cole, arrKey) {
        if (!cole || !cole.length || cole.length == 0) return;
        cole.sort(function (item1, item2) {
            var arrCheckKey = arrKey.slice(0);
            return util.getSortResult(item1, item2, arrCheckKey);
        });
    },
    getSortResult: function (item1, item2, arrKey) {
        var key = arrKey.shift(),
            item1Val,
            item2Val;
        if (!key) return 0;

        if (key.indexOf('.') == -1) {
            item1Val = item1[key];
            item2Val = item2[key];
        } else {
            var arrKeys = key.split('.');
            item1Val = item1;
            item2Val = item2;
            arrKeys.forEach(function (inKey) {
                item1Val = item1Val[inKey];
                item2Val = item2Val[inKey];
            });
        }

        //数字型需要以数字排序
        if (!isNaN(+item1Val) && !isNaN(+item2Val)) {
            item1Val = +item1Val;
            item2Val = +item2Val;
        }

        if (item1Val > item2Val) {
            return 1;
        } else if (item1Val < item2Val) {
            return -1;
        } else {
            return util.getSortResult(item1, item2, arrKey);
        }
    },
    /**
     * 仅用于判断是否为空对象
     * @return boolean
     * @param  Object对象
     *
     * */
    isEmptyObject(obj) {
        return JSON.stringify(obj) === '{}';
    },
    /**旧的
     * 获取周
     * 按simpleNo判断
     * */
    getWeeks(num) {
        return weeks[num]
    },
    /**
     * 获取周
     * 按completeNo判断
     * dateString 为 20180929 的格式日期
     */
    getWeek(dateString) {
        let date;
        if (dateString.length == 0) {
            date = new Date();
        } else {
            // let formatedDate = dateString.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
            // date = new Date(formatedDate);
            date = Date.prototype.parseISO8601(dateString);
        }
        return "周" + "日一二三四五六".charAt(date.getDay());
    },
    /**
     * 获取前七天以及后三天的的日期数组
     * @returns {Array}
     */
    getRecentDays(){
        let _today = new Date();                        // 当天时间
        let _dateArr = [];                              // 日期数组
        let oneDay = 24 * 3600 * 1000;                  // 一天的秒数
        let _tenHalfDateStr = _today.getFullYear() + '/' + (_today.getMonth() + 1) + '/' + _today.getDate() + ' 10:30';
        let _tenHalfDate = new Date(_tenHalfDateStr);   // 当天10：30的时间
        // 判断当前时间是当天的10：30前或后
        if(_today.getTime() < _tenHalfDate.getTime()){
            // 还没到当天的10：30则日期回退一天
            _today = new Date(_today.getTime() - oneDay);
        }
        let sevenBefore = _today;  // 用于计算七天前的日期
        let threeFuture = _today;  // 用于计算三天后的日期
        // 前七天的日期
        for (let i = 6; i >=0; i--){
            sevenBefore = new Date(_today.getTime() - oneDay * i);
            _dateArr.push([sevenBefore.getFullYear(), sevenBefore.getMonth() + 1, sevenBefore.getDate()].join('-'));
        }
        // 后三天的日期
        for (let i = 1; i <= 3; i++) {
            threeFuture = new Date(_today.getTime() + oneDay * i);
            _dateArr.push([threeFuture.getFullYear(), threeFuture.getMonth() + 1, threeFuture.getDate()].join('-'))
        }
        // console.log('_dateArr----', _dateArr);
        return _dateArr;
    },
    /**
     * 时间戳转日期
     * @param now
     * @returns {string}
     */
    formatDate(now) {
        //得到时间对象
        now = new Date(now);
        //获取年
        let year = now.getFullYear();
        //获取月
        let month = now.getMonth() + 1;
        //如果月份小于10,则在前面加0补充为两位数字
        month=month>9?month:"0"+month;
        //获取日
        let date = now.getDate();
        //如果天数小于10,则在前面加0补充为两位数字
        date=date>9?date:"0"+date;
        //获取小时
        let hour = now.getHours();
        //如果小时数字小于10,则在前面加0补充为两位数字
        hour=hour>9?hour:"0"+hour;
        //获取分
        let minute = now.getMinutes();
        //如果分钟小于10,则在前面加0补充为两位数字
        minute=minute>9?minute:"0"+minute;
        //获取秒
        let second = now.getSeconds();
        //如果秒数小于10,则在前面加0补充为两位数字
        second=second>9?second:"0"+second;
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
};
module.exports = util;