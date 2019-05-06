/**
 * Created by ljx on 2018/11/14.
 */
export default{
    test: '我是test',
    EXPLIST:{                       // 正则表达式集合
        pwd:/^[\w_-]{6,20}$/
    },
    clear:{                        // 输入框清除/重置的配置项
        curPwd: 'curPwd',          // 当前密码与state里的保持一致
        newPwd: 'newPwd',          // 新密码与state里的保持一致
        checkPwd:'checkPwd'        // 检查密码与state里的保持一致
    }
}