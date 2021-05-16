
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import axios from "axios";
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataView } from 'primereact/dataview';
import { SelectButton } from 'primereact/selectbutton';
import { toast } from "react-toastify";
import moment from 'moment';
import { Card } from 'primereact/card';

class OrderDetailsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData: null,
            loading: true,
            fetching: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.state.fetching) {
            return;
        }

        if (!prevProps.visible && this.props.visible) {
            this.fetchOrderData();
        }
    }

    async fetchOrderData() {
        const chosenOrder = this.props.chosenOrder;
        this.setState({ loading: true, fetching: true });
        if (chosenOrder === null) {
            this.setState({ loading: false, fetching: false, orderData: null });
            return;
        }

        await axios.get("/customer/getOrderDetails/order_id=" + chosenOrder.orderId).then((result) => {
            if (result.data.success) {
                this.setState({ orderData: result.data.data });
            }
            else {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error("Connection error.");
        });

        this.setState({ loading: false, fetching: false });
    }

    render() {
        let orderData = this.state.orderData;
        let visible = this.props.visible;

        if (orderData === null || this.state.loading) {
            return (
                <Dialog
                    header="Loading..."
                    visible={visible}
                    style={{ width: '50vw' }}
                    modal={true}
                    onHide={() => this.props.hideDialog()}
                ><ProgressSpinner></ProgressSpinner>
                </Dialog>
            );

        }
        else {

            const renderItemList = () => {
                const renderItem = (data) => {
                    let price = data.menuItem.basePrice;
                    const ingredients = data.selectedIngredients;
                    for (var i = 0; i < ingredients.length; i++) {
                        price += ingredients[i].additionalPrice;
                        let displayText = ingredients[i].ingredientName + " " + (ingredients[i].additionalPrice === 0 ? "(Free)" : "(" + ingredients[i].additionalPrice + "$)");
                        ingredients[i].displayText = displayText;
                    }
                    price *= data.quantity;

                    return (
                        <div className="p-col-12">
                            <div className="product-list-item">
                                <img src={data.menuItem.imageLink} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.menuItem.name} />
                                <div className="product-list-detail">
                                    <div className="product-name">{data.menuItem.name}</div>
                                    <div className="product-description">{data.menuItem.description}</div>
                                </div>
                                <div className="product-list-action">
                                    <span className="product-price">Quantity: {data.quantity} Price: {price}$</span>
                                </div>
                            </div>
                            <div className="p-col-12">
                                <SelectButton value={ingredients} options={ingredients} disabled={true} optionLabel="displayText" multiple />
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
                            <DataView emptyMessage="This order is empty." value={orderData.selectedMenuItems} layout={'list'} header="Order items" itemTemplate={itemTemplate} />
                        </div>
                    </div>
                );
            }
            const dialogHeader = "Your order from " + orderData.order.restaurantName;
            console.log(orderData);
            const couponText = (orderData.order.coupon === null) ? "" : <div><h2>Used coupon: {orderData.order.coupon}</h2></div>;
            
            const deliveryTime = new Date(orderData.order.deliveryTime).toUTCString();
            const deliveryTimeFromNow = moment(deliveryTime).fromNow();
            const deliveryTimeText = (orderData.order.deliveryTime === null) ? "" : <div><h2>Delivered at: {deliveryTime}, <br/> {deliveryTimeFromNow}</h2></div>;


            return (
                <div>
                    <Dialog
                        header={dialogHeader}
                        visible={visible}
                        style={{ width: '70vw', height: '100' }}
                        modal={true}
                        onHide={() => this.props.hideDialog()}
                    >

                        <div className="p-col-12">
                            {renderItemList()}
                        </div>

                        <div className="p-col-12">
                            <Card>
                            <div className="p-grid">
                                <div className="p-col-12 p-md-9">
                                <div className="p-col-12">
                                    <div><h2>Payment Method: {orderData.order.paymentMethod}</h2></div>
                                    {couponText}
                                    <div><h2>Total price: {orderData.order.price}$</h2></div>
                                    <div><h2>Order status: {orderData.order.status}</h2></div>
                                    {deliveryTimeText}
                                </div></div>
                                <div className="p-col-12 p-md-3">
                                    
                                </div>
                                </div>
                            </Card>
                        </div>

                    </Dialog>
                </div>
            );
        }

    }
}

export default OrderDetailsDialog;