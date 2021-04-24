import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import React from 'react';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import './styles/restaurantViewStyle.css';
import 'primeflex/primeflex.css';

class RestaurantView extends React.Component
{
    state = {
        layout: 'grid',
        products: [{name: "şırdan"},{},{},{},{}]
    }

    render() {
        const renderListItem = (data) => {
            return (
                <div className="p-col-12">
                    <div className="product-list-item">
                        <img src={`showcase/demo/images/product/${data.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                        <div className="product-list-detail">
                            <div className="product-name">{data.name}</div>
                            <div className="product-description">{data.description}</div>
                            <Rating value={data.rating} readOnly cancel={false}></Rating>
                            <i className="pi pi-tag product-category-icon"></i><span className="product-category">{data.category}</span>
                        </div>
                        <div className="product-list-action">
                            <span className="product-price">${data.price}</span>
                            <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
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
                            <div>
                                <i className="pi pi-tag product-category-icon"></i>
                                <span className="product-category">{data.category}</span>
                            </div>
                        </div>
                        <div className="product-grid-item-content">
                        <img src={`showcase/demo/images/product/${data.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                            <div className="product-name">{data.name}</div>
                            <div className="product-description">{data.description}</div>
                        </div>
                        <div className="product-grid-item-bottom">
                            <span className="product-price">${data.price}</span>
                            <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
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
    
        const renderHeader = () => {
            return (
                <div className="p-grid p-nogutter">
                    <div className="p-col-6" style={{textAlign: 'right'}}>
                        <DataViewLayoutOptions layout={this.state.layout} onChange={(e) => this.setState({layout: e.value})} />
                    </div>
                </div>
            );
        }
    
        const header = renderHeader();
    
        return (
            <div>
                <br/> <br/>
                <div>  
                    Burada yukarda restoranın genel bilgileri falan filan.
                </div>
                <br/> <br/>

                <div className="dataview-demo">
                    <div className="card">
                        <DataView value={this.state.products} layout={this.state.layout} header={header}
                                itemTemplate={itemTemplate} paginator rows={9} />
                    </div>
                </div>
            </div>
        );
    }
}

export default RestaurantView;