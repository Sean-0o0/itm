import React, { Component } from 'react'
import TopConsole from './TopConsole'
import Overview from './Overview'
import InfoTable from './InfoTable'
import { message } from 'antd'

class DepartmentOverview extends Component {
    state = {  } 
    render() { 
        const { routes } = this.props
        return (<div className="department-staff-box cont-box">
        <TopConsole routes={routes}/>
        <div className="overview-box">
            <Overview order={1}/>
            <Overview order={2}/>
        </div>
        <InfoTable/>
    </div>);
    }
}
 
export default DepartmentOverview;