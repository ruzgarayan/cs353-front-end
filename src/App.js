import 'primeicons/primeicons.css';
import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import MainMenu from './components/MainMenu';
import MainCustomerPage from './components/customer/MainCustomerPage';
import MainRestaurantPage from './components/restaurant/MainRestaurantPage';
import MainCourierPage from './components/courier/MainCourierPage';
import {
    BrowserRouter as Router,
    Route,
} from "react-router-dom";

import {routerReducer} from 'react-router-redux';
import {loginInfo} from "./reducers/index"

import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux'
import CustomerMenuBar from './components/customer/CustomerMenuBar';
import CustomerFavorites from './components/customer/CustomerFavorites';
import CustomerOldOrders from './components/customer/CustomerOldOrders';
import CustomerProfile from './components/customer/CustomerProfile';
import RestaurantView from './components/customer/RestaurantView';
import OrderDetails from './components/customer/OrderDetails';

import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


class App extends React.Component {

    render() {

        let history = createBrowserHistory();
        let reducers = combineReducers({routerReducer, loginInfo});
        let store = createStore(reducers);
        toast.configure();

        return (
            <div>
                <div style={{ textAlign: "center" }}>
                    <Provider store={store}>
                        <Router history={history}>
                            <div>
                                {//<Switch>
                                }
                                    <Route path="/" exact component={MainMenu} /> 
                                    <Route path="/customer" component={CustomerMenuBar} /> 
                                    <Route path="/customer/main" exact component={MainCustomerPage} />
                                    <Route path="/customer/profile" exact component={CustomerProfile} />
                                    <Route path="/customer/orders" exact component={CustomerOldOrders} />
                                    <Route path="/customer/favorites" exact component={CustomerFavorites} />
                                    <Route path="/customer/restaurantPage/:id" exact component={RestaurantView} />
                                    <Route path="/customer/orderDetails/:id" exact component={OrderDetails} />
                                    <Route path="/courier" component={MainCourierPage} />
                                    <Route path="/restaurant" component={MainRestaurantPage} />
                                
                                {//</Switch>
                                }
                            </div>
                        </Router>
                    </Provider>
                </div>
                <ToastContainer position="bottom-right"/>
            </div>
        )
    }

}

export default App;
