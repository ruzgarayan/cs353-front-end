import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import {connect} from 'react-redux';
import axios from "axios";
import { ProgressSpinner } from 'primereact/progressspinner';

import React from 'react';


class CustomerProfile extends React.Component
{
    state = {
        loading: true,
        userData: null
    };

    componentDidMount()
    {
        axios.get("https://60376f1f54350400177225f6.mockapi.io/cs353/user").then((result) => {
            this.setState({userData: result.data[0], loading: false});
        }).catch((error) => {
            console.log(error);
            //TODO
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
            return (
                <div> This is {this.state.userData.name}'s profile. 
                </div>
            );
        }
    }
}

const mapStateToProps = state => {  
    console.log(state);
    return {
        loginInfo: state.loginInfo
    };
};
export default connect(mapStateToProps)(CustomerProfile);