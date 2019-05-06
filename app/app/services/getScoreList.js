/**
 * Created by sanji on 2018/10/15.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let instantAction = isDebug ? 'score/scoreInstantList' : 'soccer/versusLive';
let completionAction = isDebug ? 'score/scoreCompletionList' : 'soccer/versusLive';
let gamesAction = isDebug ? 'score/scoreGamesList' : 'soccer/versusLive';
let attentionAction = isDebug ? 'score/scoreGamesList' : 'soccer/versusLive';

module.exports = {
    getInstantData(data) {
        return new Promise((resolve, reject) => {
            service.getData(instantAction, data || {}, {}).then((data) => {
                resolve(data);
            }, reject);
        });
    }
    ,
    getCompletionData(data) {
        return new Promise((resolve, reject) => {
            service.getData(completionAction, data || {}, {}).then((data) => {
                resolve(data);
            }, reject);
        });
    },
    getGamesData(data) {
        return new Promise((resolve, reject) => {
            service.getData(gamesAction, data || {}, {}).then((data) => {
                resolve(data);
            }, reject);
        });
    },
    getAttentionData(data) {
        return new Promise((resolve, reject) => {
            service.getData(attentionAction, data || {}, {}).then((data) => {
                resolve(data);
            }, reject);
        });
    }
};
