/**
 * Created by easyLottoMac on 2018/10/10.
 */

import './index.scss';
import template from './index.template';
import Vue from 'vue';
import '../sortButton';
let _selectActive = {};

let winDrawWinSelect = Vue.component('win-draw-win-select', {
    data(){
        return {
            textArr:[
                {
                    text:'恢复默认排序',
                    typeId: 0,
                    className: false,
                },
                {
                    text:'从低到高',
                    typeId: 1,
                    className: 'upIcon'
                },
                {
                    text:'从高到低',
                    typeId: 2,
                    className: 'downIcon'
                },
                {
                    text:'从低到高(让球)',
                    typeId: 3,
                    className: 'upIcon'
                },
                {
                    text:'从高到低(让球)',
                    typeId: 4,
                    className:'downIcon'
                }
            ],
            selectArr:[false, false ,false ,false, false]  //选中状态
        }
    },
    props:{
        titleText: {  //title 展示的文字
            default: ''
        },
        oneMarket: {  //是否只操作胜平负
            default: false
        }
    },
    template: template,
    created(){
        // 但是单关固定时只显示胜平负玩法的选择
        if(this.oneMarket){
            this.textArr.splice(-2,2)
        };
        //记录当前组件
        _selectActive[`uid_${this._uid}`] = this;
    },
    destroyed(){
        //销毁组件记录
        delete _selectActive[`uid_${this._uid}`];
    },
    methods: {
        /**
         * 玩法排序方式事件
         * @param index  玩法对应的索引下标
         */
        selectHandle(index){
            let selectArr = this.selectArr;
            // 父组件回调事件
            this.$emit('clickHandle', index);
            //更新显示状态
            selectArr.forEach((sel, i)=>{
                if(index === i){
                    selectArr[i] = !selectArr[i]
                }else {
                    selectArr[i] = false
                }
            });
            this.selectArr = selectArr.slice(0);
            this.hideOtherSelect();
        },
        /**
         * 清除其他玩法的赛选选项
         */
        hideOtherSelect(){
            let defSelect = [false, false ,false ,false, false]; //默认的选中状态
            for (let i in _selectActive ) {
                if (_selectActive[i]._uid !== this._uid){
                    _selectActive[i].selectArr = defSelect;
                }
            }
        }
    }
});

module.exports = winDrawWinSelect;