/**
 * Created by oWEn on 2018/8/31.
 */
export default {
    repairZero: function (num) {
        return num < 10 ? ('0' + num) : ('' + num);
    },

    getDateObj: function (date) {
        date = new Date(parseInt(date));
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        y = this.repairZero(y);
        m = this.repairZero(m);
        d = this.repairZero(d);
        return {
            y, m, d
        }
    },

    getDateText: function (date) {
        let obj = this.getDateObj(date);
        return `${obj.m}月${obj.d}日`;
    }
}