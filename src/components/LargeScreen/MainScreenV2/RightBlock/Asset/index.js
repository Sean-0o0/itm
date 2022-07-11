import React from 'react';
import { connect } from 'dva';
import { message, Progress, Tooltip } from 'antd';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';
import HandleDataUtils from '../../HandleDataUtils';


class Asset extends React.Component {
  state = {
    datas1: [],
    datas2: [],
    StatusAndColor: {},

    datas3: [],
    datas4: [],
  };


  componentDidMount() {
    //查询指标状态
    this.fetchData1();
    this.fetchData2();
    this.fetchData3();
  }

  componentWillUnmount() {

  }

  //处理运行进度百分比
  getPercent = (data={}) => {
    if(data.COMPLTSTEPNUM && data.GROUPSTEPNUM){
      return ((data.COMPLTSTEPNUM / data.GROUPSTEPNUM) * 100);
    }
    return '-';
  };

  //处理运行进度百分比
  handlePercent = (data) => {
    let percent = { one: '', two: '', three: '', four: '', five: '' };
    let total = 0;
    total = parseInt(data.NORMALTASKS) + parseInt(data.EXEPTTASKS) + parseInt(data.HANDTASKS) + parseInt(data.OUTSTTASKS);
    percent.one = ((data.COMPLTASKS / data.TOTALTASKS) * 100);
    percent.two = ((data.NORMALTASKS / total) * 100);
    percent.three = ((data.EXEPTTASKS / total) * 100);
    percent.four = ((data.HANDTASKS / total) * 100);
    percent.five = ((data.OUTSTTASKS / total) * 100);
    return percent;
  };

  //处理标题名称
  handleData = (data={}) => {
    return (data.GROUPNAME === '' ? '-' : data.GROUPNAME);
  };

  //处理完成状态和样式
  handleComplete = (data={}) => {
    let StatusAndColor = { status: '-', color: '#00ACFF' };
    if (data.GROUPSTATUS) {
      switch (data.GROUPSTATUS) {
        case '0':
          StatusAndColor.status = '未开始';
          StatusAndColor.color = '#00ACFF';
          break;
        case '1':
          StatusAndColor.status = '进行中';
          StatusAndColor.color = '#F7B432';
          break;
        case '2':
          StatusAndColor.status = '异常';
          StatusAndColor.color = '#E23C39';
          break;
        case '3':
          StatusAndColor.status = '已完成';
          StatusAndColor.color = '#00ACFF';
          break;
        default:
          StatusAndColor.status = '-';
          StatusAndColor.color = '#00ACFF';
          break;
      }
    }
    return StatusAndColor;
  };

  //处理样式
  handleStyle = (data) => {
    return (data.COMPLTSTEPNUM === data.GROUPSTEPNUM ? '#00ACFF' : '#F7B432');
  };

  //处理完成比 n/m
  handleDataSecond = (data) => {
    return ((data.COMPLTASKS === '' ? '-' : data.COMPLTASKS) + '/' + (data.TOTALTASKS === '' ? '-' : data.TOTALTASKS));
  };

