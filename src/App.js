
import React from 'react';
import MainMenu from './components/MainMenu';
import MainRestaurantPage from './components/restaurant/MainRestaurantPage';
import MainCourierPage from './components/courier/MainCourierPage';
import {
    BrowserRouter as Router,
    Route,
} from "react-router-dom";

import { createBrowserHistory } from 'history';
import store from './reducers/index.js'
import { Provider } from 'react-redux';
import CustomerMenuBar from './components/customer/CustomerMenuBar';
import CustomerFavorites from './components/customer/CustomerFavorites';
import CustomerOrderList from './components/customer/CustomerOrderList';
import CustomerProfile from './components/customer/CustomerProfile';
import RestaurantView from './components/customer/RestaurantView';
import OrderDetails from './components/customer/OrderDetails';

import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import RestaurantList from './components/customer/RestaurantList';
import FinalizeOrderPage from './components/customer/FinalizeOrderPage';


class App extends React.Component {

    render() {

        let history = createBrowserHistory();
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
                                    <Route path="/customer/restaurants" exact component={RestaurantList} />
                                    <Route path="/customer/restaurants/search=:searchKey" exact component={RestaurantList} />
                                    <Route path="/customer/restaurants/min=:min/max=:max/open=:open" exact component={RestaurantList} />
                                    <Route path="/customer/profile" exact component={CustomerProfile} />
                                    <Route path="/customer/orders" exact component={CustomerOrderList} />
                                    <Route path="/customer/favorites" exact component={CustomerFavorites} />
                                    <Route path="/customer/finalizeOrder" exact component={FinalizeOrderPage} />
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
