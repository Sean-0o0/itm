import React from 'react';
import { Icon } from 'antd';
import RowItem from './RowItem';

class Instruction extends React.Component {

  render() {
    const { zdInstrtData = [] } = this.props;
    return (
      <div className='ax-card flex-c left-cont FundSettlement'>
        <div className='pos-r'>
          <div className='card-title title-l'>中登指令执行</div>
        </div>
        {zdInstrtData.length === 0 ?
          (<React.Fragment>
            <div className='evrt-bg evrt-bgimg'></div>
            <div className='tc blue' style={{ fontSize: '1.633rem' }}>暂无数据</div>
          </React.Fragment>) :
          (<div style={{ padding: '1.1rem 2rem 0 2rem', fontSize: '1.633rem', height: 'calc(100% - 3.66rem)' }}>
            <div className='flex-c h100'>
              <div className='flex-c h13'>
                <div className='bg_table table_style h100 flex-r fwb' style={{ padding: '0rem 2rem' }}>
                  <div className='flex1 '>中登指令</div>
                  <div className='tr' style={{ width: '10rem' }}>未处理</div>
                  <div className='tr' style={{ width: '10rem' }}>已处理</div>
                  <div className='tr' style={{ width: '10rem' }}>未发生</div>
                  {/* <div className='flex-r  table_font '>
                    中登指令
                  </div>
                  <div className='flex1 flex-r table_font '>
                    <div className='flex1 tr' style={{ paddingLeft: '8rem' }}>未处理</div>
                    <div className='flex1 tr'>已处理</div>
                    <div className='flex1 tr'>未发生</div>
                  </div> */}
                </div>
              </div>
              <div className='flex-c h84'>
                <div className='flex-c h100'>
                  {zdInstrtData.map((item, index) => (
                    <RowItem item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>)}
      </div>
    );
  }
}

export default Instruction;
