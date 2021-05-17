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
import { Rating } from 'primereact/rating';
import moment from 'moment';
import { Fieldset } from 'primereact/fieldset';
import {confirmDialog} from 'primereact/confirmdialog';

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
        loading: true,
        rating: 0,
        status: true,
    }

    constructor(props) {
        super(props);

        this.accept1 = this.accept1.bind(this);
        this.reject1 = this.reject1.bind(this);
        this.confirm1 = this.confirm1.bind(this);

        this.accept2 = this.accept2.bind(this);
        this.reject2 = this.reject2.bind(this);
        this.confirm2 = this.confirm2.bind(this);
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

        await axios.get("/courier/courierData/courier_id=" + userId).then((result) => {
            console.log(result.data.data);
            this.setState({ rating: result.data.data.courier.rating, status: result.data.data.courier.status });
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
                this.fetchData();
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
                this.fetchData();
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
                this.fetchData();
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

            const confirm1 = () => {
                this.confirm1(order.orderId);
            }
            const confirm2 = () => {
                this.confirm2(order.orderId);
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
                                    <Button label="Accept" className="p-button-success p-button-text" onClick={confirm1} />
                                    <Button label="Reject" className="p-button-danger p-button-text" onClick={confirm2} />
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

    open() {
        const userId = this.props.loginInfo.userId;
        axios.post("courier/open/courier_id=" + userId).then((result) => {
            if (result.data.success) {
                toast.success(result.data.message);
                this.setState({ status: true });
            } else {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error while updating the status.")
        });
    }

    close() {
        const userId = this.props.loginInfo.userId;
        axios.post("courier/close/courier_id=" + userId).then((result) => {
            if (result.data.success) {
                toast.success(result.data.message);
                this.setState({ status: false });
            } else {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error while updating the status.")
        });
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


    accept1(orderId) {
        this.acceptAssignment(orderId);
    }

    reject1() {
        return;
    }

    confirm1(orderId) {
        const accept = () => {
            this.accept1(orderId);
        }

        confirmDialog({
            message: 'Are you sure you want to update this item?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            accept: accept,
            reject: this.reject1
        });
    }

    accept2(orderId) {
        this.rejectAssignment(orderId);
    }

    reject2() {
        return;
    }

    confirm2(orderId) {
        const accept = () => {
            this.accept2(orderId);
        }

        confirmDialog({
            message: 'Are you sure you want to remove this item?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            accept: accept,
            reject: this.reject2
        });
    }

    render() {
        const openCloseButton = () => {
            if (!this.state.status) {
                return (<div><Button label="Start Accepting New Assignments" style={{ 'marginTop': '50px' }} onClick={() => { this.open() }} /></div>);
            } else {
                return (<div><Button label="Stop Accepting New Assignments" style={{ 'marginTop': '50px' }} onClick={() => { this.close() }} /></div>);
            }
        }

        if (this.state.loading) {
            return (<ProgressSpinner />);
        }
        if (this.state.acceptedOrder === null) {
            return (<div className="p-grid">
                <div className="p-col-12 p-md-3">
                    {openCloseButton()}
                    <Rating value={this.state.rating} readOnly cancel={false} style={{ 'marginTop': '20px' }}></Rating>
                    <div style={{ 'marginTop': '20px' }}>
                        <h3>Your rating is: {this.state.rating}</h3>
                    </div>
                </div>
                <div className="p-col-12 p-md-9">
                    {this.renderAssignments()}
                </div>
            </div>);
        }
        else {
            return (
                <div className="p-grid">
                    <div className="p-col-12 p-md-3">
                        {openCloseButton()}
                        <Rating value={this.state.rating} readOnly cancel={false} style={{ 'marginTop': '20px' }}></Rating>
                        <div style={{ 'marginTop': '20px' }}>
                            <h3>Your rating is: {this.state.rating}</h3>
                        </div>
                    </div>
                    <div className="p-col-12 p-md-9">
                        {this.renderAcceptedOrder()}
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
AssignmentPage = withRouter(connect(mapStateToProps)(AssignmentPage))
export default AssignmentPage;