  //指标状态(圆形图表)
  fetchData1 = () => {
    FetchQueryChartIndexData({
      //集团运营概况对应的chartCode
      chartCode: 'AssetmMontSerComplt',
    })
      .then((ret = {}) => {
          const { code = 0, data = [] } = ret;
          if (code > 0) {
            let map = {};
            let myArr = [];
            for (let i = 0; i < data.length; i++) {
              if (!map[data[i].GROUPCODE]) {
                myArr.push({
                  GROUPCODE: data[i].GROUPCODE,
                  GROUPNAME: data[i].GROUPNAME,
                  GROUPSTEPNUM: data[i].GROUPSTEPNUM,
                  COMPLTSTEPNUM: data[i].COMPLTSTEPNUM,
                  STARTDATE: data[i].STARTDATE,
                  ENDDATE: data[i].ENDDATE,
                  CURRSTEP: data[i].CURRSTEP,
                  GROUPSTATUS: data[i].GROUPSTATUS,
                  data: [data[i]],
                });
                map[data[i].GROUPCODE] = data[i];
              } else {
                for (let j = 0; j < myArr.length; j++) {
                  if (data[i].GROUPCODE === myArr[j].GROUPCODE) {
                    myArr[j].data.push(data[i]);
                    break;
                  }
                }
              }
            }
            const datas1 = [];
            const datas2 = [];
            if (myArr.length > 0) {
              for (let i = 0; i < 3; i++) {
                datas1.push(myArr[i]);
              }
              for (let i = 3; i < 6; i++) {
                datas2.push(myArr[i]);
              }
            }
            console.log('---datas1---', datas1);
            console.log('---datas2---', datas2);
            this.setState({ datas1: datas1, datas2: datas2 });
          }
        },
      )
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //指标状态(进度条数据)
  fetchData2 = () => {
    FetchQueryChartIndexData({
      //集团运营概况对应的chartCode
      chartCode: 'AssetmServiceCheckIndMont',
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ datas3: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //指标状态(底部数据)
  fetchData3 = () => {
    FetchQueryChartIndexData({
      //集团运营概况对应的chartCode
      chartCode: 'MProgIndcPubOfferingProd',
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ datas4: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  render() {

    const { datas1 = [], datas2 = [], datas3 = [], datas4 = [] } = this.state;
    return (
      <div className='flex1 h100 pd10'>
        <div className='ax-card flex-c'>
          <div className='pos-r'>
            <div className='card-title title-c'>兴证资管</div>
          </div>
          <div className='flex-r h28' style={{ justifyContent: 'space-around' }}>
            {/*datas判断是否为[]????*/}
            {datas1.map((item={}, index) => {
              return (
                <div className='pos-r' key={index}>
                  <Tooltip title='基金行情复核'>
                    <Progress type='dashboard' percent={this.getPercent(item)}
                              format={() => <div
                                style={{ color: `${this.handleComplete(item).color}` }}>{item.COMPLTSTEPNUM ? item.COMPLTSTEPNUM : '-'} / {item.GROUPSTEPNUM ? item.GROUPSTEPNUM : '-'}<br /><span
                                className='fs16'>{this.handleComplete(item).status}</span>
                              </div>}
                              strokeColor={this.handleComplete(item).color} />
                  </Tooltip>
                  <div className='pos-a pgs-pos' style={{ width: '12rem', left: 'calc(50% - 6rem)' }}>
                    {this.handleData(item)}
                  </div>
                </div>
              );
            })
            }
          </div>
          <div className='flex-r h28' style={{ justifyContent: 'space-around' }}>
            {datas2.map((item={},index) => {
              return (
                <div className='pos-r' key={index}>
                  <Tooltip title='基金行情复核'>
                    <Progress type='dashboard' percent={this.getPercent(item)}
                              format={() => <div
                                style={{ color: `${this.handleComplete(item).color}` }}>{item.COMPLTSTEPNUM ? item.COMPLTSTEPNUM : '-'} / {item.GROUPSTEPNUM ? item.GROUPSTEPNUM : '-'}<br /><span
                                className='fs16'>{this.handleComplete(item).status}</span>
                              </div>}
                              strokeColor={this.handleComplete(item).color} />
                  </Tooltip>
                  <div className='pos-a pgs-pos' style={{ width: '12rem', left: 'calc(50% - 6rem)' }}>
                    {this.handleData(item)}
                  </div>
                </div>
              );
            })
            }
          </div>
          <div className='flex-r'>
            {datas3.map((item={}, index) => {
              let percent = this.handlePercent(item);
              return <div className='flex-c flex1 sec-pos' key={index}>
                <div className='fs18'>
                  <span style={{ float: 'left' }}>{item.GROUPNAME.replace('业务检查', '')}</span>
                  <span style={{ float: 'right' }}><span className='fs24'
                                                         style={{ fontWeight: 'bold' }}>{item.COMPLTASKS}</span>/{item.TOTALTASKS}</span>
                </div>
                <div className='flex-r' style={{ height: '.4rem', borderRadius: '2px' }}>
                  <div style={{
                    width: `${percent.one}%`,
                    backgroundColor: '#157EF4',
                    display: 'inline',
                    borderRadius: '2px 0px 0px 2px',
                  }}></div>
                  <div style={{
                    width: `${100 - percent.one}%`,
                    backgroundColor: '#383F5F',
                    display: 'inline',
                    borderRadius: '0px 2px 2px 0px',
                  }}></div>
                </div>
                <div className='flex-r' style={{ height: '1.2rem', borderRadius: '2px', margin: '.5rem 0' }}>
                  <div style={{
                    width: `${percent.two}%`,
                    backgroundColor: '#157EF4',
                    display: 'inline',
                    borderRadius: '6px 0px 0px 6px',
                  }}></div>
                  <div style={{ width: `${percent.three}%`, backgroundColor: '#E23C39', display: 'inline' }}></div>
                  <div style={{ width: `${percent.four}%`, backgroundColor: '#F7B432', display: 'inline' }}></div>
                  <div style={{
                    width: `${percent.five}%`,
                    backgroundColor: '#383F5F',
                    display: 'inline',
                    borderRadius: '0px 6px 6px 0px',
                  }}></div>
                </div>
                <div className='fs18'>
                  <span className='blue'>正常:{item.NORMALTASKS}</span>/<span className='red'>异常:{item.EXEPTTASKS}</span>/<span
                  className='orange'>手工确认:{item.HANDTASKS}</span><br /><span
                  className='grey'>未完成:{item.OUTSTTASKS}</span>
                </div>
              </div>;
            })}
            {/*<div className='flex-c flex1 sec-pos'>*/}
            {/*  <div className='fs18'>*/}
            {/*    <span style={{ float: 'left' }}>估值指标监控</span>*/}
            {/*    <span style={{ float: 'right' }}><span className='fs24'*/}
            {/*                                           style={{ fontWeight: 'bold' }}>20</span>/27</span>*/}
            {/*  </div>*/}
            {/*  <div className='flex-r' style={{ height: '.4rem', borderRadius: '2px' }}>*/}
            {/*    <div style={{*/}
            {/*      width: '70%',*/}
            {/*      backgroundColor: '#157EF4',*/}
            {/*      display: 'inline',*/}
            {/*      borderRadius: '2px 0px 0px 2px',*/}
            {/*    }}></div>*/}
            {/*    <div style={{*/}
            {/*      width: '30%',*/}
            {/*      backgroundColor: '#383F5F',*/}
            {/*      display: 'inline',*/}
            {/*      borderRadius: '0px 2px 2px 0px',*/}
            {/*    }}></div>*/}
            {/*  </div>*/}
            {/*  <div className='flex-r' style={{ height: '1.2rem', borderRadius: '2px', margin: '.5rem 0' }}>*/}
            {/*    <div style={{*/}
            {/*      width: '40%',*/}
            {/*      backgroundColor: '#157EF4',*/}
            {/*      display: 'inline',*/}
            {/*      borderRadius: '6px 0px 0px 6px',*/}
            {/*    }}></div>*/}
            {/*    <div style={{ width: '20%', backgroundColor: '#E23C39', display: 'inline' }}></div>*/}
            {/*    <div style={{ width: '10%', backgroundColor: '#F7B432', display: 'inline' }}></div>*/}
            {/*    <div style={{*/}
            {/*      width: '30%',*/}
            {/*      backgroundColor: '#383F5F',*/}
            {/*      display: 'inline',*/}
            {/*      borderRadius: '0px 6px 6px 0px',*/}
            {/*    }}></div>*/}
            {/*  </div>*/}
            {/*  <div className='fs18'>*/}
            {/*    <span className='blue'>正常:17</span>/<span className='red'>异常:1</span>/<span*/}
            {/*    className='orange'>手工确认:2</span><br /><span className='grey'>未完成:7</span>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div className='flex-c flex1 sec-pos'>*/}
            {/*  <div className='fs18'>*/}
            {/*    <span style={{ float: 'left' }}>注册登记指标监控</span>*/}
            {/*    <span style={{ float: 'right' }}><span className='fs24'*/}
            {/*                                           style={{ fontWeight: 'bold' }}>20</span>/27</span>*/}
            {/*  </div>*/}
            {/*  <div className='flex-r' style={{ height: '.4rem', borderRadius: '2px' }}>*/}
            {/*    <div style={{*/}
            {/*      width: '70%',*/}
            {/*      backgroundColor: '#157EF4',*/}
            {/*      display: 'inline',*/}
            {/*      borderRadius: '2px 0px 0px 2px',*/}
            {/*    }}></div>*/}
            {/*    <div style={{*/}
            {/*      width: '30%',*/}
            {/*      backgroundColor: '#383F5F',*/}
            {/*      display: 'inline',*/}
            {/*      borderRadius: '0px 2px 2px 0px',*/}
            {/*    }}></div>*/}
            {/*  </div>*/}
            {/*  <div className='flex-r' style={{ height: '1.2rem', borderRadius: '2px', margin: '.5rem 0' }}>*/}
            {/*    <div style={{*/}
            {/*      width: '40%',*/}
            {/*      backgroundColor: '#157EF4',*/}
            {/*      display: 'inline',*/}
            {/*      borderRadius: '6px 0px 0px 6px',*/}
            {/*    }}></div>*/}
            {/*    <div style={{ width: '20%', backgroundColor: '#E23C39', display: 'inline' }}></div>*/}
            {/*    <div style={{ width: '10%', backgroundColor: '#F7B432', display: 'inline' }}></div>*/}
            {/*    <div style={{*/}
            {/*      width: '30%',*/}
            {/*      backgroundColor: '#383F5F',*/}
            {/*      display: 'inline',*/}
            {/*      borderRadius: '0px 6px 6px 0px',*/}
            {/*    }}></div>*/}
            {/*  </div>*/}
            {/*  <div className='fs18'>*/}
            {/*    <span className='blue'>正常:17</span>/<span className='red'>异常:1</span>/<span*/}
            {/*    className='orange'>手工确认:2</span><br /><span className='grey'>未完成:7</span>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
          <div className='flex-c flex1'>
            <div className='tc fs18'>公募化产品进度指标</div>
            <div className='flex-r pro-aim fs18' style={{ justifyContent: 'space-around', lineHeight: '4rem' }}>
              {datas4.map((item) => {
                return <div>{item.INDEXNAME}&nbsp;&nbsp;&nbsp;{item.INDEXVALUE}</div>;
              })}
              {/*<div>改造完成&nbsp;&nbsp;&nbsp;25</div>*/}
              {/*<div>进行中&nbsp;&nbsp;&nbsp;25</div>*/}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({
     global,
   },
  ) =>
    ({}),
)
(Asset);
