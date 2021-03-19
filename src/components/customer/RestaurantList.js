import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import axios from "axios";
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { DataScroller } from 'primereact/datascroller';
import {connect} from 'react-redux';
import { withRouter } from 'react-router'
import './customerStyle.css'

class RestaurantList extends React.Component {

    state = {
        loading: true,
        restaurants: []
    };

    
    fetchData() {
        axios.get("https://60376f1f54350400177225f6.mockapi.io/cs353/restaurants").then((result) => {
            console.log(result);
            this.setState({restaurants: result.data, loading:false});
        }).catch((error) => {
            console.log("Error");
            //TODO
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const itemTemplate = (data) => {
            return (
                <div className="restaurant-item">
                    <img src={`https://lh3.googleusercontent.com/proxy/rYy3zhdtwQueXVNfG8YnZe_Iah2uV0ZahMiyWmzxDOb6tZPh0ZYOTzkJ4dXN1sM0dCH6updAs104Xak37p_jg59c1L_6IJ-N1sq0A_68Ae0lF8nPh3Ui`} alt="" />
                    <div className="restaurant-detail">
                        <div className="restaurant-name">{data.name}</div>
                        <div className="restaurant-description">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false}></Rating>
                        <i className="pi pi-tag restaurant-category-icon"></i><span className="restaurant-category">{data.category}</span>
                    </div>
                    <div className="restaurant-action">
                        <Button icon="pi pi-shopping-cart" label="Enter" onClick= {() => { this.props.history.push('/customer/restaurantPage/' + data.id);}}></Button>
                    </div>
                </div>
            );
        }
        
        if (this.state.loading)
        {
            return (
                <div> Loading... 
                </div>
            );
        }
        else
        {
            return (
                <div className="datascroller-demo">
                    <div className="card">
                        <DataScroller value={this.state.restaurants} itemTemplate={itemTemplate}
                            rows={6} buffer={0.4} header="List of Restaurants" />
                    </div>
                </div>
            );
        }

    }
}

const mapDispatchToProps = {    
}; 
RestaurantList = withRouter(connect(null,mapDispatchToProps)(RestaurantList))
export default RestaurantList;