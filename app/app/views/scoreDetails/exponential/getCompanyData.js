import getExponentialList from '~/services/getExponentialList';

module.exports = {
    getConstructor() {
        return new function () {
            return {
                data: null,
                //hadSend: false,
                getData(obj) {
                    if (this.data) {
                        return new Promise((resolve) => {
                            resolve(this.data)
                        });
                    } else {
                        //this.hadSend = true;
                        return getExponentialList.getData(obj).then(rsp => {
                            this.data = rsp;
                            return this.data;
                        });
                    }
                }
            }
        };
    }
}