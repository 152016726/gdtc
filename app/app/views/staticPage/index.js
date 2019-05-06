/**
 * Created by mac-ddt on 2018/8/31.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    WebView,
    Dimensions
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import staticContent from "../../services/getStaticpage";
import config from "../../config";
import HeaderRight from './headerRight';
import {BgColorWhite, BorderColor} from "../../constants/color";
import getMoreInformations from '../../services/getMoreInformations';
import getInformationArticle from '../../services/getInformationArticle';
import getOneMessage from '../../services/getOneMessage';
import {DEVICER_TYPE, PAGE_SIZE} from "../../constants/articleConfig";
import Headerleft from "../../components/headerLeft";

let customMenuContext = { saveToLocal: '保存到相册', cancel: '取消' };    //自定义保存相册文字配置
let htmlStyle = `
<style>
html {
  font-size: ${Dimensions.get('window').width/10}px;
}
html, body{
  margin: 0;
  padding: 0;
}
img {
  width: 100%!important;
}
.article {
  color: #333;
  padding: 0 12px;
  font-size: 16px;
}
.article p {
 margin: 0;
 padding: 0;
}
.articleTitle {
  padding: 12px 12px 0 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #DEDEDE;
}
.articleTitle h6{
  font-size: 20px;
  margin: 0;
  font-weight: 500;  
}
.articleTitle p{
  margin: 10px 0;  
  color: #999999;
  font-size: 12px;
  font-family: PingFang-SC-Regular;  
}
.teamVs {
  font-size: 16px;
  padding: 0 12px 12px 12px;
  display: none;
}
.teamVs span{
  color: #2F80FA;
  margin-left: 10px;
}

.article p {
  letter-spacing: 2px;
  line-height: 24px;
  text-align: justify;
}

.author{
  font-size: 16px;
  color: #999999;
  padding: 16px 12px;
}
.relatedInfoTitle{
  background: #F5F5F5;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  padding-left: 12px;
  border-bottom: 1px solid #DEDEDE;
  border-top: 1px solid #DEDEDE;
}
.relatedInfoTitle span{
  float: left;
  height: 16px;
}
.relatedInfoTitle .iconInfo{
  width: 3px;
  margin-top: 11px;
  margin-right: 10px;
  background: #EB812B;
}
.relatedInfoList{
  padding: 0 12px;  
}
.relatedInfoList .infoList{
  padding:12px 0;
  width: 100%;
  height: 75px;
  border-bottom: 1px solid #DEDEDE;  
}
.relatedInfoList .lastBorder {
  border: none;
}
.infoList div{
 float: left;
 height: 75px;
 font-size: 14px;
}
.infoList .infoListImg{
  width: 100px;
  margin-right: 12px;
  border-radius: 2px;
  overflow: hidden;
}
.infoListImg img{
  width: 100%;
  height: 100%;
}
.infoList .listRight{
  width: calc(100% - 112px);
  position: relative;
}
.listRight p{
  position: absolute;
}
.listRight .titleText{
  left: 0;
  font-size: 16px;
  top: -17px;
}
.listRight .articleDate{
  right: 0;
  bottom: -18px;
  color: #999999;
  font-size: 12px;
  font-family: PingFang-SC-Regular; 
}
.noTipsText {
 height: 60px;
 line-height: 60px;
 font-size: 16px;
 color: #999999;
 text-align: center;
}
</style>
`;

export default class StaticPage extends Component {
    static navigationOptions = ({navigation}) => {
        const {isFromMessage=false} = navigation.state.params || {};
        return {
            title: isFromMessage ? '消息中心': '资讯详情',
            headerRight: isFromMessage ? (<View/>): (<HeaderRight/>),
            headerLeft: <Headerleft handleGoBack={() => navigation.goBack()} img={require('../../images/back.png')}/>,
            headerBackTitleStyle:{color: 'transparent'}
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            isReqIng: true,             // 正在加载中的状态
            reqFail: false,             // 加载失败的状态
            content: '',                // 展示的内容
            infoList: [],               // 相关资讯
            itemList: {},               // 当前展示的文章
            show: false,                // 是否放大图片
            imagesArr: [],              // 需要放大的的图片地址
            isFromMessage: false        // 是否来自消息中心
        }
    }

    componentWillMount() {
        const {navigation} = this.props;
        const {state} = navigation;
        let item = state.params && state.params.item;
        let id = item && item.id;       // 文章 id
        if(state.params && state.params.isFromMessage) {
            // 消息详情
            this.getMessageData(id);
            this.setState({
                isFromMessage: true
            });
            navigation.setParams({
                isFromMessage: true
            })
        }else {
            // 资讯详情
            this.getArticleData(id);
        }


    }

    /**
     * 请求消息详情
     */
    getMessageData(id) {
        getOneMessage.getData({id}).then(rsp => {
            this.setState({
                content: rsp.data.content,
                itemList: rsp.data,
                isReqIng: false,
                reqFail: false
            })
        })
    }

    /**
     * 请求文章内容
     */
    getArticleData(id) {
        getInformationArticle.getData({id, deviceType: 2}).then(rsp => {
            let rspData = rsp.data;
            let link = rspData.link;   // 文章链接
            let id = rspData.id;       // 文章 id
            this.getContent(link);
            this.getMoreList(id);
            this.setState({
                itemList: rspData
            })
        })
    }

    /**
     * 获取相关资讯接口
     * @param id 文章 id
     */
    getMoreList(id) {
        let reqObj = {
            exclude: '',
            id: id,
            pageSize: PAGE_SIZE,
            deviceType: DEVICER_TYPE
        };
        getMoreInformations.getData(reqObj).then((rsp) => {
            this.setState({
                infoList: rsp.data.list
            })
        }, (req) => {
            console.log('error')
        })
    }

    /**
     * 获取文件内容
     * @param link 文章 link
     */
    getContent(link) {
        let _seft = this;
        staticContent.getData({
            link
        }).then((rsp) => {
            // console.log(rsp);
            _seft.setState({
                content: rsp.data.content,
                isReqIng: false,
                reqFail: false
            })
        }, (req) => {
            console.log(req);
            _seft.setState({
                isReqIng: false,
                reqFail: true
            })
        });
    }

    /**
     * 隐藏放大的图片
     */
    hideImgHandle() {
        this.setState({
            show: false,
            imagesArr: []
        })
    }

    /**
     * 点击 webView 内容回调
     * @param e
     * @private
     */
    _onMessage(e) {
        const {navigation} = this.props;
        if(e.nativeEvent.data.indexOf('/') !== -1){  // 图片放大功能
            this.setState({
                show: true,
                imagesArr: [{
                    url:config.staticResourceHost + e.nativeEvent.data
                }]
            })
        }else {       // 相关推荐的资讯页面操作
            let {infoList} = this.state;
            let index = Math.floor(e.nativeEvent.data);
            let infoObj = infoList[index];
            this.getContent(infoObj.link);
            this.getMoreList(infoObj.id);
            this.setState({
                itemList: infoObj
            });
        }
    }

    /**
     * 相关资讯文章模块渲染
     * @returns {string}
     */
    renderRelatedInfo () {
        const {infoList, isFromMessage} = this.state;
        let relatedInfoHtml = ``;       // 相关资讯模板
        let listHtml = ``;              // 相关推荐的文章模块
        if(!isFromMessage) {
            if(infoList && infoList.length > 0) {
                infoList.forEach((list, index) => {
                    let lastClass = index === infoList.length - 1 ? 'lastBorder' : '';
                    let pLDate = Date.prototype.parseISO8601(list.publishDate);
                    let artDate = pLDate.format('MM-dd hh:mm');
                    listHtml += `
                <div class="infoList ${lastClass}">
                   <div class="infoListImg">
                     <img src="${list.titleImage}" alt="">
                   </div>
                   <div class="listRight">
                      <p class="titleText">${list.title}</p>
                      <p class="articleDate">${artDate}</p> 
                   </div>
                </div>`;
                });
            }else {
                listHtml = `<div class="noTipsText">暂无相关资讯</div>`;
            }
            relatedInfoHtml = `
                <div class="relatedInfo">
                   <div class="relatedInfoTitle">
                       <span class="iconInfo"></span> <span>相关资讯</span>
                   </div>
                   <div class="relatedInfoList">
                      ${listHtml}
                   </div>
                </div>
            `
        }
        return relatedInfoHtml;
    }

    render() {
        const {content, isReqIng, reqFail, itemList, show, imagesArr} = this.state;
        let authorHtml = ``;            // 编辑展示的模块
        let sourceHtml = ``;            // 来源的展示模块
        let articleDate = '';           // 文章时间
        if(itemList.publishDate) {
            let publishDate = Date.prototype.parseISO8601(itemList.publishDate);
            articleDate = publishDate.format('MM-dd hh:mm');
        }
        if (itemList.source) {          // 判断是否有来源
            sourceHtml = itemList.source
        }
        if (itemList.author) {          // 判断是否有编辑
            authorHtml = `编辑：` + itemList.author;
        }
        let relatedInfoHtml = this.renderRelatedInfo();
        let html = `
        <!doctype html>
        <html>
          <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
            <meta charset="utf-8" name="format-detection" content="telephone=no">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
            ${htmlStyle}
            <base href="${config.staticResourceHost}" />
          </head>
          <script>
          window.onload = function () {
              var detailed = document.getElementById('detailed');
              detailed.addEventListener('click',(e)=>{
                  window.postMessage('详细分析');
              });
              var liDoms = document.getElementsByClassName('infoList');
              for(let i = 0; i <= liDoms.length - 1; i++){
                  liDoms[i].addEventListener('click', ()=>{
                      window.postMessage(i);
                  })
              }
              // var imgDoms = document.querySelectorAll('img');
              // for(let i = 0; i < imgDoms.length; i++){
              //     imgDoms[i].addEventListener('click', ()=>{
              //         var srcValue = imgDoms[i].getAttribute('src')
              //         window.postMessage(srcValue);
              //     })
              // }
          }  
          </script>
          <body>
            <div class="articleTitle">
                <h6>${itemList.title}</h6>
                <p>${articleDate}  ${sourceHtml}</p>
            </div>
            <div class="teamVs">
                广州恒大 VS 鹿岛鹿角
                <span id="detailed">详细信息>></span>
            </div>
            <div class="article">
                ${content}
            </div>
            <div class="author">
                ${authorHtml}
            </div>
            ${relatedInfoHtml}
          </body>
        </html>
        `;
        return (
            <View style={{flex: 1}}>
                {
                    isReqIng &&
                    <View style={styles.reqSty}>
                        <Text style={styles.reqText}>
                            数据请求中...
                        </Text>
                    </View>
                }
                {
                    reqFail &&
                    <View style={styles.reqSty}>
                        <Text style={styles.reqText}>
                            数据请求失败。。。
                        </Text>
                    </View>
                }
                {!isReqIng && !reqFail && <WebView ref={(webView) => this.webview = webView}
                                                   javaScriptEnabled={true}
                                                   scalesPageToFit={true}
                                                   originWhitelist={['*']}
                                                   automaticallyAdjustContentInsets={false}
                                                   onMessage={(e) => this._onMessage(e)}
                                                   style={{flex: 1,backgroundColor:'transparent'}}
                                                   source={{html: html, baseUrl: ''}}/>}
                <Modal animationType={"slide"}
                                    transparent={true}
                                    visible={show}
                                    onRequestClose={() => {
                                    }}>
                    <ImageViewer
                        imageUrls={imagesArr}
                        menuContext={customMenuContext}
                        onClick={()=>this.hideImgHandle()}
                    />
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    reqSty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    reqText: {
        color: '#777777'
    },
    titleBox: {
        backgroundColor: BgColorWhite,
    },
    titleContent: {
        paddingHorizontal: 12,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: BorderColor
    },
    titleTeam: {
        paddingHorizontal: 12,
        paddingVertical: 15,
        flexDirection: 'row'
    }

});