/**
 * Created by DDT on 2018/11/27.
 */
export default {
    show: false,            // 是否显示
    title: '',              // 标题 格式：String|Component|{home:String|Component(主队),away:String|Component(客队),neutral:false(是否是中立场)}
    content: '',            // 内容 格式：String|Component
    buttons: [],            // 按钮 格式：{text:String|Component,onPress:Function}
    cancelBtnText: '取消',   // 取消按钮文字
    confirmBtnText: '确定',  // 确认按钮文字
    customStyles: {},     // 自定义样式对象
    onCancel: () => {       // 取消回调
    },
    onConfirm: () => {      // 确认回调
    },
    maskPress: () =>{       // 点击遮罩回调
    },
    showOtherContent: false, //是否显示其他内容
    otherContent: null       //其他内容，为避免弹窗时操作还要弹出其他内容（两个modal有冲突，只能显示一个）
};