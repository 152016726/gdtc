/**
 * Created by marcus on 2018/11/7.
 */
export default{
    num: 59,                      // 倒计时
    isCountdown: false,          // 是否开启计时器
    codeCheck: '',               // 后台返回的验证码
    EXPLIST: {                   // 正则表达式集合
        phone:/^1[34578]\d{9}$/,
        imgCode:/^[a-zA-Z0-9]{4}$/,
        pwd:/^[\w_-]{6,20}$/
    },
    clear: {                    // 输入框清除/重置的配置项
        phone: 'phoneNum',      // 手机号与state里的保持一致
        imgCode: 'imgCode',     // 图形验证码
        pwd: 'password'        // 密码与state里的保持一致
    },
    timerOps: {                // 定时器固定配置
        key: 'register',
        duration: 60
    }
}