import { routerReducer } from 'react-router-redux';

import { combineReducers, createStore } from 'redux';
import { toast } from "react-toastify";

const INITIAL_LOGIN_INFO = {
    loggedIn: false,
    userId: null,
    token: null,
    restaurantId: null
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
    switch (action.type) {
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
    var newCartItems

    switch (action.type) {
        case "ADD":
            newPrice = state.totalPrice + action.newItem.price;
            oldCartItems = state.cartItems;
            return { ...state, totalPrice: newPrice, cartItems: [...oldCartItems, action.newItem] };
        case "UPDATE":
            const updatedMenuItemId = action.updatedItem.menuItemId;
            oldCartItems = state.cartItems;
            newPrice = state.totalPrice;
            newCartItems = [];
            for (var i = 0; i < oldCartItems.length; i++) {
                if (oldCartItems[i].menuItemId === updatedMenuItemId) {
                    newPrice = newPrice - oldCartItems[i].price + action.updatedItem.price;
                    newCartItems = [...newCartItems, action.updatedItem];
                }
                else {
                    newCartItems = [...newCartItems, oldCartItems[i]];
                }
            }
            if (newPrice < 0)
            {
                toast.error("Your cart total becomes negative, you need to remove your coupon first.");
                return state;
            }

            return { ...state, totalPrice: newPrice, cartItems: newCartItems };
        case "EMPTY":
            return INITIAL_CART_INFO;
        case "REMOVE":
            oldCartItems = state.cartItems;
            newPrice = state.totalPrice;
            newCartItems = [];
            for (var i = 0; i < oldCartItems.length; i++) {
                if (oldCartItems[i].menuItemId !== action.removedMenuItemId) {
                    newPrice = newPrice + oldCartItems[i].price;
                    newCartItems = [...newCartItems, oldCartItems[i]];
                }
                else {
                    newPrice -= oldCartItems[i].price;
                }
            }
            if (newPrice < 0)
            {
                toast.error("Your cart total becomes negative, you need to remove your coupon first.");
                return state;
            }

            return { ...state, totalPrice: newPrice, cartItems: newCartItems };
        case "APPLY_COUPON":
            newPrice = state.totalPrice - action.couponData.discountAmount;
            return { ...state, totalPrice: newPrice, usedCoupon: action.couponData };
        case "REMOVE_COUPON":
            if (state.usedCoupon === null) return state;

            newPrice = state.totalPrice + state.usedCoupon.discountAmount;
            return { ...state, totalPrice: newPrice, usedCoupon: null};
        default:
            return state;
    }
}

let reducers = combineReducers({ routerReducer, loginInfo, cartInfo });

const persistedState = loadFromLocalStorage();
const store = createStore(reducers, persistedState);
store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;