import Vue from 'vue';
import './index.scss';
import template from './index.template';
import collapse from '../../images/collapse.png';
import expend from '../../images/expend.png';

module.exports = Vue.component('selections', {
    data(){
        return {
            placeholder: '',
            isFold: false,     // 是否展开
            collapse,
            expend
        }
    },
    template,
    props:{
        optionList:{default: [{name: '', id: ''}]},
        placeholderText: {default: ''},
        defaultId: {default: ''}
    },
    watch:{
        defaultId(val){
            let flag = this.optionList.every((item)=> {
                if(item.id === val){
                    this.placeholder = item.name;
                    return false
                }else{
                    return true
                }
            });
            if(flag){
                this.placeholder = this.placeholderText
            }
        },
        optionList(val){
            let flag = val.every((item)=> {
                if(item.id === this.defaultId){
                    this.placeholder = item.name;
                    return false
                }else{
                    return true
                }
            });
            if(flag){
               this.placeholder = this.placeholderText
            }
        }
    },
    methods:{
        /**
         * 点击展开与收起选项栏
         */
        tabClick(){
            this.isFold = !this.isFold;
        },
        /**
         * 子项的点击事件
         * @param val
         */
        itemClick(val){
            this.isFold = false;
            this.placeholder = val.name;
            this.$emit('transfer',val);
        }
    },
    mounted(){
        // 如果外部未传递默认展示的defaultId,则显示placeholderText
        if(!!this.placeholderText){
            this.placeholder = this.placeholderText
        }
        // 遍历optionList找到与defaultId匹配的一项
          this.optionList.forEach((item, index)=> {
                if(item.id === this.defaultId){
                    this.placeholder = item.name;
                }
          })
    }
});