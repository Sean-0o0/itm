import React from 'react';
import {Button, Input, Select, Row, Col} from 'antd';
import {connect} from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';

const {Option} = Select;

class ProgressStatus extends React.Component {
  state = {};

  render() {

    const {state} = this.props;

    return (
      <div>
        {
          state === "4" && <div className='head-title' style={{
            background: 'rgba(215, 14, 25, 0.1)',
            color: 'rgba(215, 14, 25, 1)',
            // width: '10rem'
          }}>
            <div className='head-cont' style={{background: 'rgba(215, 14, 25, 1)'}}/>
            <div style={{margin: '0.5rem 1rem'}}>逾期</div>
          </div>
        }
        {
          state === "3" && <div className='head-title' style={{
            background: 'rgba(245, 247, 250, 1)',
            color: 'rgba(48, 49, 51, 1)',
            // width: '12rem'
          }}>
            <div className='head-cont' style={{background: 'rgba(48, 49, 51, 1)'}}/>
            <div style={{margin: '0.5rem 1rem'}}>已完成</div>
          </div>
        }
        {
          state === "2" && <div className='head-title' style={{
            background: 'rgba(51, 97, 255, 0.1)',
            color: 'rgba(51, 97, 255, 1)',
            // width: '12rem'
          }}>
            <div className='head-cont' style={{background: 'rgba(51, 97, 255, 1)'}}/>
            <div style={{margin: '0.5rem 1rem'}}>进行中</div>
          </div>
        }
        {
          state === "正常" && <div className='head-title' style={{
            background: 'rgba(51, 97, 255, 0.1)',
            color: 'rgba(51, 97, 255, 1)',
            // width: '10rem'
          }}>
            <div className='head-cont' style={{background: 'rgba(51, 97, 255, 1)'}}/>
            <div style={{margin: '0.5rem 1rem'}}>正常</div>
          </div>
        }
        {
          state === "1" && <div className='head-title' style={{
            background: 'rgba(245, 247, 250, 1)',
            color: 'rgba(144, 147, 153, 1)',
            // width: '12rem'
          }}>
            <div className='head-cont' style={{background: 'rgba(144, 147, 153, 1)'}}/>
            <div style={{margin: '0.5rem 1rem'}}>未开始</div>
          </div>
        }
      </div>
    );
  }
}

export default connect(({global = {}}) => ({
  authorities: global.authorities,
}))(ProgressStatus);
