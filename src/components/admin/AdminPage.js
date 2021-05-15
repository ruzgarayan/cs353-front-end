import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import React from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/components/column/Column';


class AdminPage extends React.Component {
    state = {
        tableData: null
    }

    renderReportTable() {
        if (this.state.tableData === null)
            return (<div>Choose a report first.</div>);
        else {
            const columnNames = this.state.tableData.columnNames;
            const rows = this.state.tableData.rows;
            const numRows = rows.length;
            const numCols = columnNames.length;

            let formattedRows = [];

            for (var i = 0; i < numRows; i++) {
                let newRow = {};
                for (var j = 0; j < numCols; j++) {
                    newRow[columnNames[j]] = rows[i][j];
                }
                formattedRows = [...formattedRows, newRow];
            }


            return (<div>
                <DataTable value={formattedRows}>
                    {
                        columnNames.map((column, index) => (
                            <Column  field={column} header={column}>
                            </Column>
                        )
                        )
                    }
                </DataTable>
            </div>);
        }
    }

    generateReport(reportName) {
        axios.get("/admin/" + reportName + "Report").then((result) => {
            if (result.data.success) {
                toast.success(result.data.message);
                console.log(result);
                this.setState({ tableData: result.data.data });
            } else {
                toast.error(result.data.message);
            }
        }).catch((error) => {
            toast.error("Error during the connection.");
        });
    }

    render() {
        return (
            <div>
                <Button label="Generate report 1" onClick={() => this.generateReport("paymentMethod")} /> <Button label="Generate report 2" />

                <div style={{ 'marginTop': '100px' }}>
                    {this.renderReportTable()}
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        loginInfo: state.loginInfo
    };
};
AdminPage = withRouter(connect(mapStateToProps)(AdminPage))
export default AdminPage;