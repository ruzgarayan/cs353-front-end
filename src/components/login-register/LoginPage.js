import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { Button } from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import 'primeflex/primeflex.css';
import axios from 'axios';
import {connect} from 'react-redux';
import { withRouter } from 'react-router'

import {toast} from 'react-toastify';

class LoginPage extends React.Component {

    
    state = {
        username: "",
        password: ""
    };

    constructor(props)
    {
        super(props);
    }

    login()
    {
        let loginInfo = {username: this.state.username, password: this.state.password};

        axios.post("/login", loginInfo).then((result) => {
            if (result.data.success)
            {
                toast.success(result.data.message);
                toast.success("Welcome, " + result.data.data.name + " " + result.data.data.surname);

                if (result.data.data.userType == 'Customer')
                    this.props.history.push('/customer/main');
                else if (result.data.data.userType == 'Courier')
                    this.props.history.push('/courier/main');
                else if (result.data.data.userType == 'Restaurant Owner')
                    this.props.history.push('/restaurant/main');
                else    
                    toast.error("Incorrect user type.");
            }
            else
                toast.error(result.data.message);

        }).catch((error) => {
            console.log(error);
            toast.error("Error during the connection.");
        });
    }

    render() {
        return (
            <div>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="username">Username </label>
                         <InputText id="username" type="text" value={this.state.username} style={{width:'100px', marginLeft: '10px'}} 
                         onChange={(e) => this.setState({username: e.target.value})} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="password">Password</label>
                        <InputText id="password" type="password" value={this.state.password} style={{width:'100px', marginLeft: '10px'}} 
                        onChange={(e) => this.setState({password: e.target.value})} />
                    </div>
                 </div>
                    <div className="p-field">
                        <Button label="Login" onClick={() => this.login()}/>
                    </div>
            </div>
        );
    }
}
const mapDispatchToProps = {  
    
};
  
LoginPage = withRouter(connect(null,mapDispatchToProps)(LoginPage))

export default LoginPage;