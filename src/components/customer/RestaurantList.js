import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import axios from "axios";
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { DataScroller } from 'primereact/datascroller';
import { InputNumber } from 'primereact/inputnumber';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { ProgressSpinner } from 'primereact/progressspinner';
import './styles/customerStyle.css'
import { toast } from 'react-toastify';
import { Checkbox } from 'primereact/checkbox';

class RestaurantList extends React.Component {

    constructor(props) {
        super(props);

        let searchKey = null;
        if (this.props.match.params.searchKey !== undefined)
            searchKey = this.props.match.params.searchKey;

        let minRating = null;
        if (this.props.match.params.min !== undefined)
            minRating = parseFloat(this.props.match.params.min);
        else
            minRating = 0;

        let maxRating = null;
        if (this.props.match.params.max !== undefined)
            maxRating = parseFloat(this.props.match.params.max);
        else
            maxRating = 5;

        let open = null;
        if (this.props.match.params.open !== undefined)
            open = this.props.match.params.open === "true";
        else
            open = true;

        this.state = {
            loading: true,
            restaurants: [],
            open: open,
            minRating: minRating,
            maxRating: maxRating,
            searchKey: searchKey,
            favorites: []
        };
    }

    async fetchData() {
        const userId = this.props.loginInfo.userId;
        let searchKey = this.state.searchKey;

        await axios.get("/customer/getFavorite/customer_id=" + userId).then((result) => {
            if (result.data.success) {
                let favorites = [];
                for (var i = 0; i < result.data.data.length; i++)
                    favorites = [...favorites, result.data.data[i].restaurantId];
                this.setState({ favorites: favorites });
            }
            else
                toast.error(result.data.message);
        }).catch((error) => {
            toast.error("Error during the connection.");
        })

        if (searchKey !== null) {
            await axios.get("/customer/restaurants/id=" + userId + "/search=" + searchKey).then((result) => {
                console.log(result);
                this.setState({ restaurants: result.data.data, loading: false });
            }).catch((error) => {
                toast.error("Error during the connection.");
                this.fetchData();
            })
            return;
        }

        let minRating = this.state.minRating;
        let maxRating = this.state.maxRating;
        let open = this.state.open;

        if (minRating !== null && maxRating !== null && open !== null) {
            await axios.get("/customer/restaurants/id=" + userId + "/open=" + open + "/rating=" + minRating + "to" + maxRating).then((result) => {
                this.setState({ restaurants: result.data.data, loading: false });
            }).catch((error) => {
                toast.error("Error during the connection.");
                this.fetchData();
            });
            return;
        }

        await axios.get("/customer/restaurants/id=" + userId).then((result) => {
            console.log(result);
            this.setState({ restaurants: result.data.data, loading: false });
        }).catch((error) => {
            toast.error("Error during the connection.");
            this.fetchData();
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    addFavorite(restaurantId) {
        const userId = this.props.loginInfo.userId;
        const oldFavorites = this.state.favorites;
        const newFavorites = [...oldFavorites, restaurantId];
        axios.post("/customer/addFavorite/customer_id=" + userId + "/restaurant_id=" + restaurantId).then((result) => {
            if (result.data.success)
            {
                this.setState({ favorites: newFavorites });
                toast.success("Restaurant is successfully added to your favorites.");
            }
            else {
                toast.success(result.data.message);
            }

        }).catch((error) => {
            toast.error("Error during the connection.");
        });
    }

    removeFavorite(restaurantId) {
        const userId = this.props.loginInfo.userId;
        const oldFavorites = this.state.favorites;
        let newFavorites = [];
        for (var i = 0; i < oldFavorites.length; i++) {
            if (oldFavorites[i] !== restaurantId)
                newFavorites = [...newFavorites, oldFavorites[i]];
        }

        axios.post("/customer/removeFavorite/customer_id=" + userId + "/restaurant_id=" + restaurantId).then((result) => {
            if (result.data.success)
            {
                this.setState({ favorites: newFavorites });
                toast.success("Restaurant is successfully removed from your favorites.");
            }
            else {
                toast.success(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error during the connection.");
        });
    }

    render() {
        console.log(this.state);
        const favorites = this.state.favorites;
        const itemTemplate = (data) => {
            console.log(data);
            const renderFavoriteButtons = () => {
                for (var i = 0; i < favorites.length; i++) {
                    if (data.restaurantId === favorites[i]) {
                        return (
                            <div>
                                <i className="pi pi-star" style={{ 'fontSize': '2em' }}> </i>    <div>
                                    <Button icon="pi pi-times" className="p-button-danger p-button-text" label="Remove Favorite"
                                        onClick={() => { this.removeFavorite(data.restaurantId) }} style={{ 'width': '200px', 'marginTop': '50px' }} /></div></div>
                        );
                    }
                }

                return (
                    <div>
                        <i className="pi pi-star-o" style={{ 'fontSize': '2em' }}> </i>        <div>
                            <Button icon="pi pi-bookmark" className="p-button-success p-button-text" label="Add Favorite"
                                onClick={() => { this.addFavorite(data.restaurantId) }} style={{ 'width': '200px', 'marginTop': '50px' }} /> </div> </div>
                );
            }
            return (
                <div className="restaurant-item">
                    <img src={data.image} alt="" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg" }} />
                    <div className="restaurant-detail">
                        <div className="restaurant-name">{data.restaurantName}</div>
                        <div className="restaurant-description">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false}></Rating>
                        <i className="pi pi-tag restaurant-category-icon"></i><span className="restaurant-category">{data.restaurantCategory}</span>
                    </div>
                    <div className="restaurant-action">
                        {renderFavoriteButtons()}
                        <Button icon="pi pi-shopping-cart" label="Enter" onClick={() => { this.props.history.push('/customer/restaurantPage/' + data.restaurantId); }}></Button>
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
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-2" >
                        <Panel style={{ 'marginTop': '200px' }} header="Search Options">
                            <div className="p-field-checkbox" style={{ 'justifyContent': 'center' }}>
                                <Checkbox onChange={e => this.setState({ open: e.checked })} checked={this.state.open} />
                                <label htmlFor="open" className="p-checkbox-label">Only Open Restaurants</label>
                            </div>
                            <div className="card">
                                <label htmlFor="minRating" >Min. Rating</label>
                                <InputNumber id="horizontal" value={this.state.minRating} onValueChange={(e) => this.setState({ minRating: e.value })}
                                    showButtons buttonLayout="horizontal" step={0.1} decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success"
                                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" mode="decimal" min={0} max={this.state.maxRating} />
                            </div>
                            <div className="card">
                                <label htmlFor="maxRating" >Max. Rating</label>
                                <InputNumber id="horizontal" value={this.state.maxRating} onValueChange={(e) => this.setState({ maxRating: e.value })}
                                    showButtons buttonLayout="horizontal" step={0.1} decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success"
                                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" mode="decimal" min={this.state.minRating} max={5} />
                            </div>
                            <div className="card" style={{ 'marginTop': '25px' }}>
                                <Button label="Apply Filters"
                                    onClick={() => {
                                        this.props.history.replace('/customer/restaurants/min=' + this.state.minRating +
                                            "/max=" + this.state.maxRating + "/open=" + this.state.open); window.location.reload();
                                    }} />
                            </div>
                        </Panel>
                    </div>
                    <div className="p-field p-col-12 p-md-10" >
                        <div className="datascroller-demo">
                            <div className="card">
                                <DataScroller value={this.state.restaurants} itemTemplate={itemTemplate}
                                    rows={10} buffer={0.4} header="List of Restaurants" />
                            </div>
                        </div>
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
RestaurantList = withRouter(connect(mapStateToProps)(RestaurantList))
export default RestaurantList;