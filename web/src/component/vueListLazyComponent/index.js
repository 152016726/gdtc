/**
 * vue列表懒加载组件
 * Created by DDT on 2018/11/3.
 */
import template from './index.template';
import Vue from 'vue';
import emitter from '@easylotto/emitter';
import $ from 'jquery';
import {
    DO_VIEW_RENDER,
    VIEW_SCROLL,
    START_INTERVAL_RENDER
} from 'constants/EmitterKey';

let _renderInterval = null;                         // 定时器key
let _renderStep = 300;                              // 自动渲染间隔时间
let _renderTimes = 3;                               // 每次执行多少次渲染方法
let _emitterRenderKey = DO_VIEW_RENDER;             // 触发render组件渲染
let _emitterScrollKey = VIEW_SCROLL;                // 触发滚动组件渲染
let _emitterIntervalKey = START_INTERVAL_RENDER;    // 触发定时器渲染组件

/**
 * 循环触发渲染事件，使未渲染对象进行渲染
 */
function loopToRender(){
    // 已经存在循环不进行处理
    if(_renderInterval) return;

    _renderInterval = setInterval(()=>{
        let arrEmitFn = emitter.global.listeners(_emitterRenderKey);
        if(arrEmitFn.length > 0){
            for(let i = 0;i < _renderTimes;i++){
                arrEmitFn[i] && arrEmitFn[i]();
            }
        }else{
            clearInterval(_renderInterval);
            _renderInterval = null;
        }
    }, _renderStep);
}

/**
 * 检查组件是否
 * @param objDoc
 * @returns {*|boolean}
 */
function checkContentInView(objDoc){
    let $obj = $(objDoc);
    return $obj.is(':visible') && $obj.offset().top - document.documentElement.scrollTop < document.documentElement.clientHeight;
}

(function(){
    // 滚动事件/窗口变更与emitter映射
    $(window).bind('scroll.emitter resize.emitter', ()=>{
        emitter.global.emit(_emitterScrollKey);
    });
    // 绑定循环渲染内容
    emitter.global.on(_emitterIntervalKey, loopToRender);
})();

let lazyComponent = Vue.component('vue-list-lazy-component', {
    data() {
        return {
            isNeedShow: false
        }
    },
    props:{
        isShow: { // 外部调用控制 isNeedShow 参数
            default: false
        },
        minHeight: {
            default: '0'
        }
    },
    template: template,
    created(){
        if(!this.isNeedShow){
            this.isNeedShow = this.isShow;
            !this.isNeedShow && this.dealEmitterTrigger(true);
        }
    },
    mounted(){
        !this.isNeedShow && this.fnEmitterCheck && this.fnEmitterCheck();
    },
    destroyed(){
        this.dealEmitterTrigger();
    },
    methods: {
        checkShowContent(isSetShow){
            this.isNeedShow = isSetShow || checkContentInView(this.$el);
            if(this.isNeedShow && this.fnEmitterCheck){
                this.dealEmitterTrigger();
            }
        },
        dealEmitterTrigger(isOn){
            if(isOn){
                this.fnEmitterCheck = this.checkShowContent.bind(this);
                this.fnEmitterRender = this.checkShowContent.bind(this, true);
                emitter.global.on(_emitterScrollKey, this.fnEmitterCheck);
                emitter.global.on(_emitterRenderKey, this.fnEmitterRender);
            }else if(this.fnEmitterCheck){
                emitter.global.off(_emitterScrollKey, this.fnEmitterCheck);
                emitter.global.off(_emitterRenderKey, this.fnEmitterRender);
                this.fnEmitterCheck = null;
                this.fnEmitterRender = null;
            }
        }
    }
});

module.exports = lazyComponent;