
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

class OrderReviewDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenOrder: null,
            reviewData: null,
            loading: true,
            fetching: false,
            restaurantScore: 0,
            courierScore: 0,
            comment: "",
            makeComment: false
        };
    }

    componentDidUpdate(prevProps) {
        if (this.state.fetching) {
            return;
        }

        if (!prevProps.visible && this.props.visible) {
            this.fetchReviewData();
        }
    }

    async fetchReviewData() {
        this.setState({ loading: true, fetching: true });

        await axios.get("/review/getReview/order_id=" + this.props.chosenOrder.orderId).then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else
                this.setState({ reviewData: result.data.data });
        }).catch((error) => {
            toast.error("Error while getting the review data.");
        });

        this.setState({ loading: false, fetching: false });
    }

    changeComment(comment) {
        if (comment.length > 128) {
            toast.error("Review comment cannot exceed 128 characters");
        }
        else {
            this.setState({ comment: comment });
        }
    }

    submitReview() {
        if (this.state.restaurantScore === 0 || this.state.courierScore === 0) {
            toast.warning("You need to select scores for both the restaurant and the courier.");
            return;
        }
        if (this.state.makeComment && this.state.comment.length < 20) {
            toast.warning("Your comment must be at least 20 characters long.");
            return;
        }

        const comment = this.state.makeComment ? this.state.comment : "";
        const reviewData = {
            restaurantScore: this.state.restaurantScore,
            courierScore: this.state.courierScore,
            comment: comment,
            order_id: this.props.chosenOrder.orderId
        };


        axios.post("/review/makeReview/order_id=" + this.props.chosenOrder.orderId, reviewData).then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else {
                toast.success(result.data.message);
                this.props.hideDialog();
            }
        }).catch((error) => {
            toast.error("Error while connecting to the server.");
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

            const renderCommentInput = () => {
                if (this.state.makeComment) {
                    return (
                        <InputTextarea value={this.state.comment} onChange={(e) => { this.changeComment(e.target.value) }} rows={5} cols={30} />
                    );
                }
                else {
                    return (
                        <div></div>
                    );
                }
            }

            return (
                <div>
                    <Dialog
                        header="Make a Review"
                        visible={visible}
                        style={{ width: '50vw', height: '100' }}
                        modal={true}
                        onHide={() => this.props.hideDialog()}
                    >
                        <div className="card">
                            <b>Restaurant Score:</b>
                            <Rating value={this.state.restaurantScore} cancel={false} onChange={(e) => this.setState({ restaurantScore: e.value })} ></Rating>
                            <b>Courier Score:</b>
                            <Rating value={this.state.courierScore} cancel={false} onChange={(e) => this.setState({ courierScore: e.value })} ></Rating>
                            <div style={{ 'marginTop': '20px', 'marginBottom': '20px', 'fontSize': '25px' }}> Make a comment:
                                <InputSwitch style={{ 'marginLeft': '20px' }} checked={this.state.makeComment} onChange={(e) => this.setState({ makeComment: e.value })} />
                            </div>

                            {renderCommentInput()}

                            <div><Button label="Submit Review" onClick={() => { this.submitReview() }} /></div>
                        </div>
                    </Dialog>
                </div>
            );
        } else {

            const data = this.state.reviewData;
            const orderTime = new Date(data.date).toUTCString();
            const timeFromNow = moment(orderTime).fromNow();

            const renderResponsePart = () => {
                if (data.response === null || data.response === "")
                    return <div></div>;
                else
                    return (
                        <div>
                            <Divider align="center" >
                                <b>Response from Restaurant Owner:</b>
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
                        header="Your Review"
                        visible={visible}
                        style={{ width: '50vw', height: '100' }}
                        modal={true}
                        onHide={() => this.props.hideDialog()}
                    >

                        <div className="p-col-12">
                            <Fieldset legend={legend()}>

                                <div className="p-col-12">
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

const itemTemplate = (data) => {
    const orderTime = new Date(data.date).toUTCString();
    const timeFromNow = moment(orderTime).fromNow();

    const renderResponsePart = () => {
        if (data.response === null || data.response === "")
            return <div></div>;
        else
            return (
                <div>
                    <Divider align="center" >
                        <b>Response from Restaurant Owner:</b>
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
        <div className="p-col-12">
            <Fieldset legend={legend()}>

                <div className="p-col-12">
                    {data.comment}
                </div>
                {responsePart}
            </Fieldset>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        cartInfo: state.cartInfo
    };
};
OrderReviewDialog = withRouter(connect(mapStateToProps)(OrderReviewDialog));
export default OrderReviewDialog;