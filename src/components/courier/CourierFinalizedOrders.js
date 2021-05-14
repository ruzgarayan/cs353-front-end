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
                                    <Rating value={3} readOnly cancel={false} />
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