
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import axios from "axios";
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { toast } from "react-toastify";
import store from './../../reducers/index.js'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import firebase from "../../firebase/firebase"
import FileUploader from "react-firebase-file-uploader";

class AddMenuItemDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            imageLink: "",
            description: "",
            basePrice: 0,
            foodCategory: "",

            imageProgress: 0,
            imageLoading: false,
        };
    }

    resetData() {
        this.setState({
            name: "",
            imageLink: "",
            description: "",
            basePrice: 0,
            foodCategory: "",

            imageProgress: 0,
            imageLoading: false
        });
    }

    addMenuItem() {
        const restaurantId = this.props.loginInfo.restaurantId;
        const newMenuItem = {
            restaurantId: restaurantId,
            menuItemId: 0,
            name: this.state.name,
            imageLink: this.state.imageLink,
            description: this.state.description,
            basePrice: this.state.basePrice,
            foodCategory: this.state.foodCategory
        }
        console.log(newMenuItem);
        axios.post("/restaurant/addMenuItem/restaurant_id=" + restaurantId, newMenuItem).then((result) => {
            console.log(result);
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else{
                this.resetData();
                this.props.hideDialog();
                this.props.fetchData();
            }
        }).catch((error) => {
            toast.error("Error while getting the restaurant menu.");
        });
    }

    render() {
        let visible = this.props.visible;

        const renderUploadProgress = () => {
            if (this.state.imageLoading)
                return (<div> Uploading the image, progress {this.state.imageProgress}%</div>)
        }

        return (
            <div>
                <Dialog
                    header="Add a New Menu Item"
                    visible={visible}
                    style={{ width: '50vw', height: '100' }}
                    modal={true}
                    onHide={() => this.props.hideDialog()}
                >
                    <div className="card">
                        <div className="p-field p-col-12" >

                            <div style={{ 'marginTop': '30px' }}>
                                <img src={this.state.imageLink} alt="" style={{ 'width': '30%' }}
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
                                                this.setState({ imageLoading: false, imageLink: url });
                                                toast.success("Image successfully uploaded. Use the Save Changes button for changing your profile picture.");
                                            });

                                    }}
                                    onProgress={(progress) => { this.setState({ imageProgress: progress }); }}
                                />

                                {
                                    renderUploadProgress()
                                }
                            </div>

                            <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                                <InputText id="name" type="text" value={this.state.name}
                                    onChange={(e) => this.setState({ name: e.target.value })} />
                                <label>Name</label>
                            </div>

                            <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                                <InputText id="foodCategory" type="text" value={this.state.foodCategory}
                                    onChange={(e) => this.setState({ foodCategory: e.target.value })} />
                                <label>Category</label>
                            </div>


                            <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                                <InputTextarea cols={30} id="description" type="text" value={this.state.description} autoResize
                                    onChange={(e) => this.setState({ description: e.target.value })} />
                                <label>Description</label>
                            </div>

                            <div className="p-float-label" style={{ 'marginTop': '30px' }}>
                                <InputNumber cols={30} mode="currency" currency="USD" locale="en-US" value={this.state.basePrice}
                                    onChange={(e) => this.setState({ basePrice: e.value })} />
                                <label>Base Price</label>
                            </div>

                            <div style={{ 'marginTop': '30px' }}>
                                <Button label="Confirm and Add" onClick={() => {this.addMenuItem()}} />
                            </div>

                            <br />
                        </div>
                    </div>
                </Dialog>
            </div>
        );

    }
}

const mapStateToProps = state => {
    return {
        loginInfo: state.loginInfo
    };
};
AddMenuItemDialog = withRouter(connect(mapStateToProps)(AddMenuItemDialog));
export default AddMenuItemDialog;