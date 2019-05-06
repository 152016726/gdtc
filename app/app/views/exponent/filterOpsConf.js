let oddsCfg = [{text: '亚指', id: 'ah'}, {text: '欧指', id: 'wdw'}];   //大小球暂时不显示
let filterOpsConf = {     //用于筛选的设置
    odds: oddsCfg[0].id,  //赔率
    company: null,          //公司
    league: null            //联赛
};
export {
    oddsCfg, filterOpsConf
}