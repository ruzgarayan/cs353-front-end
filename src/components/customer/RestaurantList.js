import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {Button} from 'primereact/button';
import { Rating } from 'primereact/rating';
import './customerStyle.css'


class RestaurantList extends React.Component
{
    render() {
        var restaurants = [
        {
            name: "Ömer Aybak Meşhur Adıyaman Çiğ Köftecisi",
            category: "-",
            rating: 4.2
        },
        {
            name: "Black & Yellow Pizza",
            category: "-",
            rating: 4.9
        },
        {
            name: "Tostbaa Cafe",
            category: "-",
            rating: 3.3
        },
        {
            name: "Özgür Çöp Şiş",
            category: "-",
            rating: 4.7
        },
    ];

        const header = (
            <div className="table-header">
                Products
                <Button icon="pi pi-refresh" />
            </div>
        );

        const imageBodyTemplate = (rowData) => {
            return <img src={`showcase/demo/images/product/${rowData.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />;
        }

        const footer = `In total there are ${restaurants ? restaurants.length : 0} restaurants.`;

        const ratingBodyTemplate = (rowData) => {
            return <Rating value={rowData.rating} readOnly cancel={false} />;
        }    

        return (
            <div>
                <div className="datatable-templating-demo">
                    <div className="card">
                    <DataTable value={restaurants} header={header} footer={footer}>
                        <Column field="name" header="Name"></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="category" header="Category"></Column>
                        <Column field="rating" header="Reviews" body={ratingBodyTemplate}></Column>
                    </DataTable>
                    </div>
                </div>
            </div>
        );
    }
}

export default RestaurantList;