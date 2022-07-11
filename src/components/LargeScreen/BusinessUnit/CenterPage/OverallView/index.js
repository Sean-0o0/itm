import React from 'react';
import { connect } from 'dva';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';
import { message } from 'antd';


class OverallView extends React.Component {
  state = {
    dataList: []
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
          this.setState({ dataList: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  render() {
    const {chartConfig = []} = this.props;
    if(chartConfig.length && chartConfig[0].chartCode) {
      this.fetchData(chartConfig[0].chartCode);
    }
    const { dataList } = this.state;
    const data = dataList[0];
    return (
      <div className="h50 pd10">
        <div className="ax-card flex-c">
          <div className="pos-r" style={{width: '100%', height: '100%'}}>
            <div className="card-title title-c">交易单元总览</div>
            <div style={{display: 'flex', height: '100%', width: '100%', flexDirection: 'column'}}>
              <div className="Bond" style={{ padding: '1rem 3rem', height: '30%', marginTop: '0.5rem'}}>
                <div className='bg_table table_style h100 flex-r fwb' style={{height: '100%'}}>
                  <div className='tr' style={{ width: '29rem', fontSize: '2.5rem'}}>
                    交易类总数
                  </div>
                  <div className='tr' style={{ width: '12rem', fontSize: '3rem', color: '#00ACFF', fontWeight: 'bold'}}>
                    {data ? data.ALLMKTUNIT : ""}
                  </div>
                </div>
              </div>
              <div className="Bond" style={{ padding: '1rem 3rem', height: '30%', display: 'flex', flexDirection: 'row'}}>
                <div className='bg_table table_style h100 fwb' style={{width: '48%',height: '100%',marginRight:'3rem'}}>
                    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                      <div style={{fontSize: '2rem',paddingTop: '4.5rem', textAlign: 'center', width: '100%', height: '50%'}}>
                        自营类
                      </div>
                      <div style={{fontSize: '3rem',paddingTop: '1.5rem', color: '#00ACFF', fontWeight: 'bold',height: '50%',   textAlign: 'center', width: '100%'}}>{data ? data.AUTOMKTUNIT : ""}</div>
                    </div>
                </div>
                <div className='bg_table table_style h100 fwb' style={{width: '48%',height: '100%'}}>
                  <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{fontSize: '2rem',paddingTop: '4.5rem', textAlign: 'center', width: '100%', height: '50%'}}>
                      经济类
                    </div>
                    <div style={{fontSize: '3rem',paddingTop: '1.5rem', color: '#00ACFF', fontWeight: 'bold',height: '50%',   textAlign: 'center', width: '100%'}}>{data ? data.MANAMKTUNIT : ""}</div>
                  </div>
                </div>
              </div>

              <div className="Bond" style={{ padding: '1rem 3rem', height: '30%', display: 'flex', flexDirection: 'row'}}>
                <div className='bg_table table_style h100 fwb' style={{width: '48%',height: '100%',marginRight:'3rem',}}>
                  <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{fontSize: '2rem',paddingTop: '4.5rem', textAlign: 'center', width: '100%', height: '50%'}}>
                      出租类
                    </div>
                    <div style={{fontSize: '3rem',paddingTop: '1.5rem', color: '#00ACFF', fontWeight: 'bold',height: '50%',   textAlign: 'center', width: '100%'}}>{data ? data.RENTMKTUNIT : ""}</div>
                  </div>
                </div>
                <div className='bg_table table_style h100 fwb' style={{width: '48%',height: '100%'}}>
                  <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{fontSize: '2rem',paddingTop: '4.5rem', textAlign: 'center', width: '100%', height: '50%'}}>
                      资管类
                    </div>
                    <div style={{fontSize: '3rem',paddingTop: '1.5rem', color: '#00ACFF', fontWeight: 'bold',height: '50%',   textAlign: 'center', width: '100%'}}>{data ? data.BUSIMKTUNIT : ""}</div>
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
