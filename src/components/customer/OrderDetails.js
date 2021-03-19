import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';

class OrderDetails extends React.Component
{
    render() {
        let orderId = this.props.match.params.id;
        return (
            <div>
                Order details for orderId = {orderId}
            </div>
        );
    }
}

export default OrderDetails;