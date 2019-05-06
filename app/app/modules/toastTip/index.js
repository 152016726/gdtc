/**
 * 公共toast提示框
 * Created by DDT on 2018/11/26.
 */
let _progressDialog = null;
let _innerProgressDialog = null;

export default {
    init(objDialog) {
        if(!_progressDialog){
            _progressDialog = objDialog;
        }
    },
    /**
     * 设置内部toast，modal窗口内需要重置
     * @param objDialog
     */
    initInner(objDialog) {
        if(_progressDialog){
            _innerProgressDialog = objDialog;
        }else{
            this.init(objDialog);
        }
    },
    clearInner(){
        _innerProgressDialog = null;
    },
    toast(text) {
        (_innerProgressDialog || _progressDialog).toast(text);
    },
    show(label) {
        (_innerProgressDialog || _progressDialog).show(label);
    },
    hide() {
        (_innerProgressDialog || _progressDialog).hide();
    }
};