import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import axios from "axios";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import React from 'react';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import './styles/restaurantViewStyle.css';
import 'primeflex/primeflex.css';
import { toast } from 'react-toastify';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';
import MenuItemDialog from './MenuItemDialog';
import { TabView, TabPanel } from 'primereact/tabview';
import moment from 'moment';
import { Divider } from 'primereact/divider';
import { Fieldset } from 'primereact/fieldset';

class RestaurantView extends React.Component {
    state = {
        restaurantId: this.props.match.params.id,
        loading: true,
        layout: 'grid',
        restaurant_info: {},
        category_menus: [],
        displayDialog: false,
        chosenMenuItem: null,
        reviews: [],
        raffleData: null,
    }

    async fetchData() {
        const userId = this.props.loginInfo.userId;
        let restaurantId = this.state.restaurantId;
        this.setState({ loading: true });

        //Get restaurant info
        await axios.get("/customer/restaurantInfo/id=" + restaurantId).then((result) => {
            console.log(result);
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else
                this.setState({ restaurant_info: result.data.data });
        }).catch((error) => {
            toast.error("Error while getting the restaurant info.");
        });

        //Get restaurant menu
        await axios.get("/customer/restaurantMenuByCategory/id=" + restaurantId).then((result) => {
            console.log(result);
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else
                this.setState({ category_menus: result.data.data });
        }).catch((error) => {
            toast.error("Error while getting the restaurant menu.");
        });

        //Get reviews
        await axios.get("/review/getReviews/restaurant_id=" + restaurantId).then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else
                this.setState({ reviews: result.data.data });
        }).catch((error) => {
            toast.error("Error while getting the reviews.");
        });

        //Get raffle data
        await axios.get("/raffle/getRaffle/restaurant_id=" + restaurantId).then((result) => {
            if (!result.data.success) {
                toast.error(result.data.message);
            }
            else {
                let raffleData = result.data.data;
                if (raffleData !== null) {

                    axios.get("/raffle/getEntryAmount/restaurant_id=" + restaurantId + "/customer_id=" + userId).then((result) => {
                        if (!result.data.success) {
                            toast.error(result.data.message);
                        }
                        else {
                            raffleData.entryAmount = result.data.data;
                            this.setState({ raffleData: raffleData });
                        }
                    }).catch((error) => {
                        toast.error("Error while getting the raffle data.");
                    });
                }
            }
        }).catch((error) => {
            toast.error("Error while getting the raffle data.");
        });

        this.setState({ loading: false });
    }

    componentDidMount() {
        this.fetchData();
    }

    showMenuItemDialog(chosenMenuItem) {
        this.setState({ chosenMenuItem: chosenMenuItem, displayDialog: true });
    }

    renderCategoryMenus() {
        const renderListItem = (data) => {
            return (
                <div className="p-col-12">
                    <div className="product-list-item">
                        <img src={data.imageLink} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                        <div className="product-list-detail">
                            <div className="product-name">{data.name}</div>
                            <div className="product-description">{data.description}</div>
                        </div>
                        <div className="product-list-action">
                            <span className="product-price">${data.basePrice}</span>
                            <Button icon="pi pi-shopping-cart" label="Add to Cart" onClick={() => this.showMenuItemDialog(data)}></Button>
                        </div>
                    </div>
                </div>
            );
        }

        const renderGridItem = (data) => {
            return (
                <div className="p-col-12 p-md-4">
                    <div className="product-grid-item card">
                        <div className="product-grid-item-top">
                        </div>
                        <div className="product-grid-item-content">
                            <img src={data.imageLink} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                            <div className="product-name">{data.name}</div>
                            <div className="product-description">{data.description}</div>
                        </div>
                        <div className="product-grid-item-bottom">
                            <span className="product-price">${data.basePrice}</span>
                            <Button icon="pi pi-shopping-cart" label="Add to Cart" onClick={() => this.showMenuItemDialog(data)}></Button>
                        </div>
                    </div>
                </div>
            );
        }

        const itemTemplate = (menuItem, layout) => {
            if (!menuItem) {
                return;
            }

            if (layout === 'list')
                return renderListItem(menuItem);
            else if (layout === 'grid')
                return renderGridItem(menuItem);
        }

        return (
            <div>
                { this.state.category_menus.map((menu, index) => (
                    <div className="dataview-demo" key={index}>
                        <div className="card">
                            <DataView value={menu.categoryMenuItems} layout={this.state.layout} header={menu.category}
                                itemTemplate={itemTemplate} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    renderReviewPanel() {

        if (this.state.reviews === null || this.state.reviews.length === 0) {
            return (
                <div> There are no reviews available for this restaurant.</div>
            );
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

        return (
            <div className="card">
                <DataView value={this.state.reviews} layout="list" itemTemplate={itemTemplate} paginator rows={5}></DataView>
            </div>
        );
    }

    renderRaffleInformation() {
        const raffleData = this.state.raffleData;
        if (raffleData === null) {
            return (
                <Fieldset legend="Ongoing Lottaery">
                    <div>Currently there is no lotteary for this restaurant.</div>
                </Fieldset>
            );
        }
        const startingDate = new Date(raffleData.startingDate).toUTCString();
        const startingDateFromNow = moment(startingDate).fromNow();
        const endingDate = new Date(raffleData.endingDate).toUTCString();
        const endingDateFromNow = moment(endingDate).fromNow();

        return (
            <Fieldset legend="Ongoing Lottaery">
                <div>Started: {startingDateFromNow}</div>
                <div>Ending: {endingDateFromNow}</div>
                <div>Prize: {raffleData.couponPrize}$</div>
                <div>Gain 1 entry for every {raffleData.minEntryPrice}$</div>
                <div>Your entries: {raffleData.entryAmount}</div>
            </Fieldset>
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <ProgressSpinner />
            );
        }
        else {

            const renderHeader = () => {
                return (
                    <div className="p-grid p-nogutter">
                        <DataViewLayoutOptions layout={this.state.layout} onChange={(e) => this.setState({ layout: e.value })} />
                    </div>
                );
            }
            const header = renderHeader();

            let restaurant_info = this.state.restaurant_info;
            return (
                <div>
                    <br /> <br />
                    <Panel header={restaurant_info.restaurant_name} >
                        <div className="p-fluid p-formgrid p-grid" >
                            <div className="p-field p-col-12 p-md-2" >
                                <img src={`https://sampiyon-kokorec.developerkitchen.com/img/default-1.jpg`} alt="" style={{ 'width': '100%' }} />
                            </div>
                            <div className="p-field p-col-12 p-md-1" ></div>
                            <div className="p-field p-col-12 p-md-6" >
                                <i className="pi pi-tag restaurant-category-icon"></i><span >{restaurant_info.restaurant_category}</span>
                                <p> {restaurant_info.description}</p>
                            </div>
                            <div className="p-field p-col-12 p-md-1" ></div>
                            <div className="p-field p-col-12 p-md-2" style={{ 'justifyContent': 'center', 'display': 'flex', 'alignItems': 'center' }}>
                                <div className="p-field p-col-12" >
                                    <Rating value={restaurant_info.rating} readOnly cancel={false} style={{ 'marginBottom': '20px' }}></Rating>
                                    <div className="p-field p-col-12">
                                        {this.renderRaffleInformation()}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Panel>
                    <TabView>
                        <TabPanel header="Restaurant Menu">
                            <Panel header={header}> {this.renderCategoryMenus()} </Panel>
                        </TabPanel>
                        <TabPanel header="Reviews">
                            <Panel> {this.renderReviewPanel()} </Panel>
                        </TabPanel>
                    </TabView>
                    <MenuItemDialog chosenMenuItem={this.state.chosenMenuItem} visible={this.state.displayDialog} hideDialog={() => this.setState({ displayDialog: false })} />
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
RestaurantView = withRouter(connect(mapStateToProps)(RestaurantView))
export default RestaurantView;