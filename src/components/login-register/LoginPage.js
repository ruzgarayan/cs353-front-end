import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import store from './../../reducers/index.js'

import { toast } from 'react-toastify';

class LoginPage extends React.Component {


    state = {
        username: "",
        password: ""
    };

    constructor(props) {
        super(props);
        console.log(props);
    }

    deneme() {

    }

    async login() {
        let loginPostInfo = { username: this.state.username, password: this.state.password };

        await axios.post("/login", loginPostInfo).then((result) => {
            if (result.data.success) {
                toast.success(result.data.message);
                toast.success("Welcome, " + result.data.data.name + " " + result.data.data.surname);

                const userId = result.data.data.userId;

                let restaurantId = null;
                if (result.data.data.userType === 'Restaurant Owner') {
                    axios.get("/restaurant/getRestaurantId/owner_id=" + userId).then((result2) => {
                        console.log(result2);
                        if (result2.data.success) {

                            let loginAction = () => {
                                return {
                                    type: "LOGIN",
                                    newState: {
                                        loggedIn: true,
                                        userId: userId,
                                        token: null,
                                        restaurantId: result2.data.data
                                    }
                                }
                            }

                            store.dispatch(loginAction());
                            this.props.history.push('/restaurant/activeOrders');
                        }
                        else {
                            toast.error(result2.data.message);
                        }
                    }).catch((error) => {
                        toast.error("Error during the connection.");
                    });


                }
                else {

                    let loginAction = () => {
                        return {
                            type: "LOGIN",
                            newState: {
                                loggedIn: true,
                                userId: userId,
                                token: null,
                                restaurantId: null
                            }
                        }
                    }
                    store.dispatch(loginAction());

                    if (result.data.data.userType === 'Customer')
                        this.props.history.push('/customer/restaurants');
                    else if (result.data.data.userType === 'Courier')
                        this.props.history.push('/courier/assignments');
                    else if (result.data.data.userType === 'Admin')
                        this.props.history.push('/admin');
                    else
                        toast.error("Incorrect user type.");
                }


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
                <br /><div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-5"></div>

                    <div className="p-field p-col-12 p-md-2">
                        <span className="p-float-label">
                            <InputText id="username" type="text" value={this.state.username}
                                onChange={(e) => this.setState({ username: e.target.value })} />
                            <label>Username</label>
                        </span>
                    </div>
                </div>

                <br /><div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-5"></div>

                    <div className="p-field p-col-12 p-md-2">
                        <span className="p-float-label">
                            <InputText id="password" type="password" value={this.state.password}
                                onChange={(e) => this.setState({ password: e.target.value })} />
                            <label>Password</label>
                        </span>
                    </div>
                </div>

                <br /><div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-5"></div>

                    <div className="p-field p-col-12 p-md-2">
                        <Button label="Login" onClick={() => this.login()} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loginInfo: state.loginInfo
    };
};
export default withRouter(connect(mapStateToProps)(LoginPage));