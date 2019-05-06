let innerFn = {
    urlEncode: (param, key, encode) => {
        if (param == null) return '';
        let paramStr = '';
        let t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (let i in param) {
                let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
                paramStr += innerFn.urlEncode(param[i], k, encode)
            }
        }
        return paramStr;
    }
}

module.exports = {
    urlEncode: (param, key, encode) => {
        return innerFn.urlEncode(param, key, encode).slice(1);
    },
    getQueryString: (name) => {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
};