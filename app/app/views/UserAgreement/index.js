import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
} from 'react-native';
import Headerleft from '../../components/headerLeft';

export default class UserAgreement extends Component {
    static navigationOptions = ({ navigation }) => {
        const { handleGoBack = null, title } = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        return { title, headerLeft }
    };

    componentWillMount() {
        const { navigation } = this.props;
        navigation.setParams({
            title : '用户服务协议',
            handleGoBack : () => {
                navigation.goBack()
            }
        });
    }

    render() {
        let html = `<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="Content-Style-Type" content="text/css">
    <meta name="generator" content="Aspose.Words for .NET 15.1.0.0">
    <title></title>
</head>
<body>
    <div style="padding:0 20px;">
        
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
        <p style="text-indent:60px;margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt;">本《用户服务协议》（以下简称“协议”）是由您与广东省体育彩票所订立的相关权利义务规范，用以描述广东竞猜向您提供服务及您使用服务所涉及的详细规定。因此，请您于注册成为广东竞猜用户或开始使用该产品前，切实详细地阅读本条款的所有内容。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">一、总则</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">1.1
                用户开始使用广东竞猜产品或接受广东竞猜服务，或者注册成为广东竞猜用户的，即表示同意本协议的条款。用户注册成为广东竞猜用户的，应当按照注册页面的提示完成全部的注册程序。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">1.2
                注册成功后，广东竞猜将给予每个用户一个用户帐号及对应密码，该用户帐号和密码由用户负责保管；用户应当对使用该账号在广东竞猜上进行的所有行为和事件负法律责任。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">1.3
                本协议可由广东竞猜根据国家法律政策或公司运营要求随时更新，且无需另行通知。您在使用相关服务时,应关注并遵守其所适用的相关条款。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">如您不同意更新的协议，应当立即停止使用广东竞猜产品或者服务。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">二、注册信息和隐私保护</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.1
                广东竞猜账号的所有权归广东竞猜，用户完成注册流程后，即获得广东竞猜帐号的使用权。用户应提供及时、详尽及准确的个人资料，并不断更新注册资料，符合及时、详尽准确的要求。如果因注册信息不真实或更新不及时而引起的问题，并对问题发生所带来的后果，广东竞猜不负有任何责任。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.2
                用户有权自行确定用户昵称、头像等个人信息。用户编辑的昵称和上传的头像属于用户自行公开的信息，不属于隐私保护的范围，同时用户理解并认可，广东竞猜有权在合理范围内使用用户的昵称、头像等信息（例如在文章评论区、活动页面、个性化推送以及个性化广告等场景使用）。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.3
                用户应当通过真实身份信息认证注册账号，且用户提交的账号名、头像等注册信息中不得出现违法和不良信息，如存在上述情况，广东竞猜有权中止注册流程。同时注册后，如发现用户以虚假信息骗取账号名称注册，或其账号头像等注册信息存在违法和不良信息的，广东竞猜有权不经通知单方采取限期改正、暂停使用、注销登记、收回等措施。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.4
                用户不应将其帐号、密码转让、出售或出借予他人使用，若用户授权他人使用帐户，应对被授权人在该帐户下发生所有行为负全部责任。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.5 保护用户隐私和其他个人信息是广东竞猜的一项基本政策，广东竞猜承诺不</span><span
                style="font-family:DengXian; font-size:20pt">会将单个用户的注册资料及用户在使用广东竞猜服务时存储在广东竞猜的非公开内容（如有）用于任何非法的用途，且保证将单个用户的注册资料进行商业上的利用时应事先获得用户的同意，但下列情况除外：</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.5.1 事先获得用户的明确授权；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.5.2 为维护社会公共利益；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.5.3
                学校、科研机构等基于公共利益为学术研究或统计的目的，经自然人用户书面同意，且公开方式不足以识别特定自然人；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.5.4 用户自行在网络上公开的信息或其他已合法公开的个人信息；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.5.5 以合法渠道获取的个人信息；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.5.6 用户侵害广东竞猜合法权益，为维护前述合法权益且在必要范围内；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.5.7 为维护广东竞猜的合法权益，例如查找、预防、处理欺诈或安全方面的问题；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.5.8 根据相关政府主管部门的要求；根据相关法律法规或政策的要求；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.5.9 其他必要情况。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2.6
                广东竞猜可能会与合作伙伴共同向您提供您所要求的服务或者共同向您展示您可能感兴趣的内容。在信息为该项产品/服务所必须的情况下，您同意广东竞猜可与其分享必要的信息。并且，广东竞猜会要求其确保数据安全并且禁止用于任何其他用途。除此之外，广东竞猜不会向任何无关第三方提供或分享信息。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">三、使用规则</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">3．1
                用户在使用广东竞猜服务时，必须遵守中华人民共和国相关法律法规的规定，用户应同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为∶</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">（1）上载、展示、张贴、传播或以其它方式传送含有下列内容之一的信息：</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">1） 反对宪法所确定的基本原则的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2） 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">3） 损害国家荣誉和利益的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4） 煽动民族仇恨、民族歧视、破坏民族团结的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">5） 破坏国家宗教政策，宣扬邪教和封建迷信的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">6） 散布谣言，扰乱社会秩序，破坏社会稳定的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">7） 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">8） 侮辱或者诽谤他人，侵害他人合法权利的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">9） 含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">10） 含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">（2）不得为任何非法目的而使用网络服务系统；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">（3）不利用广东竞猜服务从事以下活动：</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">1) 未经允许，进入计算机信息网络或者使用计算机信息网络资源的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2) 未经允许，对计算机信息网络功能进行删除、修改或者增加的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">3) 未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4) 故意制作、传播计算机病毒等破坏性程序的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">5) 其他危害计算机信息网络安全的行为。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">3.2
                用户违反本协议或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，您同意赔偿广东竞猜与合作公司、关联公司，并使之免受损害。对此，广东竞猜有权视用户的行为性质，采取包括但不限于删除用户发布信息内容、暂停使用许可、终止服务、限制使用、回收广东竞猜帐号、追究法律责任等措施。对恶意注册广东竞猜帐号或利用广东竞猜帐号进行违法活动、捣乱、骚扰、欺骗、其他用户以及其他违反本协议的行为，广东竞猜有权回收其帐号。同时，广东竞猜公司会视司法部门的要求，协助调查。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">3.3 用户不得对本服务任何部分或本服务之使用或获得，进行复制、拷贝、出售、转售或用于任何其它商业目的。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">3.4
                用户须对自己在使用广东竞猜服务过程中的行为承担法律责任。用户承担法律责任的形式包括但不限于：对受到侵害者进行赔偿，以及在广东竞猜公司首先承担了因用户行为导致的行政处罚或侵权损害赔偿责任后，用户应给予广东竞猜公司等额的赔偿。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">四、服务内容</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.1 广东竞猜网络服务的具体内容由广东竞猜根据实际情况提供。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.2 除非本服务协议另有其它明示规定，广东竞猜所推出的新产品、新功能、新服务，均受到本服务协议之规范。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.3
                为使用本服务，您必须能够自行经有法律资格对您提供互联网接入服务的第三方，进入国际互联网，并应自行支付相关服务费用。此外，您必须自行配备及负责与国际联网连线所需之一切必要装备，包括计算机、数据机或其它存取装置。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.4
                鉴于网络服务的特殊性，用户同意广东竞猜有权不经事先通知，随时变更、中断或终止部分或全部的网络服务（包括收费网络服务）。广东竞猜不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作担保。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.5
                广东竞猜需要定期或不定期地对提供网络服务的平台或相关的设备进行检修或者维护，如因此类情况而造成网络服务（包括收费网络服务）在合理时间内的中断，广东竞猜无需为此承担任何责任。广东竞猜保留不经事先通知为维修保养、升级或其它目的暂停本服务任何部分的权利。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.6
                本服务或第三人可提供与其它国际互联网上之网站或资源之链接。由于广东竞猜无法控制这些网站及资源，您了解并同意，此类网站或资源是否可供利用，广东竞猜不予负责，存在或源于此类网站或资源之任何内容、广告、产品或其它资料，广东竞猜亦不予保证或负责。因使用或依赖任何此类网站或资源发布的或经由此类网站或资源获得的任何内容、商品或服务所产生的任何损害或损失，广东竞猜不承担任何责任。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.7
                用户明确同意其使用广东竞猜网络服务所存在的风险将完全由其自己承担。用户理解并接受下载或通过广东竞猜服务取得的任何信息资料取决于用户自己，并由其承担系统受损、资料丢失以及其它任何风险。广东竞猜对在服务网上得到的任何商品购物服务、交易进程、招聘信息，都不作担保。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.8 6个月未登录的帐号，广东竞猜保留关闭的权利。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.9
                广东竞猜有权于任何时间暂时或永久修改或终止本服务（或其任何部分），而无论其通知与否，广东竞猜对用户和任何第三人均无需承担任何责任。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.10 终止服务</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">您同意广东竞猜得基于其自行之考虑，因任何理由，包含但不限于长时间（超过一年）未使用，或广东竞猜认为您已经违反本服务协议的文字及精神，终止您的密码、帐号或本服务之使用（或服务之任何部分），并将您在本服务内任何内容加以移除并删除。您同意依本服务协议任何规定提供之本服务，无需进行事先通知即可中断或终止，您承认并同意，广东竞猜可立即关闭或删除您的帐号及您帐号中所有相关信息及文件，及/或禁止继续使用前述文件或本服务。此外，您同意若本服务之使用被中断或终止或您的帐号及相关信息和文件被关闭或删除，广东竞猜对您或任何第三人均不承担任何责任。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">五、知识产权和其他合法权益（包括但不限于名誉权、商誉权）</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">5.1 用户专属权利</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">广东竞猜尊重他人知识产权和合法权益，呼吁用户也要同样尊重知识产权和他人合法权益。若您认为您的知识产权或其他合法权益被侵犯，请按照《广东竞猜版权保护说明》向广东竞猜提供资料∶</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">请注意：如果权利通知的陈述失实，权利通知提交者将承担对由此造成的全部法律责任（包括但不限于赔偿各种费用及律师费）。如果上述个人或单位不确定网络上可获取的资料是否侵犯了其知识产权和其他合法权益，广东竞猜建议该个人或单位首先咨询专业人士。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">为了广东竞猜有效处理上述个人或单位的权利通知，请使用以下格式（包括各条款的序号）：</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">1. 权利人对涉嫌侵权内容拥有知识产权或其他合法权益和/或依法可以行使知识产权或其他合法权益的权属证明；</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">2. 请充分、明确地描述被侵犯了知识产权或其他合法权益的情况并请提供涉嫌侵权的第三方网址（如果有）。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">3. 请指明涉嫌侵权内容的哪些内容侵犯了第2项中列明的权利。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">4.
                请提供权利人具体的联络信息，包括姓名、身份证或护照复印件（对自然人）、单位登记证明复印件（对单位）、通信地址、电话号码、传真和电子邮件。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">5.
                请提供涉嫌侵权内容在信息网络上的位置（如指明您举报的含有侵权内容的出处，即：指网页地址或网页内的位置）以便我们与您举报的含有侵权内容的所有权人/管理人联系。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">6. 请在权利通知中加入如下关于通知内容真实性的声明：
                “我保证，本通知中所述信息是充分、真实、准确的，如果本权利通知内容不完全属实，本人将承担由此产生的一切法律责任。”</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">7. 请您签署该文件，如果您是依法成立的机构或组织，请您加盖公章。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">5.2
                对于用户通过广东竞猜服务（包括但不限于手机客户端、网页版等）上传到广东竞猜网站上可公开获取区域的任何内容，用户同意广东竞猜在全世界范围内具有免费的、永久性的、不可撤销的、非独家的和完全再许可的权利和许可，以使用、复制、修改、改编、出版、翻译、据以创作衍生作品、传播、表演和展示此等内容（整体或部分），和/或将此等内容编入当前已知的或以后开发的其他任何形式的作品、媒体或技术中。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">5.3
                广东竞猜拥有本站内所有资料的版权。任何被授权的浏览、复制、打印和传播属于本站内的资料必须符合以下条件：</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">5.3.1 所有的资料和图象均以获得信息为目的；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">5.3.2 所有的资料、图象及其任何部分都必须包括此版权声明；</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">5.3.3
                本站所有的产品、技术与所有程序均属于广东竞猜知识产权，在此并未授权。“广东竞猜”及相关图形等为广东竞猜的注册商标。</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">5.3.4 未经广东竞猜许可，任</span><span
                style="font-family:DengXian; font-size:20pt">何人不得擅自（包括但不限于：以非法的方式复制、传播、展示、镜像、上载、下载）使用。否则，广东竞猜将依法追究法律责任。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">六、青少年用户特别提示</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">青少年用户必须遵守全国青少年网络文明公约：要善于网上学习，不浏览不良信息；要诚实友好交流，不侮辱欺诈他人；要增强自护意识，不随意约会网友；要维护网络安全，不破坏网络秩序；要有益身心健康，不沉溺虚拟时空。</span>
        </p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
        <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
        
    </div>
</body>

</html>`;
        return (
            <View style={styles.container}>
                <WebView style={{ flex : 1 }}
                         source={{ html : html, baseUrl : '' }}
                         javaScriptEnabled={true}
                         originWhitelist={[ '*' ]}
                         automaticallyAdjustContentInsets={false}
                         scalesPageToFit={true}/>
            </View> );
    }
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
});