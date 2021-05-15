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
import firebase from "../../firebase/firebase"
import FileUploader from "react-firebase-file-uploader";
import { PickList } from 'primereact/picklist';

import React from 'react';
import { Fieldset } from 'primereact/fieldset';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import moment from 'moment';


class RestaurantProfile extends React.Component {

    state = {
        loading: true,

        ownerInfo: {
            username: "",
            password: "",
            name: "",
            surname: "",
            telephone: "",
            email: "",
            userType: "",
            image: "",
        },

        restaurantInfo: {
            address: "",
            description: "",
            category: "",
            name: "",
            image: null,
        },

        imageProgress: 0,
        imageLoading: false,
        servedRegions: [],
        otherRegions: [],
        raffleData: null,

        endingTime: new Date(),
        entryFee: 10,
        prize: 50,
    };

    async fetchData() {
        let success = true;
        let userId = this.props.loginInfo.userId;
        let restaurantId = this.props.loginInfo.restaurantId;
        this.setState({ loading: true });
        let regions = [];

        //Get regions
        await axios.get("/region/allRegions").then((result) => {
            if (!result.data.success) {
                success = false;
            }
            else {
                regions = result.data.data;
            }
        }).catch((error) => {
            toast.error("Error while getting the region data.");
            success = false;
        });

        await axios.get("/raffle/getUnfinishedRaffle/restaurant_id=" + restaurantId).then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else {
                this.setState({ raffleData: result.data.data });
            }
        }).catch((error) => {
            toast.error("Error while getting the raffle data.");
        });

        //Get all restaurant info
        await axios.get("/restaurant/restaurantData/restaurant_id=" + restaurantId).then((result) => {
            if (!result.data.success) {
                success = false;
            }
            else {
                console.log(result);
                const restaurantInfo = {
                    address: result.data.data.address,
                    description: result.data.data.description,
                    category: result.data.data.restaurantCategory,
                    name: result.data.data.restaurantName,
                    image: result.data.data.image,
                };
                const servedRegions = result.data.data.servedRegions;

                let otherRegions = [];
                for (var i = 0; i < regions.length; i++) {
                    let flag = true;
                    for (var j = 0; j < servedRegions.length; j++) {
                        if (regions[i].regionId === servedRegions[j].regionId)
                            flag = false
                    }

                    if (flag)
                        otherRegions = [...otherRegions, regions[i]];
                }
                console.log(otherRegions);

                this.setState({ ownerInfo: result.data.data.ownerData, restaurantInfo: restaurantInfo, servedRegions: servedRegions, otherRegions: otherRegions });
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
        return (
            <div >
                {data.regionName}
            </div>
        );
    }

    onChange = async (event) => {
        const oldServedRegions = this.state.servedRegions;
        const newServedRegions = event.target;
        const restaurantId = this.props.loginInfo.restaurantId;

        console.log(oldServedRegions);
        console.log(newServedRegions);

        var i, j, flag;
        for (i = 0; i < oldServedRegions.length; i++) {
            flag = false;
            for (j = 0; j < newServedRegions.length; j++) {
                if (oldServedRegions[i] === newServedRegions[j]) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                console.log("restaurant/removeRegion/restaurant_id=" + restaurantId + "/region_id=" + oldServedRegions[i].regionId);
                await axios.post("restaurant/removeRegion/restaurant_id=" + restaurantId + "/region_id=" + oldServedRegions[i].regionId).then((result) => {
                    if (result.data.success) {
                        toast.success("Successfully removed " + oldServedRegions[i].regionName + " from the served regions.");
                    } else {
                        toast.error(result.data.message);
                    }
                }).catch((error) => {
                    toast.error("Error while connecting");
                });
            }
        }

        for (i = 0; i < newServedRegions.length; i++) {
            flag = false;
            for (j = 0; j < oldServedRegions.length; j++) {
                if (oldServedRegions[i] === newServedRegions[j]) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                await axios.post("restaurant/addRegion/restaurant_id=" + restaurantId + "/region_id=" + newServedRegions[i].regionId).then((result) => {
                    if (result.data.success) {
                        toast.success("Successfully added " + newServedRegions[i].regionName + " to the served regions.");
                    } else {
                        toast.error(result.data.message);
                    }
                }).catch((error) => {
                    toast.error("Error while connecting");
                });
            }
        }

        this.setState({ servedRegions: newServedRegions, otherRegions: event.source });

    }

    async saveChanges() {
        const userId = this.props.loginInfo.userId;
        const restaurantId = this.props.loginInfo.restaurantId;

        const restaurantOwnerData = {
            userId: userId,
            name: this.state.ownerInfo.name,
            surname: this.state.ownerInfo.surname,
            email: this.state.ownerInfo.email,
            telephone: this.state.ownerInfo.telephone,
            image: this.state.ownerInfo.image,
            username: this.state.ownerInfo.username,
            password: this.state.ownerInfo.password,
        };

        const updatedRestaurantData = {
            restaurantOwnerData: restaurantOwnerData,
            restaurantName: this.state.restaurantInfo.name,
            address: this.state.restaurantInfo.address,
            description: this.state.restaurantInfo.description,
            restaurantCategory: this.state.restaurantInfo.category,
            image: this.state.restaurantInfo.image
        }

        console.log(updatedRestaurantData);

        axios.post("/restaurant/restaurantData/restaurant_id=" + restaurantId, updatedRestaurantData).then((result) => {
            if (result.data.success)
                toast.success(result.data.message);
            else
                toast.error(result.data.message);

            this.fetchData();
        }).catch((error) => {
            toast.error("Error while connecting");
        });
    }

    renderRaffleTab() {
        const raffleData = this.state.raffleData;
        const restaurantId = this.props.loginInfo.restaurantId;
        const minDate = new Date();
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        if (raffleData === null) {
            return (

                <Fieldset legend="New Raffle" style={{ 'marginTop': '50px' }}>
                    <div className="p-fluid p-formgrid p-grid">
                        <h2>Start a new Raffle</h2>
                        <div className="p-field p-col-12 " >
                            <div className="p-float-label" style={{ 'marginTop': '30px' }}>

                                <Calendar value={this.state.endingTime} minDate={minDate} maxDate={maxDate} showTime onChange={(e) => this.setState({ endingTime: e.value })} />
                                <label>Ending Time</label>
                            </div>

                            <div className="p-float-label" style={{ 'marginTop': '30px' }}>

                                <InputNumber mode="decimal" value={this.state.entryFee} min={1} max={100} mode="currency" currency="USD" locale="en-US"
                                    onValueChange={(e) => { this.setState({ entryFee: e.value }) }} />
                                <label>Minimum Entry Fee</label>
                            </div>

                            <div className="p-float-label" style={{ 'marginTop': '30px' }}>

                                <InputNumber mode="decimal" value={this.state.prize} min={1} max={100} mode="currency" currency="USD" locale="en-US"
                                    onValueChange={(e) => { this.setState({ prize: e.value }) }} />
                                <label>Prize</label>
                            </div>

                            <Button label="Start" style={{ 'marginTop': '30px' }} onClick={
                                () => {
                                    const now = new Date();
                                    const newRaffle = {
                                        restaurantId: restaurantId,
                                        startingDate: now,
                                        endingDate: this.state.endingTime,
                                        minEntryPrice: this.state.entryFee,
                                        couponPrize: this.state.prize,
                                    }

                                    axios.post("/raffle/newRaffle/restaurant_id=" + restaurantId, newRaffle).then((result) => {
                                        if (!result.data.success) {
                                            toast.error(result.data.message);
                                        }
                                        else {
                                            toast.success(result.data.message);
                                            this.fetchData();
                                        }
                                    }).catch((error) => {
                                        toast.error("Error while submitting the new raffle data.");
                                    });
                                }
                            } />
                        </div>
                    </div>
                </Fieldset>
            );
        } else {
            const now = new Date();
            const endingTime = new Date(raffleData.endingDate);
            const endingTimeFromNow = moment(raffleData.endingDate).fromNow();
            const startingTimeFromNow = moment(raffleData.startingDate).fromNow();

            const finished = now.getTime() > endingTime.getTime();
            const renderButton = () => {
                if (finished)
                    return (
                        <div>
                            <Button label="Poll the Winner" onClick={() => {
                                axios.post("/raffle/finishRaffle/restaurant_id=" + restaurantId + "/raffle_id=" + raffleData.raffleId).then((result) => {
                                    if (!result.data.success) {
                                        toast.error(result.data.message);
                                    }
                                    else {
                                        toast.success(result.data.message);
                                        const message = "Winner of the raffle is the customer " + result.data.data + ".";
                                        toast.success(message);
                                        this.fetchData();
                                    }
                                }).catch((error) => {
                                    toast.error("Error while submitting the new raffle data.");
                                });
                            }} />
                        </div>
                    );
                else {
                    return (
                        <div>
                            You can poll the winner when the raffle ends.
                        </div>
                    );
                }
            }

            return (

                <Fieldset legend="Current Raffle" style={{ 'marginTop': '50px' }}>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12 " >
                            <div className="p-float-label" style={{ 'marginTop': '10px' }}>
                            </div>
                            <b>Starting time</b> is {startingTimeFromNow}
                            <div className="p-float-label" style={{ 'marginTop': '10px' }}>
                                <b>Ending time</b> is {endingTimeFromNow}
                            </div>

                            <div className="p-float-label" style={{ 'marginTop': '10px' }}>
                                <b>Minimum Entry Fee</b> is {raffleData.minEntryPrice}$
                            </div>

                            <div className="p-float-label" style={{ 'marginTop': '10px' }}>
                                <b>Prize</b> is {raffleData.couponPrize}$
                            </div>

                            <div className="p-float-label" style={{ 'marginTop': '10px' }}>
                                {renderButton()}
                            </div>
                        </div>
                    </div>
                </Fieldset>
            );
        }
    }

    render() {
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
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="restauırantName" type="text" value={this.state.restaurantInfo.name}
                                onChange={(e) => this.setState({ restaurantInfo: { ...this.state.restaurantInfo, name: e.target.value } })} />
                            <label>Restaurant Name</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="restaurantCategory" type="text" value={this.state.restaurantInfo.category}
                                onChange={(e) => this.setState({ restaurantInfo: { ...this.state.restaurantInfo, category: e.target.value } })} />
                            <label>Restaurant Category</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="restaurantDescription" type="text" value={this.state.restaurantInfo.description}
                                onChange={(e) => this.setState({ restaurantInfo: { ...this.state.restaurantInfo, description: e.target.value } })} />
                            <label>Restaurant Description</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="restaurantAddress" type="text" value={this.state.restaurantInfo.address}
                                onChange={(e) => this.setState({ restaurantInfo: { ...this.state.restaurantInfo, address: e.target.value } })} />
                            <label>Restaurant Address</label>
                        </div>

                        <div>
                            <PickList source={this.state.otherRegions} target={this.state.servedRegions} itemTemplate={this.itemTemplate}
                                sourceHeader="Others" targetHeader="Served Regions"
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
                            <InputText id="username" type="text" value={this.state.ownerInfo.username}
                                onChange={(e) => this.setState({ ownerInfo: { ...this.state.ownerInfo, username: e.target.value } })} />
                            <label>Username</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="password" type="password" value={this.state.password}
                                onChange={(e) => this.setState({ ownerInfo: { ...this.state.ownerInfo, password: e.target.value } })} />
                            <label>Password</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="name" type="text" value={this.state.ownerInfo.name}
                                onChange={(e) => this.setState({ ownerInfo: { ...this.state.ownerInfo, name: e.target.value } })} />
                            <label>Name</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="surname" type="text" value={this.state.ownerInfo.surname}
                                onChange={(e) => this.setState({ ownerInfo: { ...this.state.ownerInfo, surname: e.target.value } })} />
                            <label>Surname</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="email" type="text" value={this.state.ownerInfo.email}
                                onChange={(e) => this.setState({ ownerInfo: { ...this.state.ownerInfo, email: e.target.value } })} />
                            <label>Email</label>
                        </div>
                        <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                            <InputText id="telephone" type="text" value={this.state.ownerInfo.telephone}
                                onChange={(e) => this.setState({ ownerInfo: { ...this.state.ownerInfo, telephone: e.target.value } })} />
                            <label>Telephone</label>
                        </div>

                        <div style={{ 'marginTop': '30px' }}>
                            <Button label="Save Changes" onClick={() => this.saveChanges()} />
                        </div>

                        <br />
                    </div>
                    <div className="p-field p-col-12 p-md-3" >
                        <img src={this.state.restaurantInfo.image} alt="" style={{ 'width': '100%' }}
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
                                        this.setState({ imageLoading: false, restaurantInfo: { ...this.state.restaurantInfo, image: url } });
                                        toast.success("Image successfully uploaded. Use the Save Changes button for changing your profile picture.");
                                    });

                            }}
                            onProgress={(progress) => { this.setState({ imageProgress: progress }); }}
                        />

                        {
                            renderUploadProgress()
                        }
                        {
                            this.renderRaffleTab()
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
export default connect(mapStateToProps)(RestaurantProfile);