/**
 * Created by marcus on 2018/11/7.
 */
export default{
    test: '我是test',
    isLogin: false,      //已经登录
    times: 500,          // 动画持续时间
    tab: {               // 路由导航跳转的配置项
        reg: 'Register',
        fPWD: 'ForgetPassword',
        doc: 'UserAgreement'
    },
    EXPLIST: {                   // 正则表达式集合
        imgCode:/^[a-zA-Z0-9]{4}$/
    },
    clear: {
        ac: 'account',      // 账户与state里的保持一致
        imgCode: 'imgCode',  // 图形验证码
        pwd: 'password'      // 密码与state里的保持一致
    }
}