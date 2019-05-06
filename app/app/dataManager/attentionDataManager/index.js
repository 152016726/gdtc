import React from "react";
import { AsyncStorage } from "react-native";
const KEY = "attentionData";//比分页面--收藏页面--KEY
export default class AttentionDataManager {

    /**
     * 收藏数据
     * @param data 比赛
     * @param isChoose 是收藏 还是删除
     * @returns {Promise.<T>}
     */
    static put(data, isChoose) {
        return this.getAll()
            .then(list => {
                if (!list) {
                    list = [];
                }
                if (isChoose) {
                    //找到收藏列表的相同的元素  收藏
                    list = list.filter(item => item.vid !== data.vid);
                    Object.assign(data, { isFavourite : true });
                    list = [ data, ...list ];
                    // console.log('收藏', list);
                } else {
                    //找到收藏列表的相同的元素  删除
                    list = list.filter(item => item.vid !== data.vid);
                    Object.assign(data, { isFavourite : false });
                    // console.log('删除收藏', list);
                }
                //更新缓存
                return  AsyncStorage.setItem(KEY, JSON.stringify(list));
            })
            .catch(err => {
                console.warn(err);
            });
    }

    /**
     * 获取全部缓存数据
     * @returns {Promise}
     */
    static getAll() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(KEY)
                .then(ret => {
                    if (ret && ret !== 'null') {
                        /**
                         * 筛选当日10：30前的比赛 如果超出10：30即下一日 排除昨天赛事的关注
                         * vsDate:比赛时间 timeLine:时间分界线 now:当前时间
                         */
                        // let vsDate, timeLine, dataArr, now;
                        let dataArr;
                        dataArr = JSON.parse(ret);
                        // dataArr.forEach((item, index) => {
                        //     vsDate = Date.parse(item.vsDate).toString();
                        //     timeLine = Date.parse(new Date().toLocaleDateString() + ' 10:30').toString();
                        //     now = Math.round(new Date() / 1000);
                        //     timeLine = parseInt(timeLine.substr(0, 10));
                        //     vsDate = parseInt(vsDate.substr(0, 10));
                        //     //当比赛时间小于时间分割线 当前时间又大于分割线 等于比赛过期
                        //     if (vsDate < timeLine && now > timeLine) {
                        //         //删除旧数据 更新缓存数据
                        //         dataArr.splice(index, 1);
                        //         AsyncStorage.setItem(KEY, JSON.stringify(dataArr));
                        //     }
                        // });
                        resolve(dataArr);
                    } else {
                        resolve(null);
                    }
                })
                .catch(err => {
                    reject(err);
                    console.warn(err);
                });
        });

    }

    /**
     * 删除全部缓存数据
     * @returns {*}
     */
    static clearAll() {
        return AsyncStorage.removeItem(KEY);
    }
}
