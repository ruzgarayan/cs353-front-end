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
import { Rating } from 'primereact/rating';
import { DataView } from 'primereact/dataview';
import { Fieldset } from 'primereact/fieldset';
import moment from 'moment';

class CourierFinalizedOrders extends React.Component {

    state = {
        orders: null,
        loading: true,
    }

    fetchData() {
        this.setState({ loading: true });
        const userId = this.props.loginInfo.userId;
        axios.get("/courier/orders/courier_id=" + userId).then((result) => {
            if (result.data.success) {
                toast.success(result.data.message);
                this.setState({ orders: result.data.data, loading: false });
            } else {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error during the connection.");
        });
    }

    componentDidMount() {
        this.fetchData();
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
        
        const displayStatusList = [
            { label: 'Order Taken' },
            { label: 'Preparing Food' },
            { label: 'Waiting Courier' },
            { label: 'Delivering' },
            { label: 'Delivered-Waiting Customer\'s Approval' },
            { label: 'Delivered-Approved' }
        ];
        const numStatus = statusList.length;

        console.log(this.state.orders);
        const itemTemplate = (data) => {
            const order = data.order;
            const customerInfo = data;
            const orderTime = new Date(order.orderTime).toUTCString();
            const timeFromNow = moment(orderTime).fromNow();

            let status = 0;
            for (var i = 0; i < statusList.length; i++) {
                if (statusList[i].label === order.status)
                    status = i;
            }

            const renderDeliveryOption = () => {
                if (order.optionalDeliveryTime === null)
                    return (
                        <div>
                            Deliver now.
                        </div>
                    );
                else {
                    const optionalDeliveryTime = new Date(order.optionalDeliveryTime).toUTCString();
                    const timeFromNow = moment(optionalDeliveryTime).fromNow();

                    return (
                        <div>
                            <div>
                                Selected Delivery Time is: {optionalDeliveryTime}
                            </div>
                            <div>
                                {timeFromNow}
                            </div>
                        </div>
                    );
                }
            }

            const renderRating = () => {
                if (customerInfo.courierScore === -1)
                    return (
                        <div>
                            The customer hasn't reviewed you yet.
                        </div>
                    )
                else {
                    return (
                        <div>
                            <Rating value={customerInfo.courierScore} readOnly cancel={false}></Rating>
                        </div>
                    )
                }
            }

            return (
                    <div className="p-col-12" style={{'marginBottom': '30px', 'border': 'solid'}}>
                        <div className="p-col-12">
                            <div className="p-grid">
                                <div className="p-col-12 p-md-4">
                                    <div>Order from {order.restaurantName} </div>
                                </div>
                                <div className="p-col-12 p-md-3">
                                    {timeFromNow}
                                </div>
                                <div className="p-col-12 p-md-2">
                                    for {order.price}$
                        </div>
                                <div className="p-col-12 p-md-3">
                                    <span>
                                        {renderRating()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-col-12">
                            <Fieldset legend="Customer Information">
                                <div className="p-grid">
                                    <div className="p-col-12 p-md-4">
                                        <img src={customerInfo.customerImage} alt="" style={{ 'width': '200px' }}
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg" }} />
                                        <div><b>Name:</b> {customerInfo.customerName} {customerInfo.customerSurname} </div>
                                    </div>
                                    <div className="p-col-12 p-md-3">
                                        <div><b>Region:</b> {customerInfo.customerRegionName}</div>
                                        <div><b>Address:</b> {customerInfo.customerAddress} </div>
                                    </div>
                                    <div className="p-col-12 p-md-2">
                                        <div><b>Contact Information</b></div>
                                        <div><b>Customer Telephone:</b> {customerInfo.customerTelephone} </div>
                                    </div>
                                    <div className="p-col-12 p-md-3">
                                        <div><b>Payment Method:</b> {order.paymentMethod}</div>
                                        <div><b>Delivery Time Option:</b> {renderDeliveryOption()} </div>
                                    </div>
                                </div>
                            </Fieldset>
                        </div>
                        <div className="p-col-12">
                            <Steps model={displayStatusList} activeIndex={status} />
                        </div>
                    </div>
            );
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
                        <DataView value={this.state.orders} itemTemplate={itemTemplate} layout="list" header="List of Orders" paginator rows={5} />
                    </div>
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
CourierFinalizedOrders = withRouter(connect(mapStateToProps)(CourierFinalizedOrders))
export default CourierFinalizedOrders;