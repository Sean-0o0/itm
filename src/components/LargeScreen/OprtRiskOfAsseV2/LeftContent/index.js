import React, { Component } from 'react';
import { Tooltip } from 'antd';

export class LeftContent extends Component {

  state = {
    serviceCheck: [],
  };

  render() {
    const { data = [], chartConfig = [] } = this.props;

    let firstNorPercent = 0;
    let firstExePercent = 0;
    let firstHandPercent = 0;
    let firstOutPercent = 0;
    //进行第一个指标监控的进度条百分比计算，如果有多种任务，按比例缩小，空出空隙
    if (data[0]) {
      let first = -1;
      let total = 0;
      if (data[0].NORMALTASKS !== '0') {
        first = first + 1;
      }
      if (data[0].EXEPTTASKS !== '0') {
        first = first + 1;
      }
      if (data[0].HANDTASKS !== '0') {
        first = first + 1;
      }
      if (data[0].OUTSTTASKS !== '0') {
        first = first + 1;
      }
      total = parseInt(data[0].NORMALTASKS) + parseInt(data[0].EXEPTTASKS) + parseInt(data[0].HANDTASKS) + parseInt(data[0].OUTSTTASKS);
      if (first > 0) {
        firstNorPercent = (100 - first) * data[0].NORMALTASKS / total;
        firstExePercent = (100 - first) * data[0].EXEPTTASKS / total;
        firstHandPercent = (100 - first) * data[0].HANDTASKS / total;
        firstOutPercent = (100 - first) * data[0].OUTSTTASKS / total;
      } else {
        firstNorPercent = 100 * data[0].NORMALTASKS / total;
        firstExePercent = 100 * data[0].EXEPTTASKS / total;
        firstHandPercent = 100 * data[0].HANDTASKS / total;
        firstOutPercent = 100 * data[0].OUTSTTASKS / total;
      }
    }

    let secondNorPercent = 0;
    let secondExePercent = 0;
    let secondHandPercent = 0;
    let secondOutPercent = 0;
    //进行第一个指标监控的进度条百分比计算，如果有多种任务，按比例缩小，空出空隙
    if (data[1]) {
      let first = -1;
      let total = 0;
      if (data[1].NORMALTASKS !== '0') {
        first = first + 1;
      }
      if (data[1].EXEPTTASKS !== '0') {
        first = first + 1;
      }
      if (data[1].HANDTASKS !== '0') {
        first = first + 1;
      }
      if (data[1].OUTSTTASKS !== '0') {
        first = first + 1;
      }
      total = parseInt(data[1].NORMALTASKS) + parseInt(data[1].EXEPTTASKS) + parseInt(data[1].HANDTASKS) + parseInt(data[1].OUTSTTASKS);
      if (first > 0) {
        secondNorPercent = (100 - first) * data[1].NORMALTASKS / total;
        secondExePercent = (100 - first) * data[1].EXEPTTASKS / total;
        secondHandPercent = (100 - first) * data[1].HANDTASKS / total;
        secondOutPercent = (100 - first) * data[1].OUTSTTASKS / total;
      } else {
        secondNorPercent = 100 * data[1].NORMALTASKS / total;
        secondExePercent = 100 * data[1].EXEPTTASKS / total;
        secondHandPercent = 100 * data[1].HANDTASKS / total;
        secondOutPercent = 100 * data[1].OUTSTTASKS / total;
      }
    }
    //当没有任务时候，默认进度条全为灰色
    if (firstNorPercent === 0 && firstExePercent === 0 && firstHandPercent === 0) {
      firstOutPercent = 100;
    }
    if (secondNorPercent === 0 && secondExePercent === 0 && secondHandPercent === 0) {
      secondOutPercent = 100;
    }
    return (
      <div className='wid100 h100 pd10 check'>
        <div className='ax-card pos-r flex-c'>
          <div className='pos-r'>
            <div
              className='card-title title-l'>{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
              {chartConfig.length && chartConfig[0].chartNote ?
                (<Tooltip placement='top' title={<div>{chartConfig[0].chartNote.split('\n').map((item, index) => {
                  return <span key={index}>{item}<br /></span>;
                })}</div>}>
                  <img className='title-tip' src={[require('../../../../image/icon_tip.png')]} alt='' />
                </Tooltip>) : ''
              }
            </div>
          </div>
          <div className='flex-c circle flex1 h100'>
            <div className='flex-c circle dotLine sec-pos' style={{ height: '50%'}}>
              <div style={{ height: '10%' }}></div>
              <div className='flex-c' style={{ height: '54%' }}>
                <div style={{ height: '5%' }}></div>
                <div className='txt fs16' style={{ paddingBottom: '1rem' }}>
                <span className='fwsize' style={{
                  float: 'left',
                  color: '#00ACFF',
                  fontSize: '2rem',
                }}>{data[0] ? data[0].GROUPNAME : '-'}</span>
                  <span style={{ float: 'right' }}>完成进度 : <span className='fs24'
                                                              style={{ fontWeight: 'bold' }}>{data[0] ? data[0].TOTALTASKS - data[0].OUTSTTASKS : '-'}</span>/{data[0] ? data[0].TOTALTASKS : '-'}</span>
                </div>
                <div className='flex-r'
                     style={{ height: '25%', borderRadius: '.8rem', overflow: 'hidden', margin: '1rem 0',backgroundColor: !data[0]||data[0].TOTALTASKS==='0'?'#233471':null}}>
                  <div style={{
                    width: `${firstNorPercent}%`, background: 'linear-gradient(90deg, #02D3FF 1%, #007EFF 100%)',
                    display: 'inline',
                  }}>
                  </div>
                  <div style={{
                    width: `${firstExePercent}%`, background: 'linear-gradient(90deg, #E23C39 0%, #FF6A00 100%)',
                    marginLeft: firstNorPercent !== 0 && firstExePercent !== 0 ? '1%' : '',
                    display: 'inline',
                  }}>
                  </div>
                  <div style={{
                    width: `${firstHandPercent}%`, background: 'linear-gradient(90deg, #F7B230 1%, #FFE401 100%)',
                    marginLeft: firstHandPercent !== 0 && (firstNorPercent !== 0 || firstExePercent !== 0) ? '1%' : '',
                    display: 'inline',
                  }}>
                  </div>
                  <div style={{
                    width: `${firstOutPercent}%`, background: '#233471',
                    marginLeft: firstOutPercent !== 0 && (firstNorPercent !== 0 || firstExePercent !== 0 || firstHandPercent !== 0) ? '1%' : '',
                    display: 'inline',
                  }}>
                  </div>
                </div>
              </div>
              <div className='flex1 flex-r'
                   style={{ marginTop: '0.3rem', justifyContent: 'space-between', height: '41%' }}>
                <div className='squre pos-r' style={{ height: '5.3rem' }}>
                  <div className='topTxt fwsize'>正常</div>
                  <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{data[0] ? data[0].NORMALTASKS : '-'}</div>
                </div>
                <div className='squre pos-r' style={{ height: '5.3rem' }}>
                  <div className='topTxt fwsize' style={{ color: '#D34643' }}>异常</div>
                  <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{data[0] ? data[0].EXEPTTASKS : '-'}</div>
                </div>
                <div className='squre pos-r' style={{ height: '5.3rem' }}>
                  <div className='topTxt fwsize' style={{ color: '#F7B432' }}>手工登记</div>
                  <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{data[0] ? data[0].HANDTASKS : '-'}</div>
                </div>
                <div className='squre pos-r' style={{ height: '5.3rem' }}>
                  <div className='topTxt fwsize' style={{ color: '#AAAAAA' }}>未完成</div>
                  <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{data[0] ? data[0].OUTSTTASKS : '-'}</div>
                </div>
              </div>
            </div>
            <div className='flex-c circle dotLine sec-pos' style={{ height: '50%'}}>
              <div style={{ height: '10%' }}></div>
              <div className='flex-c' style={{ height: '54%' }}>
                <div style={{ height: '5%' }}></div>
                <div className='txt fs16' style={{ paddingBottom: '1rem' }}>
                <span className='fwsize' style={{
                  float: 'left',
                  color: '#00ACFF',
                  fontSize: '2rem',
                }}>{data[1] ? data[1].GROUPNAME : '-'}</span>
                  <span style={{ float: 'right' }}>完成进度 : <span className='fs24'
                                                              style={{ fontWeight: 'bold' }}>{data[1] ? data[1].TOTALTASKS - data[1].OUTSTTASKS : '-'}</span>/{data[1] ? data[1].TOTALTASKS : '-'}</span>
                </div>
                <div className='flex-r'
                     style={{ height: '25%', borderRadius: '.8rem', overflow: 'hidden', margin: '1rem 0',backgroundColor: !data[0]||data[0].TOTALTASKS==='0'?'#233471':null}}>
                  <div style={{
                    width: `${secondNorPercent}%`, background: 'linear-gradient(90deg, #02D3FF 1%, #007EFF 100%)',
                    display: 'inline',
                  }}>
                  </div>
                  <div style={{
                    width: `${secondExePercent}%`, background: 'linear-gradient(90deg, #E23C39 0%, #FF6A00 100%)',
                    marginLeft: secondNorPercent !== 0 && secondExePercent !== 0 ? '1%' : '',
                    display: 'inline',
                  }}>
                  </div>
                  <div style={{
                    width: `${secondHandPercent}%`, background: 'linear-gradient(90deg, #F7B230 1%, #FFE401 100%)',
                    marginLeft: secondHandPercent !== 0 && (secondNorPercent !== 0 || secondExePercent !== 0) ? '1%' : '',
                    display: 'inline',
                  }}>
                  </div>
                  <div style={{
                    width: `${secondOutPercent}%`, background: '#233471',
                    marginLeft: secondOutPercent !== 0 && (secondHandPercent !== 0 || secondNorPercent !== 0 || secondExePercent !== 0) ? '1%' : '',
                    display: 'inline',
                  }}>
                  </div>
                </div>
              </div>
              <div className='flex1 flex-r'
                   style={{ marginTop: '0.45rem', justifyContent: 'space-between', height: '41%' }}>
                <div className='squre pos-r' style={{ height: '5.3rem' }}>
                  <div className='topTxt fwsize'>正常</div>
                  <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{data[1] ? data[1].NORMALTASKS : '-'}</div>
                </div>
                <div className='squre pos-r' style={{ height: '5.3rem' }}>
                  <div className='topTxt fwsize' style={{ color: '#E23C39' }}>异常</div>
                  <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{data[1] ? data[1].EXEPTTASKS : '-'}</div>
                </div>
                <div className='squre pos-r' style={{ height: '5.3rem' }}>
                  <div className='topTxt fwsize' style={{ color: '#F7B432' }}>手工登记</div>
                  <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{data[1] ? data[1].HANDTASKS : '-'}</div>
                </div>

                <div className='squre pos-r' style={{ height: '5.3rem' }}>
                  <div className='topTxt fwsize' style={{ color: '#AAAAAA' }}>未完成</div>
                  <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{data[1] ? data[1].OUTSTTASKS : '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LeftContent;
