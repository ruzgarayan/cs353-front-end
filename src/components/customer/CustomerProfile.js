import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import { connect } from 'react-redux';
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
import ImageUploader from 'react-images-upload';
import firebase from "./../../firebase/firebase"
import FileUploader from "react-firebase-file-uploader";

import React from 'react';


class CustomerProfile extends React.Component {
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
            image: "",
        },

        coupons: null,
        imageProgress: 0,
        imageLoading: false,
        regions: [],

        selectedRegion: null
    };

    //TODO there is a problem when this.setState({ regions: result.data.data }); doesnt work before trying to change selectedRegion.
    //Separate into fetchRegions(), fetchUserData(), ... 
    async fetchData() {
        let success = true;
        let userId = this.props.loginInfo.userId;
        this.setState({ loading: true });

        //Get regions
        await axios.get("/region/allRegions").then((result) => {
            if (!result.data.success) {
                success = false;
            }
            else {
                this.setState({ regions: result.data.data });
            }
        }).catch((error) => {
            toast.error("Error while getting the region data.");
            success = false;
        });

        //Get user info
        await axios.get("/customer/customerData/id=" + userId).then((result) => {
            if (!result.data.success) {
                success = false;
            }
            else {
                const newUserInfo = result.data.data;
                console.log(newUserInfo);
                console.log(this.state);
                this.setState({ userInfo: newUserInfo });
                for (let i = 0; i < this.state.regions.length; i++) {

                    if (this.state.regions[i].regionId === newUserInfo.region_id) {
                        this.setState({ selectedRegion: this.state.regions[i] });
                        break;
                    }
                }
            }
        }).catch((error) => {
            toast.error("Error while getting the user data.");
            success = false;
        });


        //Get coupons
        await axios.get("/raffle/coupons/id=" + userId).then((result) => {
            console.log(result);
            if (!result.data.success) {
                success = false;
            }
            else {
                this.setState({ coupons: result.data.data });
            }
        }).catch((error) => {
            toast.error("Error while getting the coupons' data.");
            success = false;
        });


        this.setState({ loading: false });
    }

    componentDidMount() {
        this.fetchData();
    }

    itemTemplate(data) {
        return (
            <div >
                <Card title={data.couponId} style={{ 'borderStyle': 'dashed' }}>
                    <div >{data.discountAmount}$ discount in {data.restaurantName}</div>
                </Card>
            </div>
        );
    }

    async saveChanges() {
        let userId = this.props.loginInfo.userId;
        console.log(this.state.userInfo);
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
        if (this.state.loading) {
            return (
                <ProgressSpinner />
            );
        }
        else {
            console.log(this.state);
            const renderUploadProgress = () => {
                if (this.state.imageLoading)
                    return (<div> Uploading the image, progress {this.state.imageProgress}%</div>)
            }
            return (

                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-3" >
                        <ScrollPanel style={{ 'width': '100%', 'height': '500px' }}>
                            <DataScroller value={this.state.coupons} itemTemplate={this.itemTemplate}
                                rows={1000} buffer={0.4} header="Coupons" />
                        </ScrollPanel>
                    </div>

                    <div className="p-field p-col-12 p-md-6" style={{ 'borderStyle': 'solid' }}>

                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="username" type="text" value={this.state.userInfo.username}
                                onChange={(e) => this.setState({ userInfo: { ...this.state.userInfo, username: e.target.value } })} />
                            <label>Username</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="password" type="password" value={this.state.password}
                                onChange={(e) => this.setState({ userInfo: { ...this.state.userInfo, password: e.target.value } })} />
                            <label>Password</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="name" type="text" value={this.state.userInfo.name}
                                onChange={(e) => this.setState({ userInfo: { ...this.state.userInfo, name: e.target.value } })} />
                            <label>Name</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="surname" type="text" value={this.state.userInfo.surname}
                                onChange={(e) => this.setState({ userInfo: { ...this.state.userInfo, surname: e.target.value } })} />
                            <label>Surname</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="email" type="text" value={this.state.userInfo.email}
                                onChange={(e) => this.setState({ userInfo: { ...this.state.userInfo, email: e.target.value } })} />
                            <label>Email</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="telephone" type="text" value={this.state.userInfo.telephone}
                                onChange={(e) => this.setState({ userInfo: { ...this.state.userInfo, telephone: e.target.value } })} />
                            <label>Telephone</label>
                        </div>

                        <div className="p-fluid p-formgrid p-grid">
                            <div className="p-field p-col-12 p-md-8" >
                                <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                                    <InputTextarea id="address" type="text" value={this.state.userInfo.address} autoResize
                                        onChange={(e) => this.setState({ userInfo: { ...this.state.userInfo, address: e.target.value } })} />
                                    <label>Address</label>
                                </div>
                            </div>
                            <div className="p-field p-col-12 p-md-4" >

                                <ScrollPanel style={{ 'width': '100%', 'height': '150px', 'marginTop': '25px' }}>
                                    <ListBox optionLabel="regionName" value={this.state.selectedRegion}
                                        options={this.state.regions}
                                        onChange={(e) => this.setState({ selectedRegion: e.value, userInfo: { ...this.state.userInfo, region_id: e.value.regionId } })} />
                                </ScrollPanel>
                            </div>
                        </div>

                        <div style={{ 'marginTop': '30px' }}>
                            <Button label="Save Changes" onClick={() => this.saveChanges()} />
                        </div>

                        <br />
                    </div>
                    <div className="p-field p-col-12 p-md-3" >
                        <img src={this.state.userInfo.image} alt="" style={{ 'width': '100%' }} 
                        onError={(e)=>{e.target.onerror = null; e.target.src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}}/>
                        <FileUploader
                            accept="image/*"
                            name="avatar"
                            randomizeFilename
                            storageRef={firebase.storage().ref("images")}
                            onUploadStart={(progress) => { this.setState({ imageLoading: true, imageProgress: 0 }) }}
                            onUploadError={(error) => { this.setState({ imageLoading: false, imageProgress: 0 }); toast.error("Error during the image upload.") }}
                            onUploadSuccess={(filename) => {
                                firebase
                                    .storage()
                                    .ref("images")
                                    .child(filename)
                                    .getDownloadURL()
                                    .then(url => {
                                        this.setState({ imageLoading: false, userInfo: {...this.state.userInfo, image:url} });
                                        toast.success("Image successfully uploaded. Use the Save Changes button for changing your profile picture.");
                                    });

                            }}
                            onProgress={(progress) => { this.setState({ imageProgress: progress }); }}
                        />

                        {
                            renderUploadProgress()
                        }
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