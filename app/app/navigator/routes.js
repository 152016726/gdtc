/**
 * Created by mac-ddt on 2017/6/9.
 */

import Home from '../views/home'
import Score from '../views/score';
import Award from '../views/award'
import MatchTypeSelect from '../views/matchTypeSelect'
import MatchTypeSelectVersion2 from '../views/matchTypeSelectVersion2'
import Introduction from '../views/introduction'
import EventInformation from '../views/eventInformation'
import BonusCalculation from '../views/bonusCalculation'
import BonusOptimize from '../views/bonusOptimize'
import { createBottomTabNavigator } from 'react-navigation'
import ScoreDetails from '../views/scoreDetails'
import Exponent from '../views/exponent'
import ScoreSetting from '../views/score/scoreSetting';
import Login from '../views/login';
import Register from '../views/register';
import ForgetPassword from '../views/forgetPassword';
import ResetPassword from '../views/resetPassword';
import Personal from '../views/Personal';
import PersonalInformation from  '../views/personalInformation';
import ResetName from  '../views/resetName';
import LotteryShop from '../views/lotteryShop';
import LotteryShopImgManage from '../views/lotteryShopImgManage';
import LotteryShopDetail from '../views/lotteryShopDetail';
import OfficialNews from '../views/officialNews';
import CitySelect from '../views/citySelect';
import SolutionIntro from '../views/solutionIntro';
import PlayingSkills from '../views/playingSkills';
import MyProject from '../views/myProject';
import Feedback from '../views/feedback';
import EventCenter from '../views/eventCenter';
import EventLeagueInfo from '../views/eventLeagueInfo';
import EventLeagueDetail from '../views/eventLeagueDetail';
import Seasons from '../views/eventLeagueDetail/seasons';
import UtilityProgram from '../views/utilityProgram';
import PeerReviewDetails from '../views/utilityProgram/peerReviewDetails';
import ScreeningPage from '../views/screeningPage';
import SendRecommend from '../views/sendRecommend';
import AboutUs from '../views/aboutUs';
import MessageCenter from '../views/messageCenter';

import ExpertHome from '../views/expertHome';
import ExpertZone from '../views/expertZone';
import NewRecommend from '../views/newRecommend';
import ExpertGroup from '../views/expertGroup';
import ExpertAttention from '../views/expertAttention';
import TabBar from './TabBar'
// import MatchList from '../views/matchList'
import MatchList from '../views/matchListContainer'
import StaticPage from '../views/staticPage'
import ExpertRank from '../views/expertRank';
import Summary from '../views/summary';
import UserAgreement from '../views/UserAgreement';
import Privacy from '../views/privacy';
import MyQRCode from '../views/myQRCode';

const MainView = createBottomTabNavigator(
    {
        Home: {
            screen: Home                // 首页
        },
        Score: {
            screen: Score               // 比分
        },
        ExpertHome: {
            screen: ExpertHome          // 专家
        },
        Personal: {
            screen: Personal            // 我的
        }
    },
    {
        tabBarComponent: TabBar,
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled: false,
        lazyLoad: true
    }
);

MainView.navigationOptions = ({ navigation }) => {
    const routes = navigation.state.routes;
    const params = routes ? routes[navigation.state.index].params : null;

    const header = null;

    return {
        header
    };
};

export const navRoutes = {
    Main: {
        screen: MainView                // 主页面
    },
    EventInformation: {
        screen: EventInformation        // 赛事资讯
    },
    MatchList: {
        screen: MatchList               // 赛程列表
    },
    MatchTypeSelect: {
        screen: MatchTypeSelect         // 赛事筛选
    },
    MatchTypeSelectVersion2:{
        screen: MatchTypeSelectVersion2 // 赛事筛选(改版)
    },
    Award:{
        screen:Award                    // 开奖查询
    },
    Introduction: {
        screen: Introduction            // 比分玩法
    },
    BonusCalculation: {
        screen: BonusCalculation        // 奖金计算
    },
    BonusOptimize: {
        screen: BonusOptimize           // 奖金优化
    },
    StaticPage: {
        screen: StaticPage              // 静态页
    },
    ScoreDetails: {
        screen: ScoreDetails            // 比分详情页
    },
    ScoreSetting: {
        screen: ScoreSetting            // 比分设置页
    },
    Login:{
        screen: Login                   // 登陆
    },
    Register:{
        screen: Register                // 注册
    },
    ForgetPassword:{
        screen: ForgetPassword          // 忘记密码
    },
    ResetPassword:{
        screen: ResetPassword           // 重置密码
    },
    PersonalInformation:{
        screen: PersonalInformation     // 我的资料
    },
    ResetName:{
        screen: ResetName               // 重置昵称
    },
    LotteryShop:{
        screen: LotteryShop            // 竞彩店
    },
    LotteryShopDetail: {
        screen: LotteryShopDetail      // 竞彩店详情
    },
    LotteryShopImgManage: {
        screen: LotteryShopImgManage   // 竞彩店图片管理
    },
    OfficialNews:{
        screen: OfficialNews            // 官方资讯
    },
    CitySelect:{
        screen: CitySelect             // 城市选择
    },
    SolutionIntro: {
        screen: SolutionIntro           // 方案详情
    },
    PlayingSkills: {
        screen: PlayingSkills           // 玩法技巧
    },
    MyProject:{
        screen: MyProject               // 我的方案
    },
    Feedback:{
        screen: Feedback                // 反馈
    },
    EventCenter:{
        screen: EventCenter             // 赛事中心
    },
    EventLeagueInfo:{
        screen: EventLeagueInfo         // 联赛中心
    },
    EventLeagueDetail:{
        screen: EventLeagueDetail       // 联赛数据
    },
    Seasons:{
        screen: Seasons                 // 赛季选择
    },
    UtilityProgram: {                   // 实用工具
        screen : UtilityProgram
    },
    PeerReviewDetails: {                // 同奖回查详情页
        screen: PeerReviewDetails
    },
    ScreeningPage: {                    // 同奖回查筛选页面
        screen: ScreeningPage
    },
    SendRecommend: {                    //发推荐页面
        screen: SendRecommend
    },
    ExpertZone: {
        screen: ExpertZone              // 专家个人主页
    },
    NewRecommend: {                     // 最新推荐
        screen: NewRecommend
    },
    ExpertGroup: {                      // 专家团
        screen: ExpertGroup
    },
    ExpertRank: {                       // 排行榜
        screen: ExpertRank
    },
    ExpertAttention: {                  //专家关注
        screen: ExpertAttention
    },
    Exponent: {                         // 竞彩指数
        screen: Exponent
    },
    AboutUs:{
        screen: AboutUs                //关于我们
    },
    Summary: {
        screen: Summary                // 简介
    },
    MessageCenter: {
        screen: MessageCenter          // 消息中心
    },
    UserAgreement: {
        screen: UserAgreement          // 用户协议
    },
    Privacy: {
        screen: Privacy               // 隐私政策
    },
    MyQRCode: {
        screen: MyQRCode              //我的二维码
    }
};
