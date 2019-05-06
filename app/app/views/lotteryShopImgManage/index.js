/**
 * Created by owen on 2019/03/05.
 */
import React, {Component} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {connectReducerComponent} from '../../reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '~/constants/storeKeys'
import Headerleft from "~/components/headerLeft"
import ImagePicker from 'react-native-image-picker';
import * as Color from '~/constants/color'
import uploadImg from "./images/upload.png"
import iconSetImg from "./images/icon_set.png"
import firstImg from "./images/first.png"
import deleteImg from "./images/delete.png"
import circleImg from "./images/circle.png"
import selectImg from "./images/select.png"
import emptyImg from "./images/empty.png"
import getUploaderImg from '~/services/getUploaderImg';
import ActionProgressDialog from "../../components/actionProgressDialog";
const _imgMaxCount = 3;

class LotteryShopImgManage extends Component {
    static navigationOptions = ({navigation}) => {
        let {params = {}} = navigation.state;
        let {cancleCb, isManageState} = params;
        let headerLeft = <Headerleft
            handleGoBack={
                () => {
                    navigation.goBack()
                }}
            img={require('~/images/back.png')}
        />;
        if (isManageState) {
            headerLeft = <TouchableOpacity style={styles.headerLeftWrapper} onPress={cancleCb}>
                <Text style={styles.headerLeft}>取消</Text>
            </TouchableOpacity>
        }
        let headerTitle = '图片上传';
        return {headerLeft, headerTitle}
    };

    componentWillMount() {
        const {navigation} = this.props;
        navigation.setParams({
            cancleCb: () => {
                this.changeManageState(false)
            }
        });
    }

    componentDidMount() {
        this.props.setShopImages({}, 'get');
    }

    /**
     * 点击管理店铺图片
     */
    changeManageState(val) {
        const {changeSomeProps, navigation} = this.props;
        changeSomeProps({
            isManageState: val
        });
        navigation.setParams({
            isManageState: val
        });
    }

    /**
     * 选择图片
     */
    changeCheckedImg(index) {
        const {changeSomeProps, checkedImg, isManageState} = this.props;
        if (!isManageState) {
            return false;
        }
        let checkedImgVal = index;
        if (checkedImg === index) {
            checkedImgVal = null;
        }
        changeSomeProps({
            checkedImg: checkedImgVal
        })
    }

    /**
     * 设置首页
     */
    setFirstImg(type) {
        const {checkedImg, lotteryImgArr, setShopImages} = this.props;
        setShopImages({id: lotteryImgArr[checkedImg].id}, type);

    }

