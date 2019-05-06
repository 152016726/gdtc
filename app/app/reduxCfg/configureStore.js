/**
 * Created by mac-ddt on 16/7/6.
 */

import thunk from 'redux-thunk'
import getRootReducer from './index'
import {
    applyMiddleware,
    compose,
    createStore
} from 'redux'

let store;

export const reloadStore = (nextRootReducer) => {
    if(store){
        store.replaceReducer(nextRootReducer);
    }
};

export default function configureStore (initialState = {}) {
    let createStoreWithMiddleware

    const middleware = applyMiddleware(thunk);

    createStoreWithMiddleware = compose(middleware)

    store = createStoreWithMiddleware(createStore)(
        getRootReducer(), initialState
    );

    return store
}
