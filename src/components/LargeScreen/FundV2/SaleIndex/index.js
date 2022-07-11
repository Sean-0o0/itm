import React, { Component } from 'react';
import { Tooltip } from 'antd';
import IndexItem from './IndexItem';
import { Scrollbars } from 'react-custom-scrollbars';

export class SaleIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { chartConfig = [], dataList = [] } = this.props;
    return (
      <div className='h100 pd10 wid67'>
        <div className='ax-card flex-c'>
            <div className='pos-r'>
              <div
                className='card-title title-l'>{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                {chartConfig.length && chartConfig[0].chartNote ?
                  (<Tooltip placement='top' title={<div>{chartConfig[0].chartNote.split('\n').map((item, index) => {
                    return <span key={index}>{item}<br /></span>;
                  })}</div>}>
                    <img className='title-tip' src={[require('../../../../image/icon_tip.png')]} alt='' />
                  </Tooltip>) : '直销系统指标监控'
                }
              </div>
            </div>
            {dataList.length === 0 ?
              (<React.Fragment>
                <div className="evrt-bg evrt-bgimg"></div>
                <div className="tc blue" style={{fontSize:'1.633rem'}}>暂无数据</div>
              </React.Fragment>) :
            (<Scrollbars
              autoHide
              style={{ width: '100%' }}>
              <div style={{ padding: '1rem 1rem 1rem 3rem' }}>
                <div className='in-side-sub' style={{ height: '100%'}}>
                  {/* <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{dataList[0]?dataList[0].SUBGROUP:''}</div> */}
                  <div className='flex1' >
                    {dataList.map(i => (
                      <IndexItem key={i} itemData={i} />))}
                  </div>
                </div>
              </div>
            </Scrollbars>)}
        </div>
      </div>

    );
  }
}

export default SaleIndex;
