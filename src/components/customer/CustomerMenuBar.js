import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import {connect} from 'react-redux';
import { withRouter } from 'react-router'


class CustomerMenuBar extends React.Component
{
    render() {

        const items = [
            {
                label: 'Restaurants',
                icon: 'pi pi-fw pi-sitemap',
                command: () => { this.props.history.push('/customer/main'); }
            },
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-user',
                command: () => { this.props.history.push('/customer/profile'); }
            },
            {
                label: 'Favorite Restaurants',
                icon: 'pi pi-fw pi-star',
                command: () => { this.props.history.push('/customer/favorites'); }
            },
            {
                label: 'Old orders',
                icon: 'pi pi-fw pi-list',
                command: () => { this.props.history.push('/customer/orders'); }
            },
            {
                label: 'Logout',
                icon: 'pi pi-fw pi-power-off',
                command: () => { this.props.history.push('/'); }
            }
        ];
    
        const start = <img alt="logo" src="showcase/images/logo.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} height="40" className="p-mr-2"></img>;
        const end = <InputText placeholder="Search" type="text" />;
    
        return (
            <div>
                <div className="card">
                    <Menubar model={items} start={start} end={end} />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {  
    
};
  
CustomerMenuBar = withRouter(connect(null,mapDispatchToProps)(CustomerMenuBar))

export default CustomerMenuBar;

/*
const mapStateToProps = state => {  
    return {
        history: state.history
    };
};
export default connect(mapStateToProps)(CustomerMenuBar);
*/