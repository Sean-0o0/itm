import React from 'react';
// import { message } from 'antd';
import { connect } from 'dva';
// import { FetchQueryModuleChartConfig, FetchQueryErrOrImpRptStat } from '../../../services/largescreen';
import ChartBox from '../../../centralOpert/ChartBox';

import EventReport from '../../../ClearingPlace/EventReport';
import { FetchQueryChartIndexData, FetchQueryErrOrImpRpt } from '../../../../../services/largescreen';
import { message } from 'antd';
import Swiper from 'react-id-swiper';


class RunEffect extends React.Component {
  state = {
    // runEffectTotal: {unuseTotal: 32, usingTotal: 45, leaveTotal: 56},
    runEffectTotal: [],
    runEffectDetl: []
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  fetchData = (chartCode, index) => {
    FetchQueryChartIndexData({
      chartCode: chartCode,
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          if(index === 0) {
            this.setState({ runEffectTotal: data });
          } else if (index === 1) {
            this.setState({ runEffectDetl: data });
          }
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  render() {
    const { runEffectTotal = {}, runEffectDetl = []} = this.state;
    const { chartConfigTotal = [], chartConfigDetl = [] } = this.props;
    if(chartConfigTotal.length && chartConfigTotal[0].chartCode) {
      this.fetchData(chartConfigTotal[0].chartCode, 0);
    }
    if(chartConfigDetl.length && chartConfigDetl[0].chartCode) {
      this.fetchData(chartConfigDetl[0].chartCode, 1);
    }
    return (
      <div className="pd10" style={{height: "75.8%"}}>
        <div className="ax-card flex-c">
          <div className="pos-r" style={{width: '100%', height: '100%'}}>
            <div className="card-title title-c">{chartConfigTotal.length && chartConfigTotal[0].chartTitle ? chartConfigTotal[0].chartTitle: ''}</div>
            <div style={{display: 'flex', flexDirection: 'row', height: '17%', justifyContent: 'space-between'}}>
              <div style={{height: '100%', width: '30%', position: 'relative'}}>
                <div style={{height:'90%',marginLeft: '2rem',width:'60%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-nouse.png")+")", backgroundRepeat: 'no-repeat'}}>
                </div>
                <div style={{fontWeight: 'bold', position: 'absolute', left: '70%', top: '25%'}}>未使用</div>
                <div style={{position: 'absolute', top: '50%', left: '70%', fontWeight: 'bold', color: '#00ACFF', fontSize: '20px'}}>{runEffectTotal[0] ? runEffectTotal[0].UNUSETOTAL : 0}</div>
              </div>
              <div style={{height: '100%', width: '30%', position: 'relative'}}>
                <div style={{height:'90%',marginLeft: '2rem',width:'60%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-using.png")+")", backgroundRepeat: 'no-repeat'}}>
                </div>
                <div style={{fontWeight: 'bold', position: 'absolute', left: '70%', top: '25%'}}>使用中</div>
                <div style={{position: 'absolute', top: '50%', left: '70%', fontWeight: 'bold', color: '#00ACFF', fontSize: '20px'}}>{runEffectTotal[0] ? runEffectTotal[0].USINGTOTAL : 0}</div>
              </div>
              <div style={{height: '100%', width: '30%', position: 'relative', marginRight: '2rem'}}>
                <div style={{height:'90%',marginLeft: '2rem',width:'60%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-leave.png")+")", backgroundRepeat: 'no-repeat'}}>
                </div>
                <div style={{fontWeight: 'bold', position: 'absolute', left: '70%', top: '25%'}}>闲置率</div>
                <div style={{position: 'absolute', top: '50%', left: '70%', fontWeight: 'bold', color: '#00ACFF', fontSize: '20px'}}>{runEffectTotal[0] ? runEffectTotal[0].LEAVETOTAL : 0}</div>
              </div>
            </div>

            <div className="Bond" style={{ padding: '0rem 3rem', width: '100%', height: '10%'}}>
              <div className='bg_table table_style h100 flex-r fwb' >
                <div style={{ width: '30rem',height: '100%', display: 'flex', flexDirection: 'row',alignItems:'center'}}>
                  <div style={{height:'30%', marginLeft: '13rem', width:'6%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-use-tag.png")+")", backgroundRepeat: 'no-repeat'}}>
                  </div>
                  <div style={{height: '100%',width:'20%', marginTop: '4.5rem', marginLeft: '1rem'}}>
                    使用率
                  </div>
                </div>
                <div style={{ width: '30rem',height: '100%', display: 'flex', flexDirection: 'row',alignItems:'center'}}>
                  <div style={{height:'30%', marginLeft: '11rem', width:'6%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-leave-tag.png")+")", backgroundRepeat: 'no-repeat'}}>
                  </div>
                  <div style={{height: '100%',width:'20%', marginTop: '4.5rem', marginLeft: '1rem'}}>
                    闲置率
                  </div>
                </div>
              </div>
            </div>


            {runEffectDetl.map((data, index) => (
              <React.Fragment key={index}>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%', height: '10%'}}>
                  <div style={{width: '30%', height: '100%', textAlign: 'right', color: '#C6E2FF', fontWeight: 'bold'}}>{data.DEPARTMENT}</div>
                  <div style={{width: '60%', height: '100%',position:'relative',marginLeft: '2rem'}}>
                    <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#00C2FF', width: data.USINGRATIO +'%',zIndex: '1'}}></div>
                    <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#054492', width: '100%'}}></div>
                    <div style={{position: 'absolute', left: '0', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-use-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>
                    <div style={{position: 'absolute', left: '5%', top: '35%', color: '#00ACFF'}}>{data.USINGRATIO}%</div>
                    <div style={{position: 'absolute', left: (data.USINGRATIO - 2) + '%', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-leave-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>
                    <div style={{position: 'absolute', left: (data.USINGRATIO - 2 + 5) +'%', top: '35%'}}>{data.LEAVERATIO}%</div>
                  </div>
                </div>
              </React.Fragment>
            ))}


          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(RunEffect);
