/**
 * 定义push需要绑定的方法及key
 * Created by DDT on 2018/10/29.
 */
module.exports = {
    // 赛事信息更新
    // 指定绑定方法 onEventInfoUpdate(vid, callback)
    eventInfoUpdate: {
        key: 'event_info_update'
    },
    // 赛事文字直播更新
    // 指定绑定方法 onEventTextUpdate(vid, callback)
    eventTextUpdate: {
        key: 'event_text_update'
    }
};