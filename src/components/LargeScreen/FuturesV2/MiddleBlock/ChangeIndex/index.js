import React, { Component } from 'react';
import NoTitleStyleModuleChart from '../../../ClearingPlace/ModuleChart/NoTitleStyleModuleChart';
import { Divider } from 'antd';

export class ChangeIndex extends Component {
    render() {
        const { moduleCharts = [], indexConfig = [], dispatch = [] } = this.props;
        return (
            <div className="flex-r flex1">
                <div className="wid50">
                    <NoTitleStyleModuleChart
                        records={moduleCharts[10]}
                        indexConfig={indexConfig}
                        tClass='title-c-nomage'
                        dispatch={dispatch} />
                </div>
                <Divider type="vertical" className="h90" style={{background:'rgba(14, 38, 118, 0.2)',boxShadow: '0 0 1rem rgba(0,172,255,0.2) inset'}}/>
                <div className="wid50">
                    <NoTitleStyleModuleChart
                        records={moduleCharts[11]}
                        indexConfig={indexConfig}
                        tClass='title-c-nomage'
                        dispatch={dispatch} />
                </div>
            </div>
        )
    }
}

export default ChangeIndex
