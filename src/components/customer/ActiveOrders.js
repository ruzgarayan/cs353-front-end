import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import axios from "axios";
import {Steps} from 'primereact/steps';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { TabView,TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import {connect} from 'react-redux';
import { withRouter } from 'react-router'
import { ProgressSpinner } from 'primereact/progressspinner';


class ActiveOrders extends React.Component {

    state = {
        loading: true,
        activeOrders: [],
        activeIndex: 0
    };
    
    fetchData() {
        axios.get("https://60376f1f54350400177225f6.mockapi.io/cs353/activeorders").then((result) => {
            console.log(result);
            this.setState({activeOrders: result.data, loading:false});
        }).catch((error) => {
            console.log("Error");
            //TODO
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        if (this.state.loading)
        {
            return (
                <ProgressSpinner/>
            );
        }
        else
        {
            const items = [
                {label: 'Preparing Food'},
                {label: 'Delivering'},
                {label: 'Delivered'}
            ];

            const accordionTabs = this.state.activeOrders.map((order) =>
            <TabPanel header={order.name}>
                <div>
                    <Steps model={items} activeIndex={order.status % 3} />
                </div>
                <br/>
                <div>
                    <Button label="Order Details" onClick= {() => { this.props.history.push('/customer/orderDetails/' + order.id);}}></Button>
                </div>
            </TabPanel>
        );

            return (
                <div>
                    <h1> Active Orders </h1>
                    <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({activeIndex: e.index})}>
                        {accordionTabs}
                    </TabView>
                </div>
            );
        }

    }

}

const mapDispatchToProps = {    
}; 
ActiveOrders = withRouter(connect(null,mapDispatchToProps)(ActiveOrders))
export default ActiveOrders;