import React, { Component } from 'react';
import WealthDetail from "../../../../../components/WorkPlatForm/PlanningPage/BusinessAnalysis/WealthDetail";
import { DecryptBase64 } from "../../../../../components/Common/Encrypt";

class WealthManagement extends Component {
    render() {
        const { match: { params }, location: { state } } = this.props
        const param = params.params
        //let titleArr = [], series = []
        // if (state) {
        //     titleArr = state.titleArr
        //     series = state.series
        // }
        return (
            <div className='ba-body' style={{ margin: '.8rem', minHeight: 'calc(100% - 5rem' }}>
                <div span={24} className='bg_whith mgb1'>
                    <WealthDetail
                        brokerArray={DecryptBase64(param.substring(0, param.indexOf('&&')))}
                        classId={+DecryptBase64(param.substring(param.indexOf('&&') + 2, param.lastIndexOf('&&')))}
                        series={JSON.parse(DecryptBase64(param.substring(param.lastIndexOf('&&') + 2, param.indexOf('||'))))}
                        titleArr={DecryptBase64(param.substring(param.indexOf('||') + 2), param.lastIndexOf('||') + 2)}
                        title={DecryptBase64(param.substring(param.lastIndexOf('||') + 2))}
                    />
                </div>
            </div>
        );
    }

}

export default WealthManagement;