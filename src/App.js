import 'primeicons/primeicons.css';
import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import {Button} from 'primereact/button';
import MainCustomerPage from './components/customer/MainCustomerPage';
import MainRestaurantPage from './components/restaurant/MainRestaurantPage';
import MainCourierPage from './components/courier/MainCourierPage';

const pages = {
	MAIN_PAGE: "mainPage",
    CUSTOMER_PAGE: "customerPage",
    COURIER_PAGE: "courierPage",
    RESTAURANT_PAGE: "resturantPage"
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            shownPage: pages.MAIN_PAGE
        }
    }

    renderMainPage()
    {
        return (
            <div style={{textAlign:"center"}}>
                <Button icon="pi pi-user" label={"Customer Login"} onClick={() => this.setState({shownPage:pages.CUSTOMER_PAGE})} />
                <br/> <br/>
                <Button icon="pi pi-user" label={"Courier Login"} onClick={() => this.setState({shownPage:pages.COURIER_PAGE})} />
                <br/> <br/>
                <Button icon="pi pi-user" label={"Restaurant Login"} onClick={() => this.setState({shownPage:pages.RESTAURANT_PAGE})} />
            </div>
        )
    }

    renderCustomerPage()
    {
        return (
            <MainCustomerPage/>
        );
    }

    renderCourierPage()
    {
        return (
            <MainCourierPage/>
        );
    }
	
	renderRestaurantPage()
    {
        return (
            <MainRestaurantPage/>
        );
    }

    renderSwitch() {
        let page = this.state.shownPage;
        switch(page) {
            case pages.MAIN_PAGE:
                return this.renderMainPage();
            case pages.CUSTOMER_PAGE:
                return this.renderCustomerPage();
            case pages.COURIER_PAGE:
                return this.renderCourierPage();
			case pages.RESTAURANT_PAGE:
				return this.renderRestaurantPage();
            default:
                return this.renderMainPage();
        }
    }

    render()
    {
        return (
            <div>
                {this.renderSwitch()}
            </div>
        );
    }

}

export default App;
