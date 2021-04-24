import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { Button } from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import 'primeflex/primeflex.css';
import axios from 'axios';
import { RadioButton } from 'primereact/radiobutton';

import {
    Link
} from "react-router-dom";

import {toast} from 'react-toastify';

class RegisterPage extends React.Component {


    constructor(props)
    {
        super(props);

        this.userTypes = [{name: 'Customer', key: '1'}, {name: 'Courier', key: '2'}, {name: 'Restaurant Owner', key: '3'}];

        this.state = {
            username: "",
            password: "",
            name: "",
            surname: "",
            telephone: "",
            email: "",
            userType: this.userTypes[0]
        };

    }


    register()
    {
        let registerInfo = this.state;
        registerInfo.userType = registerInfo.userType.name;
        console.log(registerInfo);

        axios.post("/register", registerInfo).then((result) => {
            if (result.data.success)
                toast.success(result.data.message);
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
                        <label htmlFor="name">Name</label>
                        <InputText id="name" type="text" value={this.state.name} style={{width:'100px', marginLeft: '10px'}} 
                        onChange={(e) => this.setState({name: e.target.value})} />
                    </div>

                    <div className="p-field">
                        <label htmlFor="surname">Surname</label>
                        <InputText id="surname" type="text" value={this.state.surname} style={{width:'100px', marginLeft: '10px'}} 
                        onChange={(e) => this.setState({surname: e.target.value})} />
                    </div>

                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" type="text" value={this.state.email} style={{width:'100px', marginLeft: '10px'}} 
                        onChange={(e) => this.setState({email: e.target.value})} />
                    </div>

                    <div className="p-field">
                        <label htmlFor="telephone">Telephone</label>
                        <InputText id="telephone" type="text" value={this.state.telephone} style={{width:'100px', marginLeft: '10px'}} 
                        onChange={(e) => this.setState({telephone: e.target.value})} />
                    </div>

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
                    <div className="p-field" style={{ textAlign: "center" }}>
                        {
                            this.userTypes.map((userType) => {
                                return (
                                    <div key={userType.key} className="p-field-radiobutton">
                                        <RadioButton inputId={userType.key} name="userType" value={userType} onChange={(e) => this.setState({userType: e.value})}  checked={this.state.userType.key === userType.key} disabled={userType.key === 'R'} />
                                        <label htmlFor={userType.key}>{userType.name}</label>
                                    </div>
                                )
                            }
                            )
                        }
                    </div>
                    <div className="p-field">
                        <Button label="Register" onClick={() => this.register()}/>
                    </div>
            </div>
        );
    }
}

export default RegisterPage;