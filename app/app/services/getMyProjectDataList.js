import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let projectAction = isDebug ? 'myProject/myProject' : 'personal/getmyplan';
let saveAction = isDebug ? '' : 'personal/saveplan';
let deleteAction = isDebug ? '' : 'personal/delplan';

module.exports = {
    getData(data) {
        return new Promise((resolve, reject) => {
            service.getData(projectAction, data || {}, {}).then((data) => {
                resolve(data);
            }, reject);
        });
    },
    saveData(data) {
        return new Promise((resolve, reject) => {
            service.getData(saveAction, data || {}, {}).then((data) => {
                resolve(data);
            },
                reject);
        });
    },
    deleteData(data){
        return new Promise((resolve, reject) => {
            service.getData(deleteAction, data || {}, {}).then((data) => {
                    console.log(data);
                    resolve(data);
                },
                reject);
        });
    }
};
