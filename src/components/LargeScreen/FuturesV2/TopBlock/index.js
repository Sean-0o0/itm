import React, { Component } from 'react';
import ClearingBusiness from './ClearingBusiness';
import MiddleBlock from '../MiddleBlock';
import ChangeIndex from '../MiddleBlock/ChangeIndex';
import NoTitleStyleModuleChart from '../../ClearingPlace/ModuleChart/NoTitleStyleModuleChart';
import { Divider, Tooltip } from 'antd';

export default class TopBlock extends Component {
  render() {
    const {
      moduleCharts = [],
      indexConfig = [],
      dispatch = [],
      FutursClearingbusiness = [],
      FutursRegulatorySub = [],
      FutursPermissionsetting = [],
      FutursFundsettlement = [],
    } = this.props;
    let chartConfig = [];
    if (moduleCharts.length) {
      chartConfig = moduleCharts[6];
    }
    return (
      <div className='flex1 wid100 flex-r h100'>
        <div className='wid50 flex-c flex1'>
          <div className='h67 pd10'>
            {/*清算业务*/}
            <ClearingBusiness chartConfig={moduleCharts[0]} dispatch={dispatch}
                              futursClearingbusiness={FutursClearingbusiness} moduleCharts={moduleCharts}
                              indexConfig={indexConfig} />
          </div>
          <div className='flex1 h33 pd10 flex-r'>
            <div className='ax-card wid100 flex-c'>
              <div className='pos-l'>
                <div className='card-title title-l'>账户业务办理
                  {chartConfig.length && chartConfig[0].chartNote ?
                    (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                      <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                    </Tooltip>) : ''
                  }
                </div>
              </div>
              <div className='flex-r flex1'>
                <div className='wid50'>
                  {/*业务数量分布*/}
                  <NoTitleStyleModuleChart
                    records={moduleCharts[8]}
                    indexConfig={indexConfig}
                    tClass='title-c-nomage'
                    dispatch={dispatch}
                  />
                </div>
                <Divider type="vertical" className="h90" style={{background:'rgba(14, 38, 118, 0.2)',boxShadow: '0 0 1rem rgba(0,172,255,0.2) inset'}}/>
                <div className='wid50 pl20'>
                  {/*新开客户数*/}
                  <NoTitleStyleModuleChart
                    records={moduleCharts[6]}
                    indexConfig={indexConfig}
                    tClass='title-c-nomage'
                    dispatch={dispatch}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='wid50 flex-c flex1'>
          <div className='h67'>
            <MiddleBlock dispatch={dispatch} moduleCharts={moduleCharts} indexConfig={indexConfig}
                         FutursFundsettlement={FutursFundsettlement} FutursRegulatorySub ={FutursRegulatorySub} FutursPermissionsetting={FutursPermissionsetting}/>
            {/*账户业务*/}
            {/*<AccountBusiness chartConfig={moduleCharts[4]} dispatch={dispatch} moduleCharts={moduleCharts} indexConfig={indexConfig} />*/}
          </div>
          <div className='flex1 h33 flex-c pd10'>
            <div className="ax-card flex-c h100">
              <div className="pos-r">
                <div className="card-title title-r">交易交割业务
                  {chartConfig.length && chartConfig[0].chartNote ?
                    (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                      <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                    </Tooltip>) : ''
                  }
                </div>
              </div>
              <ChangeIndex
                moduleCharts={moduleCharts}
                indexConfig={indexConfig}
                dispatch={dispatch}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
