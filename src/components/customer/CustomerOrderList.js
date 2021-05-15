import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';

import axios from "axios";
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { ProgressSpinner } from 'primereact/progressspinner'
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { DataView } from 'primereact/dataview';
import OrderDetailsDialog from './OrderDetailsDialog';
import moment from 'moment';
import OrderReviewDialog from './OrderReviewDialog';

class CustomerOrderList extends React.Component {

    state = {
        orders: null,
        loading: true,
        chosenOrder: null,
        displayDetails: false,
        displayReview: false
    }

    fetchData() {
        this.setState({ loading: true });
        const userId = this.props.loginInfo.userId;
        axios.get("/customer/orders/id=" + userId).then((result) => {
            console.log(result.data.data);
            this.setState({ orders: result.data.data, loading: false });
        }).catch((error) => {
            toast.error("Error during the connection.");
            this.fetchData();
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    showDetails(chosenOrder) {
        console.log(chosenOrder);
        this.setState({chosenOrder: chosenOrder, displayDetails: true});
    }
    showReview(chosenOrder) {
        this.setState({chosenOrder: chosenOrder, displayReview: true});
    }

    approveDelivery(chosenOrder) {
        axios.post("customer/approveOrder/order_id=" + chosenOrder.orderId).then((result) => {
            if (result.data.success)
            {
                toast.success(result.data.message);
            } else {
                toast.error(result.data.message);
            }
            this.fetchData();
        }).catch((error) => {
            toast.error("Error during the connection.");
        });
    }

    render() {
        const statusList = [
            { label: 'Order Taken' },
            { label: 'Preparing Food' },
            { label: 'Waiting Courier' },
            { label: 'Delivering' },
            { label: 'Delivered-Waiting Your Approval' },
            { label: 'Delivered-Approved' }
        ];
        const numStatus = statusList.length;

        console.log(this.state.orders);
        const itemTemplate = (data) => {
            const orderTime = new Date(data.orderTime).toUTCString();
            const timeFromNow = moment(orderTime).fromNow();

            let status = 0;
            for (var i = 0; i < numStatus; i++) {
                if (statusList[i].label === data.status)
                    status = i;
            }

            if (status === numStatus - 1) {
                return (
                    <div className="p-col-12">
                        <div className="p-grid">
                            <div className="p-col-12 p-md-4">
                                <div>Order from {data.restaurantName} </div>
                            </div>
                            <div className="p-col-12 p-md-3">
                                {timeFromNow}
                            </div>
                            <div className="p-col-12 p-md-2">
                                for {data.price}$
                        </div>
                            <div className="p-col-12 p-md-3">
                                <span>
                                    <Button label="Order Details" className="p-button-text" onClick={() => {this.showDetails(data);}}/> 
                                    <Button label="Review" className="p-button-raised p-button-success p-button-text" onClick={() => {this.showReview(data);}}/>
                                </span>
                            </div>
                        </div>
                    </div>
                );
            }
            else if (status === numStatus - 2) {
                return (
                    <div className="p-col-12">
                        <div className="p-grid">
                            <div className="p-col-12 p-md-4">
                                <div>Order from {data.restaurantName} </div>
                            </div>
                            <div className="p-col-12 p-md-3">
                                {timeFromNow}
                            </div>
                            <div className="p-col-12 p-md-2">
                                for {data.price}$
                        </div>
                            <div className="p-col-12 p-md-3">
                                <span>
                                    <Button label="Order Details" className="p-button-text" onClick={() => {this.showDetails(data);}}/> 
                                    <Button label="Approve Delivery" className="p-button-raised p-button-success p-button-text" onClick={() => {this.approveDelivery(data);}}/>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <Steps model={statusList} activeIndex={status} />
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
                                    <div>Order from {data.restaurantName} </div>
                                </div>
                                <div className="p-col-12 p-md-3">
                                    {timeFromNow}
                                </div>
                                <div className="p-col-12 p-md-2">
                                    for {data.price}$
                        </div>
                                <div className="p-col-12 p-md-3">
                                    <span>
                                        <Button label="Order Details" className="p-button-text" onClick={() => {this.showDetails(data);}}/> 
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
            return (
                <div>
                    <div className="card">
                        <DataView value={this.state.orders} itemTemplate={itemTemplate} layout="list" header="List of Orders" paginator rows={5}/>
                    </div>
                    <OrderDetailsDialog chosenOrder={this.state.chosenOrder} visible={this.state.displayDetails} hideDialog={() => this.setState({displayDetails: false})} />
                    <OrderReviewDialog chosenOrder={this.state.chosenOrder} visible={this.state.displayReview} hideDialog={() => this.setState({displayReview: false})} />
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
CustomerOrderList = withRouter(connect(mapStateToProps)(CustomerOrderList))
export default CustomerOrderList;