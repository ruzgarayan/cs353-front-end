
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import axios from "axios";
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SelectButton } from 'primereact/selectbutton';
import { toast } from "react-toastify";
import store from './../../reducers/index.js'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { InputTextarea } from 'primereact/inputtextarea';
import { Fieldset } from 'primereact/fieldset';
import { Divider } from 'primereact/divider';
import { InputSwitch } from 'primereact/inputswitch';
import moment from 'moment';
import OrderReviewDialog from "../customer/OrderReviewDialog";

class RestaurantCommentDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            chosenOrder: null,
            reviewData: null,
            loading: true,
            fetching: false,
            response: null
        };
    }

    async fetchReviewData() {
        this.setState({ loading: true, fetching: true , response: null});

        await axios.get("/review/getReview/order_id=" + this.props.chosenOrder.orderId).then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
            } else
                this.setState({ reviewData: result.data.data });
        }).catch((error) => {
            toast.error("Error while getting the review data.");
        });

        this.setState({ loading: false, fetching: false });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.visible && this.props.visible) {
            this.fetchReviewData();
        }
    }
    
    changeResponse(response) {
        if (response.length > 128) {
            toast.error("Review response cannot exceed 128 characters");
        }
        else {
            this.setState({ response: response });
        }
    }

    makeResponse() {
        if (this.state.response === null ||this.state.response.length < 20)
        {
            toast.warning("Your comment must be at least 20 characters long.");
            return;
        }

        const response = {
            response: this.state.response
        }

        axios.post("/review/makeResponse/review_id=" + this.state.reviewData.reviewId, response).then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
            } else {
                toast.success(result.data.message);
                this.props.hideDialog();
            }
        }).catch((error) => {
            toast.error("Error while getting the review data.");
        });
    }

    render() {
        let reviewData = this.state.reviewData;
        let visible = this.props.visible;

        if (this.state.loading) {
            return (
                <Dialog
                    header="Loading..."
                    visible={visible}
                    style={{ width: '50vw' }}
                    modal={true}
                    onHide={() => this.props.hideDialog()}
                ><ProgressSpinner></ProgressSpinner>
                </Dialog>
            );
        }
        else if (reviewData === null) {
            return (
                <div>
                    <Dialog
                        header="No Review"
                        visible={visible}
                        style={{ width: '50vw', height: '100' }}
                        modal={true}
                        onHide={() => this.props.hideDialog()}
                    >
                        <div className="card">
                            The customer {this.props.chosenOrder.customerNameSurname} has not reviewed this order yet.
                        </div>
                    </Dialog>
                </div>
            );
        } else {

            const data = this.state.reviewData;
            const reviewTime = new Date(data.date).toUTCString();
            const timeFromNow = moment(reviewTime).fromNow();

            const renderResponsePart = () => {
                if (data.response === null || data.response === "")
                    return (
                        <div className="p-col-12" style={{'textAlign': 'center'}}>
                            <Divider align="center" >
                                <b>Write a response:</b>
                            </Divider>
                            <div className="p-col-12" style={{'textAlign': 'center'}}>
                                <InputTextarea value={this.state.response} onChange={(e) => { this.changeResponse(e.target.value) }} rows={5} cols={30} />
                            </div>
                            <div className="p-col-12" style={{'textAlign': 'center'}}> 
                                <Button label="Publish Response" onClick={()=>{this.makeResponse()}}/>
                            </div>
                        </div>
                    );
                else
                    return (
                        <div>
                            <Divider align="center" >
                                <b>Your response:</b>
                            </Divider>
                            <div className="p-col-12">
                                {data.response}
                            </div>
                        </div>
                    );
            }
            const responsePart = renderResponsePart();
            const legend = () => {
                return <div><Rating value={data.restaurantScore} readOnly cancel={false} style={{ 'marginBottom': '20px' }} ></Rating> {timeFromNow}</div>;
            }

            return (
                <div>
                    <Dialog
                        header="Review of the Order"
                        visible={visible}
                        style={{ width: '50vw', height: '100' }}
                        modal={true}
                        onHide={() => this.props.hideDialog()}
                    >

                        <div className="p-col-12">
                            <Fieldset legend={legend()}>

                                <div className="p-col-12" style={{'textAlign': 'center'}}>
                                    {data.comment}
                                </div>
                                {responsePart}
                            </Fieldset>
                        </div>

                    </Dialog>
                </div>
            );
        }

    }
}


export default RestaurantCommentDialog;