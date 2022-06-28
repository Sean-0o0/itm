import React, { Component } from 'react';
import { Row, Col, Card, Divider, Progress } from 'antd';


export class IncomeCard extends Component {
  static propTypes = {};

  render() {
    const { cardData } = this.props;
    const data = cardData.length > 0 ? cardData[0] : {};
    return (
      <div className='target' style={{ height: '100%', padding: '2rem' }}>
        <Card style={{ height: '100%', width: '100%' }}
              bodyStyle={{ width: '100%', height: '100%', padding: '0.35rem 1rem', marginBottom: 0 }} hoverable={true}>
          <div style={{padding:'0.5rem 0',display: 'inline-flex', whiteSpace: 'nowrap',flex:'1', height: '50%', width: '100%' }}>
            <div style={{textAlign:'left',display:'inline-block', width: '15%', fontSize:'1.43rem',fontWeight:500,lineHeight:'2rem',whiteSpace: 'normal',color:'#666666' }}>
              本月净利润<div style={{textAlign:'left',fontSize:'1.43rem',fontWeight:500,lineHeight:'2rem',whiteSpace: 'normal',color:'#666666' }}>{'/月均目标'}</div>
            </div>
            <div style={{ display: 'grid', width: '31%', height: '1.5rem' }}>
              <Progress format={0} strokeColor='linear-gradient(90deg, #5CBAF6 0%, #3796D2 100%)'
                        percent={data.INDI_VAL} showInfo={false} size='small'
                        style={{ height: '1.5rem', display: 'inline-block' }} />
              <span style={{ fontSize: '1.07rem',display:'flex'}}><span style={{textAlign:'left',width:'100%',color:'#999999'}}>0</span><span style={{textAlign:'right',color:'#999999' }}>期望:</span></span>
            </div>
            <div style={{ display: 'grid', width: '19%', textAlign: 'left',color:'#333333',fontSize:'1.43rem',fontWeight:500,lineHeight:'2.4rem' }}>
              &nbsp;&nbsp;{data.INDI_VAL}/{data.MONBREAK_GOAL}
            </div>
            <div style={{display:'inline-block',width:'35%',textAlign: 'left',fontSize:'1.07rem',fontWeight:400,lineHeight:'1.7rem'}}>
              {/*<div className="month-data" style={{ fontSize: '1.2rem' }} >{data.INDI_VAL}/{data.MONBREAK_GOAL}</div>*/}
              <span style={{ display:'inline-block'  }}>环比：<span>{data.GROWTH_MON}%&nbsp;&nbsp;</span></span>
              <span style={{ display:'inline-block'  }}>完成率：<span>{data.COMPRATE_MON}%&nbsp;&nbsp;</span></span>
              <span className='rank'>排名：
                <span>{data.MONRANK}&nbsp;</span>
                {/* 排名图标由MONRANK_CHANGE控制 */}
                {Number(data.MONRANK) > 0 && <div className='go-up-icon' />}
                {Number(data.MONRANK) < 0 && <div className='go-down-icon' />}
                {data.MONRANK !== '-' &&
                <span className={+data.MONRANK < 0 ? 'down-color-green' : 'up-color-red'}>{data.MONRANK_CHANGE}</span>}
              </span>
            </div>
          </div>
          <Divider style={{ margin: '0' }}></Divider>
          <div style={{padding:'0.5rem 0', display: 'inline-flex', whiteSpace: 'nowrap',flex:'1', height: '50%', width: '100%' }}>
            <div style={{textAlign:'left',display:'inline-block', width: '15%',fontSize:'1.43rem',fontWeight:500,lineHeight:'2rem',whiteSpace: 'normal',color:'#666666' }}>
              本年净利润<div style={{textAlign:'left',fontSize:'1.43rem',fontWeight:500,lineHeight:'2rem',whiteSpace: 'normal',color:'#666666' }}>{'/年度目标'}</div>
            </div>
            <div style={{ display: 'grid', width: '31%', height: '1.5rem' }}>
              <Progress format={0} strokeColor='linear-gradient(90deg, #F7C739 0%, #FEC622 100%)'
                        percent={data.TOTL_VAL} showInfo={false} size='small'
                        style={{ height: '1.5rem', display: 'inline-block' }} />
              <span style={{ fontSize: '1.07rem',display:'flex'}}><span style={{textAlign:'left',width:'100%',color:'#999999'}}>0</span><span style={{textAlign:'right',color:'#999999' }}>期望:</span></span>
            </div>
            <div style={{ display: 'grid', width: '19%', textAlign: 'left',color:'#333333',fontSize:'1.43rem',fontWeight:500,lineHeight:'2.4rem' }}>
              &nbsp;&nbsp;{data.TOTL_VAL}/{data.BREAK_GOAL}
            </div>
            <div style={{display:'inline-block',width:'35%',textAlign: 'left',fontSize:'1.07rem',fontWeight:400,lineHeight:'1.7rem'}}>
              {/*<div className="month-data" style={{ fontSize: '1.2rem' }} >{data.INDI_VAL}/{data.MONBREAK_GOAL}</div>*/}
              <span style={{ display:'inline-block'  }}>环比：<span>{data.GROWTH_YEAR}%&nbsp;&nbsp;</span></span>
              <span style={{ display:'inline-block'  }}>完成率：<span>{data.COMPRATE_YEAR}%&nbsp;&nbsp;</span></span>
              <span className='rank'>排名：
                <span>{data.YEARRANK}&nbsp;</span>
                {/* 排名图标由MONRANK_CHANGE控制 */}
                {Number(data.MONRANK) > 0 && <div className='go-up-icon' />}
                {Number(data.MONRANK) < 0 && <div className='go-down-icon' />}
                {data.MONRANK !== '-' &&
                <span className={+data.MONRANK < 0 ? 'down-color-green' : 'up-color-red'}>{data.MONRANK_CHANGE}</span>}
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default IncomeCard;
