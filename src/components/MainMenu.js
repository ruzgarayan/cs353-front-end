import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { Button } from 'primereact/button';

import LoginPage from './login-register/LoginPage';
import RegisterPage from './login-register/RegisterPage';
import 'primeflex/primeflex.css';

class MainMenu extends React.Component {

    state = {
        login: true
    }

    render() {

        if (this.state.login)
        {
            return (
                <div>
                    <Button label="Login" className="p-button-success" onClick={() => this.setState({login: true})} style={{marginRight: '10px'}}/>
                    <Button label="Register" onClick={() => this.setState({login: false})}/>
                    <br/><br/>
                    <LoginPage/>
                </div>
            );
        }
        else 
        {
            return (
                <div>
                    <Button label="Login" onClick={() => this.setState({login: true})} style={{marginRight: '10px'}}/>
                    <Button label="Register" className="p-button-success" onClick={() => this.setState({login: false})}/>
                    <br/><br/>
                    <RegisterPage/>
                </div>
            );
        }
        
    }
}

export default MainMenu;