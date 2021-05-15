import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import store from './../../reducers/index.js'


class CustomerMenuBar extends React.Component {
    state = {
        searchKey: ""
    };

    render() {
        const items = [
            {
                label: 'Restaurants',
                icon: 'pi pi-fw pi-sitemap',
                command: () => { this.props.history.push('/customer/restaurants'); }
            },
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-user',
                command: () => { this.props.history.push('/customer/profile'); }
            },
            {
                label: 'Orders',
                icon: 'pi pi-fw pi-list',
                command: () => { this.props.history.push('/customer/orders'); }
            },
            {
                label: 'Logout',
                icon: 'pi pi-fw pi-power-off',
                command: () => {
                    const logoutAction = () => {
                        return {
                            type: "LOGOUT",
                            newState: {
                                loggedIn: false,
                                userId: null,
                                token: null
                            }
                        }
                    }
                    store.dispatch(logoutAction());
                    this.props.history.push('/');
                }
            }
        ];

        const totalPrice = store.getState().cartInfo.totalPrice;
        let cartLabel = "";
        if (totalPrice === 0)
            cartLabel = "Cart (Empty)"
        else
            cartLabel = "Cart (" + totalPrice + "$)"

        const start = <img alt="logo" src="showcase/images/logo.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} height="40" className="p-mr-2"></img>;
        const end = <span>
            <Button icon="pi pi-shopping-cart" label={cartLabel} onClick={() => { this.props.history.push('/customer/finalizeOrder') }} />
            <InputText value={this.state.searchKey} placeholder="Name of restaurant, category, food" type="text" id="searchKey"
                style={{ 'width': '400px', 'marginLeft': '20px', 'marginRight': '10px' }}
                onChange={(e) => { this.setState({ searchKey: e.target.value }); }}
            />
            <Button label="Search" onClick={() => {
                this.props.history.replace('/customer/restaurants/search=' + this.state.searchKey);
                window.location.reload();
            }} />
        </span>;

        return (
            <div>
                <div className="card">
                    <Menubar model={items} start={start} end={end} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cartInfo: state.cartInfo
    };
};

CustomerMenuBar = withRouter(connect(mapStateToProps)(CustomerMenuBar))

export default CustomerMenuBar;

/*
const mapStateToProps = state => {
    return {
        history: state.history
    };
};
export default connect(mapStateToProps)(CustomerMenuBar);
*/