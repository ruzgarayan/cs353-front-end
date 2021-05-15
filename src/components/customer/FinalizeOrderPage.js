import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import axios from "axios";
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { toast } from "react-toastify";
import store, { loginInfo } from './../../reducers/index.js'
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
        couponInput: ""
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

        const renderHeader = () => {
            return (
                <span>Cart<Button style={{ 'float': 'right' }} label="" className="p-button-danger" icon='pi pi-fw pi-trash'
                    onClick={() => {
                        const emptyCartAction = () => {
                            return {
                                type: "EMPTY"
                            }
                        }

                        store.dispatch(emptyCartAction());
                    }} /></span>

            );
        }
        const header = renderHeader();

        return (
            <div className="dataview-demo" >
                <div className="card">
                    <DataView emptyMessage="Your cart is empty." value={cartItems} layout={'list'} header={header} itemTemplate={itemTemplate} />
                </div>
            </div>
        );
    }

    makeOrder() {
        const cartInfo = this.props.cartInfo;
        const loginInfo = this.props.loginInfo;
        const cartItems = cartInfo.cartItems;

        if (cartItems.length == 0) {
            toast.error("Your cart is empty.");
            return;
        }

        if (this.state.paymentMethod === null)
        {
            toast.error("Select a payment method first.");
            return;
        }

        if (!this.state.deliverNow && (this.state.optionalDeliveryTime === null))
        {
            toast.error("Select the optional delivery time.");
            return;
        }

        const restaurantId = cartInfo.cartItems[0].menuItemData.restaurantId;
        const customerId = loginInfo.userId;
        const price = cartInfo.totalPrice;
        const optionalDeliveryTime = this.state.deliverNow ? null : this.state.optionalDeliveryTime;
        const paymentMethod = this.state.paymentMethod.name;
        const coupon = (cartInfo.usedCoupon === null) ? null : cartInfo.usedCoupon.couponId;

        let selectedMenuItems = [];
        console.log(cartItems);

        for (var i = 0; i < cartItems.length; i++) {
            const cartItemData = cartItems[i];
            let cartItem = {
                menuItemId: cartItemData.menuItemId,
                quantity: cartItemData.quantity,
                selectedIngredients: cartItemData.selectedIngredients
            }

            selectedMenuItems = [...selectedMenuItems, cartItem];
        }

        let orderData = {
            restaurantId: restaurantId,
            customerId: customerId,
            price: price,
            optionalDeliveryTime: optionalDeliveryTime,
            paymentMethod: paymentMethod,
            coupon: coupon,

            selectedMenuItems: selectedMenuItems
        };
        console.log(orderData);

        axios.post("/customer/order", orderData).then((result) => {
            if (result.data.success)
            {
                const emptyCartAction = () => {
                    return {
                        type: "EMPTY"
                    }
                }

                store.dispatch(emptyCartAction());
                toast.success(result.data.message);
                const raffleResults = result.data.data;
                if (raffleResults !== null)
                {
                    const message = "You have gained " + raffleResults.newEntries + " entries to raffle. You have now a total of " + raffleResults.totalEntries + " entries.";
                    toast.success(message);
                }
                this.props.history.replace('/customer/orders');
            } else {
                toast.error(result.data.message);
            }
        }).catch((error) => {

        });
    }

    applyCoupon(couponId) {        
        const cartInfo = this.props.cartInfo;
        const cartItems = cartInfo.cartItems;
        if (cartItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }
        if (cartInfo.usedCoupon !== null) {
            toast.error("You already have an applied coupon.");
            return;
        }
        const restaurantId = cartInfo.cartItems[0].menuItemData.restaurantId;
        console.log(couponId);

        axios.post("/raffle/checkCoupon/restaurant_id=" + restaurantId, couponId, {headers: {"Content-Type": "text/plain"}}).then((result) => {
            if (result.data.success)
            {
                const couponData = result.data.data;
                if (couponData.discountAmount > cartInfo.totalPrice)
                {
                    toast.error("The discount amount of the coupon is " + couponData.discountAmount + "$. It must be less than the cart total.");
                    return;
                } 
                const applyCouponAction = () => {
                    return {
                    type: "APPLY_COUPON",
                    couponData: couponData
                };
                }
                store.dispatch(applyCouponAction());
            }
            else{
                toast.error(result.data.message);
            }
        }).catch((error) => {});
    }

    removeCoupon()
    {
        const removeCouponAction = () => {
            return {
            type: "REMOVE_COUPON"
        };
        }
        store.dispatch(removeCouponAction());
    }

    render() {
        const itemList = this.renderItemList();
        const totalPrice = this.props.cartInfo.totalPrice;
        const minDate = new Date();
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        const couponInfo = this.props.cartInfo.usedCoupon;

        const paymentMethods = [
            { name: 'Online Payment', code: '1' },
            { name: 'Credit Card at Door', code: '2' },
            { name: 'Cash at Door', code: '3' },
            { name: 'Sodexo', code: '4' }
        ];

        const renderCoupon = () => {
            if (couponInfo === null) {
                return (
                <div>You haven't added a coupon.</div>
                );
            }
            else {
                return (
                <Card title={couponInfo.couponId} style={{ 'borderStyle': 'dashed' }}>
                    <div >{couponInfo.discountAmount}$ discount in {couponInfo.restaurantName}</div>
                    <div> <Button label="Remove Coupon" className="p-button-danger p-button-text" style={{'width':'200px', 'marginTop':'20px'}}
                        onClick={()=>{this.removeCoupon()}}
                    /></div>
                </Card>
                );
            }
        }
        const coupon = renderCoupon();

        return (
            <div>
                {itemList}
                <Panel header="Order Details">
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-4" >
                            <div className="p-field p-grid">
                                <label htmlFor="paymentmethod" className="p-col-fixed" style={{ width: '100px' }}>Payment Method</label>
                                <div className="p-col">
                                    <Dropdown optionLabel="name" value={this.state.paymentMethod} options={paymentMethods} onChange={(e) => this.setState({ paymentMethod: e.value })} placeholder="Select a Payment Method" />
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
                                    <Calendar disabled={this.state.deliverNow} id="time24" minDate={minDate} maxDate={maxDate}
                                        value={this.state.optionalDeliveryTime} onChange={(e) => this.setState({ optionalDeliveryTime: e.value })} showTime />
                                </div>
                            </div>
                        </div>
                        <div className="p-field p-col-12 p-md-1" ></div>
                        <div className="p-field p-col-12 p-md-3" >
                            <div className="p-field p-grid">
                                <label htmlFor="coupon" className="p-col-fixed" style={{ width: '100px' }}>Enter coupon</label>
                                <div className="p-col">
                                    <InputText id="coupon" type="text" value={this.state.couponInput}
                                onChange={(e) => this.setState({ couponInput: e.target.value })} />
                                </div>
                            </div>
                            <div className="p-field p-grid">
                                <Button label="Apply coupon" onClick={() => { this.applyCoupon(this.state.couponInput) }} />
                            </div>
                            {coupon}
                        </div>

                        <div className="p-field p-col-12 p-md-1" ></div>
                        <div className="p-field p-col-12 p-md-3" >
                            <h1>Total is {totalPrice}$ </h1>
                            <div className="p-field p-grid">
                                <Button label="Confirm the Order" onClick={() => { this.makeOrder() }} />
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
        cartInfo: state.cartInfo,
        loginInfo: state.loginInfo
    };
};

FinalizeOrderPage = withRouter(connect(mapStateToProps)(FinalizeOrderPage))

export default FinalizeOrderPage;