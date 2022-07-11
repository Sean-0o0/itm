import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import {
  FetchQueryChartIndexData,
} from '../../../../../services/largescreen';


class OverallView extends React.Component {
  state = {
    data1: [],
    data2: [],
    leftdata: [],
    rightdata: [],
    leftdata2: [],
    rightdata2: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.records !== this.props.records) {
      this.fetchData(nextProps.records);
    }
  }

  componentWillUnmount() {
  }

  //表头数据查询
  fetchData = (records = []) => {
    FetchQueryChartIndexData({
      chartCode: records.chartCode
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          let map = {}
          let leftdata = [];
          let rightdata = [];
          let leftdata2 = [];
          let rightdata2 = [];
          for (let i = 0; i < data.length; i++) {
            let ai = data[i]
            if (!map[ai.GROUPNO]) {
              map[ai.GROUPNO] = [ai]
            } else {
              map[ai.GROUPNO].push(ai)
            }
          }
          for (let i = 0; i < map[1].length; i++) {
            if (i % 2 === 0) {
              leftdata.push(map[1][i])
            } else {
              rightdata.push(map[1][i])
            }
          }
          for (let i = 0; i < map[2].length; i++) {
            if (i % 2 === 0) {
              leftdata2.push(map[2][i])
            } else {
              rightdata2.push(map[2][i])
            }
          }
          this.setState({
            data1: map[1],
            leftdata: leftdata,
            rightdata: rightdata,
            leftdata2: leftdata2,
            rightdata2: rightdata2,
            data2: map[2],
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };



  render() {
    const { data1 = [], data2 = [], leftdata = [], rightdata = [], leftdata2 = [], rightdata2 = [], } = this.state;
    return (
      <div className="h50 pd10">
        <div className="ax-card flex-c">
          <div className="pos-r" style={{ width: '100%', height: '100%' }}>
            <div className="card-title title-c">总览</div>
            <div className="pos-r" style={{ width: '100%', height: '90%', marginTop: '2rem' }}>
              <div style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column' }}>
                <div style={{ height: '50%', width: '100%', }}>
                  <div className="Bond" style={{ padding: '1rem 3rem', height: '25%', width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <div className='lh36' style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', }}>
                      <div className='fs18 fwb' style={{ width: '50%', height: '100%', justifyContent: 'start', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 3rem', background: 'linear-gradient(90deg, rgba(17, 47, 111, 1) 0%, rgba(17, 39, 111, 1) 100%)' }}>
                        {data1[0]?.GROUPNAME}
                      </div>
                      <div className='fs28 fwb' style={{ width: '50%', height: '100%', justifyContent: 'end', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 3rem', background: 'linear-gradient(90deg,rgba(17, 39, 111, 1)  0%, rgba(17, 47, 111, 1) 100%)', color: 'rgba(0, 172, 255, 1)' }}>
                        {data1[0]?.GROUPNUM}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '1rem 3rem', height: '75%', width: '100%', display: 'flex', flexDirection: 'col' }}>
                    <div className="Bond" style={{ height: '100%', width: '50%', flexDirection: 'col' }}>
                      {
                        leftdata.map(data => (
                          <div style={{ height: '33.3%', width: '100%', display: 'flex', flexDirection: 'row' }}>
                            <div style={{ width: '100%', height: '33%', display: 'flex', flexDirection: 'row', padding: '1rem 3rem' }}>
                              <div style={{ width: '100%', height: '100%', textAlign: 'start' }}>
                                {data.NAME}
                              </div>
                              <div className='fs21 fwb' style={{ width: '50%', height: '100%', textAlign: 'end', color: 'rgba(0, 172, 255, 1)' }}>
                                {data.NUM} / {data.PERCENT}
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    <div className="Bond" style={{ height: '100%', width: '50%', flexDirection: 'col' }}>
                      {
                        rightdata.map(data => (
                          <div style={{ height: '33.3%', width: '100%', display: 'flex', flexDirection: 'row' }}>
                            <div style={{ width: '100%', height: '33%', display: 'flex', flexDirection: 'row', padding: '1rem 3rem' }}>
                              <div style={{ width: '100%', height: '100%', textAlign: 'start' }}>
                                {data.NAME}
                              </div>
                              <div className='fs21 fwb' style={{ width: '50%', height: '100%', textAlign: 'end', color: 'rgba(0, 172, 255, 1)' }}>
                                {data.NUM} / {data.PERCENT}
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>

                <div style={{ height: '50%', width: '100%', }}>
                  <div className="Bond" style={{ padding: '1rem 3rem', height: '25%', width: '100%', display: 'flex', flexDirection: 'row' }}>
                    <div className='lh36' style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', }}>
                      <div className='fs18 fwb' style={{ width: '50%', height: '100%', justifyContent: 'start', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 3rem', background: 'linear-gradient(90deg, rgba(17, 47, 111, 1) 0%, rgba(17, 39, 111, 1) 100%)' }}>
                        {data2[0]?.GROUPNAME}
                      </div>
                      <div className='fs28 fwb' style={{ width: '50%', height: '100%', justifyContent: 'end', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0 3rem', background: 'linear-gradient(90deg,rgba(17, 39, 111, 1)  0%, rgba(17, 47, 111, 1) 100%)', color: 'rgba(0, 172, 255, 1)' }}>
                        {data2[0]?.GROUPNUM}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '1rem 3rem', height: '75%', width: '100%', display: 'flex', flexDirection: 'col' }}>
                    <div className="Bond" style={{ height: '100%', width: '50%', flexDirection: 'col' }}>
                      {
                        leftdata2.map(data => (
                          <div style={{ height: '33.3%', width: '100%', display: 'flex', flexDirection: 'row' }}>
                            <div style={{ width: '100%', height: '33%', display: 'flex', flexDirection: 'row', padding: '1rem 3rem' }}>
                              <div style={{ width: '100%', height: '100%', textAlign: 'start' }}>
                                {data.NAME}
                              </div>
                              <div className='fs21 fwb' style={{ width: '50%', height: '100%', textAlign: 'end', color: 'rgba(0, 172, 255, 1)' }}>
                                {data.NUM} / {data.PERCENT}
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    <div className="Bond" style={{ height: '100%', width: '50%', flexDirection: 'col' }}>
                      {
                        rightdata2.map(data => (
                          <div style={{ height: '33.3%', width: '100%', display: 'flex', flexDirection: 'row' }}>
                            <div style={{ width: '100%', height: '33%', display: 'flex', flexDirection: 'row', padding: '1rem 3rem' }}>
                              <div style={{ width: '100%', height: '100%', textAlign: 'start' }}>
                                {data.NAME}
                              </div>
                              <div className='fs21 fwb' style={{ width: '50%', height: '100%', textAlign: 'end', color: 'rgba(0, 172, 255, 1)' }}>
                                {data.NUM} / {data.PERCENT}
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
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(OverallView);
