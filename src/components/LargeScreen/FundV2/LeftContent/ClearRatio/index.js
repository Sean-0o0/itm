import React, { Component } from 'react';
import ModuleChart from '../../../ClearingPlace/ModuleChart';

export class ClearRatio extends Component {
    render() {
        const { dispatch, moduleCharts = [], indexConfig = [] } = this.props;
        return (
            <div className="pd10 h40">
                {<ModuleChart
                    records={moduleCharts}
                    indexConfig={indexConfig}
                    tClass='title-l'
                    dispatch={dispatch}
                />}
            </div>
        )
    }
}

export default ClearRatio
