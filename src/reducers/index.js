import {routerReducer} from 'react-router-redux';

import { combineReducers, createStore } from 'redux';

const INITIAL_LOGIN_INFO = {
    loggedIn: false,
    userId: null,
    token: null
}

const INITIAL_CART_INFO = {
    totalPrice: 0.0,
    cartItems: [],
    usedCoupon: null
}

export function saveToLocalStorage(state) {
    console.log("here1");
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (error) {
        console.log(error);
    }
}

export function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export const loginInfo = (state = INITIAL_LOGIN_INFO, action) => {
    switch(action.type) {
        case "LOGIN":
            return action.newState;
        case "LOGOUT":
            return action.newState;
        default:
            return state;
    }
}

export const cartInfo = (state = INITIAL_CART_INFO, action) => {
    var newPrice;
    var oldCartItems;

    switch(action.type) {
        case "ADD":
            newPrice = state.totalPrice + action.newItem.price;
            oldCartItems = state.cartItems;
            return {...state, totalPrice: newPrice, cartItems: [...oldCartItems, action.newItem]};
        case "UPDATE":
            const updatedMenuItemId = action.updatedItem.menuItemId;
            oldCartItems = state.cartItems;
            newPrice = state.totalPrice;
            let newCartItems = [];
            for (var i = 0; i < oldCartItems.length; i++)
            {
                if (oldCartItems[i].menuItemId === updatedMenuItemId) {
                    newPrice = newPrice - oldCartItems[i].price + action.updatedItem.price;
                    newCartItems = [...newCartItems, action.updatedItem];
                }
                else {
                    newCartItems = [...newCartItems, oldCartItems[i]];
                }
            }
            return {...state, totalPrice: newPrice, cartItems: newCartItems};
        default:
            return state;
    }
}

let reducers = combineReducers({routerReducer, loginInfo, cartInfo});

const persistedState = loadFromLocalStorage();
const store = createStore(reducers, persistedState);
store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;