import React from "react";
import {AsyncStorage} from "react-native";

export default class commonDataManager {

    static put(KEY,obj) {
        return this.getAll(KEY)
            .then(list => {

                if (!list) {
                    list = [];
                }
                list = list.filter(item => item !== obj);
                list = [obj,...list];
                // console.log('缓存Put',list,obj);
                return AsyncStorage.setItem(KEY, JSON.stringify(list));
            })
            .catch(err => {
                console.warn(err);
            });
    }

    static getAll(KEY) {

        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(KEY)
                .then(ret => {
                    // console.log('缓存get',JSON.parse(ret));
                    if (ret && ret !== 'null') {
                        resolve(JSON.parse(ret));
                    } else {
                        resolve(null);
                    }
                })
                .catch(err=> {
                    reject(err);
                    console.warn(err);
                });
        });

    }

    static clearAll(KEY) {
        return AsyncStorage.removeItem(KEY);
    }
}
