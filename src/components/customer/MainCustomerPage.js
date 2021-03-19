import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import ActiveOrders from './ActiveOrders';
import RestaurantList from './RestaurantList';

class MainCustomerPage extends React.Component
{
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>
                <ActiveOrders />
                <br/>
                <RestaurantList />
            </div>
        );
    }
}

export default MainCustomerPage;