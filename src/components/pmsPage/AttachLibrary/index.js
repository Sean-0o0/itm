import React, { Component } from 'react'
import TopConsole from './TopConsole'
import InfoTable from './InfoTable'

class AttachLibrary extends Component {
    state = {}
    render() {
        const { tableData=[], tableLoading=false} = this.state
        return (<div className="attach-library-box">
            <TopConsole/>
            <InfoTable tableData={tableData} tableLoading={tableLoading} />
        </div>);
    }
}

export default AttachLibrary;