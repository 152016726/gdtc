/**
 *
 * Created by DDT on 2017/8/7.
 */

//定义核心处理方法
let _innerFn = {
    /**
     * 根据改变的data, 设置vmodel
     * @param vm
     * @param data
     */
    setVmodel(vm, data) {
        if(vm && data){
            for(let p in data){
                vm[p] = data[p];
            }
        }
    },
    /**
     * 根据vm的名称获取vm对象, 建议vm只读
     * @param vmName
     */
    getState(vmName) {
        return avalon.vmodels[vmName];
    },
    /**
     * 重新配置方法, 返回设置vmodel方式
     * @param action
     * @returns {Function}
     */
    deploy(action) {
        let bindSelf = this;
        return function(){
            let arrArgs = Array.prototype.slice.call(arguments);
            let _self = this;
            let oldData = this.$model, toData;
            arrArgs.unshift(oldData, _innerFn.getState);
            toData = action.apply(bindSelf, arrArgs);
            if(toData instanceof Promise){
                return toData.then(function(data){
                    _innerFn.setVmodel(_self, data);
                    return data;
                }, function(data){
                    _innerFn.setVmodel(_self, data);
                    return data;
                });
            }else{
                _innerFn.setVmodel(_self, toData);
                return toData;
            }
        };
    }
};

module.exports = {
    /**
     *
     * @param name      对应组件名称
     * @param state     记录组件状态，建议只记录需要更新页面的属性
     * @param actions    触发state转变的方法
     * @param ops       指定组件控制方法，可以调用action中的方法进行更新state，主要不要把action放放入ops
     */
    connet2Componet(name, state, actions, ops){
        let deployActions = {};
        for(let p in actions){
            if(p.indexOf('_') !== 0){
                deployActions[p] = _innerFn.deploy.call(actions, actions[p]);
            }
        }
        ops.defaults = Object.assign(ops.defaults, state, deployActions);
        return avalon.component(name, ops);
    },
    connet2Vmodel(ops, state, actions){
        let deployActions = {};
        for(let p in actions){
            if(p.indexOf('_') !== 0){
                deployActions[p] = _innerFn.deploy.call(actions, actions[p]);
            }
        }
        ops = Object.assign(ops, state, deployActions);
        return avalon.define(ops);
    }
};