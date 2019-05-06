/**
 * Created by mac-ddt on 2018/9/4.
 */
export default {
    data: [],               //投注数据
    arrExtendFlag: [],      //扩展参数数组
    isDisableOne: false,    //是否屏蔽单个不能改变
    price: null,              //计划购买金额
    amount: 0,              //生成注数
    minBonus: 0,            //最小奖金
    maxBonus: 0,            //最高奖金
    multiple: 1,            //投注倍数
    pay: 0,                 //投注金额
    optimizeType: 0,         //优化类别  平均优化 0、搏冷优化 1、博热优化 2
    isLogin : false
}