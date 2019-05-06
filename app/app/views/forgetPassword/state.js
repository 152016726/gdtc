/**
 * Created by ljx on 2018/11/13.
 */
export default {
    num: 59,                        // 倒计时
    isCountdown: false,             // 是否开启计时器
    codeCheck: '',                  // 后台返回的验证码
    EXPLIST: {                      // 正则表达式集合
        phone:/^1[34578]\d{9}$/,
        pwd:/^[\w_-]{6,20}$/
    },
    timerOps: {                     // 定时器固定配置
        key: 'forgetPassword',
        duration: 60
    },
    clear: {                        // 输入框清除/重置的配置项
        phone: 'phoneNum',          // 手机号与state里的保持一致
        pwd: 'password',            // 新密码与state里的保持一致
        pwdCheck:'passwordCheck',   // 检查密码与state里的保持一致
        imgCode: 'imgCode'          // 图形验证码
    }
}