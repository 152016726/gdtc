/**
 * Created by mac-ddt on 2017/6/7.
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux'
import configureStore from './reduxCfg/configureStore'
import RootPage from './views/rootPage'
import './common/js/init'

const store = configureStore();
export default class EasyLottery_RN extends Component{

    render(){
        return(
            <Provider store={store}>
                <RootPage/>
            </Provider>
            )
    }
}
