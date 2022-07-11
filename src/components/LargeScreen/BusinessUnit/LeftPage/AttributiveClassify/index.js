import React from 'react';
import { connect } from 'dva';
import { Icon, message } from 'antd';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';


class AttributiveClassify extends React.Component {
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
          <div className="box-title">
            <div className="card-title title-l">交易单元属性分类</div>
          </div>
          <div className="pos-r" style={{width: '100%', height: '100%', marginTop: '2rem'}}>


            <div style={{ padding: '0rem 2rem', height: 'calc(100% - 1.667rem)', fontSize: '1.5rem' }}>
              <div className='flex-c' style={{height: '100%' }}>
                <div className='flex-r left-cont-box'>
                  <div className='flex-r left-cont-title' style={{width: '18rem'}}>
                  </div>
                  <div className='flex1 flex-r' style={{color: '#00ACFF', display: 'flex', flex: '1 1', padding: '0 1.5rem'}}>
                    <div className='flex1 tr'>上月存量</div>
                    <div className='flex1 tr'>当月增长</div>
                    <div className='flex1 tr'>总数</div>
                    <div className='flex1 tr'>占比</div>
                  </div>
                </div>

                {
                  dataList.map((item, index) => {
                    if(item.GROUPNO === '8') {
                      return (
                        <div className='flex1 flex-r left-data-box' style={{alignItems: 'center', marginTop: '1rem', padding: '0 1.5rem'}}>
                          <div className='flex-r left-data-sub' style={{width: '18rem', color: '#00ACFF'}}>
                            {item.GROUPNAME}
                          </div>
                          <div className='flex1 flex-r blue fs21' style={{display: 'flex', flex: '1 1'}}>
                            <div className='flex1 tr fwb' style={{ color: '#00ACFF', fontWeight: 'bold' }}>
                              {item.LASTMONTHSTOCK}
                            </div>
                            <div className='flex1 tr fwb' style={{ color: '#00ACFF', fontWeight: 'bold' }}>
                              {item.MONTHINCREASE}
                            </div>
                            <div className='flex1 tr fwb' style={{ color: '#00ACFF', fontWeight: 'bold' }}>
                              {item.TOTAL}
                            </div>
                            <div className='flex1 tr fwb' style={{ color: '#00ACFF', fontWeight: 'bold' }}>
                              {item.RATIO}
                            </div>
                          </div>
                        </div>
                      )
                    } else {
                      return (<div className='flex1 flex-r left-data-box' style={{
                        background: 'rgba(17, 39, 111, 0.7)',
                        alignItems: 'center',
                        marginTop: '1rem',
                        padding: '0 1.5rem'
                      }}>
                        <div className='flex-r left-data-sub' style={{ width: '18rem' }}>
                          {item.GROUPNAME}
                        </div>
                        <div className='flex1 flex-r blue fs21' style={{ display: 'flex', flex: '1 1' }}>
                          <div className='flex1 tr fwb' style={{ color: '#FFFFFF' }}>
                            {item.LASTMONTHSTOCK}
                          </div>
                          <div className='flex1 tr fwb'
                               style={{ color: item.MONTHINCREASE >= 0 ? '#FF1200' : '#40CB67' }}>
                            {item.MONTHINCREASE}
                          </div>
                          <div className='flex1 tr fwb' style={{ color: '#FFFFFF' }}>
                            {item.TOTAL}
                          </div>
                          <div className='flex1 tr fwb' style={{ color: '#FFFFFF' }}>
                            {item.RATIO}
                          </div>
                        </div>
                      </div>)
                    }
                  })
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
}))(AttributiveClassify);
