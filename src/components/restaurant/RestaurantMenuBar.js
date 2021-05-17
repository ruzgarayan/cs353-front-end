import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { Menubar } from 'primereact/menubar';
import store from '../../reducers/index.js'


class RestaurantMenuBar extends React.Component {

    componentDidMount() {
        
    }

    render() {
        const items = [
            {
                label: 'Active orders',
                icon: 'pi pi-fw pi-sitemap',
                command: () => { this.props.history.push('/restaurant/activeOrders'); }
            },
            {
                label: 'Finalized Orders',
                icon: 'pi pi-fw pi-sitemap',
                command: () => { this.props.history.push('/restaurant/finalizedOrders'); }
            },
            {
                label: 'Modify Menu',
                icon: 'pi pi-fw pi-sitemap',
                command: () => { this.props.history.push('/restaurant/modifyMenu'); }
            },
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-user',
                command: () => { this.props.history.push('/restaurant/profile'); }
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
        const start = <img alt="logo" src="showcase/images/logo.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} height="40" className="p-mr-2"></img>;
        return (
            <div>
                <div className="card">
                    <Menubar model={items} start={start} />
                </div>
            </div>
        );
    }
}

export default RestaurantMenuBar;
