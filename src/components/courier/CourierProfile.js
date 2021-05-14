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
import { InputNumber } from 'primereact/inputnumber';
import { ListBox } from 'primereact/listbox';
import { toast } from 'react-toastify';
import firebase from "../../firebase/firebase"
import FileUploader from "react-firebase-file-uploader";
import { PickList } from 'primereact/picklist';

import React from 'react';


class CourierProfile extends React.Component {
    state = {
        loading: true,

        courierInfo: {
            username: "",
            password: "",
            name: "",
            surname: "",
            telephone: "",
            email: "",
            userType: "",
            image: "",
        },


        imageProgress: 0,
        imageLoading: false,
        operatedRegions: [],
        otherRegions: [],
    };

    async fetchData() {
        let success = true;
        let userId = this.props.loginInfo.userId;
        this.setState({ loading: true });
        let regions = [];

        //Get regions
        await axios.get("/region/allRegions").then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
                success = false;
            }
            else {
                regions = result.data.data;
            }
        }).catch((error) => {
            toast.error("Error while getting the region data.");
            success = false;
        });

        //Get all courier info
        await axios.get("/courier/courierData/courier_id=" + userId).then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
                success = false;
            }
            else {
                console.log(result.data.data);
                const operatedRegions = result.data.data.operateRegions;
                for (var i = 0; i < operatedRegions.length; i++) {
                    for (var j = 0; j < regions.length; j++) {
                        if (regions[j].regionId === operatedRegions[i].regionId)
                            operatedRegions[i].regionName = regions[j].regionName;
                    }
                }

                let otherRegions = [];
                for (var i = 0; i < regions.length; i++) {
                    let flag = true;
                    for (var j = 0; j < operatedRegions.length; j++) {
                        if (regions[i].regionId === operatedRegions[j].regionId)
                            flag = false
                    }
                    let newOtherRegion = {
                        regionId: regions[i].regionId,
                        regionName: regions[i].regionName,
                        fee: 2.5
                    };
                    if (flag)
                        otherRegions = [...otherRegions, newOtherRegion];
                }
                console.log(otherRegions);
                this.setState({ courierInfo: result.data.data.courier, operatedRegions: operatedRegions, otherRegions: otherRegions });
            }
        }).catch((error) => {
            toast.error("Error while getting the user data.");
            success = false;
        });

        //If success, stop loading screen
        if (success)
            this.setState({ loading: false });
        else {
            toast.error("An error occured, retrying...");
            this.fetchData();
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    itemTemplate = (data) => {
        console.log(data);
        const id = data.regionId;
        let operatedIndex = -1;
        let otherIndex = -1;
        for (var i = 0; i < this.state.operatedRegions.length; i++) {
            if (id === this.state.operatedRegions[i].regionId) {
                operatedIndex = i;
                break;
            }
        }
        for (var i = 0; i < this.state.otherRegions.length; i++) {
            if (id === this.state.otherRegions[i].regionId) {
                otherIndex = i;
                break;
            }
        }

        return (
            <Card >
                <div className="p-grid">
                    <div className="p-col-12 p-md-5" style={{ 'verticalAlign': 'middle' }}>
                        {data.regionName} </div><div className="p-col-12 p-md-7"><InputNumber id="horizontal" value={data.fee}
                            onValueChange={(e) => {
                                if (operatedIndex === -1) {
                                    let otherRegions = this.state.otherRegions;
                                    otherRegions[otherIndex].fee = e.value;
                                    this.setState({ otherRegions: otherRegions });
                                }
                                else {
                                    let operatedRegions = this.state.operatedRegions;
                                    operatedRegions[operatedIndex].fee = e.value;
                                    this.setState({ operatedRegions: operatedRegions });
                                }
                            }}
                            mode="decimal" min={0.5} max={5} mode="currency" currency="USD" locale="en-US" />
                    </div></div>
            </Card>
        );
    }

    onChange = async (event) => {
        let userId = this.props.loginInfo.userId;
        const newOperatedRegions = event.target;
        const newOtherRegions = event.source;
        console.log(newOperatedRegions);
        this.setState({ operatedRegions: newOperatedRegions, otherRegions: newOtherRegions });

    }

    async saveChanges() {
        const userId = this.props.loginInfo.userId;
        console.log(userId);
        await axios.post("/courier/courierData/courier_id=" + userId, this.state.courierInfo).then((result) => {
            if (result.data.success)
                toast.success(result.data.message);
            else
                toast.error(result.data.message);
        }).catch((error) => {
            toast.error("Error while connecting");
        });

        axios.post("/courier/updateRegions/courier_id=" + userId, this.state.operatedRegions).then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error while connecting");
        });
    }

    render() {
        console.log(this.state);
        if (this.state.loading) {
            return (
                <ProgressSpinner />
            );
        }
        else {
            const renderUploadProgress = () => {
                if (this.state.imageLoading)
                    return (<div> Uploading the image, progress {this.state.imageProgress}%</div>)
            }
            return (

                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-5" >

                        <div>
                            <PickList source={this.state.otherRegions} target={this.state.operatedRegions} itemTemplate={this.itemTemplate}
                                sourceHeader="Others" targetHeader="Operated Regions"
                                sourceStyle={{ height: '342px' }} targetStyle={{ height: '342px' }}
                                onChange={this.onChange}
                                showSourceControls={false}
                                showTargetControls={false}
                            >
                            </PickList>
                        </div>


                    </div>

                    <div className="p-field p-col-12 p-md-4" >

                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="username" type="text" value={this.state.courierInfo.username}
                                onChange={(e) => this.setState({ courierInfo: { ...this.state.courierInfo, username: e.target.value } })} />
                            <label>Username</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="password" type="password" value={this.state.password}
                                onChange={(e) => this.setState({ courierInfo: { ...this.state.courierInfo, password: e.target.value } })} />
                            <label>Password</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="name" type="text" value={this.state.courierInfo.name}
                                onChange={(e) => this.setState({ courierInfo: { ...this.state.courierInfo, name: e.target.value } })} />
                            <label>Name</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="surname" type="text" value={this.state.courierInfo.surname}
                                onChange={(e) => this.setState({ courierInfo: { ...this.state.courierInfo, surname: e.target.value } })} />
                            <label>Surname</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="email" type="text" value={this.state.courierInfo.email}
                                onChange={(e) => this.setState({ courierInfo: { ...this.state.courierInfo, email: e.target.value } })} />
                            <label>Email</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="telephone" type="text" value={this.state.courierInfo.telephone}
                                onChange={(e) => this.setState({ courierInfo: { ...this.state.courierInfo, telephone: e.target.value } })} />
                            <label>Telephone</label>
                        </div>

                        <div style={{ 'marginTop': '30px' }}>
                            <Button label="Save Changes" onClick={() => this.saveChanges()} />
                        </div>

                        <br />
                    </div>
                    <div className="p-field p-col-12 p-md-3" >
                        <img src={this.state.courierInfo.image} alt="" style={{ 'width': '100%' }}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg" }} />
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
                                        this.setState({ imageLoading: false, courierInfo: { ...this.state.courierInfo, image: url } });
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
export default connect(mapStateToProps)(CourierProfile);