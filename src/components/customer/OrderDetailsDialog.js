
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import axios from "axios";
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataView } from 'primereact/dataview';
import { SelectButton } from 'primereact/selectbutton';
import { toast } from "react-toastify";
import store from './../../reducers/index.js'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'

class OrderDetailsDialog extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            chosenOrder: null,
            orderData: [],
            loading: true,
            fetching: false
        };
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

    componentDidUpdate(prevProps) {
        console.log(this.props);
        if (this.state.fetching) {
            return;
        }
        
        if (!prevProps.visible && this.props.visible) {
            this.fetchOrderData();
        }
    }

    fetchOrderData() {
        this.setState({ loading: true, fetching: true });
        
        this.setState({ loading: false, fetching: false });
    }

    render() {
        let orderDetails = this.state.chosenOrder;
        let visible = this.props.visible;
        console.log(visible);

        if (orderDetails === null || this.state.loading) {
            return (
                <Dialog
                    header="Loading..."
                    visible={visible}
                    style={{ width: '50vw'}}
                    modal={true}
                    onHide={() => this.props.hideDialog()}
                ><ProgressSpinner></ProgressSpinner>
                </Dialog>
            );

        }
        else {
            return (
                <div>
                    <Dialog
                        header="a"
                        visible={visible}
                        style={{ width: '50vw', height: '100' }}
                        modal={true}
                        onHide={() => this.props.hideDialog()}
                    >

                        b

                        <div style={{ 'marginTop': '30px' }}>
                            <div className="p-fluid p-formgrid p-grid">
                                <div className="p-field p-col-12 p-md-4" ></div>
                                <div className="p-field p-col-12 p-md-2" >
                                    <InputNumber id="vertical" value={this.state.quantity}
                                        onValueChange={(e) => this.setState({ quantity: e.value })} mode="decimal"
                                        showButtons buttonLayout="vertical" style={{ 'width': '4em' }}
                                        decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary"
                                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                                </div>
                                <div className="p-field p-col-12 p-md-4" >
                                    <label> a </label> b
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
            );
        }

    }
}

const mapStateToProps = state => {
    return {
        cartInfo: state.cartInfo
    };
};
OrderDetailsDialog = withRouter(connect(mapStateToProps)(OrderDetailsDialog));
export default OrderDetailsDialog;