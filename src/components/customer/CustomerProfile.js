import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import {connect} from 'react-redux';
import axios from "axios";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import React from 'react';


class CustomerProfile extends React.Component
{
    state = {
        loading: true,

        userInfo: {
            username: "",
            password: "",
            name: "",
            surname: "",
            telephone: "",
            email: ""
        },
        
    };

    componentDidMount()
    {
        this.setState({userInfo: this.props.loginInfo.userInfo, loading: false});
    }

    render() { 
        if (this.state.loading)
        {
            return (
                <ProgressSpinner/>
            );
        }
        else
        {
            console.log(this.props);
            return (

                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-3">

                    </div>

                    <div className="p-field p-col-12 p-md-6" style={{'border-style': 'solid'}}>

                        <div className="p-float-label" style={{'margin-top': '30px'}}>
                            <InputText id="username" type="text" value={this.state.userInfo.username}
                                onChange={(e) => this.setState({ userInfo: {...this.state.userInfo, username: e.target.value }})} />
                            <label>Username</label>
                        </div>
                        <div className="p-float-label" style={{'margin-top': '30px'}}>
                            <InputText id="username" type="text" value={this.state.username}
                                onChange={(e) => this.setState({ username: e.target.value })} />
                            <label>Username</label>
                        </div>

                        
                        <br />
                    </div>
                </div>

            );
        }
    }
}

const mapStateToProps = state => { 
    return {
        loginInfo: state.loginInfo
    };
};
export default connect(mapStateToProps)(CustomerProfile);