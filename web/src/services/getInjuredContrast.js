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
                    "result": {
                        "h": {
                            "tid": "2018",
                            "team_name": "\u62c9\u79d1\u9c81\u5c3c\u4e9a",
                            "team_name_abbr": "\u62c9\u79d1",
                            "injury": [{ "person_id": "9407", "description": "Hamstring", "person_name": "Sidnei", "shirtnumber": "12", "goals": "1", "starting_pole": 20, "appearances": "20" }, { "person_id": "622", "description": "Thigh Muscle Rupture", "person_name": "S. Muntari", "shirtnumber": "21", "goals": "0", "starting_pole": 5, "appearances": "6" }, { "person_id": "61475", "description": "Thigh Muscle Rupture", "person_name": "B\u00f3veda", "shirtnumber": "4", "goals": "0", "starting_pole": 7, "appearances": "8" }, { "person_id": "263165", "description": "Knock", "person_name": "F. Cartabia", "shirtnumber": "9", "goals": "2", "starting_pole": 16, "appearances": "19" }]
                        },
                        "a": {
                            "tid": "2021",
                            "team_name": "\u585e\u7ef4\u5229\u4e9a",
                            "team_name_abbr": "\u585e\u7ef4\u5229\u4e9a",
                            "injury": [{ "person_id": "11744", "description": "Hamstring", "person_name": "S. Kj\u00e6r", "shirtnumber": "4", "goals": "1", "starting_pole": 16, "appearances": "18" }],
                            "suspension": [{ "person_id": "146646", "description": "Yellow card accumulation suspension", "person_name": "W. Ben Yedder", "shirtnumber": "9", "goals": "6", "starting_pole": 15, "appearances": "20" }]
                        }
                    }
                }
            )
        })

    }
};

