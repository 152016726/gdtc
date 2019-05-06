/**
 * Created by oWEn on 2018/5/22.
 */
var echarts = require('plugin/echarts/echarts.common.min.js');

/**
 * 赛果颜色组合类型
 */
var colorObj = [
    {
        win: '#C00',
        draw: '#09C',
        lose: '#030'
    },
    {
        win: '#e9573e',
        draw: '#4b89dc',
        lose: '#8dc153'
    }
];

/**
 * 内部方法
 */
var innerFn = {
    /*
     * 英文转化为中文
     * */
    eTransC: function (value) {
        var str = '';
        switch (value) {
            case 'win':
                str = '胜';
                break;
            case 'draw':
                str = '平';
                break;
            case 'lose':
                str = '负';
                break;
        }
        return str;
    },
    /*
     * 中文转化为英文
     * */
    cTransE: function (value) {
        var str = '';
        switch (value) {
            case '胜':
                str = 'win';
                break;
            case '平':
                str = 'draw';
                break;
            case '负':
                str = 'lose';
                break;
        }
        return str;
    }
}

module.exports = {
    /**
     * 积分排名图表
     * @param opt{Object} 图表配置
     * */
    drawIntegralRanking: function (opt) {
        var defOpt = {
            ele: null,
            xAxisData: [],  //呈现的分别是第几轮的数据
            seriesData: []  // [[num,num...],[num,num...],[num,num...]] 分别为积分,排名和比赛结果的data
        };
        opt = Object.assign({}, defOpt, opt);
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(opt.ele);
        // 指定图表的配置项和数据
        var option = {
            tooltip: {
                trigger: 'axis',
                formatter: '第{b0}轮<br />{a0}:{c0}<br />{a1}:{c1}'
            },
            legend: {
                data: ['积分', '排名'],
                top: 30
            },
            grid: {
                top: 80,
                bottom: 20
            },
            xAxis: [
                {
                    type: 'category',
                    data: opt.xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    }
                }

            ],
            yAxis: [
                {
                    type: 'value',
                    name: '积分',
                    min: 0,
                    max: 120,
                    interval: 20,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '排名',
                    min: 0,
                    max: 20,
                    interval: 5,
                    inverse: true,
                    nameLocation: 'start',
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '积分',
                    type: 'bar',
                    barWidth: 10,
                    data: opt.seriesData[0]
                },
                {
                    name: '排名',
                    type: 'line',
                    yAxisIndex: 1,
                    symbolSize: 7,
                    symbol: 'circle',
                    showAllSymbol: true,
                    lineStyle: {
                        color: 'rgba(0,0,0)'
                    },
                    itemStyle: {
                        color: function (obj) {
                            return colorObj[0][opt.seriesData[2][obj.dataIndex]]
                        }
                    },
                    data: opt.seriesData[1]
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },

    /**
     * 盘路走势图表
     * @param data 图表数据
     * */
    drawTrends: function (opt) {
        var defOpt = {
            ele: null,
            data: [], //[{result:'win|draw|lose', round:num}]
        };
        opt = Object.assign({}, defOpt, opt);
        var round = [], resultArr = [];
        opt.data.forEach(function (ele, idx) {
            round.push(ele.round);
            var rs = 2;
            if ('lose' == ele.result) {
                rs = 0
            }
            else if ('draw' == ele.result) {
                rs = 1
            }
            resultArr.push(rs);
        })
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(opt.ele);

        // 指定图表的配置项和数据
        var option = {
            xAxis: [
                {
                    type: 'category',
                    data: round,
                    show: false
                }
            ],
            grid: {
                top: 15,
                right: -3.5,
                bottom: 15,
                left: -3.5
            },
            yAxis: [
                {
                    type: 'value',
                    name: '胜负',
                    min: 0,
                    max: 2,
                    interval: 1,
                    show: false
                }
            ],
            series: [
                {
                    name: '胜负',
                    type: 'line',
                    barWidth: 10,
                    data: resultArr,
                    show: false,
                    symbolSize: 6,
                    symbol: 'circle',
                    lineStyle: {
                        color: 'rgba(0,0,0)' //例子暂时都是显示为黑色
                    },
                    itemStyle: {
                        color: function (obj) {
                            return colorObj[opt.data[obj.dataIndex].result]
                        }
                    },
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    /**
     * 必发交易圆环图
     * @param opt{Object} 图表配置
     * */
    drawBetfairDealPie: function (opt) {
        var defOpt = {
            ele: null,
            data: []  //[胜的成交额, 平的成交额, 负的成交额]
        };
        opt = Object.assign({}, defOpt, opt);

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(opt.ele);

        // 指定图表的配置项和数据
        var option = {
            grid: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            title: {
                text: '{a|' + (opt.data[0] + opt.data[1] + opt.data[2]) + '}',          //winLast + drawLast + loseLast,
                textStyle: {
                    rich: {
                        a: {
                            fontWeight: 'normal',
                            fontSize: 24,
                            lineHeight: 24,
                            height: 24,
                            color: '#333'
                        }
                    }
                },
                itemGap: 0,
                subtext: '总交易[港币]',
                x: 'center',
                y: 'center'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'center',
                data: ['主胜', '平局', '客胜'],
                formatter: function (name) {
                    var count = '';
                    switch (name) {
                        case '主胜':
                            count = opt.data[0];
                            break;
                        case '平局':
                            count = opt.data[1];
                            break;
                        case '客胜':
                            count = opt.data[2];
                            break;
                    }
                    return name + count;
                }
            },
            series: [
                {
                    name: '成交量',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: opt.data[0], name: '主胜'},
                        {value: opt.data[1], name: '平局'},
                        {value: opt.data[2], name: '客胜'}
                    ]
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },

    /**
     * 必发交易折线图
     * @param opt{Object} 图表配置
     * */
    drawBetfairTrendsLine: function (opt) {
        var defOpt = {
            ele: null,
            xAxisDate: [],
            seriesData: [] //格式:[[num1, num2....],[num1, num2....],[num1, num2....]] 三个子数组分别为win draw lose的成交量
        };
        opt = Object.assign({}, defOpt, opt);
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(opt.ele);

        // 指定图表的配置项和数据
        var option = {
            grid: {
                top: '20%',
                right: '20%',
                bottom: '10%',
                left: '10%'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'top',
                data: ['主胜', '平局', '客胜']
            },
            xAxis: {
                type: 'category',
                data: opt.xAxisDate,
                name: '日期',
            },
            yAxis: {
                type: 'value',
                name: '单位：元',
                axisLabel: {
                    formatter: '{value} 万'
                }
            },
            series: [{
                data: opt.seriesData[0],
                type: 'line',
                name: '主胜'
            }, {
                data: opt.seriesData[1],
                type: 'line',
                name: '平局'
            }, {
                data: opt.seriesData[2],
                type: 'line',
                name: '客胜'
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },

    /**
     * 必发交易大额成交分布柱状图
     * @param opt 图表设置
     * */
    drawBetfairBigDealBar: function (opt) {
        var defOpt = {
            ele: null,
            seriesData: [] //格式:[[num1, num2....],[num1, num2....]] 第一个子数组为买入数据，第二个为卖出数据
        };
        opt = Object.assign({}, defOpt, opt);
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(opt.ele);

        // 指定图表的配置项和数据
        var option = {
            grid: {
                top: '20%',
                right: '20%',
                bottom: '10%',
                left: '10%'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'top',
                data: ['买入', '卖出']
            },
            xAxis: {
                type: 'category',
                data: ['主胜', '主平', '客胜'],
                axisTick: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                name: '单位：元',
                max: function (value) {
                    return value.max + 2
                },
                axisLabel: {
                    formatter: '{value} 万'
                }
            },
            series: [{
                data: opt.seriesData[0],
                type: 'bar',
                name: '买入'
            }, {
                data: opt.seriesData[1],
                type: 'bar',
                name: '卖出'
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },

    /**
     * 战绩统计近十场战绩圆环图
     * @param opt{Object} 图表设置
     * */
    drawRecordPie: function (opt) {
        var defOpt = {
            ele: null,
            seriesData: [] //格式:[x, y, z],xyz分别代表win draw lose的场数
        };
        opt = Object.assign({}, defOpt, opt);
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(opt.ele);

        // 指定图表的配置项和数据
        var option = {
            grid: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            title: {
                text: '近10场\n胜平负统计',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 14,
                    lineHeight: 24,
                    color: '#999'
                },
                x: 'center',
                y: 'center'
            },
            legend: {
                x: 'center',
                bottom: 20,
                data: ['胜', '平', '负']
            },
            series: [
                {
                    name: '战绩',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        color: function (obj) {
                            return colorObj[1][obj.data.nameEn];
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                fontSize: 18
                            }
                        }
                    },
                    data: [
                        {value: opt.seriesData[0], name: '胜', nameEn: 'win'},
                        {value: opt.seriesData[1], name: '平', nameEn: 'draw'},
                        {value: opt.seriesData[2], name: '负', nameEn: 'lose'}
                    ]
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    /**
     * 战绩统计近十场战绩柱状图（显示胜平负）
     * @param opt{Object} 图表设置
     * */
    drawRecordBar: function (opt) {
        var defOpt = {
            ele: null,
            title: '',      //标题
            yAxisData: [],  //y轴类目数据
            seriesData: [], //系列列表数据

        };
        opt = Object.assign({}, defOpt, opt);
        var myChart = echarts.init(opt.ele);
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: opt.title,
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 14,
                    rich: {
                        win: {
                            color: colorObj[1].win
                        },
                        draw: {
                            color: colorObj[1].draw
                        },
                        lose: {
                            color: colorObj[1].lose
                        }
                    }
                },
                y: 'bottom',
                x: 'center'
            },
            grid: {
                top: 80,
                bottom: 40,
                left: 40
            },
            xAxis: [
                {
                    type: 'category',
                    // data: data.round,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    // name: '积分',
                    data: opt.yAxisData,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    // name: '积分',
                    type: 'bar',
                    barWidth: 20,
                    data: opt.seriesData,
                    itemStyle: {
                        color: function (value) {
                            return colorObj[1][value.data];
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    },

    /**
     * 圆环图-最近命中率
     * @param opt{Object} 图表设置
     * */
    drawPieRecentWin: function (opt) {
        var defOpt = {
            ele: null,
            seriesData: [], //格式:[x, y],xy分别代表中 没中的场数
            title: '',
            color: '#f40',//中的颜色
            colorLose: '#eee'
        };
        opt = Object.assign({}, defOpt, opt);
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(opt.ele);

        // 指定图表的配置项和数据
        var option = {
            // grid: {
            //     top: 0,
            //     right: 0,
            //     bottom: 0,
            //     left: 0
            // },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {d}%"
            },
            title: {
                text: opt.title,
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 14,
                    lineHeight: 24,
                    color: '#999'
                },
                x: 'center',
                y: 'center'
            },
            legend: {
                show: false
            },
            series: [
                {
                    name: '战绩',
                    type: 'pie',
                    radius: ['60%', '80%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        color: function (obj) {
                            if(obj.data.nameEn=='win'){
                                return opt.color;
                            }
                            else return opt.colorLose;
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: opt.seriesData[0], name: '中', nameEn: 'win'},
                        {value: opt.seriesData[1], name: '没中', nameEn: 'lose'}
                    ]
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
}