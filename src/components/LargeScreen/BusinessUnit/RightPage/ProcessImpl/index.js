import React from 'react';
import { connect } from 'dva';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';
import { message } from 'antd';


class ProcessImpl extends React.Component {
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
      <div className="h30 pd10">
        <div className="ax-card flex-c flex1">
          <div className="card-title title-r">流程执行情况</div>
          <div className="pos-r" style={{width: '100%', height: '100%'}}>
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}}>
              <div className="Bond" style={{ padding: '1rem 3rem', height: '30%'}}>
                <div className='bg_table table_style h100 flex-r fwb' style={{height: '100%'}}>
                  <div className='tr' style={{ width: '20rem', fontSize: '1.8rem'}}>
                    {dataList[0] ? dataList[0].GROUPNAME : ""}
                  </div>
                  <div className='tr' style={{ width: '8rem', fontSize: '1.8rem', color: '#00ACFF', fontWeight: 'bold'}}>
                    {dataList[0] ? dataList[0].FLOWNUM : ""}
                  </div>
                  <div className='tr' style={{ width: '25rem', fontSize: '1.8rem'}}>
                    {dataList[1] ? dataList[1].GROUPNAME : ""}
                  </div>
                  <div className='tr' style={{ width: '8rem', fontSize: '1.8rem', color: '#00ACFF', fontWeight: 'bold'}}>
                    {dataList[1] ? dataList[1].FLOWNUM : ""}
                  </div>
                </div>
              </div>

              <div className="Bond" style={{ padding: '1rem 3rem', height: '30%'}}>
                <div className='bg_table table_style h100 flex-r fwb' style={{height: '100%'}}>
                  <div className='tr' style={{ width: '5rem', fontSize: '1.8rem',color: '#00ACFF', fontWeight: 'bold'}}>
                    自用
                  </div>
                  <div className='tr' style={{ width: '15rem', fontSize: '1.8rem'}}>
                    {dataList[4] ? dataList[4].GROUPNAME : ""}
                  </div>
                  <div className='tr' style={{ width: '8rem', fontSize: '1.8rem', color: '#00ACFF', fontWeight: 'bold'}}>
                    {dataList[4] ? dataList[4].FLOWNUM : ""}
                  </div>
                  <div className='tr' style={{ width: '25rem', fontSize: '1.8rem'}}>
                    {dataList[5] ? dataList[5].GROUPNAME : ""}
                  </div>
                  <div className='tr' style={{ width: '8rem', fontSize: '1.8rem', color: '#00ACFF', fontWeight: 'bold'}}>
                    {dataList[5] ? dataList[5].FLOWNUM : ""}
                  </div>
                </div>
              </div>


              <div className="Bond" style={{ padding: '1rem 3rem', height: '30%'}}>
                <div className='bg_table table_style h100 flex-r fwb' style={{height: '100%'}}>
                  <div className='tr' style={{ width: '5rem', fontSize: '1.8rem',color: '#00ACFF', fontWeight: 'bold'}}>
                    租用
                  </div>
                  <div className='tr' style={{ width: '15rem', fontSize: '1.8rem'}}>
                    {dataList[2] ? dataList[2].GROUPNAME : ""}
                  </div>
                  <div className='tr' style={{ width: '8rem', fontSize: '1.8rem', color: '#00ACFF', fontWeight: 'bold'}}>
                    {dataList[2] ? dataList[2].FLOWNUM : ""}
                  </div>
                  <div className='tr' style={{ width: '25rem', fontSize: '1.8rem'}}>
                    {dataList[3] ? dataList[3].GROUPNAME : ""}
                  </div>
                  <div className='tr' style={{ width: '8rem', fontSize: '1.8rem', color: '#00ACFF', fontWeight: 'bold'}}>
                    {dataList[3] ? dataList[3].FLOWNUM : ""}
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
}))(ProcessImpl);
