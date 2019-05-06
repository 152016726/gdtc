/**
 * Created by marcus on 2018/11/15.
 */
export default{
    showDialog: false,
    id: "",                     // int 用户id
    name: "",                   // string 用户名
    nickname: "",               // string 昵称
    summary: "",                // string 用户简介
    couponNumber: 0, 
    phone: "",                  // string 手机号
    qrCode: "", 
    icon: "", 
    latestMsgCount: "",        // 最新消息数
    regtime: "",                // string 注册时间
    isExpert: false, 
    attentionNumber: 0, 
    fiveWinrate: "",            // decimal 近五场胜率
    comboWin: "",               // int 连胜场数
    weekHitRate: "",            // int 周命中率
    monthHitRate: "",           // int 月命中率
    orderTotal: "",             // int 荐单总数
    orderWin: "",               // int 荐单红单数
    orderDefeat: "",            // int 荐单黑单数
    orderDraw: "",              // int 荐单走水场数
    orderState: { 
        "twoStickOne": "",      // bool 胜平负2串1是否发单
        "single": "",           // bool 单关胜平负是否发单
        "tg": ""                // bool 总进球是否发单
    }, 
    isOwner: "",                // bool 是否业主
    dotNumber: "",              // string 网点编号
    maxBonus: "",               // int 最高奖金
    address: "",                // string 地址
    lng: "",                    // decimal 经度
    lat: "",                    // decimal 维度
    starLevel: "",              // int 网点星级
    contactName: "",            // string 联系人
    contactPhone: "",           // string 手机号码
    dotQrCode: "",              // string 网点二维码
    dotPictures: "",           // array 图集, 数组, 放图片地址
    webApiPath: "",            // string 图片头部
    loginStatus: 0
}