import Vue from 'vue';
import './index.scss';
import template from './index.template';
import getExpertInfo from 'services/getExpertInfo';
import getCurrentInfo from 'services/getCurrentClient';
import getConcern from 'services/getConcern';
import echarts from 'echarts';

const ID_STATIC_NAME = ['monthRate', 'weekRate', 'recentBattles', 'combo'];
const COLOR_LIST= ['#ed9853', '#53abed', '#31d586', '#f38771'];

module.exports = Vue.component('expert-header',{
    data(){
        return {
            expertInfo:{},               // 专家个人信息
            isFocused:false,             // 是否关注
            isLogin: false,              // 是否登录
            isShowConcern: true,         // 是否展示关注
        }
    },
    template,
    props:{
      eid:{default: ''}
    },
    methods:{
        /**
         * 绘图
         * @param el dom元素
         * @param text 文字
         * @param rate 占比
         */
        initCharts(el, text, rate, color){
            echarts.init(el).setOption({
                title:{
                    text: text,
                    x: 'center',
                    y: 'center',
                    textStyle: {'fontSize': 16}
                },
                color: ['#d8d8d8', color],
                series:[
                    {
                        type: 'pie',
                        radius: ['80%', '100%'],
                        selectedMode: 'single',      // 阻止饼图的默认点击偏移事件
                        selectedOffset: 0,           // 阻止饼图的默认点击偏移事件
                        hoverAnimation: false,       // 阻止饼图的默认点击偏移事件
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                show: false
                            }
                        },
                        data: [
                            {value: 1-rate},
                            {value: rate}
                        ]
                    }
                ]

            })
        },
        /**
         * 点击关注
         */
        focusClick(){
            getConcern.getData({
                eid: this.eid,
                isAttention: !this.isFocused
            }).then(rsp=>{
                this.isFocused = !this.isFocused;
            }, rej=>{
                console.log(rej.rspMsg);
            })
        }
    },
    created(){
        const that = this;
        // 判断用户是否登录
        getCurrentInfo.getData().then(rsp=> {
            this.isLogin = true;
            // 自己不能关注自己
            if(rsp.data.id === this.eid){
                this.isShowConcern = false;
            }
        }, rej=>{
            this.isLogin = false;
            this.isShowConcern = true;
            console.log(rej.rspMsg);
        });
        // 获取专家的个人信息
        getExpertInfo.getData({eid: that.eid}).then(rsp=>{
            this.expertInfo = rsp.data[0];
            const {weekHitRate, monthHitRate, fiveWinrate, comboWin} = this.expertInfo;
            const textList = [
                parseInt(100*weekHitRate)+'%',
                parseInt(100*monthHitRate)+'%',
                "近5中"+fiveWinrate*5,
                comboWin+'连胜'
            ];
            let conboRate = 0;
            if(+comboWin > 5){
                conboRate = 1;
            }else{
                conboRate = comboWin/5;
            }
            let arr= [
                weekHitRate,
                monthHitRate,
                fiveWinrate,
                conboRate
            ];
            ID_STATIC_NAME.forEach((item, index)=>{
                arr.push({
                    rate: this.expertInfo[item],
                    text: textList[index]
                });
                this.initCharts(document.getElementById(item), textList[index], arr[index], COLOR_LIST[index])
            })
        }, rej=>{
            console.log(rej.rspMsg);
        })
    }
})