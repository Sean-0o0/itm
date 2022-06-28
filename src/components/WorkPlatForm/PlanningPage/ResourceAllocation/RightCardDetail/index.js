import React from 'react';
import { connect } from 'dva';
import { Card, Progress } from 'antd';
import RightEchartData from '../RightEchartData';

class RightCardDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;
    return data !== undefined && (!Array.prototype.isPrototypeOf(data) && data.length !== 0) ?
      (
        <div className='right-card'>
          <Card className='right-card1' bodyStyle={{ padding: '1rem' }} style={{ height: '55%' }}>
            <div className='condition1'>
              <div className='data'><span className='key'>资源类别</span>{data.resClassName===""?'--':data.resClassName}</div>
              <div className='data' style={{ paddingLeft: '10rem' }}><span className='key'>年份</span>{data.yr===""?'--':data.yr}</div>
            </div>
            <div className='condition2'>
              <div className='data'><span className='key'>组织机构</span>{data.orgName===""?'--':data.orgName}</div>
            </div>
            <div className='remark'>
              <div className='data'><span className='key'>备注</span>
                <div style={{
                  wordWrap: 'break-word',
                  wordBreak: 'break-all',
                  overflow: 'hidden',
                }}>{data?.remark.length > 40 ? data?.remark.slice(0, 40) + '...' : (data.remark===""?'--':data.remark)}</div>
              </div>
            </div>
          </Card>
          <div className='right-card2' style={{ height: '47%' }}>
              <RightEchartData echartData={data}></RightEchartData>
          </div>
        </div>

      ) : (<div className='right-card'>
        <Card className='right-card1' bodyStyle={{ padding: '1rem' }} style={{ height: '55%' }}>
          <div className='condition1'>
            <div className='data'><span className='key'>资源类别</span>{'--'}</div>
            <div className='data' style={{ paddingLeft: '10rem' }}><span className='key'>年份</span>{'--'}</div>
          </div>
          <div className='condition2'>
            <div className='data'><span className='key'>组织机构</span>{'--'}</div>
          </div>
          <div className='remark'>
            <div className='data'><span className='key'>备注</span>
              <div style={{
                wordWrap: 'break-word',
                wordBreak: 'break-all',
                overflow: 'hidden',
              }}>{'--'}</div>
            </div>
          </div>
        </Card>
        <div className='right-card2' style={{ height: '47%' }}>
            <RightEchartData echartData={data}></RightEchartData>
        </div>
      </div>);
  }
}

export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(RightCardDetail);
