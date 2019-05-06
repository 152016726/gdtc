/**
 * Created by Administrator on 2018/8/8.
 */

// 计算阶乘
function factorial(n) {
    return n > 0 ? n * factorial(n - 1) : 1;
}

module.exports = {

    // 计算排列
    permutation: function (n, m) {
        return n < m ? false : factorial(n) / factorial(m);
    },
    // 计算组合
    combinations: function (n, m) {
        return n < m ? false : factorial(n) / (factorial(m) * factorial(n - m));
    },
    // 计算阶乘
    factorial: function (n) {
        return factorial(n);
    }
};



































