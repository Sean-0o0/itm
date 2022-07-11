import React from 'react';
import { message, Progress } from 'antd';
import { connect } from 'dva';
// import { FetchQueryModuleChartConfig, FetchQueryErrOrImpRptStat } from '../../../services/largescreen';
import ChartBox from '../../../centralOpert/ChartBox';

import EventReport from '../../../ClearingPlace/EventReport';
import { FetchQueryChartIndexData, FetchQueryErrOrImpRpt } from '../../../../../services/largescreen';
// import { message } from 'antd';
import Swiper from 'react-id-swiper';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';


class RunAccount extends React.Component {
  state = {
    runAccountTotal: []
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  fetchData = (chartCode) => {
    FetchQueryChartIndexData({
      chartCode: chartCode,
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ runAccountTotal: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  render() {
    const { runAccountTotal = {}} = this.state;
    const { chartConfig = [] } = this.props;
    if(chartConfig.length && chartConfig[0].chartCode) {
      this.fetchData(chartConfig[0].chartCode);
    }
    const colorList = ['#157EF4', '#1549F4', '#2515F4'];
    const option = {
      series: [
        {
          name: 'Access From',
          type: 'pie',
          hoverAnimation: false,
          radius: ['70%', '100%'],
          label: {
            show: false,
            position: 'center'
          },
          data: [
            { value: runAccountTotal[0] ? runAccountTotal[0].SINGLEDEPTOTAL : 0, name: 'single' },
            { value: runAccountTotal[0] ? runAccountTotal[0].DOUBLEDEPTOTAL : 0, name: 'double' },
            { value: runAccountTotal[0] ? runAccountTotal[0].THREEDEPTOTAL : 0, name: 'three' }
          ],
          itemStyle: {
            normal: {
              color: function(params) {
                return colorList[params.dataIndex]
              }
            }
          }
        }
      ]
    };

    return (
      <div className="h24 pd10">
        <div className="ax-card flex-c">
          <div className="pos-r" style={{width: '100%'}}>
            <div  style={{position: 'absolute', top: '155%', left: '6%', width: '30%'}}>

              <div style={{color: '#FFFFFF',zIndex: '9999', fontWeight: 'bold', fontSize: '4rem',position: 'absolute', top: '40%', left: '33%', width: '30%'}}>
                {runAccountTotal[0] ? runAccountTotal[0].DEPTOTAL : ""}
              </div>
              <div style={{color: '#FFFFFF',zIndex: '9999', fontSize: '3.2rem',position: 'absolute', top: '52%', left: '34%', width: '30%'}}>
                ——
              </div>
              <div style={{color: '#FFFFFF',zIndex: '9999', fontSize: '1rem',position: 'absolute', top: '65%', left: '42%', width: '30%'}}>
                {runAccountTotal[0] ? runAccountTotal[0].DEPDETAILTOTAL : ""}
              </div>
              <ReactEchartsCore
                echarts={echarts}
                option={option}
                notMerge
                lazyUpdate
                style={{ height: '15rem', width: '20rem'}}
                theme=""
              />
            </div>

            <div className="card-title title-c">{chartConfig.length && chartConfig[0].chartTitle? chartConfig[0].chartTitle: ''}</div>
            <div style={{position: 'absolute', top: '255%', left: '35%'}}>
              <div style={{width: '15px',height: '15px', border: '2px solid #1362D0', borderRadius: '50%'}}></div>
            </div>
            <div style={{position: 'absolute', top: '265%', left: '40%'}}>单部门账户数<span style={{color: '#157EF4', marginLeft: '3px'}}>{runAccountTotal[0] ? runAccountTotal[0].SINGLEDEPTOTAL : ""}</span></div>
            <div style={{position: 'absolute', top: '445%', left: '35%'}}>
              <div style={{width: '15px',height: '15px', border: '2px solid #40A0ED', borderRadius: '50%'}}></div>
            </div>
            <div style={{position: 'absolute', top: '455%', left: '40%'}}>三部门账户数<span style={{color: '#157EF4', marginLeft: '3px'}}>{runAccountTotal[0] ? runAccountTotal[0].DOUBLEDEPTOTAL : ""}</span></div>

            <div style={{position: 'absolute', top: '255%', left: '65%'}}>
              <div style={{width: '15px',height: '15px', border: '2px solid #1362D0', borderRadius: '50%'}}></div>
            </div>
            <div style={{position: 'absolute', top: '265%', left: '70%'}}>两部门账户数<span style={{color: '#157EF4', marginLeft: '3px'}}>{runAccountTotal[0] ? runAccountTotal[0].THREEDEPTOTAL : ""}</span></div>

          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(RunAccount);
