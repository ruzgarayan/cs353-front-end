import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import axios from "axios";
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { DataScroller } from 'primereact/datascroller';
import {connect} from 'react-redux';
import { withRouter } from 'react-router'
import { ProgressSpinner } from 'primereact/progressspinner';
import './styles/customerStyle.css'
import { toast } from 'react-toastify';
import {Checkbox} from 'primereact/checkbox';

class RestaurantList extends React.Component {

    constructor(props) {
        super(props);

        var searchKey = null;
        if (this.props.match.params.searchKey !== undefined)
            searchKey = this.props.match.params.searchKey;

        this.state = {
            loading: true,
            restaurants: [],
            searchKey: searchKey,
            open: true,
            minRating: null,
            maxRating: null
        };

        console.log(this.state);
    }

    
    fetchData() {
        const searchKey = this.state.searchKey;
        const userId = this.props.loginInfo.userId;
        if (searchKey === null) {
            axios.get("/customer/restaurants/id=" + userId).then((result) => {
                console.log(result);
                this.setState({restaurants: result.data.data, loading:false});
            }).catch((error) => {
                toast.error("Error during the connection.");
                this.fetchData();
            });
        }
        else {
            axios.get("/customer/restaurants/id=" + userId + "/search=" + searchKey).then((result) => {
                console.log(result);
                this.setState({restaurants: result.data.data, loading:false});
            }).catch((error) => {
                toast.error("Error during the connection.");
                this.fetchData();
            });
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const itemTemplate = (data) => {
            return (
                <div className="restaurant-item">
                    <img src={`https://sampiyon-kokorec.developerkitchen.com/img/default-1.jpg`} alt="" />
                    <div className="restaurant-detail">
                        <div className="restaurant-name">{data.restaurant_name}</div>
                        <div className="restaurant-description">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false}></Rating>
                        <i className="pi pi-tag restaurant-category-icon"></i><span className="restaurant-category">{data.restaurant_category}</span>
                    </div>
                    <div className="restaurant-action">
                        <Button icon="pi pi-shopping-cart" label="Enter" onClick= {() => { this.props.history.push('/customer/restaurantPage/' + data.restaurantId);}}></Button>
                    </div>
                </div>
            );
        }
        
        if (this.state.loading)
        {
            return (
                <ProgressSpinner/>
            );
        }
        else
        {
            return (
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-2" >
                        <Panel style={{'marginTop': '200px'}} header="Search Options">
                            <div className="p-field-checkbox" style={{'justifyContent': 'center'}}>
                                <Checkbox onChange={e => this.setState({open: e.checked})} checked={this.state.open} />
                                <label htmlFor="open" className="p-checkbox-label">Open</label>
                            </div>
                            <div className="card">
                                <label htmlFor="minRating" >Min. Rating</label>
                                <Rating value={this.state.minRating} onChange={(e) => this.setState({minRating: e.value})} stars={5} />
                            </div>
                            <div className="card">
                                <label htmlFor="maxRating" >Max. Rating</label>
                                <Rating value={this.state.maxRating} onChange={(e) => this.setState({maxRating: e.value})} stars={5} />
                            </div>
                            <div className="card" style={{'marginTop': '25px'}}>
                                <Button label="Apply Filters" onClick={()=>{/*TODO*/}}/> 
                            </div>
                        </Panel>
                    </div>
                    <div className="p-field p-col-12 p-md-10" >
                        <div className="datascroller-demo">
                            <div className="card">
                                <DataScroller value={this.state.restaurants} itemTemplate={itemTemplate}
                                    rows={6} buffer={0.4} header="List of Restaurants" />
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