import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import './customerStyle.css'


class CustomerProfile extends React.Component
{
    render() {
        return (
            <div> This is my profile.
            {/*
            <div>
                <br/>
    
                <div className="p-fluid">
                    <div className="p-field">
                        <span className="p-float-label">
                            <InputText type="text" value={this.state.eventName} onChange={(e) => this.setState({eventName: e.target.value})}/>
                            <label>Etkinlik İsmi</label>
                        </span>
                    </div>
                </div>
    
                <br/>
    
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-6">
                        <span className="p-float-label">
                            <Calendar value={this.state.startingDate} onChange={(e) => this.setState({startingDate: e.value})} />
                            <label>Başlangıç Tarihi</label>
                        </span>
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <span className="p-float-label">
                            <Calendar value={this.state.endingDate} onChange={(e) => this.setState({endingDate: e.value})} />
                            <label>Bitiş Tarihi</label>
                        </span>
                    </div>
                </div>
    
                <br/>
    
                <div className="p-fluid p-formgrid p-grid">
                    <div className="p-field p-col-12 p-md-4">
                        <span className="p-float-label">
                            <InputText type="text" keyfilter="pint" value={this.state.totalQuota} onChange={(e) => this.setState({totalQuota: e.target.value})} />
                            <label >Kontenjan</label>
                        </span>
                    </div>
                </div>
            </div>    
            */}
             </div>
        );
    }
}

export default CustomerProfile;