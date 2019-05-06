import getAreaRegions from '~/services/getAreaRegions'
module.exports = {
    data:null,
    hadSend: false,
    getData(){
        if(this.hadSend){
            return new Promise((resolve)=>{
                resolve(this.data)
            });
        }else{
            this.hadSend = true;
            return getAreaRegions.getData().then(rsp => {
                this.data = rsp.data;
                return this.data;
            });
        }
    }
}