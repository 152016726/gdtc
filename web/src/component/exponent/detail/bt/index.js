import Vue from "vue";
import tpl from "./index.template";
import getExponentialListDetail from '../../../../services/getExponentialListDetail'
import '../../../../pages/raceCourse/component/betOutCome/index'
import '../../style.scss'


let type = 'bt';

module.exports = Vue.component('exponent-detail-bt', {
    data() {
        return {
            list: [],         //列表数据
            dataType: 'home'
        }
    },
    mounted: function () {
        let vid = this.vid;
        getExponentialListDetail.getData({
            vid,
            market: type
        }).then((rsp) => {
            this.list = rsp.data[type];
        });
    },
    props: {
        vid: {
            default: ''
        }
    },
    methods: {
        getTypeName: function () {
            let type = this.dataType;
            if (type === 'home') {
                return '主';
            }
            if (type === 'draw') {
                return '平';
            }
            else {
                return '客';
            }
        },
        changeDataType: function (type) {
            this.dataType = type;
        },
        getTimeStr: (str) => {
            if(!str){
                return ''
            }
            return new Date(str).format('MM-dd hh:mm')
        }
    },
    template: tpl
});

