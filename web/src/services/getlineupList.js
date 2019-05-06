/**
 * Created by ljx on 2018/4/24.
 */
import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'live/playerList' : 'soccer/versusLineups';

module.exports = {
    getData: (data = {}) => {
        return service.getData(action, data || {}, {});
        //return service.getData(action, data);
        /*return new Promise(function (res, rej) {
            res({
                "rspCode": "SUCCESS",
                "rspMsg": "success",
                data: {
                    "away": {
                        "tid": "123",
                        "formation": "4-4-2",
                        "coachCn": "费尔南德斯, 达尼洛",
                        "coachCnShort": "费尔南德斯, 达尼洛",
                        "lineupsBench": [
                            {
                                "playerCnShort": "范德雷",
                                "playerId": 77526,
                                "playerCn": "范德雷",
                                "position": "G",
                                "shirtnumber": "12"
                            },
                            {
                                "playerCnShort": "范德雷",
                                "playerId": 77526,
                                "playerCn": "范德雷",
                                "position": "G",
                                "shirtnumber": "14"
                            },
                            {
                                "playerCnShort": "范德雷",
                                "playerId": 77526,
                                "playerCn": "范德雷",
                                "position": "G",
                                "shirtnumber": "15"
                            },
                            {
                                "playerCnShort": "范德雷",
                                "playerId": 77526,
                                "playerCn": "范德雷",
                                "position": "G",
                                "shirtnumber": "21"
                            },
                            {
                                "playerCnShort": "范德雷",
                                "playerId": 77526,
                                "playerCn": "范德雷",
                                "position": "G",
                                "shirtnumber": "51"
                            }
                        ],
                        "lineups": [
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "71",
                                "position": "G",
                                "positionX": "GK",
                                "positionY": "C"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "81",
                                "position": "G",
                                "positionX": "D1",
                                "positionY": "L"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "91",
                                "position": "G",
                                "positionX": "D1",
                                "positionY": "CL"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "01",
                                "position": "G",
                                "positionX": "D1",
                                "positionY": "CR"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "11",
                                "position": "G",
                                "positionX": "D1",
                                "positionY": "R"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "12",
                                "position": "G",
                                "positionX": "M",
                                "positionY": "L"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "16",
                                "position": "G",
                                "positionX": "M",
                                "positionY": "CL"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "18",
                                "position": "G",
                                "positionX": "M",
                                "positionY": "CR"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "10",
                                "position": "G",
                                "positionX": "M",
                                "positionY": "R"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "22",
                                "position": "G",
                                "positionX": "A",
                                "positionY": "CL"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "32",
                                "position": "G",
                                "positionX": "A",
                                "positionY": "CR"
                            }
                        ]
                    },
                    "home": {
                        "tid": "123",
                        "formation": "5-3-1",
                        "coachCn": "费尔南德斯, 达尼洛",
                        "coachCnShort": "费尔南德斯, 达尼洛",
                        "lineupsBench": [
                            {
                                "playerCnShort": "范德雷",
                                "playerId": 77526,
                                "playerCn": "范德雷",
                                "position": "G",
                                "shirtnumber": "13"
                            },
                            {
                                "playerCnShort": "范德雷",
                                "playerId": 77526,
                                "playerCn": "范德雷",
                                "position": "G",
                                "shirtnumber": "12"
                            },
                            {
                                "playerCnShort": "范德雷",
                                "playerId": 77526,
                                "playerCn": "范德雷",
                                "position": "G",
                                "shirtnumber": "21"
                            },
                            {
                                "playerCnShort": "范德雷",
                                "playerId": 77526,
                                "playerCn": "范德雷",
                                "position": "G",
                                "shirtnumber": "61"
                            },
                            {
                                "playerCnShort": "范德雷",
                                "playerId": 77526,
                                "playerCn": "范德雷",
                                "position": "G",
                                "shirtnumber": "18"
                            }
                        ],
                        "lineups": [
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "19",
                                "position": "G",
                                "positionX": "GK",
                                "positionY": "C"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "16",
                                "position": "G",
                                "positionX": "D1",
                                "positionY": "L"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "14",
                                "position": "G",
                                "positionX": "D2",
                                "positionY": "CL"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "10",
                                "position": "G",
                                "positionX": "D2",
                                "positionY": "CR"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "19",
                                "position": "G",
                                "positionX": "D1",
                                "positionY": "R"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "12",
                                "position": "G",
                                "positionX": "M",
                                "positionY": "L"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "13",
                                "position": "G",
                                "positionX": "M",
                                "positionY": "CL"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "111",
                                "position": "G",
                                "positionX": "M",
                                "positionY": "C"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "31",
                                "position": "G",
                                "positionX": "M",
                                "positionY": "R"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "41",
                                "position": "G",
                                "positionX": "A",
                                "positionY": "CL"
                            },
                            {
                                "playerId": 77526,
                                "playerCnShort": "范德雷",
                                "playerCn": "范德雷",
                                "shirtnumber": "51",
                                "position": "G",
                                "positionX": "A",
                                "positionY": "CR"
                            }
                        ]
                    }
                }

            }, function (rsp) {
                rej(rsp);
            })
        })*/

    }
};

