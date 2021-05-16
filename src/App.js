
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

import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import RestaurantList from './components/customer/RestaurantList';
import FinalizeOrderPage from './components/customer/FinalizeOrderPage';
import RestaurantMenuBar from './components/restaurant/RestaurantMenuBar';
import RestaurantProfile from './components/restaurant/RestaurantProfile';
import CourierMenuBar from './components/courier/CourierMenuBar';
import CourierProfile from './components/courier/CourierProfile';
import AssignmentPage from './components/courier/AssignmentsPage';
import CourierFinalizedOrders from './components/courier/CourierFinalizedOrders';
import RestaurantModifyMenu from './components/restaurant/RestaurantModifyMenu';
import AdminPage from './components/admin/AdminPage';
import RestaurantFinalizedOrders from "./components/restaurant/RestaurantFinalizedOrders";


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
                                    <Route path="/courier" component={CourierMenuBar} />
                                    <Route path="/courier/profile" component={CourierProfile} />
                                    <Route path="/courier/assignments" exact component={AssignmentPage} />
                                    <Route path="/courier/finalizedOrders" exact component={CourierFinalizedOrders} />
                                    <Route path="/restaurant" component={RestaurantMenuBar} />
                                    <Route path="/restaurant/profile" exact component={RestaurantProfile} />
                                    <Route path="/restaurant/activeOrders" exact component={MainRestaurantPage}/>
                                    <Route path="/restaurant/finalizedOrders" exact component={RestaurantFinalizedOrders}/>
                                    <Route path="/restaurant/modifyMenu" exact component={RestaurantModifyMenu} />
                                    <Route path="/admin/" exact component={AdminPage} />
                                
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
