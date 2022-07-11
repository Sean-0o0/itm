import React, { Component } from 'react';
import { Divider, Tooltip } from 'antd';
import ModuleChart from '../../ClearingPlace/ModuleChart';
import TextChart from '../../ClearingPlace/ModuleChart/TextChart';
import EventReport from '../../ClearingPlace/EventReport';
import NoTitleStyleModuleChart from '../../ClearingPlace/ModuleChart/NoTitleStyleModuleChart';
import CustomerModuleChart from '../../ClearingPlace/ModuleChart/CustomerModuleChart';
import EquityModuleChart from '../../ClearingPlace/ModuleChart/EquityModuleChart'
export default class BottomBlockV2 extends Component {

  render() {
    const { dispatch, moduleCharts = [], indexConfig = [], errOrImpRpt = [], FutursTrdRiskControl } = this.props;
    let chartConfig = [];
    if (moduleCharts.length) {
      chartConfig = moduleCharts[4];
    }
    return (
      <div className='flex-r flex1 pd10'>
        <div className='ax-card wid100 flex-c'>
          {/*<div className='pos-l'>*/}
            <div className='card-title title-c'>数据监控
              {chartConfig.length && chartConfig[0].chartNote ?
                (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                  <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                </Tooltip>) : ''
              }
            </div>
          {/*</div>*/}
          <div className='flex-r flex1'>
            <div className='wid25'>
              <CustomerModuleChart
                records={moduleCharts[4]}
                indexConfig={indexConfig}
                tClass='title-c-nomage'
                dispatch={dispatch}
              />
            </div>
            <Divider type="vertical" className="h90" style={{background:'rgba(14, 38, 118, 0.2)',boxShadow: '0 0 1rem rgba(0,172,255,0.2) inset'}}/>
            <div className='wid25'>
              <EquityModuleChart
                records={moduleCharts[5]}
                indexConfig={indexConfig}
                tClass='title-c-nomage'
                dispatch={dispatch}
              />
            </div>
            <Divider type="vertical" className="h81" style={{top:'20px',background:'rgba(14, 38, 118, 0.2)',boxShadow: '0 0 1rem rgba(0,172,255,0.2) inset'}}/>
            <div className='wid25'>
              <NoTitleStyleModuleChart
                records={moduleCharts[7]}
                indexConfig={indexConfig}
                tClass='title-c-nomage'
                dispatch={dispatch}
              />
            </div>
            <Divider type="vertical" className="h90" style={{background:'rgba(14, 38, 118, 0.2)',boxShadow: '0 0 1rem rgba(0,172,255,0.2) inset'}}/>
            <div className='wid25'>
              <NoTitleStyleModuleChart
                records={moduleCharts[9]}
                indexConfig={indexConfig}
                tClass='title-c-nomage'
                dispatch={dispatch}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
