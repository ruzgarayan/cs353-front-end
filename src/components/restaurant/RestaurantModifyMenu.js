import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import { connect } from 'react-redux';
import axios from "axios";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import firebase from "../../firebase/firebase"
import FileUploader from "react-firebase-file-uploader";
import { DataView } from 'primereact/dataview';

import React from 'react';
import AddMenuItemDialog from './AddMenuItemDialog';
import ModifyMenuItemDialog from './ModifyMenuItemDialog';
import { confirmDialog } from 'primereact/confirmdialog';


class RestaurantModifyMenu extends React.Component {
    state = {
        loading: true,
        categoryMenus: [],
        layout: 'grid',
        displayAddDialog: false,
        displayModifyDialog: false,
        chosenMenuItem: null
    };

    constructor(props) {
        super(props);

        this.accept1 = this.accept1.bind(this);
        this.reject1 = this.reject1.bind(this);
        this.confirm1 = this.confirm1.bind(this);
    }

    async fetchData() {
        const userId = this.props.loginInfo.userId;
        const restaurantId = this.props.loginInfo.restaurantId;
        this.setState({ loading: true });

        //Get restaurant menu
        await axios.get("/customer/restaurantMenuByCategory/id=" + restaurantId).then((result) => {
            console.log(result);
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else
                this.setState({ categoryMenus: result.data.data, loading: false });
        }).catch((error) => {
            toast.error("Error while getting the restaurant menu.");
        });
    }

    async removeMenuItem(menuItemId) {
        console.log(menuItemId);
        const restaurantId = this.props.loginInfo.restaurantId;
        await axios.post("/restaurant/removeMenuItem/restaurant_id=" + restaurantId + "/menu_item_id=" + menuItemId).then((result) => {
            console.log(result);
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else {
                toast.success(result.data.message);
                this.fetchData();

            }
        }).catch((error) => {
            toast.error("Error while getting the restaurant menu.");
        });
    }

    showModifyDialog(menuItem) {
        this.setState({ displayModifyDialog: true, chosenMenuItem: menuItem })
    }

    componentDidMount() {
        this.fetchData();
    }

    renderCategoryMenus() {

        const renderListItem = (data) => {
            const confirm = () => {
                this.confirm1(data.menuItemId);
            }
            return (
                <div className="p-col-12">
                    <div className="product-list-item">
                        <img src={data.imageLink} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                        <div className="product-list-detail">
                            <div className="product-name">{data.name}</div>
                            <div className="product-description">{data.description}</div>
                        </div>
                        <div className="product-list-action">
                            <span className="product-price">${data.basePrice}</span>
                            <Button icon="pi pi-check " label="Modify" onClick={() => this.showModifyDialog(data)}></Button>
                            <Button icon="pi pi-times" className="p-button-danger" label="Remove" onClick={confirm}></Button>
                        </div>
                    </div>
                </div>
            );
        }

        const renderGridItem = (data) => {

            const confirm = () => {
                this.confirm1(data.menuItemId);
            }

            return (
                <div className="p-col-12 p-md-4">
                    <div className="product-grid-item card">
                        <div className="product-grid-item-top">
                        </div>
                        <div className="product-grid-item-content">
                            <img src={data.imageLink} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                            <div className="product-name">{data.name}</div>
                            <div className="product-description">{data.description}</div>
                        </div>
                        <div className="product-grid-item-bottom">
                            <span className="product-price">${data.basePrice}</span>
                            <Button icon="pi pi-shopping-cart" label="Modify" onClick={() => this.showModifyDialog(data)}></Button>
                            <Button icon="pi pi-shopping-cart" className="p-button-danger" label="Remove" onClick={confirm}></Button>
                        </div>
                    </div>
                </div>
            );
        }

        const itemTemplate = (menuItem, layout) => {
            if (!menuItem) {
                return;
            }

            if (layout === 'list')
                return renderListItem(menuItem);
            else if (layout === 'grid')
                return renderGridItem(menuItem);
        }

        return (
            <div>
                { this.state.categoryMenus.map((menu, index) => (
                    <div className="dataview-demo" key={index}>
                        <div className="card">
                            <DataView value={menu.categoryMenuItems} layout={this.state.layout} header={menu.category}
                                itemTemplate={itemTemplate} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    accept1(menuItemId) {
        this.removeMenuItem(menuItemId)
    }

    reject1() {
        return;
    }

    confirm1(menuItemId) {
        const accept = () => { this.accept1(menuItemId) };

        confirmDialog({
            message: 'Are you sure you want to remove this item?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            accept: accept,
            reject: this.reject1
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <ProgressSpinner />
            );
        }
        else {
            return (
                <div>
                    <Button label="Add a new Menu Item" onClick={() => { this.setState({ displayAddDialog: true }) }} style={{ 'marginTop': '20px', 'marginBottom': '20px' }} />
                    {this.renderCategoryMenus()}
                    <AddMenuItemDialog visible={this.state.displayAddDialog}
                        hideDialog={() => this.setState({ displayAddDialog: false })}
                        fetchData={() => this.fetchData()}
                    />

                    <ModifyMenuItemDialog visible={this.state.displayModifyDialog}
                        chosenMenuItem={this.state.chosenMenuItem}
                        hideDialog={() => this.setState({ displayModifyDialog: false })}
                        fetchData={() => this.fetchData()}
                    />
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
export default connect(mapStateToProps)(RestaurantModifyMenu);