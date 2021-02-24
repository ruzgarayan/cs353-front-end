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
    Switch,
    Route,
    Link
} from "react-router-dom";

import {routerReducer} from 'react-router-redux';

import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import CustomerMenuBar from './components/customer/CustomerMenuBar';
import CustomerFavorites from './components/customer/CustomerFavorites';
import CustomerOldOrders from './components/customer/CustomerOldOrders';
import CustomerProfile from './components/customer/CustomerProfile';

class App extends React.Component {

    render() {

        let history = createBrowserHistory();
        let store = createStore(routerReducer);

        return (
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
                                <Route path="/courier" component={MainCourierPage} />
                                <Route path="/restaurant" component={MainRestaurantPage} />
                               
                            {//</Switch>
                            }
                        </div>
                    </Router>
                </Provider>
            </div>
        )
    }

}

export default App;
