/**
 * 所有模板公用数据，使用$imports访问
 * Created by DDT on 2017/11/22.
 */
module.exports = {
    title: '广东省竞彩网',
    configJs: '/resource/js/config.js',
    isStaticBuild: false,   //是否当前为静态打包状态
    /**
     * 获取返回单个文件具体链接，用于列表跳转文章
     * @param page          对应页面文件夹，必须是单独文件页面
     * @param id            对应数据id
     */
    getArticleLink: function(page, id){
        if(this.isStaticBuild){
            return page + '_' + id + '.html';
        }else{
            return page + '.html?article_id=' + id;
        }
    },
    header: {
        menus: [
            { name: '首页', url: "javascript: jumpTo('./index.html')", key: "home"},
            {
                name: '体彩介绍',
                url: 'javascript:',
                key: "introduce",
                children: [
                    {
                        name: "公益金",
                        url: "javascript: jumpTo('./welfare.html')"
                    },
                    {
                        name: "发行情况",
                        url: "javascript: jumpTo('./issue.html')"
                    },
                    {
                        name: "产品",
                        url: "javascript: jumpTo('./product.html')"
                    },
                    {
                        name: "优势",
                        url: "javascript: jumpTo('./advantage.html')"
                    }
                ]
            },
            {
                name: '申请指南',
                url: 'javascript:',
                key: "guide",
                children: [
                    {
                        name: "申请条件",
                        url: "javascript: jumpTo('./application_require.html')"
                    },
                    {
                        name: "申请公告",
                        url: "javascript: jumpTo('./reading_notes_static.html');"
                    },
                    {
                        name: "投入回报",
                        url: "javascript: jumpTo('./input_return.html')"
                    },
                    {
                        name: "流程说明",
                        url: "javascript: jumpTo('./process.html')"
                    }
                ]
            },
            {
                name: '政策法规',
                url: "javascript: jumpTo('./rules.html')",
                key: "rules"
            },
            { name: '网点展示', url: "javascript: jumpTo('./dot_display.html')", key: "case"},
            { name: '常见问题', url: "javascript: jumpTo('./faq.html')", key: "qa"}
        ]
    },
    nav: {
        "title": "申请流程",
        "list": [
            "1. 提交申请",
            "2. 网点选址",
            "3. 填写信息",
            "4. 中心初审",
            "5. 开业准备",
            "6. 中心验收",
            "7. 申请成功"
        ]
    }
};


















