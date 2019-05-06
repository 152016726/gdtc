/*封装开关显示隐藏效果*/
require("./style.scss");

var $ = require("jquery");
var timeflag = false;
var afterHideEventHandle = false;

function hide(){
    clearTimeout(timeflag);
    afterHideEventHandle && afterHideEventHandle();
    $("#tips .content").text("");
    $("#tips").fadeOut();
}

$("#tips").click(function(){
    hide();
});

module.exports = {
    timeout: 3,
    show: function(text, _afterHideEventHandle){
        $("#tips .content").text(text);
        $("#tips").fadeIn();
        afterHideEventHandle = _afterHideEventHandle;
        timeflag = setTimeout(function(){
            hide();
        }, this.timeout * 1000);
    }
};