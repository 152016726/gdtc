import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : '';

module.exports = {
    getData: (data = {}) => {
        //return service.getData(action, data);
        return new Promise(function (res, rej) {
            res(
                {
                    "status": { "code": 0, "message": "" },
                    "result": [
                        { "offer_id": "874903363", "o1": "1.94", "o2": "1.92", "o3": "\u5e73\u624b\/\u534a\u7403", "date_time": "2018-04-18 01:28", "o1_change": "down", "o2_change": "up" },
                        { "offer_id": "874903363", "o1": "1.96", "o2": "1.90", "o3": "\u5e73\u624b\/\u534a\u7403", "date_time": "2018-04-18 01:20", "o1_change": "up", "o2_change": "down" },
                        { "offer_id": "874903363", "o1": "1.94", "o2": "1.92", "o3": "\u5e73\u624b\/\u534a\u7403", "date_time": "2018-04-18 00:57", "o1_change": "down", "o2_change": "up" },
                        { "offer_id": "874903363", "o1": "1.96", "o2": "1.90", "o3": "\u5e73\u624b\/\u534a\u7403", "date_time": "2018-04-18 00:38", "o1_change": "down", "o2_change": "up" },
                        { "offer_id": "874903363", "o1": "2.00", "o2": "1.86", "o3": "\u5e73\u624b\/\u534a\u7403", "date_time": "2018-04-17 23:09", "o1_change": "up", "o2_change": "down" },
                        { "offer_id": "874178467", "o1": "1.74", "o2": "2.12", "o3": "\u5e73\u624b", "date_time": "2018-04-17 23:07", "o1_change": "down", "o2_change": "up" },
                        { "offer_id": "874178467", "o1": "1.80", "o2": "2.06", "o3": "\u5e73\u624b", "date_time": "2018-04-17 18:40", "o1_change": "down", "o2_change": "up" },
                        { "offer_id": "874178467", "o1": "1.88", "o2": "1.98", "o3": "\u5e73\u624b", "date_time": "2018-04-17 14:39", "o1_change": "up", "o2_change": "down" },
                        { "offer_id": "874903363", "o1": "1.94", "o2": "1.92", "o3": "\u5e73\u624b\/\u534a\u7403", "date_time": "2018-04-18 01:28", "o1_change": "down", "o2_change": "up" },
                        { "offer_id": "874903363", "o1": "1.96", "o2": "1.90", "o3": "\u5e73\u624b\/\u534a\u7403", "date_time": "2018-04-18 01:20", "o1_change": "up", "o2_change": "down" },
                        { "offer_id": "874903363", "o1": "1.94", "o2": "1.92", "o3": "\u5e73\u624b\/\u534a\u7403", "date_time": "2018-04-18 00:57", "o1_change": "down", "o2_change": "up" },
                        { "offer_id": "874903363", "o1": "1.96", "o2": "1.90", "o3": "\u5e73\u624b\/\u534a\u7403", "date_time": "2018-04-18 00:38", "o1_change": "down", "o2_change": "up" },
                        { "offer_id": "874903363", "o1": "2.00", "o2": "1.86", "o3": "\u5e73\u624b\/\u534a\u7403", "date_time": "2018-04-17 23:09", "o1_change": "up", "o2_change": "down" },
                        { "offer_id": "874178467", "o1": "1.74", "o2": "2.12", "o3": "\u5e73\u624b", "date_time": "2018-04-17 23:07", "o1_change": "down", "o2_change": "up" },
                        { "offer_id": "874178467", "o1": "1.80", "o2": "2.06", "o3": "\u5e73\u624b", "date_time": "2018-04-17 18:40", "o1_change": "down", "o2_change": "up" },
                        { "offer_id": "874178467", "o1": "1.88", "o2": "1.98", "o3": "\u5e73\u624b", "date_time": "2018-04-17 14:39", "o1_change": "up", "o2_change": "down" },
                        { "offer_id": "874178467", "o1": "1.86", "o2": "2.00", "o3": "\u5e73\u624b", "date_time": "2018-04-16 23:17", "o1_change": "equal", "o2_change": "equal" }
                    ]
                }
            )
        })

    }
};


