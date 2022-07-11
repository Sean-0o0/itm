import React, { Component } from 'react';

import ClearRatio from './ClearRatio';

export class LeftContent extends Component {
  getPercent = (num, faTotal) => {
    let percent = 0;
    if (faTotal) {
      percent = num / faTotal;
    }
    return percent * 100;
  };

  render() {
    const { dispatch, moduleCharts = [], indexConfig = [], fazbData = [], tazbData = [] } = this.props;
    let fafaTotalNum = 0, faFinishNum = 0, faNormalNum = 0, faExpNum = 0, faHandleNum = 0, faUnfinishNum = 0,
      tafaTotalNum = 0, taFinishNum = 0, taNormalNum = 0, taExpNum = 0, taHandleNum = 0, taUnfinishNum = 0;
    if (fazbData.length > 0) {
      fazbData.forEach(item => {
        fafaTotalNum += Number.parseInt(Number.isNaN(item.COUNT) ? 0 : item.COUNT);
        if (item.STATE !== '0') {//已完成
          faFinishNum += Number.parseInt(Number.isNaN(item.COUNT) ? 0 : item.COUNT);
          if (item.STATE === '1') {//检查正常
            faNormalNum = Number.isNaN(item.COUNT) ? 0 : item.COUNT;
          } else if (item.STATE === '2') {//检查异常
            faExpNum = Number.isNaN(item.COUNT) ? 0 : item.COUNT;
          } else if (item.STATE === '3') {//手工确认
            faHandleNum = Number.isNaN(item.COUNT) ? 0 : item.COUNT;
          }
        } else {
          //未完成
          faUnfinishNum = Number.isNaN(item.COUNT) ? 0 : item.COUNT;
        }
      });
    }
    if (tazbData.length > 0) {
      tazbData.forEach(item => {
        tafaTotalNum += Number.parseInt(Number.isNaN(item.COUNT) ? 0 : item.COUNT);
        if (item.STATE !== '0') {//已完成
          taFinishNum += Number.parseInt(Number.isNaN(item.COUNT) ? 0 : item.COUNT);
          if (item.STATE === '1') {//检查正常
            taNormalNum = Number.isNaN(item.COUNT) ? 0 : item.COUNT;
          } else if (item.STATE === '2') {//检查异常
            taExpNum = Number.isNaN(item.COUNT) ? 0 : item.COUNT;
          } else if (item.STATE === '3') {//手工确认
            taHandleNum = Number.isNaN(item.COUNT) ? 0 : item.COUNT;
          }
        } else {
          //未完成
          taUnfinishNum = Number.isNaN(item.COUNT) ? 0 : item.COUNT;
        }
      });
    }

    let firstNorPercent = 0;
    let firstExePercent = 0;
    let firstHandPercent = 0;
    let firstOutPercent = 0;
    //进行第一个指标监控的进度条百分比计算，如果有多种任务，按比例缩小，空出空隙
      let faFirst = -1;
      let faTotal = 0;
      if (faNormalNum !== '0') {
        faFirst = faFirst + 1;
      }
      if (faExpNum !== '0') {
        faFirst = faFirst + 1;
      }
      if (faHandleNum !== '0') {
        faFirst = faFirst + 1;
      }
      if (faUnfinishNum !== '0') {
        faFirst = faFirst + 1;
      }
      faTotal = parseInt(faNormalNum) + parseInt(faExpNum) + parseInt(faHandleNum) + parseInt(faUnfinishNum);
      if (faFirst > 0) {
        firstNorPercent = (100 - faFirst) * faNormalNum / faTotal;
        firstExePercent = (100 - faFirst) * faExpNum / faTotal;
        firstHandPercent = (100 - faFirst) * faHandleNum / faTotal;
        firstOutPercent = (100 - faFirst) * faUnfinishNum / faTotal;
      } else {
        firstNorPercent = 100 * faNormalNum / faTotal;
        firstExePercent = 100 * faExpNum / faTotal;
        firstHandPercent = 100 * faHandleNum / faTotal;
        firstOutPercent = 100 * faUnfinishNum / faTotal;
      }

    let secondNorPercent = 0;
    let secondExePercent = 0;
    let secondHandPercent = 0;
    let secondOutPercent = 0;
    //进行第一个指标监控的进度条百分比计算，如果有多种任务，按比例缩小，空出空隙
      let taFirst = -1;
      let taTotal = 0;
      if (taNormalNum !== '0') {
        taFirst = taFirst + 1;
      }
      if (taExpNum !== '0') {
        taFirst = taFirst + 1;
      }
      if (taHandleNum !== '0') {
        taFirst = taFirst + 1;
      }
      if (taUnfinishNum !== '0') {
        taFirst = taFirst + 1;
      }
      taTotal = parseInt(taNormalNum) + parseInt(taExpNum) + parseInt(taHandleNum) + parseInt(taUnfinishNum);
      if (taFirst > 0) {
        secondNorPercent = (100 - taFirst) * taNormalNum / taTotal;
        secondExePercent = (100 - taFirst) * taExpNum / taTotal;
        secondHandPercent = (100 - taFirst) * taHandleNum / taTotal;
        secondOutPercent = (100 - taFirst) * taUnfinishNum / taTotal;
      } else {
        secondNorPercent = 100 * taNormalNum / taTotal;
        secondExePercent = 100 * taExpNum / taTotal;
        secondHandPercent = 100 * taHandleNum / taTotal;
        secondOutPercent = 100 * taUnfinishNum / taTotal;
      }
    //当没有任务时候，默认进度条全为灰色
    if (firstNorPercent === 0 && firstExePercent === 0 && firstHandPercent === 0) {
      firstOutPercent = 100;
    }
    if (secondNorPercent === 0 && secondExePercent === 0 && secondHandPercent === 0) {
      secondOutPercent = 100;
    }

    return (
      <div className='flex-c h100 wid33'>
        <div className='flex-c h60 check '>
          <div className='pd10 h100'>
            <div className='ax-card flex-c'>
              <div className='pos-r'>
                <div className='card-title title-l'>
                  运营业务检查指标监控
                </div>
              </div>
              {
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
                    }}>{moduleCharts[1] && moduleCharts[1][0] ? moduleCharts[1][0].chartTitle : 'FA指标检测'}</span>
                      <span style={{ float: 'right' }}>完成进度 : <span className='fs24'
                                                                  style={{ fontWeight: 'bold' }}>{faFinishNum}</span>/{fafaTotalNum}</span>
                    </div>
                    <div className='flex-r'
                         style={{ height: '25%', borderRadius: '.8rem', overflow: 'hidden', margin: '1rem 0',backgroundColor: !fafaTotalNum||fafaTotalNum==='0'?'#233471':null }}>
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
                      <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{faNormalNum}</div>
                    </div>
                    <div className='squre pos-r' style={{ height: '5.3rem' }}>
                      <div className='topTxt fwsize' style={{ color: '#D34643' }}>异常</div>
                      <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{faExpNum}</div>
                    </div>
                    <div className='squre pos-r' style={{ height: '5.3rem' }}>
                      <div className='topTxt fwsize' style={{ color: '#F7B432' }}>手工登记</div>
                      <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{faHandleNum}</div>
                    </div>
                    <div className='squre pos-r' style={{ height: '5.3rem' }}>
                      <div className='topTxt fwsize' style={{ color: '#AAAAAA' }}>未完成</div>
                      <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{faUnfinishNum}</div>
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
                    }}>{moduleCharts[1] && moduleCharts[2][0] ? moduleCharts[2][0].chartTitle : 'TA指标检测'}</span>
                      <span style={{ float: 'right' }}>完成进度 : <span className='fs24'
                                                                  style={{ fontWeight: 'bold' }}>{taFinishNum}</span>/{tafaTotalNum}</span>
                    </div>
                    <div className='flex-r'
                         style={{ height: '25%', borderRadius: '.8rem', overflow: 'hidden', margin: '1rem 0' ,backgroundColor: !tafaTotalNum||tafaTotalNum==='0'?'#233471':null }}>
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
                      <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{taNormalNum}</div>
                    </div>
                    <div className='squre pos-r' style={{ height: '5.3rem' }}>
                      <div className='topTxt fwsize' style={{ color: '#D34643' }}>异常</div>
                      <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{taExpNum}</div>
                    </div>
                    <div className='squre pos-r' style={{ height: '5.3rem' }}>
                      <div className='topTxt fwsize' style={{ color: '#F7B432' }}>手工登记</div>
                      <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{taHandleNum}</div>
                    </div>

                    <div className='squre pos-r' style={{ height: '5.3rem' }}>
                      <div className='topTxt fwsize' style={{ color: '#AAAAAA' }}>未完成</div>
                      <div className='bottomTxt' style={{ color: '#C6E2FF' }}>{taUnfinishNum}</div>
                    </div>
                  </div>
                </div>
              </div>
              }
            </div>
          </div>
          {/* <div className="h50 pd10">
                        <IndexCheck title='FA指标检测' data = {fazbData}/>
                    </div>
                    <div className="h50 pd10">
                        <IndexCheck title='TA指标检测' data = {tazbData}/>
                    </div> */}

        </div>
        <ClearRatio moduleCharts={moduleCharts[4]} dispatch={dispatch} indexConfig={indexConfig} />
      </div>
    );
  }
}

export default LeftContent;