    /**
     * 上传图片
     */
    uploadImg() {
        const {setShopImages, lotteryImgArr, isManageState} = this.props;
        if (lotteryImgArr.length === _imgMaxCount) {
            this.progressDialog.toast('仅可上传3张图片');
            return false;
        }
        const options = {
            title: '请选择',
            // takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle: '选择照片',
            cancelButtonTitle: '取消',
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.8,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                this.progressDialog.toast('照片访问失败 请在设置-隐私-照片中开启对APP的使用权限');
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                let formData = new FormData();
                let file = {uri: response.uri, type: response.type, name: response.fileName};
                formData.append('file', file);
                getUploaderImg.getData(formData).then(rsp => {
                    setShopImages({id: rsp.data.id}, 'save');
                }, rej => {
                    this.progressDialog.toast(rej.rspMsg);
                });
            }
        });
    }

    delImg() {
        let conf = {
            title: '确认删除1张照片',
            content: <Text>图片删除后不可恢复，可选择设备上 的图片重新上传</Text>,
            customStyles: {
                mask: {
                    padding: 56
                }
            },
            show: true,
            maskPress: () => {
                this.props.toggleCommonDialog();
            },
            onCancel: () => {
                this.props.toggleCommonDialog();
            },
            onConfirm: () => {
                this.props.toggleCommonDialog();
                this.setFirstImg('del');
            }
        };
        this.props.updateCommonDialog(conf);
    }

    getImageBoxImg(index) {
        const {checkedImg, isManageState} = this.props;
        let img;
        let style = null;
        if (!isManageState) {
            return null;
        }
        if (checkedImg === null) { //还没选择
            img = circleImg;
        }
        else {
            if (checkedImg === index) {
                img = selectImg;
            }
            else {
                img = circleImg;
                style = styles.op50
            }
        }
        return <Image source={img} resizeMode={'cover'} style={[styles.imageBoxImg, style]}/>;
    }

    render() {
        const {isManageState, lotteryImgArr, checkedImg} = this.props;
        const hadCheckedImg = checkedImg !== null;
        const noEnoughImg = lotteryImgArr.length !== _imgMaxCount;
        return <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity
                    onPress={() => {
                        this.uploadImg();
                    }}
                >
                    <View style={[styles.uploadBtn, !noEnoughImg && styles.op70]}>
                        <View>
                            <Image source={uploadImg} style={styles.uploadImg}/>
                        </View>
                        <View>
                            <Text style={styles.uploadBtnText}>上传店铺图片</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Text style={[styles.tips, !noEnoughImg && styles.op50]}>
                    *仅可上传3张图片，大小不限，需要替换请先删除留出空位再操作
                </Text>
                <View style={styles.imageBoxList}>
                    {
                        lotteryImgArr.map((item, index) => <TouchableOpacity
                                key={index}
                                style={styles.imageBox}
                                onPress={() => {
                                    this.changeCheckedImg(index);
                                }}
                            >
                                <Image source={{uri: item.url}} resizeMode={'cover'} style={styles.imageBoxImg}/>
                                <View style={styles.imageBoxBtn}>
                                    {
                                        this.getImageBoxImg.call(this, index)
                                    }
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    {
                        lotteryImgArr.length === 0 && <View style={styles.emptyImgWrapper}>
                            <Image source={emptyImg} style={styles.emptyImg}/>
                            <Text style={styles.emptyImgText}>还没有图片</Text>
                            <Text style={styles.emptyImgText}>快上传展示一下吧～</Text>
                        </View>
                    }
                </View>
            </View>
            <View style={styles.bottomBtnWrapper}>
                {
                    isManageState ?
                        <View style={[styles.bottomBtn, !hadCheckedImg && styles.op50]}>
                            <TouchableOpacity
                                style={styles.rowBox}
                                onPress={() => {
                                    if (hadCheckedImg) {
                                        this.setFirstImg('setFirst');
                                    }
                                }
                                }>
                                <View>
                                    <Image source={firstImg} style={styles.uploadImg} resizeMode={'contain'}/>
                                </View>
                                <View>
                                    <Text style={[styles.bottomBtnText, styles.rowBoxText]}>设为首张</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.rowBox, styles.noBorderRight]}
                                onPress={() => {
                                    if (hadCheckedImg) {
                                        this.delImg();
                                    }
                                }}
                            >
                                <View>
                                    <Image source={deleteImg} style={styles.uploadImg} resizeMode={'contain'}/>
                                </View>
                                <View>
                                    <Text style={[styles.bottomBtnText, styles.rowBoxText]}>删除</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity
                            onPress={() => {
                                this.changeManageState(true);
                            }}
                            style={styles.bottomBtn}>
                            <View>
                                <Image source={iconSetImg} style={styles.uploadImg} resizeMode={'contain'}/>
                            </View>
                            <View>
                                <Text style={styles.bottomBtnText}>管理店铺图片</Text>
                            </View>
                        </TouchableOpacity>
                }
            </View>
            <ActionProgressDialog
                ref={progressDialog => this.progressDialog = progressDialog}
            />
        </View>
    }
}

export default connectReducerComponent(storeKey.LOTTERY_SHOP_IMG_MANAGE, reducer, state, action)(LotteryShopImgManage)

const styles = StyleSheet.create({
    headerLeftWrapper: {
        paddingHorizontal: 10
    },
    headerLeft: {
        color: '#ffffff'
    },
    container: {
        display: 'flex',
        flex: 1
    },
    content: {
        marginVertical: 16,
        marginHorizontal: 12,
        flex: 1
    },
    uploadBtn: {
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 8,
        height: 40,
        backgroundColor: Color.MainColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadBtnText: {
        color: '#fff',
        fontSize: 15
    },
    uploadImg: {
        width: 18,
        height: 18,
        marginRight: 8
    },
    tips: {
        marginTop: 8,
        marginBottom: 16,
        color: Color.tipsTextGrey
    },
    bottomBtnWrapper: {},
    bottomBtn: {
        display: 'flex',
        flexDirection: 'row',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#b3b3b3'
    },
    rowBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        borderRightColor: Color.DarkerBorderColor,
        borderRightWidth: 1
    },
    noBorderRight: {
        borderRightWidth: 0
    },
    rowBoxText: {
        color: '#333333'
    },
    bottomBtnText: {
        color: Color.MainColor,
        fontSize: 15
    },
    imageBoxList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    imageBox: {
        width: '48%',
        height: 95,
        marginBottom: 20
    },
    imageBoxImg: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    op50: {
        opacity: 0.5
    },
    op70: {
        opacity: 0.7
    },
    imageBoxBtn: {
        position: 'absolute',
        right: 6,
        top: 6,
        width: 16,
        height: 16
    },
    emptyImgWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40
    },
    emptyImg: {
        width: 131,
        height: 84,
        marginBottom: 12
    },
    emptyImgText: {
        fontSize: 16,
        color: Color.DarkerBorderColor
    }
});

