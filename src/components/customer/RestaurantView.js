import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import axios from "axios";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import React from 'react';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import './styles/restaurantViewStyle.css';
import 'primeflex/primeflex.css';
import { toast } from 'react-toastify';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';

class RestaurantView extends React.Component
{
    state = {
        restaurantId: this.props.match.params.id,
        loading: true,
        layout: 'grid',
        restaurant_info: {

        },
        category_menus: []
    }

    fetchData() {
        let success = true;
        let restaurantId = this.state.restaurantId;
        this.setState({loading: true});

        //Get restaurant info
        axios.get("/customer/restaurantInfo/id=" + restaurantId).then((result) => {
            console.log(result);
            if (!result.data.success)
            {
                success = false;
            }
            else
                this.setState({restaurant_info: result.data.data});
        }).catch((error) => {
            toast.error("Error while getting the restaurant info.");
            success = false;
        });

        //Get restaurant menu
        axios.get("/customer/restaurantMenuByCategory/id=" + restaurantId).then((result) => {
            console.log(result);
            if (!result.data.success)
            {
                success = false;
            }
            else
                this.setState({category_menus: result.data.data});
        }).catch((error) => {
            toast.error("Error while getting the restaurant menu.");
            success = false;
        });


        //If success, stop loading screen
        if (success)
            this.setState({loading: false});
        else
        {
            toast.error("An error occured, retrying...");
            this.fetchData();
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    renderCategoryMenus() {
        const renderListItem = (data) => {
            return (
                <div className="p-col-12">
                    <div className="product-list-item">
                        <img src={data.imageLink} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                        <div className="product-list-detail">
                            <div className="product-name">{data.name}</div>
                            <div className="product-description">{data.description}</div>
                        </div>
                        <div className="product-list-action">
                            <span className="product-price">${data.basePrice}</span>
                            <Button icon="pi pi-shopping-cart" label="Add to Cart"></Button>
                        </div>
                    </div>
                </div>
            );
        }
    
        const renderGridItem = (data) => {
            return (
                <div className="p-col-12 p-md-4">
                    <div className="product-grid-item card">
                        <div className="product-grid-item-top">
                        </div>
                        <div className="product-grid-item-content">
                        <img src={data.imageLink} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                            <div className="product-name">{data.name}</div>
                            <div className="product-description">{data.description}</div>
                        </div>
                        <div className="product-grid-item-bottom">
                            <span className="product-price">${data.basePrice}</span>
                            <Button icon="pi pi-shopping-cart" label="Add to Cart" ></Button>
                        </div>
                    </div>
                </div>
            );
        }
    
        const itemTemplate = (product, layout) => {
            if (!product) {
                return;
            }
    
            if (layout === 'list')
                return renderListItem(product);
            else if (layout === 'grid')
                return renderGridItem(product);
        }

        const categoryHeader = (category) => {
            return (
                <p>{category}</p>
            );
        }

        return (
            <div>
                {this.state.category_menus.map((menu, index) => (
                    <div className="dataview-demo">
                    <div className="card">
                        <DataView value={menu.categoryMenuItems} layout={this.state.layout} header={menu.category}
                                itemTemplate={itemTemplate} paginator rows={5} />
                    </div>
                </div>
                ))}
            </div>
        );
    }

    render() {
        if (this.state.loading)
        {
            return (
                <ProgressSpinner/>
            );
        }
        else {  
            
            const renderHeader = () => {
                return (
                    <div className="p-grid p-nogutter">
                            <DataViewLayoutOptions layout={this.state.layout} onChange={(e) => this.setState({layout: e.value})} />
                    </div>
                );
            }
        
            const header = renderHeader();

            let restaurant_info = this.state.restaurant_info;
            return (
                <div>
                    <br/> <br/>
                    <Panel header={restaurant_info.restaurant_name} >
                        <div className="p-fluid p-formgrid p-grid" > 
                            <div className="p-field p-col-12 p-md-2" > 
                                <img src={`https://sampiyon-kokorec.developerkitchen.com/img/default-1.jpg`} alt="" style={{'width': '100%'}}/>
                            </div>
                            <div className="p-field p-col-12 p-md-1" ></div>
                            <div className="p-field p-col-12 p-md-6" > 
                                <i className="pi pi-tag restaurant-category-icon"></i><span >{restaurant_info.restaurant_category}</span>
                                <p> {restaurant_info.description}</p>
                            </div>
                            <div className="p-field p-col-12 p-md-1" ></div>
                            <div className="p-field p-col-12 p-md-2" style={{'justifyContent': 'center', 'display': 'flex', 'alignItems': 'center'}}>
                                <Rating value={restaurant_info.rating} readOnly cancel={false} ></Rating>
                            </div>
                        </div>
                    </Panel>
                    <br/> <br/>
                    <Panel header={header}> {this.renderCategoryMenus()} </Panel>
                    
                </div>
            );
        }
    }
}

export default RestaurantView;