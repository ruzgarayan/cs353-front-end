
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import axios from "axios";
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SelectButton } from 'primereact/selectbutton';
import { toast } from "react-toastify";
import store from './../../reducers/index.js'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'

class MenuItemDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuItemId: null,
            ingredientData: [],
            loading: true,
            selection: null,
            quantity: 1,
            alreadyInCart: false,
            fetching: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.state.fetching) {
            return;
        }
        
        if (!prevProps.visible && this.props.visible) {
            this.fetchIngredientData();
        }

        if (this.props.chosenMenuItem !== null) {
            if (this.state.menuItemId !== this.props.chosenMenuItem.menuItemId) {
                this.setState({ menuItemId: this.props.chosenMenuItem.menuItemId });
                this.fetchIngredientData();
            }
            else {
                if (!this.state.alreadyInCart) {
                    for (var i = 0; i < this.props.cartInfo.cartItems.length; i++) {
                        if (this.props.cartInfo.cartItems[i].menuItemId === this.state.menuItemId) {
                            this.fetchIngredientData();
                            break;
                        }
                    }
                }
            }
        }
    }

    fetchIngredientData() {
        this.setState({ loading: true, fetching: true });
        axios.get("/customer/ingredients/id=" + this.props.chosenMenuItem.menuItemId).then((result) => {
            console.log(result);
            let ingredientData = result.data.data;


            let selection = [];
            const menuItemId = this.props.chosenMenuItem.menuItemId;

            let entryInCart = null;
            const cartItems = this.props.cartInfo.cartItems;
            for (var i = 0; i < cartItems.length; i++) {
                if (cartItems[i].menuItemId === menuItemId) {
                    entryInCart = cartItems[i];
                    break;
                }
            }

            if (entryInCart === null) {
                for (var i = 0; i < ingredientData.length; i++) {
                    if (ingredientData[i].default)
                        selection = [...selection, ingredientData[i]];

                    let displayText = ingredientData[i].ingredientName + " " + (ingredientData[i].additionalPrice === 0 ? "(Free)" : "(" + ingredientData[i].additionalPrice + "$)");
                    ingredientData[i].displayText = displayText;
                }

                this.setState({ loading: false, ingredientData: ingredientData, selection: selection, quantity: 1, alreadyInCart: false , fetching: false});
            }
            else {
                for (var i = 0; i < ingredientData.length; i++) {
                    let displayText = ingredientData[i].ingredientName + " " + (ingredientData[i].additionalPrice === 0 ? "(Free)" : "(" + ingredientData[i].additionalPrice + "$)");
                    ingredientData[i].displayText = displayText;
                }
                const selectedIngredients = entryInCart.selectedIngredients;
                for (var i = 0; i < selectedIngredients.length; i++) {
                    for (var j = 0; j < ingredientData.length; j++) {
                        if (selectedIngredients[i] === ingredientData[j].ingredientId) {
                            selection = [...selection, ingredientData[j]];
                        }
                    }
                }

                this.setState({ loading: false, ingredientData: ingredientData, selection: selection, quantity: entryInCart.quantity, alreadyInCart: true , fetching: false});
            }


            this.setState({ restaurant_info: result.data.data });
        }).catch((error) => {
            console.log(error);
            toast.error("Error while getting the restaurant info.");
            this.setState({ loading: false, fetching: false, visible: false});
        });

    }

    addToCart() {
        const menuItem = this.props.chosenMenuItem;
        const selection = this.state.selection;
        const quantity = this.state.quantity;
        const menuItemId = this.state.menuItemId;

        if (this.props.cartInfo.cartItems.length > 0) {
            if (this.props.cartInfo.cartItems[0].menuItemData.restaurantId !== menuItem.restaurantId) {
                toast.error("You have items in your cart from another restaurant, please empty your cart first.");
                return;
            }
        }


        let ingredientPrice = 0.00;
        let selectedIngredients = [];
        let selectedIngredientsNames = [];
        for (var i = 0; i < selection.length; i++) {
            ingredientPrice = ingredientPrice + selection[i].additionalPrice;
            selectedIngredients = [...selectedIngredients, selection[i].ingredientId];
            selectedIngredientsNames = [...selectedIngredientsNames, selection[i].ingredientName];
        }
        const totalPrice = quantity * (menuItem.basePrice + ingredientPrice);

        const addToCartAction = () => {
            return {
                type: "ADD",
                newItem: {
                    menuItemId: menuItemId,
                    menuItemData: menuItem,
                    quantity: quantity,
                    selectedIngredients: selectedIngredients,
                    selectedIngredientsNames: selectedIngredientsNames,
                    price: totalPrice,
                }
            }
        }

        store.dispatch(addToCartAction());
        this.fetchIngredientData();
        this.props.hideDialog();
    }


    updateCartItem() {
        const menuItem = this.props.chosenMenuItem;
        const selection = this.state.selection;
        const quantity = this.state.quantity;
        const menuItemId = this.state.menuItemId;

        let ingredientPrice = 0.00;
        let selectedIngredients = [];
        let selectedIngredientsNames = [];
        for (var i = 0; i < selection.length; i++) {
            ingredientPrice = ingredientPrice + selection[i].additionalPrice;
            selectedIngredients = [...selectedIngredients, selection[i].ingredientId];
            selectedIngredientsNames = [...selectedIngredientsNames, selection[i].ingredientName];
        }
        const totalPrice = quantity * (menuItem.basePrice + ingredientPrice);

        const updateCartItemAction = () => {
            return {
                type: "UPDATE",
                updatedItem: {
                    menuItemId: menuItemId,
                    menuItemData: menuItem,
                    quantity: quantity,
                    selectedIngredients: selectedIngredients,
                    selectedIngredientsNames: selectedIngredientsNames,
                    price: totalPrice,
                }
            }
        }

        store.dispatch(updateCartItemAction());
        this.fetchIngredientData();
        this.props.hideDialog();
    }

    removeCartItem() {
        const menuItemId = this.state.menuItemId;

        const removeCartItemAction = () => {
            return {
                type: "REMOVE",
                removedMenuItemId: menuItemId
            }
        }

        store.dispatch(removeCartItemAction());
        this.fetchIngredientData();
        this.props.hideDialog();
    }

    render() {
        let menuItem = this.props.chosenMenuItem;
        let visible = this.props.visible;

        const renderIngredients = () => {
            return (
                <div>
                    <h5>Select Ingredients</h5>
                    <SelectButton value={this.state.selection} options={this.state.ingredientData} onChange={(e) => this.setState({ selection: e.value })} optionLabel="displayText" multiple />
                </div>
            );
        }
        const ingredients = renderIngredients();
        if (menuItem === null || this.state.loading) {
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

            const renderButton = () => {
                if (this.state.alreadyInCart)
                    return (
                        <span>
                            <Button icon="pi pi-pencil" label="Update" className="p-button-success" onClick={() => this.updateCartItem()} style={{ 'marginTop': '10px', 'marginLeft': '20px' }} />
                            <Button icon="pi pi-trash" label="Remove" className="p-button-danger" onClick={() => this.removeCartItem()} style={{ 'marginTop': '5px', 'marginLeft': '20px' }} />
                        </span>

                    );
                else
                    return (
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" onClick={() => this.addToCart()} style={{ 'marginTop': '30px', 'marginLeft': '20px' }}></Button>
                    );
            }
            const button = renderButton();
            console.log(this.state);
            const menuItem = this.props.chosenMenuItem;
            const selection = this.state.selection;
            const quantity = this.state.quantity;
            let ingredientPrice = 0.00;
            for (var i = 0; i < selection.length; i++) {
                ingredientPrice = ingredientPrice + selection[i].additionalPrice;
            }
            const totalPrice = quantity * (menuItem.basePrice + ingredientPrice);

            return (
                <div>
                    <Dialog
                        header={menuItem.name}
                        visible={visible}
                        style={{ width: '50vw', height: '100' }}
                        modal={true}
                        onHide={() => this.props.hideDialog()}
                    >

                        {ingredients}

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
                                    <label> {totalPrice}$ </label> {button}
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
MenuItemDialog = withRouter(connect(mapStateToProps)(MenuItemDialog));
export default MenuItemDialog;