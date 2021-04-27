import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import {connect} from 'react-redux';
import axios from "axios";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataScroller } from 'primereact/datascroller';
import { Card } from 'primereact/card';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ListBox } from 'primereact/listbox';
import { toast } from 'react-toastify';

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
            email: "",
            address: "",
            userType: "",
            region_id: null,
        },

        coupons: [{coupon_id: "FYI-THIS-IS-FAKE", amount: 25.00, restaurant_name: "Hasan Abi's Kebab Place"}, {coupon_id: "FYI-THIS-IS-FAKE2", amount: 15.00, restaurant_name: "Hasan Abi's Kebab Place2"}, ],
        
        regions: [],

        selectedRegion: null
    };

    fetchData(){
        let success = true;
        let userId = this.props.loginInfo.userId;
        this.setState({loading: true});

        //Get regions
        axios.get("/region/allRegions").then((result) => {
            if (!result.data.success)
            {
                success = false;
            }
            else
            {
                this.setState({regions: result.data.data});
            }
        }).catch((error) => {
            toast.error("Error while getting the region data.");
            success = false;
        });

        //Get user info
        axios.get("/customer/customerData/id=" + userId).then((result) => {
            if (!result.data.success)
            {
                success = false;
            }
            else
            {
                this.setState({userInfo: result.data.data});
                for (let i = 0; i < this.state.regions.length; i++)
                {
                    if (this.state.regions[i].region_id === this.state.userInfo.region_id)
                    {
                        this.setState({selectedRegion: this.state.regions[i]});
                        break;
                    }
                }
            }
        }).catch((error) => {
            toast.error("Error while getting the user data.");
            success = false;
        });


        //Get coupons


        //If success, stop loading screen
        if (success)
            this.setState({loading: false});
        else
        {
            toast.error("An error occured, retrying...");
            this.fetchData();
        }
    }

    componentDidMount()
    {
        this.fetchData();
    }

    itemTemplate(data) {
        return (
            <div >
                <Card title={data.coupon_id} style={{ 'border-style': 'dashed' }}>
                    <div >{data.amount}$ discount in {data.restaurant_name}</div>
                </Card>
            </div>
        );
    }

    saveChanges() {
        let userId = this.props.loginInfo.userId;
        axios.post("/customer/customerData/id=" + userId, this.state.userInfo).then((result) => {
            
            if (result.data.success)
                toast.success(result.data.message);
            else
                toast.error(result.data.message);

            this.fetchData();
        }).catch((error) => {
            toast.error("Error while connecting");
        });
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
            console.log(this.state);
            return (

                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-3" >
                        <ScrollPanel style={{'width': '100%', 'height': '500px'}}>
                            <DataScroller value={this.state.coupons} itemTemplate={this.itemTemplate}
                            rows={1000} buffer={0.4} header="Coupons" />
                        </ScrollPanel>
                    </div>

                    <div className="p-field p-col-12 p-md-6" style={{'border-style': 'solid'}}>

                        <div className="p-float-label" style={{'marginTop': '30px'}}>
                            <InputText id="username" type="text" value={this.state.userInfo.username}
                                onChange={(e) => this.setState({ userInfo: {...this.state.userInfo, username: e.target.value }})} />
                            <label>Username</label>
                        </div>
                        <div className="p-float-label" style={{'marginTop': '30px'}}>
                            <InputText id="password" type="password" value={this.state.password}
                                onChange={(e) => this.setState({ userInfo: {...this.state.userInfo, password: e.target.value }})} />
                            <label>Password</label>
                        </div>
                        <div className="p-float-label" style={{'marginTop': '30px'}}>
                            <InputText id="name" type="text" value={this.state.userInfo.name}
                                onChange={(e) => this.setState({ userInfo: {...this.state.userInfo, name: e.target.value }})} />
                            <label>Name</label>
                        </div>
                        <div className="p-float-label" style={{'marginTop': '30px'}}>
                            <InputText id="surname" type="text" value={this.state.userInfo.surname}
                                onChange={(e) => this.setState({ userInfo: {...this.state.userInfo, surname: e.target.value }})} />
                            <label>Surname</label>
                        </div>
                        <div className="p-float-label" style={{'marginTop': '30px'}}>
                            <InputText id="email" type="text" value={this.state.userInfo.email}
                                onChange={(e) => this.setState({ userInfo: {...this.state.userInfo, email: e.target.value }})} />
                            <label>Email</label>
                        </div>
                        <div className="p-float-label" style={{'marginTop': '30px'}}>
                            <InputText id="telephone" type="text" value={this.state.userInfo.telephone}
                                onChange={(e) => this.setState({ userInfo: {...this.state.userInfo, telephone: e.target.value }})} />
                            <label>Telephone</label>
                        </div>

                        <div className="p-fluid p-formgrid p-grid">
                            <div className="p-field p-col-12 p-md-8" >
                                <div className="p-float-label" style={{'marginTop': '30px'}}>
                                    <InputTextarea id="address" type="text" value={this.state.userInfo.address} autoResize 
                                        onChange={(e) => this.setState({ userInfo: {...this.state.userInfo, address: e.target.value }})} />
                                    <label>Address</label>
                                </div>
                            </div>
                            <div className="p-field p-col-12 p-md-4" >
                                
                                <ScrollPanel style={{'width': '100%', 'height': '150px', 'marginTop': '25px'}}>
                                    <ListBox optionLabel="region_name" value={this.state.selectedRegion}
                                    options={this.state.regions} 
                                    onChange={(e) => this.setState({selectedRegion: e.value, userInfo: {...this.state.userInfo, region_id: e.value.region_id }})} />
                                </ScrollPanel>
                            </div>
                        </div>
                       
                        <div style={{'marginTop': '30px'}}>
                            <Button label="Save Changes" onClick={() => this.saveChanges()} />
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