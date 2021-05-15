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
import { Card } from 'primereact/card';
import moment from 'moment';
import { Fieldset } from 'primereact/fieldset';

class AssignmentPage extends React.Component {

    statusList = [
        { label: 'Order Taken' },
        { label: 'Preparing Food' },
        { label: 'Waiting Courier' },
        { label: 'Delivering' },
        { label: 'Delivered-Waiting Your Approval' },
        { label: 'Delivered-Approved' }
    ];

    state = {
        assignments: [],
        acceptedOrder: null,
        loading: true
    }

    async fetchData() {
        this.setState({ loading: true });
        const userId = this.props.loginInfo.userId;
        await axios.get("/courier/getCurrentAssignments/courier_id=" + userId).then((result) => {
            console.log(result.data.data);
            this.setState({ assignments: result.data.data });
        }).catch((error) => {
            toast.error("Error during the connection.");
        });

        await axios.get("/courier/getAcceptedOrder/courier_id=" + userId).then((result) => {
            console.log(result.data.data);
            this.setState({ acceptedOrder: result.data.data });
        }).catch((error) => {
            toast.error("Error during the connection.");
        });

        this.setState({ loading: false });
    }

    componentDidMount() {
        this.fetchData();
    }

    acceptAssignment(order_id) {
        const userId = this.props.loginInfo.userId;
        axios.post("/courier/acceptAssignment/courier_id=" + userId + "/order_id=" + order_id).then((result) => {
            if (result.data.success) {
                toast.success(result.data.message);
            } else {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error during the connection.");
        });
    }

    rejectAssignment(order_id) {
        const userId = this.props.loginInfo.userId;
        axios.post("/courier/rejectAssignment/courier_id=" + userId + "/order_id=" + order_id).then((result) => {
            if (result.data.success) {
                toast.success(result.data.message);
            } else {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error during the connection.");
        });
    }

    finalizeOrder(order_id) {
        const userId = this.props.loginInfo.userId;
        axios.post("/courier/finalizeOrder/courier_id=" + userId + "/order_id=" + order_id).then((result) => {
            if (result.data.success) {
                toast.success(result.data.message);
            } else {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error during the connection.");
        });
    }

    renderAssignments() {

        const itemTemplate = (data) => {
            const order = data.order;
            const customerInfo = data;
            const orderTime = new Date(order.orderTime).toUTCString();
            const timeFromNow = moment(orderTime).fromNow();

            let status = 0;
            for (var i = 0; i < this.statusList.length; i++) {
                if (this.statusList[i].label === order.status)
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

            return (
                <div className="p-col-12" style={{ 'width': '%100', 'marginBottom': '40px', 'border': 'solid' }}>
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
                                    <Button label="Accept" className="p-button-success p-button-text" onClick={() => { this.acceptAssignment(order.orderId) }} />
                                    <Button label="Reject" className="p-button-danger p-button-text" onClick={() => { this.rejectAssignment(order.orderId) }} />
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
                        <Steps model={this.statusList} activeIndex={status} />
                    </div>
                </div>
            );
        };

        return (
            <Fieldset legend="Current Assignments">
                <div className="p p-grid">
                    <DataView emptyMessage="There are no assigned orders currently." value={this.state.assignments} layout={'list'} itemTemplate={itemTemplate} />
                </div>
            </Fieldset>
        );
    }

    renderAcceptedOrder() {
        const order = this.state.acceptedOrder.order;
        const customerInfo = this.state.acceptedOrder;
        const orderTime = new Date(order.orderTime).toUTCString();
        const timeFromNow = moment(orderTime).fromNow();

        let status = 0;
        for (var i = 0; i < this.statusList.length; i++) {
            if (this.statusList[i].label === order.status)
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

        return (
            <Fieldset legend="Active Order">
                <div className="p-col-12">
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
                                    <Button label="Finalize Order" className="p-button-text" onClick={() => { this.finalizeOrder(order.orderId) }} />
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
                        <Steps model={this.statusList} activeIndex={status} />
                    </div>
                </div>
            </Fieldset>
        );
    }

    render() {
        if (this.state.loading) {
            return (<ProgressSpinner />);
        }
        if (this.state.acceptedOrder === null) {
            return (<div>
                { this.renderAssignments()}
            </div>);
        }
        else {
            return (
                <div>
                    { this.renderAcceptedOrder()}
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
AssignmentPage = withRouter(connect(mapStateToProps)(AssignmentPage))
export default AssignmentPage;