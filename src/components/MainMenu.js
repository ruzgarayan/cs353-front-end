import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { Button } from 'primereact/button';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

class MainMenu extends React.Component {
    render() {
        return (
            <div>
                    <Link to="/customer/main">
                        <Button icon="pi pi-user" label={"Customer Login"} />
                    </Link>
                    <br /> <br />
                    <Link to="/courier/main">
                        <Button icon="pi pi-user" label={"Courier Login"} />
                    </Link>
                    <br /> <br />
                    <Link to="/restaurant/main">
                        <Button icon="pi pi-user" label={"Restaurant Login"} />
                    </Link>
            </div>
        );
    }
}

export default MainMenu;