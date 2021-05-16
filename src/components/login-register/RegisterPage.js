import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ListBox } from 'primereact/listbox';
import { ProgressSpinner } from 'primereact/progressspinner';

import { toast } from 'react-toastify';

class RegisterPage extends React.Component {


    constructor(props) {
        super(props);

        this.userTypes = [{ name: 'Customer', key: '1' }, { name: 'Courier', key: '2' }, { name: 'Restaurant Owner', key: '3' }];

        this.state = {
            username: "",
            password: "",
            name: "",
            surname: "",
            telephone: "",
            email: "",
            userType: this.userTypes[0],

            address: "",
            selectedRegion: null,

            regions: [],

            loading: true
        };

    }

    fetchData() {
        axios.get("/region/allRegions").then((result) => {
            if (!result.data.success)
            {
                toast.error("Error during the connection.");
                this.fetchData();
            }
            else
                this.setState({regions: result.data.data, selectedRegion: result.data.data[0], loading:false});
        }).catch((error) => {
            toast.error("Error during the connection.");
            this.fetchData();
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    register() {

        let registerInfo = {
            username: this.state.username,
            password: this.state.password,
            name: this.state.name,
            surname: this.state.surname,
            telephone: this.state.telephone,
            email: this.state.email,
            userType: this.state.userType.name
        }
        
        let url = "";
        if (registerInfo.userType === "Customer") 
        {
            registerInfo = {
                ...registerInfo, 
                address: this.state.address,
                region_id: this.state.selectedRegion.regionId
            }
            url = "/registerCustomer";
        }
        else if (registerInfo.userType === "Courier") {
            url = "/registerCourier";
        }
        else if (registerInfo.userType === "Restaurant Owner") {
            url = "/registerRestaurantOwner";
        }

        console.log(registerInfo);
        axios.post(url, registerInfo).then((result) => {
            if (result.data.success)
                toast.success(result.data.message);
            else
                toast.error(result.data.message);
        }).catch((error) => {
            toast.error("Error during the connection.");
        });
    }

    renderUserTypeSpecific() {
        switch(this.state.userType.name) {
            case 'Customer':
                return (
                    <div> 
                            <div className="p-float-label" style={{'marginTop': '30px'}}>
                                    <InputTextarea id="address" type="text" value={this.state.address} autoResize 
                                        onChange={(e) => this.setState({ address: e.target.value })} />
                                    <label>Address</label>
                            </div>
                            <h4> Region </h4>
                            <div>
                                <ScrollPanel style={{'width': '100%', 'height': '150px', 'marginTop': '25px'}}>
                                    <ListBox optionLabel="regionName" value={this.state.selectedRegion}
                                    options={this.state.regions} onChange={(e) => this.setState({selectedRegion: e.value})} />
                                </ScrollPanel>
                            </div>
                            <br/>
                    </div>
                );
            case 'Courier':
                return (<div> </div>);
            case 'Restaurant Owner':
                return (<div> </div>);
            default:
                return (<div> </div>);
        }
    }

    render() {
        if (this.state.loading)
        {
            return (
                <ProgressSpinner/>
            );
        }
        else  {
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
    
                        <div className="p-field p-col-12 p-md-1">
                            <span className="p-float-label">
                                <InputText id="name" type="text" value={this.state.name}
                                    onChange={(e) => this.setState({ name: e.target.value })} />
                                <label>Name</label>
                            </span>
                        </div>
                        <div className="p-field p-col-12 p-md-1">
                            <span className="p-float-label">
                                <InputText id="surname" type="text" value={this.state.surname}
                                    onChange={(e) => this.setState({ surname: e.target.value })} />
                                <label>Surname</label>
                            </span>
                        </div>
                    </div>
    
                    <br /><div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-5"></div>
    
                        <div className="p-field p-col-12 p-md-2">
                            <span className="p-float-label">
                                <InputText id="email" type="text" value={this.state.email}
                                    onChange={(e) => this.setState({ email: e.target.value })} />
                                <label>Email</label>
                            </span>
                        </div>
                    </div>
    
                    <br /><div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-5"></div>
    
                        <div className="p-field p-col-12 p-md-2">
                            <span className="p-float-label">
                                <InputText id="telephone" type="text" value={this.state.telephone}
                                    onChange={(e) => this.setState({ telephone: e.target.value })} />
                                <label>Telephone</label>
                            </span>
                        </div>
                    </div>
    
                    {
                        this.userTypes.map((userType) => {
                            return (
                                <div className="p-fluid p-formgrid p-grid" key={userType.key}>
                                    <div className="p-field p-col-12 p-md-5"></div>
                                    <div key={userType.key} className="p-field-radiobutton p-col-12 p-md-2">
                                        <RadioButton inputId={userType.key} name="userType" value={userType} onChange={(e) => this.setState({ userType: e.value })} checked={this.state.userType.key === userType.key} disabled={userType.key === 'R'} />
                                        <label htmlFor={userType.key}>{userType.name}</label>
                                    </div>
                                </div>
                            )
                        })
                    }
    
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-5"></div>
    
                        <div className="p-field p-col-12 p-md-2">
                            {this.renderUserTypeSpecific()}
                        </div>
                    </div>
                    
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 p-md-5"></div>
    
                        <div className="p-field p-col-12 p-md-2">
                            <Button label="Register" onClick={() => this.register()} />
                        </div>
                    </div>
    
                </div>
            );
        }
    }
}

export default RegisterPage;