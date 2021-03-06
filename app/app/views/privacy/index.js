import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
} from 'react-native';
import Headerleft from '../../components/headerLeft';

export default class Privacy extends Component {
    static navigationOptions = ({ navigation }) => {
        const { handleGoBack = null, title } = navigation.state.params || {};
        let headerLeft = <Headerleft handleGoBack={handleGoBack} img={require('../../images/back.png')}/>;
        return { title, headerLeft }
    };

    componentWillMount() {
        const { navigation } = this.props;
        navigation.setParams({
            title : '隐私政策',
            handleGoBack : () => {
                navigation.goBack()
            }
        });
    }

    render() {
        let html = `<html>

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
                                style="font-family:DengXian; font-size:20pt">广东竞猜（以下称“我们”）尊重并保护您的隐私，您浏览广东竞猜客户端或使用我们的服务时，我们可能会收集、使用、储存和分享您</span><span
                                style="font-family:DengXian; font-size:20pt">的相关信息。我们希望通过本《隐私政策》（ 以下称
                                “本政策”）向您说明，我们如何收集、使用、储存和分享这些信息，我们如何为您提供访问、更新、控制和保护您信息的服务。本政策与您使用我们的服务紧密相关，我们希望您仔细阅读本政策的全部内容，作出您认为适当的选择。我们努力用简明扼要的文字表达，并对本政策中与您的权益存在重大关系的条款，在此提示您特别注意。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">您使用或继续使用我们的服务，即表示您同意我们按照本政策收集、使用、储存和分享您的信息。如您不同意本政策及未来修订版本的任何条款，请您不要使用我们的服务。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">一．我们可能收集的信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们提供服务时，可能会收集、储存和使用下列与您相关的信息。如果您不提供相关信息，可能无法注册成为我们的用户或无法享受我们提供的某些服务，或者即便我们可以继续向您提供一些服务，可能也无法达到该服务拟达到的效果。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">您提供给我们的信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">您在注册我们的账户或使用我们的服务时，向我们提供的相关个人信息（指以电子或者其他方式记录的能够单独或者与其他信息结合识别自然人个人身份的各种信息。），例如您的姓名、位置、身份证信息、电话号码、电子邮件等；
                                您通过我们的服务向其他方提供的共享信息，以及您使用我们的服务时所储存的信息。</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">其他方分享的您的信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">其他方使用我们的服务时所提供有关您的共享信息。</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们获取的您的信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">您使用我们的服务时，我们可能收集如下信息：</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">1、日志信息，
                                指您使用我们的服务时，系统可能会通过cookies、或其他方式自动采集的技术信息，包括：</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（1）设备或软件信息，例如您的移动设备、网页浏览器或您用于接入我们服务的其他程序所提供的配置信息、您的IP地址和您的移动设备所用的版本和设备识别码；</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（2）您在使用我们服务时搜索和浏览的信息，例如您使用的网页搜索词语、访问的社交媒体页面</span><span
                                style="font-family:DengXian; font-size:20pt">url</span><span
                                style="font-family:DengXian; font-size:20pt">地址，以及您在使用我们服务时浏览或要求提供的其他信息和内容详情；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（3）有关您曾使用的移动应用（APP）和其他软件的信息，以及您曾经使用该等移动应用和软件的信息；</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（4）您通过我们的服务进行通讯的信息，例如曾通讯的账号，以及通讯时间、数据和时长；</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（5）您通过我们的服务分享的内容所包含的信息（元数据），例如拍摄或上传的共享照片或录像的日期、时间或地点等。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">2、网络信息，
                                指您在联网状态下使用我们的服务时，我们为了解用户的运营商和网络分布的情况，收集的有关运营商名称与网络类型，此外，我们还收集接入</span><span
                                style="font-family:DengXian; font-size:20pt">WiFi</span><span
                                style="font-family:DengXian; font-size:20pt">名称和</span><span
                                style="font-family:DengXian; font-size:20pt">WiFi</span><span
                                style="font-family:DengXian; font-size:20pt">接入时间以了解您使用服务的用户场景。</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">3、位置信息，
                                指您开启设备定位功能并使用我们基于位置提供的相关服务时，我们收集的有关您位置的信息，这些信息有助于我们了解用户分布和用户使用场景，使我们可以为其提供正确的应用程序版本及更优质的服务，包括：</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">您通过具有定位功能的移动设备使用我们的服务时，我们通过GPS或</span><span
                                style="font-family:DengXian; font-size:20pt">WiFi</span><span
                                style="font-family:DengXian; font-size:20pt">等方式收集的您的地理位置信息；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">您可以通过关闭定位功能，停止我们对您的地理位置信息的收集。</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">4、手机输入设备信息，
                                指您使用我们的服务时，需要利用设备进行信息输入，包括：</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（1）摄像头信息指您开启摄像头并使我们基于您的图像信息提供相关服务时，我们收集您的摄像头图像信息。例如进行二维码扫描，录制视频上传等功能时，摄像头获取到的图像信息；</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（2）语音信息指您提供语音信息并使我们基于您的语音信息提供相关服务时，我们收集您的语音输入信息。例如您在进行语音搜索时，获取到您的语音输入信息；</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（3）您可以通过手机权限管理关闭相关权限，但是会影响我们服务中部分功能的使用。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">5、手机内容信息，
                                指您在使用我们服务时，系统会收集您手机设备的信息，包括：</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（1）手机状态信息指您手机设备硬件和软件的信息，包括设备号，手机型号，系统版本等；</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（2）手机账户信息指您手机登录账户的信息，例如在您选择使用手机账户登录我们的服务时，会获取您的手机账户信息。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">二.我们可能如何使用信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们可能将在向您提供服务的过程之中所收集的信息用作下列用途：</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">1、向您提供服务；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">2、在我们提供服务时，用于身份验证、客户服务、安全防范、诈骗监测、存档和备份用途，确保我们向您提供的产品和服务的安全性；帮助我们设计新服务，改善我们现有服务；</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">3、使我们更加了解您如何接入和使用我们的服务，从而针对性地回应您的个性化需求，例如语言设定、位置设定、个性化的帮助服务和指示，或对您和其他使用我们服务的用户作出其他方面的回应；</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">4、向您提供与您更加相关的广告以替代普遍投放的广告；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">5、评估我们服务中的广告和其他促销及推广活动的效果，并加以改善；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">6、软件认证或管理软件升级；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">7、让您参与有关我们产品和服务的调查。</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">为了让您有更好的体验、改善我们的服务或您同意的其他用途，在符合相关法律法规的前提下，我们可能将通过我们的某一项服务所收集的信息，以汇集信息或者个性化的方式，用于我们的其他服务。例如，在您使用我们的一项服务时所收集的信息，可能在另一服务中用于向您提供特定内容，或向您展示与您相关的、非普遍推送的信息。如果我们在相关服务中提供了相应选项，您也可以授权我们将该服务所提供和储存的信息用于我们的其他服务。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">三.您如何管理您的个人信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们将尽一切可能采取适当的技术手段，保证您可以访问、更新和更正自己的注册信息或使用我们的服务时提供的其他个人信息。在访问、更新、更正和删除前述信息时，我们可能会要求您进行身份验证，以保障账户安全。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">四.我们可能如何分享信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">除以下情形外，未经您同意，我们以及我们的关联公司不会与任何第三方分享您的个人信息：</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">1、我们以及我们的关联公司，可能将您的个人信息与我们的关联公司、合作伙伴及第三方服务供应商、承包商及代理（例如代表我们发出电子邮件或推送通知的通讯服务提供商、为我们提供位置数据的地图服务供应商）分享（他们可能并非位于您所在的法域），用作下列用途：</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（1）向您提供我们的服务；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（2）实现“我们可能如何使用信息”部分所述目的；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（3）履行我们在《用户协议》或本政策中的义务和行使我们的权利；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（4）理解、维护和改善我们的服务。</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">如我们或我们的关联公司与任何上述第三方分享您的个人信息，我们将努力确保该等第三方在使用您的个人信息时遵守本政策及我们要求其遵守的其他适当的保密和安全措施。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">随着我们业务的持续发展，我们以及我们的关联公司有可能进行合并、收购、资产转让或类似的交易，您的个人信息有可能作为此类交易的一部分而被转移。我们将在转移前通知您。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">2、我们或我们的关联公司还可能为以下需要而保留、保存或披露您的个人信息：</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（1）遵守适用的法律法规；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（2）遵守法院命令或其他法律程序的规定；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">（3）遵守相关政府机关的要求；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">为遵守适用的法律法规、维护社会公共利益，或保护我们的客户、我们或我们的集团公司、其他用户或雇员的人身和财产安全或合法权益所合理必需的用途。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">五.我们可能如何收集信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们，可能通过cookies等方式收集和使用您的信息，并将该等信息储存为日志信息。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们使用自己的
                                cookies，目的是为您提供更个性化的用户体验和服务，并用于以下用途：</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">1、记住您的身份。例如：cookies
                                有助于我们辨认您作为我们的注册用户的身份，或保存您向我们提供的有关您的喜好或其他信息；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">2、分析您使用我们服务的情况。例如，我们可利用
                                cookies来了解您使用我们的服务进行什么活动、或哪些网页或服务最受您的欢迎；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">3、广告优化。cookies有助于我们根据您的信息，向您提供与您相关的广告而非进行普遍的广告投放。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们为上述目的使用 cookies 的同时，可能将通过 cookies
                                收集的非个人身份信息，经统计加工后提供给广告商或其他合作伙伴，用于分析用户如何使用我们的服务，并用于广告服务。</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们的产品和服务上可能会有广告商或其他合作方放置的 cookies 。这些
                                cookies 可能会收集与您相关的非个人身份信息，以用于分析用户如何使用该等服务、向您发送您可能感兴趣的广告，或用于评估广告服务的效果。这些第三方 cookies
                                收集和使用该等信息，不受本政策约束，而是受相关使用者的隐私政策约束，我们不对第三方的 cookies 承担责任。</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">您可以通过浏览器设置拒绝或管理
                                cookies。但请注意，如果停用cookies，您有可能无法享受最佳的服务体验，某些服务也可能无法正常使用。同时，您还会收到同样数量的广告，但这些广告与您的相关性会降低。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">六.信息安全</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们仅在本政策所述目的所必需的期间和法律法规要求的时限内保留您的个人信息。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们使用各种安全技术和程序，以防信息的丢失、不当使用、未经授权阅览或披露。例如，在某些服务中，我们将利用加密技术（例如SSL）来保护您提供的个人信息。但请您理解，由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全。您需要了解，您接入我们的服务所用的系统和通讯网络，有可能因我们可控范围外的因素而出现问题。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">七.您分享的信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们的多项服务，可让您不仅与您的社交网络、也与使用该服务的所有用户公开分享您的相关信息，例如，您在我们的服务中所上传或发布的信息（包括您公开的个人信息、您建立的名单）、您对其他人上传或发布的信息作出的回应，以及包括与这些信息有关的位置数据和日志信息。使用我们服务的其他用户也有可能分享与您有关的信息（包括位置数据和日志信息）。特别是，我们的社交媒体服务，是专为使您可以与世界各地的用户共享信息而设计，您可以使共享信息实时、广泛地传递。只要您不删除共享信息，有关信息会一直留存在公共领域；即使您删除共享信息，有关信息仍可能由其他用户或不受我们控制的非关联第三方独立地缓存、复制或储存，或由其他用户或该等第三方在公共领域保存。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">因此，请您谨慎考虑通过我们的服务上传、发布和交流的信息内容。在一些情况下，您可通过我们某些服务的隐私设定来控制有权浏览您的共享信息的用户范围。如要求从我们的服务中删除您的相关信息，请通过该等特别服务条款提供的方式操作。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">八.您分享的敏感个人信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">某些个人信息因其特殊性可能被认为是敏感个人信息，例如您的种族、宗教、个人健康和医疗信息等。相比其他个人信息，敏感个人信息受到更加严格的保护。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">请注意，您在我们的服务中所提供、上传或发布的内容和信息（例如有关您社交活动的照片等信息），可能会泄露您的敏感个人信息。您需要谨慎地考虑，是否在使用我们的服务时披露相关敏感个人信息。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">您同意按本政策所述的目的和方式来处理您的敏感个人信息。</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">九.我们可能向您发送的信息</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">1、信息推送：您在使用我们的服务时，我们可能使用您的信息向您的设备发送新闻或推送通知。如您不希望收到这些信息，可在设备上选择取消相关权限或关闭相关提示。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">2、与服务有关的公告：我们可能在必要时（例如因系统维护而暂停某一项服务时）向您发出与服务有关的公告。您可能无法取消这些与服务有关、性质不属于推广的公告。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">十.对第三方责任的声明</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">请您注意，我们的服务可能包括或链接至第三方提供的社交媒体或其他服务（包括网站）。例如：</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">1、您利用"分享"键将某些内容分享到我们的服务，或您利用第三方连线服务登录我们的服务。这些功能可能会收集您的相关信息（包括您的日志信息），并可能在您的设备装置
                                cookies，从而正常运行上述功能；</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">2、我们通过广告或我们服务的其他方式向您提供链接，使您可以接入第三方的服务或网站。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">3、该等第三方社交媒体或其他服务可能由相关的第三方或我们运营。您使用该等第三方的社交媒体服务或其他服务（包括您向该等第三方提供的任何个人信息），须受该第三方的服务条款及隐私政策（而非《用户协议》或本政策）约束，您需要仔细阅读其条款。本政策仅适用于我们所收集的信息，并不适用于任何第三方提供的服务或第三方的信息使用规则，我们对任何第三方使用由您提供的信息不承担任何责任。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">十一.未成年人隐私权特别约定</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">我们不会有意向未满十八周岁（或者其他您所在地区使用法律规定的年龄）的未成年人收集信息，如果您是未成年人，请不要向我们发送您的个人信息，包括您的姓名、地址、电子邮件、电话号码等。我们鼓励父母或监护人指导未成年人使用我们的服务。如果您为未成年人，
                                建议请您的父母或监护人阅读本政策，并在征得您父母或监护人同意的前提下使用我们的服务或向我们提供您的信息。如您的父母或监护人不同意您按照本政策使用我们的服务或向我们提供信息，请您立即终止使用我们的服务并及时通知我们，以便我们采取相应的措施。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">十二.隐私政策的适用范围及修订</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">&nbsp;</span></p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">除某些特定服务外，我们所有的服务均适用本政策。这些特定服务将适用特定的隐私政策。针对某些特定服务的特定隐私政策，将更具体地说明我们在该等服务中如何使用您的信息。该特定服务的隐私政策构成本政策的一部分。如相关特定服务的隐私政策与本政策有不一致之处，适用该特定服务的隐私政策。</span>
                </p>
                <p style="margin:0pt; orphans:0; text-align:justify; widows:0"><span
                                style="font-family:DengXian; font-size:20pt">除本政策另有规定外，本政策所用词语将与《用户协议》所定义的词语具有相同的涵义。</span>
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