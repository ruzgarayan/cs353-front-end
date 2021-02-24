import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import RestaurantList from './RestaurantList';


class MainCustomerPage extends React.Component
{
    render() {
        return (
            <div>
                <RestaurantList/>
            </div>
        );
    }
}

export default MainCustomerPage;