import React from 'react';
// import { message } from 'antd';
import { connect } from 'dva';
// import { FetchQueryModuleChartConfig, FetchQueryErrOrImpRptStat } from '../../../services/largescreen';
import Swiper from 'react-id-swiper';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';
import { message } from 'antd';


class UseFee extends React.Component {
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

    return (
      <div className="h50 pd10">
        <div className="ax-card flex-c">
          <div className="pos-r" style={{width: '100%', height: '100%'}}>
            <div className="card-title title-c">交易单元使用费预估</div>
            <div style={{display: 'flex', height: '100%', width: '100%', flexDirection: 'column'}}>

              <div style={{ padding: '1rem 3rem', height: '28%', display: 'flex', flexDirection: 'row', marginTop: '1.5rem'}}>
                <div className='bg_table table_style h100 fwb' style={{width: '48%', background: '#052574', marginRight: '3rem'}} >
                  <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{fontSize: '2rem', paddingTop: '4rem',height: '50%', textAlign: 'center', width: '100%'}}>
                      {dataList[0] ? dataList[0].GROUPNAME : ""}
                    </div>
                    <div style={{fontSize: '3rem', color: '#00ACFF',height: '50%', paddingTop: '1.5rem', textAlign: 'center', width: '100%'}}> {dataList[0] ? dataList[0].ESTIMATEDCOST : ""}<span style={{fontSize: '2rem'}}>万元</span></div>
                  </div>
                </div>
                <div className='bg_table table_style h100 fwb' style={{width: '48%', background: '#052574'}} >
                  <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{fontSize: '2rem', paddingTop: '4rem',height: '50%', textAlign: 'center', width: '100%'}}>
                      {dataList[1] ? dataList[1].GROUPNAME : ""}
                    </div>
                    <div style={{fontSize: '3rem', color: '#00ACFF',height: '50%', paddingTop: '1.5rem', textAlign: 'center', width: '100%'}}>{dataList[1] ? dataList[1].ESTIMATEDCOST : ""}<span style={{fontSize: '2rem'}}>万元</span></div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1rem 3rem', height: '28%', display: 'flex', flexDirection: 'row', marginTop: '0.5rem'}}>
                <div className='bg_table table_style h100 fwb' style={{width: '48%', background: '#052574', marginRight: '3rem'}} >
                  <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{fontSize: '2rem', paddingTop: '4rem',height: '50%', textAlign: 'center', width: '100%'}}>
                      {dataList[2] ? dataList[2].GROUPNAME : ""}
                    </div>
                    <div style={{fontSize: '3rem', color: '#00ACFF',height: '50%', paddingTop: '1.5rem', textAlign: 'center', width: '100%'}}>{dataList[2] ? dataList[2].ESTIMATEDCOST : ""}<span style={{fontSize: '2rem'}}>万元</span></div>
                  </div>
                </div>
                <div className='bg_table table_style h100 fwb' style={{width: '48%', background: '#052574'}} >
                  <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{fontSize: '2rem', paddingTop: '4rem',height: '50%', textAlign: 'center', width: '100%'}}>
                      {dataList[3] ? dataList[3].GROUPNAME : ""}
                    </div>
                    <div style={{fontSize: '3rem', color: '#00ACFF',height: '50%', paddingTop: '1.5rem', textAlign: 'center', width: '100%'}}>{dataList[3] ? dataList[3].ESTIMATEDCOST : ""}<span style={{fontSize: '2rem'}}>万元</span></div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '1rem 3rem', height: '28%', display: 'flex', flexDirection: 'row', marginTop: '0.5rem'}}>
                <div className='bg_table table_style h100 fwb' style={{width: '48%', background: '#052574', marginRight: '3rem'}} >
                  <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{fontSize: '2rem', paddingTop: '4rem',height: '50%', textAlign: 'center', width: '100%'}}>
                      {dataList[4] ? dataList[4].GROUPNAME : ""}
                    </div>
                    <div style={{fontSize: '3rem', color: '#00ACFF',height: '50%', paddingTop: '1.5rem', textAlign: 'center', width: '100%'}}>{dataList[4] ? dataList[4].ESTIMATEDCOST : ""}<span style={{fontSize: '2rem'}}>万元</span></div>
                  </div>
                </div>
                <div className='bg_table table_style h100 fwb' style={{width: '48%', background: '#052574'}} >
                  <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div style={{fontSize: '2rem', paddingTop: '4rem',height: '50%', textAlign: 'center', width: '100%'}}>
                      {dataList[5] ? dataList[5].GROUPNAME : ""}
                    </div>
                    <div style={{fontSize: '3rem', color: '#00ACFF',height: '50%', paddingTop: '1.5rem', textAlign: 'center', width: '100%'}}>{dataList[5] ? dataList[5].ESTIMATEDCOST : ""}<span style={{fontSize: '2rem'}}>万元</span></div>
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
}))(UseFee);
