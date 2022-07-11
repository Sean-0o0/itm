import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import {
  FetchQueryChartIndexData,
} from '../../../../../services/largescreen';


class DayMonitoringMetrics extends React.Component {
  state = {
    datas: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.records !== this.props.records) {
      this.fetchData(nextProps.records);
    }
  }

  //表头数据查询
  fetchData = (records = []) => {
    FetchQueryChartIndexData({
      chartCode: records.chartCode
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({
            datas: data,
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  render() {
    const { datas = [] } = this.state;
    // const { dispatch } = this.props;

    return (
      <div className="h50 pd10">
        <div className="ax-card flex-c">
          <div className="box-title">
            <div className="card-title title-l">日/非日监控指标</div>
          </div>
          <div className="pos-r" style={{ width: '100%', height: '100%', marginTop: '2rem' }}>


            <div style={{ padding: '0rem 2rem', height: 'calc(100% - 1.667rem)', fontSize: '1.5rem' }}>
              <div className='flex-c' style={{ height: '100%' }}>
                <div className='flex-r left-cont-box'>
                  <div className='flex-r left-cont-title' style={{ width: '21rem' }}>
                  </div>
                  <div className='flex1 flex-r' style={{ color: '#00ACFF', display: 'flex', flex: '1 1', padding: '0 1.5rem' }}>
                    <div className='flex1 tr'>预警总量</div>
                    <div className='flex1 tr'>五级预警数量</div>
                    <div className='flex1 tr'>未处理数量</div>
                  </div>
                </div>

                {
                  datas.map(data => (
                    <div className='flex1 flex-r left-data-box' style={{ background: 'rgba(17, 39, 111, 0.7)', alignItems: 'center', marginTop: '1rem', padding: '0 1.5rem' }}>
                      <div className='flex-r left-data-sub' style={{ width: '21rem' }}>
                        {data.GROUPNAME}
                      </div>
                      <div className='flex1 flex-r blue fs21' style={{ display: 'flex', flex: '1 1' }}>
                        <div className='flex1 tr fwb' style={{ color: '#FFFFFF' }}>
                          {data.NUM}
                        </div>
                        <div className='flex1 tr fwb' style={{ color: '#FFFFFF' }}>
                          {data.LEVELFIVENUM}
                        </div>
                        <div className='flex1 tr fwb' style={{ color: '#FFFFFF' }}>
                          {data.PENDINGNUM}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>


            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(DayMonitoringMetrics);
