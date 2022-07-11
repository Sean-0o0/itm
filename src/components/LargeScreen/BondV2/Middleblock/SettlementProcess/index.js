import React from 'react';
import { Progress} from 'antd'


class SettlementOverview extends React.Component {

  wordColor = (percent) =>{
    if(percent === 100){
      return '#00ACFF '
    }else if(percent === 0){
      return '#AAAAAA';
    }else{
      return '#F7B432';
    }
  }

  processColor = (percent) =>{
    if(percent === 100){
      return {'0%':'#157EF4','100%':'#00D8FF'};
    }else{
      return {'0%':'#F7B432','100%':'#FFE401'};
    }
  }


  render() {
    const { jsjdData = [] } = this.props;
    const zdPercent = jsjdData[0] && jsjdData[0].COMPLETE !== '0' && jsjdData[0].TOTAL !== '0'?Number.parseInt(Number.parseInt(jsjdData[0].COMPLETE)/Number.parseInt(jsjdData[0].TOTAL)*100):0;
    const zjPercent = jsjdData[1] && jsjdData[1].COMPLETE !== '0' && jsjdData[1].TOTAL !== '0'?Number.parseInt(Number.parseInt(jsjdData[1].COMPLETE)/Number.parseInt(jsjdData[1].TOTAL)*100):0;
    const sqsPercent = jsjdData[3] && jsjdData[3].COMPLETE !== '0' && jsjdData[3].TOTAL !== '0'?Number.parseInt(Number.parseInt(jsjdData[3].COMPLETE)/Number.parseInt(jsjdData[3].TOTAL)*100):0;
    const jejs = jsjdData[2]?jsjdData[2].VALUE.split("|"):['/','0'];
    return (
      <div className='h100 pd10 bg_jsjd'>
        <div className='flex-r '>
          <div className='flex-r pos-zdz'>
            <div className='flex-c bg-style-r'>
              <div className='fwb data-font tr' style={{
                fontSize: '1.633rem',
                padding: '2rem 0rem 1.5rem 0',
              }}>{jsjdData[0]?jsjdData[0].NAME:"-"}
              </div>
              <div className='flex-r tr blue1'>
                <div className='flex-c flex1'>
                  <div>
                    <span style={{ fontSize: '1.334rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    结算进度
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.633rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                      {jsjdData[0]?jsjdData[0].COMPLETE:"0"}/{jsjdData[0]?jsjdData[0].TOTAL:"0"} 
                    </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '600', verticalAlign: '-10%' }}>笔</span>
                  </div>
                </div>
                <div className='flex-c flex1'>
                  <div>
                    <span style={{ fontSize: '1.334rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    结算金额
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.633rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    {jsjdData[0]?jsjdData[0].VALUE:"0"}
                    </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '600', verticalAlign: '-10%' }}>亿元</span>
                  </div>
                </div>
              </div>
            </div>
            {/*中债登*/}
            <div style={{paddingTop:"1.25rem"}}>
              <Progress type="circle" percent={zdPercent} 
                format={() => <div
                  style={{ color: this.wordColor(zdPercent), fontWeight: 'bold' }}> {zdPercent}%
              </div>}
              strokeColor={this.processColor(zdPercent)}/>
            </div>
          </div>

          <div className='flex-r pos-zjhb'>
            <div className='flex-c bg-style-r'>
              <div className='fwb data-font tr' style={{
                fontSize: '1.633rem',
                padding: '2rem 0rem 1.5rem 0',
              }}>{jsjdData[1]?jsjdData[1].NAME:"-"}</div>
              <div className='tr flex-r blue1'>
              <div className='flex-c flex1'>
                  <div>
                    <span style={{ fontSize: '1.334rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    结算进度
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.633rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                      {jsjdData[1]?jsjdData[1].COMPLETE:"0"}/{jsjdData[1]?jsjdData[1].TOTAL:"0"} 
                    </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '600', verticalAlign: '-10%' }}>笔</span>
                  </div>
                </div>
                <div className='flex-c flex1'>
                  <div>
                    <span style={{ fontSize: '1.334rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    结算金额
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.633rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    {jsjdData[1]?jsjdData[1].VALUE:"0"}
                    </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '600', verticalAlign: '-10%' }}>亿元</span>
                  </div>
                </div>
              </div>
            </div>
            {/*资金划拨*/}
            <div style={{paddingTop:"1.25rem"}}>
              <Progress type="circle" percent={zjPercent}  
                format={() => <div
                  style={{ color: this.wordColor(zjPercent), fontWeight: 'bold' }}> {zjPercent}%
              </div>}
              strokeColor={this.processColor(zjPercent)}/>
            </div>
          </div>

          <div className='flex-r pos-sqs'>
            {/*上清所*/}
            <div style={{paddingTop:"1.25rem"}}>
              <Progress type="circle" percent={sqsPercent} 
                format={() => <div
                  style={{ color:  this.wordColor(sqsPercent), fontWeight: 'bold' }}> {sqsPercent}%
              </div>}
              strokeColor={this.processColor(sqsPercent)}/>
            </div>
            <div className='flex-c bg-style-l'>
              <div className='fwb data-font tl' style={{
                fontSize: '1.633rem',
                padding: '2rem 0 1.5rem 0rem',
              }}>{jsjdData[3]?jsjdData[3].NAME:"-"}
              </div>
              <div className='blue1 flex-r'>
                <div className='flex-c flex1'>
                  <div>
                    <span style={{ fontSize: '1.334rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    结算进度
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.633rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    {jsjdData[3]?jsjdData[3].COMPLETE:"0"}/{jsjdData[3]?jsjdData[3].TOTAL:"0"} 
                    </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '600', verticalAlign: '-10%' }}>笔</span>
                  </div>
                </div>
                <div className='flex-c flex1'>
                  <div>
                    <span style={{ fontSize: '1.334rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    结算金额
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '1.633rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    {jsjdData[3]?jsjdData[3].VALUE:"0"} 
                    </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '600', verticalAlign: '-10%' }}>亿元</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex-r pos-jzyw'>
            {/*净值业务*/}
            <div style={{paddingTop:"1.25rem"}}>
              <Progress type="circle" percent={jejs[1]} 
                format={() => <div
                  style={{ color: this.wordColor(jejs[1]), fontWeight: 'bold' }}> {jejs[1]}%
              </div>}
              strokeColor={this.processColor(jejs[1])}/>
            </div>
            <div className='flex-c bg-style-l'>
              <div className='fwb data-font tl' style={{
                fontSize: '1.633rem',
                padding: '2rem 0 1.5rem 0rem',
              }}>{jsjdData[2]?jsjdData[2].NAME:"-"}
              </div>
              <div className='blue1 flex-r'>
                <div className='flex-c flex1'>
                  <div>
                    <span style={{ fontSize: '1.334rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                    净额交收业务
                    </span>
                  </div>
                  <div>
                    <span style={{ color:jejs[0]==='已结算'?"#00ACFF":"#F7B432", fontSize: '1.633rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                      {jejs[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='pos-pro'>
            <div style={{ padding: '5rem 0 0 5.6rem' }}>
              <div className='por-circle'>
                <span
                  style={{ padding: '0rem 4.57rem 0rem 4.57rem', fontSize: '2.464rem', color: '#C6E2FF' }}>结算进度</span>
              </div>
            </div>
            {/*<div className='por-circle'/>*/}
            {/*<div className='fwb data-font' style={{ fontSize: '2.564rem', color:'#C6E2FF' }}>交收总览</div>*/}
          </div>
        </div>
      </div>
    );
  }
}

export default SettlementOverview;
