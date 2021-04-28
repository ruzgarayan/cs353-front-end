import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { toast } from "react-toastify";
import store from './../../reducers/index.js'
import './styles/restaurantViewStyle.css';
import 'primeflex/primeflex.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MenuItemDialog from './MenuItemDialog';
import { InputSwitch } from 'primereact/inputswitch';

class FinalizeOrderPage extends React.Component {

    state = {
        displayDialog: false,
        chosenMenuItem: null,
        paymentMethod: null,
        deliverNow: true,
        optionalDeliveryTime: null,
    };

    showMenuItemDialog(chosenMenuItem) {
        this.setState({ chosenMenuItem: chosenMenuItem, displayDialog: true });
    }

    renderItemList() {
        const cartItems = this.props.cartInfo.cartItems;

        const renderItem = (data) => {
            return (
                <div className="p-col-12">
                    <div className="product-list-item">
                        <img src={data.menuItemData.imageLink} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                        <div className="product-list-detail">
                            <div className="product-name">{data.menuItemData.name}</div>
                            <div className="product-description">{data.menuItemData.description}</div>
                        </div>
                        <div className="product-list-action">
                            <span className="product-price">Quantity: {data.quantity} Price: {data.price}$</span>
                            <Button icon="pi pi-pencil" label="Edit" onClick={() => this.showMenuItemDialog(data.menuItemData)}></Button>
                        </div>
                    </div>
                </div>
            );
        }

        const itemTemplate = (menuItem, layout) => {
            if (!menuItem) {
                return;
            }
            return renderItem(menuItem);
        }

        return (
            <div className="dataview-demo" >
                <div className="card">
                    <DataView value={cartItems} layout={'list'} header="Cart" itemTemplate={itemTemplate} />
                </div>
            </div>
        );
    }

    renderCoupon() {
        const couponData = this.props.cartInfo.coupon;
        return (
            <div >
                <Card title={couponData.coupon_id} style={{ 'border-style': 'dashed' }}>
                    <div >{couponData.amount}$ discount in {couponData.restaurant_name}</div>
                </Card>
            </div>
        );
    }

    render() {
        const itemList = this.renderItemList();
        const totalPrice = this.props.cartInfo.totalPrice;

        const cities = [
            { name: 'Online Payment', code: '1' },
            { name: 'Credit Card at Door', code: '2' },
            { name: 'Cash at Door', code: '3' },
            { name: 'Sodexo', code: '4' }
        ];

        return (
            <div>
                {itemList}
                <Panel header="Order Details">
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-4" >
                            <div className="p-field p-grid">
                                <label htmlFor="paymentmethod" className="p-col-fixed" style={{ width: '100px' }}>Payment Method</label>
                                <div className="p-col">
                                    <Dropdown optionLabel="name" value={this.state.paymentMethod} options={cities} onChange={(e) => this.setState({ paymentMethod: e.value })} placeholder="Select a Payment Method" />
                                </div>
                            </div>

                            <div className="p-field p-grid">
                                <label htmlFor="optionalDeliveryTime" className="p-col-fixed" style={{ width: '100px' }}>Deliver Now</label>
                                <div className="p-col">
                                    <InputSwitch checked={this.state.deliverNow} onChange={(e) => this.setState({ deliverNow: e.value })} />
                                </div>
                            </div>

                            <div className="p-field p-grid">
                                <label htmlFor="optionalDeliveryTime" className="p-col-fixed" style={{ width: '100px' }}>Optional Delivery Time</label>
                                <div className="p-col">
                                    <Calendar disabled={this.state.deliverNow} id="time24" value={this.state.optionalDeliveryTime} onChange={(e) => this.setState({ optionalDeliveryTime: e.value })} showTime />
                                </div>
                            </div>
                        </div>
                        <div className="p-field p-col-12 p-md-1" ></div>
                        <div className="p-field p-col-12 p-md-3" >
                            <div className="p-field p-grid">
                                <label htmlFor="coupon" className="p-col-fixed" style={{ width: '100px' }}>Enter coupon</label>
                                <div className="p-col">
                                    <InputText id="coupon" type="text" />
                                </div>
                            </div>
                            <div className="p-field p-grid">
                                <Button label="Apply coupon"/>
                            </div>
                        </div>

                        <div className="p-field p-col-12 p-md-1" ></div>
                        <div className="p-field p-col-12 p-md-3" >
                            <h1>Total is {totalPrice}$ </h1>
                            <div className="p-field p-grid">
                                <Button label="Confirm the Order"/>
                            </div>
                        </div>
                    </div>
                </Panel>
                <MenuItemDialog chosenMenuItem={this.state.chosenMenuItem} visible={this.state.displayDialog} hideDialog={() => this.setState({ displayDialog: false })} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cartInfo: state.cartInfo
    };
};

FinalizeOrderPage = withRouter(connect(mapStateToProps)(FinalizeOrderPage))

export default FinalizeOrderPage;