import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { Button } from 'primereact/button';
import {InputText} from 'primereact/inputtext';
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
        console.log(props);
    }

    login()
    {
        let loginPostInfo = {username: this.state.username, password: this.state.password};

        axios.post("/login", loginPostInfo).then((result) => {
            if (result.data.success)
            {
                toast.success(result.data.message);
                toast.success("Welcome, " + result.data.data.name + " " + result.data.data.surname);

                this.props.loginInfo.userInfo = result.data.data;
                this.props.loginInfo.loggedIn = true;

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
                <br/><div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-5"></div>

                    <div className="p-field p-col-12 p-md-2">
                        <span className="p-float-label">
                            <InputText id="username" type="text" value={this.state.username}
                         onChange={(e) => this.setState({username: e.target.value})} />
                         <label>Username</label>
                        </span>
                    </div>
                </div>

                <br/><div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-5"></div>

                    <div className="p-field p-col-12 p-md-2">
                        <span className="p-float-label">
                        <InputText id="password" type="password" value={this.state.password}
                        onChange={(e) => this.setState({password: e.target.value})} />
                         <label>Password</label>
                        </span>
                    </div>
                </div>

                <br/><div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-5"></div>

                    <div className="p-field p-col-12 p-md-2">
                        <Button label="Login" onClick={() => this.login()}/>
                    </div>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps = {  
    
};

const mapStateToProps = state => { 
    return {
        loginInfo: state.loginInfo
    };
};
export default withRouter(connect(mapStateToProps)(LoginPage));