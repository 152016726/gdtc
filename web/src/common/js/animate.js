/**
 * Created by Invoker on 2016/12/1.
 */
function $id(id) {
    return document.getElementById(id);
}

function getStyle(element, attr) {
    return element.currentStyle ? element.currentStyle[attr] : window.getComputedStyle(element, null)[attr] || 0;
}

function animatev(element, json, fn) {
    clearInterval(element.timer);
    element.timer = setInterval(function() {
        var flag = true;
        for (var key in json) {
            if (key == "opacity") {
                var current = getStyle(element, key) * 100 || 0;
                var target = json[key] * 100;
                var step = (target - current) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                current += step;
                element.style[key] = current / 100;
            } else if (key == "zIndex") {
                element.style[key] = json[key];
            } else {
                var current = parseInt(getStyle(element, key)) || 0;
                var target = json[key];
                var step = (target - current) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                current += step;
                element.style[key] = current + "px";
            }
            if (current != target) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(element.timer);
            (typeof fn == "function") && fn();
        }
    }, 20);
}

var config1 = [
    {
        height: 110,
        width: 200,
        top: 40,
        left: 0,
        opacity: 0.2,
        zIndex: 2
    }, //0
    {
        height: 140,
        width: 200,
        top: 30,
        left: 0,
        opacity: 0.8,
        zIndex: 3
    }, //1
    {
        height: 168,
        width: 254,
        top: 16,
        left: 78,
        opacity: 1,
        zIndex: 5
    }, //2
    {
        height: 140,
        width: 200,
        top: 30,
        left: 210,
        opacity: 0.8,
        zIndex: 3
    }, //3
    {
        height: 110,
        width: 200,
        top: 40,
        left: 210,
        opacity: 0.2,
        zIndex: 2
    } //4
];
var config2 = [ //0
    {
        height: 140,
        width: 200,
        top: 30,
        left: 0,
        opacity: 0.8,
        zIndex: 3
    }, //1
    {
        height: 168,
        width: 254,
        top: 16,
        left: 78,
        opacity: 1,
        zIndex: 5
    }, //2
    {
        height: 140,
        width: 200,
        top: 30,
        left: 210,
        opacity: 0.8,
        zIndex: 3
    }, //3
    {
        height: 110,
        width: 200,
        top: 40,
        left: 210,
        opacity: 0.2,
        zIndex: 2
    } //4
    , {
        height: 110,
        width: 200,
        top: 40,
        left: 0,
        opacity: 0.2,
        zIndex: 2
    }
];
var config3 = [ //0//1
    {
        height: 168,
        width: 254,
        top: 16,
        left: 78,
        opacity: 1,
        zIndex: 5
    }, //2
    {
        height: 140,
        width: 200,
        top: 30,
        left: 210,
        opacity: 0.8,
        zIndex: 3
    }, //3
    {
        height: 110,
        width: 200,
        top: 40,
        left: 210,
        opacity: 0.2,
        zIndex: 2
    } //4
    , {
        height: 110,
        width: 200,
        top: 40,
        left: 0,
        opacity: 0.2,
        zIndex: 2
    }, {
        height: 140,
        width: 200,
        top: 30,
        left: 0,
        opacity: 0.8,
        zIndex: 3
    }
];
var config4 = [
    //0//1//2
    {
        height: 140,
        width: 200,
        top: 30,
        left: 210,
        opacity: 0.8,
        zIndex: 3
    }, //3
    {
        height: 110,
        width: 200,
        top: 40,
        left: 210,
        opacity: 0.2,
        zIndex: 2
    } //4
    , {
        height: 110,
        width: 200,
        top: 40,
        left: 0,
        opacity: 0.2,
        zIndex: 2
    }, {
        height: 140,
        width: 200,
        top: 30,
        left: 0,
        opacity: 0.8,
        zIndex: 3
    }, {
        height: 168,
        width: 254,
        top: 16,
        left: 78,
        opacity: 1,
        zIndex: 5
    }
];
var config5 = [
    //0//1//2
    //3
    {
        height: 110,
        width: 200,
        top: 40,
        left: 210,
        opacity: 0.2,
        zIndex: 2
    } //4
    , {
        height: 110,
        width: 200,
        top: 40,
        left: 0,
        opacity: 0.2,
        zIndex: 2
    }, {
        height: 140,
        width: 200,
        top: 30,
        left: 0,
        opacity: 0.8,
        zIndex: 3
    }, {
        height: 168,
        width: 254,
        top: 16,
        left: 78,
        opacity: 1,
        zIndex: 5
    }, {
        height: 140,
        width: 200,
        top: 30,
        left: 210,
        opacity: 0.8,
        zIndex: 3
    }
];
var data = {
    arr1: config1,
    arr2: config2,
    arr3: config3,
    arr4: config4,
    arr5: config5
};

module.exports = {
    animatev: animatev,
    $id: $id,
    data: data
}