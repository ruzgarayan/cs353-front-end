import React from 'react';
import axios from "axios";
import {toast} from "react-toastify";
import moment from "moment";
import {Button} from "primereact/button";
import {Steps} from "primereact/steps";
import {ProgressSpinner} from "primereact/progressspinner";
import {DataView} from "primereact/dataview";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import OrderDetailsDialog from "../customer/OrderDetailsDialog";
import { Rating } from 'primereact/rating';

class MainRestaurantPage extends React.Component
{
    state = {
        loading: true,
        displayDetails: false,
        displayReview: false,
        orders: [],
        status: true,
        rating: 0
    };

    async fetchData(){
        let success = true;
        let restaurantId = this.props.loginInfo.restaurantId;
        this.setState({ loading: true });

        await axios.get("restaurant/activeOrders/restaurant_id=" + restaurantId).then((result =>{
            console.log(result.data);
            this.setState({orders: result.data.data})
        })).catch((error)=>{
            toast.error("Error while getting the order data.");
            success = false;
        });

        await axios.get("restaurant/restaurantData/restaurant_id=" + restaurantId).then((result =>{
            console.log(result.data);
            this.setState({status: result.data.data.status, rating: result.data.data.rating});
        })).catch((error)=>{
            toast.error("Error while getting the status data.");
            success = false;
        });

        this.setState({loading: false});

    }

    componentDidMount() {
        this.fetchData();
    }

    showDetails(chosenOrder) {
        console.log(chosenOrder);
        this.setState({chosenOrder: chosenOrder, displayDetails: true});
    }

    updateOrder(chosenOrder, status){
        console.log("Hello");
        console.log(chosenOrder);
        console.log(status);
        if(status === 0){
            axios.post("restaurant/statusUpdate/preparing/order_id=" + chosenOrder.orderId).then((result)=>{
                this.fetchData();
            }).catch((error)=>{
               toast.error("Error while updating the order status.")
            });
        }else{
            axios.post("restaurant/statusUpdate/finalize/order_id=" + chosenOrder.orderId).then((result)=>{
                this.fetchData();
            }).catch((error)=>{
                toast.error("Error while updating the order status.")
            });
        }
    }

    open() {
        let restaurantId = this.props.loginInfo.restaurantId;
        axios.post("restaurant/open/restaurant_id=" + restaurantId).then((result)=>{
            if(result.data.success)
            {
                toast.success(result.data.message);
                this.setState({status: true});
            } else {
                toast.error(result.data.message);
            }
        }).catch((error)=>{
           toast.error("Error while updating the status.")
        });
    }

    close() {
        let restaurantId = this.props.loginInfo.restaurantId;
        axios.post("restaurant/close/restaurant_id=" + restaurantId).then((result)=>{
            if(result.data.success)
            {
                toast.success(result.data.message);
                this.setState({status: false});
            } else {
                toast.error(result.data.message);
            }
        }).catch((error)=>{
           toast.error("Error while updating the status.")
        });
    }

    render() {
        const statusList = [
            { label: 'Order Taken' },
            { label: 'Preparing Food' },
            { label: 'Waiting Courier' },
            { label: 'Delivering' },
            { label: 'Delivered-Waiting Customer Approval' },
            { label: 'Delivered-Approved' }
        ];
        const numStatus = statusList.length;

        const itemTemplate = (data) => {
            const orderTime = new Date(data.orderTime).toUTCString();
            const timeFromNow = moment(orderTime).fromNow();

            let status = 0;
            for (var i = 0; i < numStatus; i++) {
                if (statusList[i].label === data.status)
                    status = i;
            }

            if (status >= 1) {
                return (
                    <div className="p-col-12">
                        <div className="p-grid">
                            <div className="p-col-12 p-md-4">
                                <div>Order from {data.customerNameSurname} </div>
                            </div>
                            <div className="p-col-12 p-md-3">
                                {timeFromNow}
                            </div>
                            <div className="p-col-12 p-md-2">
                                for ${data.price}
                            </div>
                            <div className="p-col-12 p-md-3">
                                <span>
                                    <Button label="Order Details" className="p-button-text" onClick={() => {this.showDetails(data);}}/>
                                    <Button label="Finalize Order" className="p-button-raised p-button-success p-button-text" onClick={() => {this.updateOrder(data, status);this.forceUpdate();}}/>
                                </span>
                            </div>
                            <div className="p-col-12">
                                <Steps model={statusList} activeIndex={status} />
                            </div>
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div className="p-col-12">
                        <div className="p-col-12">
                            <div className="p-grid">
                                <div className="p-col-12 p-md-4">
                                    <div>Order from {data.customerNameSurname} </div>
                                </div>
                                <div className="p-col-12 p-md-3">
                                    {timeFromNow}
                                </div>
                                <div className="p-col-12 p-md-2">
                                    for ${data.price}
                                </div>
                                <div className="p-col-12 p-md-3">
                                    <span>
                                        <Button label="Order Details" className="p-button-text" onClick={() => {this.showDetails(data);}}/>
                                        <Button label="Update Order" className="p-button-raised p-button-error p-button-text" onClick={() => {this.updateOrder(data, status);this.forceUpdate();}} disabled={false} />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <Steps model={statusList} activeIndex={status} />
                        </div>
                    </div>
                );
            }
        }

        if (this.state.loading) {
            return (
                <ProgressSpinner />
            );
        }
        else {

            const openCloseButton = () => {
                if (!this.state.status)
                {
                    return (<div><Button label="Open the Restaurant For Orders" style={{'marginTop': '50px'}} onClick={()=>{this.open()}}/></div>);
                } else {
                    return (<div><Button label="Close the Restaurant For Orders" style={{'marginTop': '50px'}} onClick={()=>{this.close()}}/></div>);
                }
            }

            return (
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-3" >
                        {openCloseButton()}
                        <Rating value={this.state.rating} readOnly cancel={false} style={{'marginTop': '20px'}}></Rating>
                        <div style={{'marginTop': '20px'}}>
                            <h3>Your restaurant rating is: {this.state.rating}</h3>
                        </div>
                    </div>
                    <div className="p-field p-col-12 p-md-9" >
                        <DataView value={this.state.orders} itemTemplate={itemTemplate} layout="list" header="List of Active Orders" paginator rows={5}/>
                    </div>
                    <OrderDetailsDialog chosenOrder={this.state.chosenOrder} visible={this.state.displayDetails} hideDialog={() => this.setState({displayDetails: false})} />
                </div>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        loginInfo: state.loginInfo
    };
};
MainRestaurantPage = withRouter(connect(mapStateToProps)(MainRestaurantPage))
export default MainRestaurantPage;