
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import axios from "axios";
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { toast } from "react-toastify";
import store from './../../reducers/index.js'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import firebase from "../../firebase/firebase"
import FileUploader from "react-firebase-file-uploader";
import { Card } from 'primereact/card';
import { InputSwitch } from 'primereact/inputswitch';

class ModifyMenuItemDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            imageLink: "",
            description: "",
            basePrice: 0,
            foodCategory: "",
            ingredients: [],

            imageProgress: 0,
            imageLoading: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.visible && this.props.visible) {
            if (this.props.chosenMenuItem !== null) {

                const menuItem = this.props.chosenMenuItem;
                console.log(menuItem);

                this.setState({
                    name: menuItem.name,
                    imageLink: menuItem.imageLink,
                    description: menuItem.description,
                    basePrice: menuItem.basePrice,
                    foodCategory: menuItem.foodCategory,

                    imageProgress: 0,
                    imageLoading: false,
                    loading: false
                });
                this.fetchData();
            }
        }
    }

    fetchData() {
        this.setState({ loading: true });

        axios.get("/customer/ingredients/id=" + this.props.chosenMenuItem.menuItemId).then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
                this.props.hideDialog();
            } else {
                this.setState({ loading: false, ingredients: result.data.data })
            }
        }).catch((error) => {
            toast.error("Error while getting the restaurant info.");
            this.props.hideDialog();
        });
    }

    async updateMenuItem() {
        const restaurantId = this.props.loginInfo.restaurantId;
        const updatedMenuItem = {
            restaurantId: restaurantId,
            menuItemId: this.props.chosenMenuItem.menuItemId,
            name: this.state.name,
            imageLink: this.state.imageLink,
            description: this.state.description,
            basePrice: this.state.basePrice,
            foodCategory: this.state.foodCategory
        }
        console.log(updatedMenuItem);
        await axios.post("/restaurant/updateMenuItem/restaurant_id=" + restaurantId, updatedMenuItem).then((result) => {
            console.log(result);
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else {
                toast.success(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error while getting the restaurant menu.");
        });

        await axios.post("/restaurant/updateIngredients/restaurant_id=" + restaurantId + "/menu_item_id=" + this.props.chosenMenuItem.menuItemId, this.state.ingredients).then((result) => {
            console.log(result);
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else {
                toast.success(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error while getting the restaurant menu.");
        });


        this.props.hideDialog();
        this.props.fetchData();
    }

    renderIngredientsTab() {
        if (this.state.ingredients.length === 0)
            return (
                <Card>
                    <p>There are currently no ingredients for this menu item.</p>
                </Card>
            );

        const itemTemplate = (data, index) => {
            return (
                <div className="p-field p-col-12">
                    <Card>
                        <div className="p-fluid p-formgrid p-grid">
                            <div className="p-field p-col">
                                <label htmlFor="name">Name</label>
                                <InputText value={data.ingredientName} id="name" type="text" onChange={(e) => {
                                    const ingredients = this.state.ingredients;
                                    ingredients[index].ingredientName = e.target.value;
                                    this.setState({ ingredients: ingredients });
                                }} />
                            </div>
                            <div className="p-field p-col">
                                <label htmlFor="addPrice">Additional Price</label>
                                <InputNumber cols={30} mode="currency" currency="USD" locale="en-US" value={data.additionalPrice} onChange={(e) => {
                                    const ingredients = this.state.ingredients;
                                    ingredients[index].additionalPrice = e.value;
                                    this.setState({ ingredients: ingredients });
                                }} />
                            </div>
                            <div className="p-field p-col">
                                <label htmlFor="default">Default</label>
                                <InputSwitch checked={data.defaultIngredient} onChange={(e) => {
                                    const ingredients = this.state.ingredients;
                                    ingredients[index].defaultIngredient = e.value;
                                    this.setState({ ingredients: ingredients });
                                }} />
                            </div>
                            <div className="p-field p-col">
                                <Button icon="pi pi-shopping-cart" className="p-button-danger" label="Remove" onClick={() => {
                                    const ingredients = this.state.ingredients;
                                    ingredients.splice(index, 1);
                                    this.setState({ ingredients: ingredients });

                                }}></Button>
                            </div>
                        </div>
                    </Card>
                </div>
            );
        }

        return (
            <Card>
                {this.state.ingredients.map((ingredient, index) => (
                    <div key={index}>
                        {itemTemplate(ingredient, index)}
                    </div>
                ))}
            </Card>
        );
    }

    render() {
        let visible = this.props.visible;

        const renderUploadProgress = () => {
            if (this.state.imageLoading)
                return (<div> Uploading the image, progress {this.state.imageProgress}%</div>)
        }

        if (this.props.chosenMenuItem === null || this.state.loading) {
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

        return (
            <div>
                <Dialog
                    header="Modify a Menu Item"
                    visible={visible}
                    style={{ width: '70vw', height: '100' }}
                    modal={true}
                    onHide={() => this.props.hideDialog()}
                >
                    <div className="card">
                        <div className="p-formgrid p-grid" >
                            <div className="p-field p-col-12 p-md-5" >
                                <div style={{ 'marginTop': '30px' }}>
                                    <img src={this.state.imageLink} alt="" style={{ 'width': '30%' }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg" }} />
                                    <FileUploader
                                        accept="image/*"
                                        name="avatar"
                                        randomizeFilename
                                        storageRef={firebase.storage().ref("images")}
                                        onUploadStart={(progress) => { this.setState({ imageLoading: true, imageProgress: 0 }) }}
                                        onUploadError={(error) => { this.setState({ imageLoading: false, imageProgress: 0 }); toast.error("Error during the image upload.") }}
                                        onUploadSuccess={(filename) => {
                                            firebase
                                                .storage()
                                                .ref("images")
                                                .child(filename)
                                                .getDownloadURL()
                                                .then(url => {
                                                    this.setState({ imageLoading: false, imageLink: url });
                                                    toast.success("Image successfully uploaded. Use the Save Changes button for changing your profile picture.");
                                                });

                                        }}
                                        onProgress={(progress) => { this.setState({ imageProgress: progress }); }}
                                    />

                                    {
                                        renderUploadProgress()
                                    }
                                </div>

                                <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                                    <InputText id="name" type="text" value={this.state.name}
                                        onChange={(e) => this.setState({ name: e.target.value })} />
                                    <label>Name</label>
                                </div>

                                <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                                    <InputText id="foodCategory" type="text" value={this.state.foodCategory}
                                        onChange={(e) => this.setState({ foodCategory: e.target.value })} />
                                    <label>Category</label>
                                </div>


                                <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                                    <InputTextarea cols={30} id="description" type="text" value={this.state.description} autoResize
                                        onChange={(e) => this.setState({ description: e.target.value })} />
                                    <label>Description</label>
                                </div>

                                <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                                    <InputNumber cols={30} mode="currency" currency="USD" locale="en-US" value={this.state.basePrice}
                                        onChange={(e) => this.setState({ basePrice: e.value })} />
                                    <label>Base Price</label>
                                </div>
                            </div>
                            <div className="p-field p-col-12 p-md-7" >

                                <div style={{ 'marginTop': '30px' }}>
                                    <span><h4>Ingredient List</h4> <Button label="Add New Ingredient"
                                        onClick={() => {
                                            this.setState({
                                                ingredients: [{
                                                    ingredientName: "",
                                                    ingredientId: -1,
                                                    menuItemId: this.props.chosenMenuItem.menuItemId,
                                                    additionalPrice: 0,
                                                    defaultIngredient: false,
                                                    deleted: false
                                                },
                                                ...this.state.ingredients]
                                            })
                                        }} /></span>
                                    {this.renderIngredientsTab()}
                                </div>
                            </div>


                            <div style={{'width': '100%'}}>
                                <div style={{'textAlign': 'center' }}>
                                <Button label="Apply Modifications" onClick={() => { this.updateMenuItem() }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        );

    }
}

const mapStateToProps = state => {
    return {
        loginInfo: state.loginInfo
    };
};
ModifyMenuItemDialog = withRouter(connect(mapStateToProps)(ModifyMenuItemDialog));
export default ModifyMenuItemDialog;