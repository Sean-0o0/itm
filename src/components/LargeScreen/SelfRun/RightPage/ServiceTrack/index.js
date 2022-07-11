import React from 'react';
// import { message } from 'antd';
import { connect } from 'dva';
// import { FetchQueryModuleChartConfig, FetchQueryErrOrImpRptStat } from '../../../services/largescreen';
import EventReport from '../../../ClearingPlace/EventReport';
import { FetchQueryChartIndexData, FetchQueryErrOrImpRpt } from '../../../../../services/largescreen';
import { message } from 'antd';
import Swiper from 'react-id-swiper';


class ServiceTrack extends React.Component {
  state = {
    errOrImpRpt: [],
    fundAccountOpen: {},
    fundAccountClose: {},
    fundAccountChange: {},
    bondAccountOpen:  {},
    bondAccountClose:  {}
  };

  componentDidMount() {
    this.fetchErrOrImpRpt();
  }

  componentWillUnmount() {
  }

  //重大事项查询
  fetchErrOrImpRpt = () => {
    FetchQueryErrOrImpRpt({
      screenPage: 13,
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ errOrImpRpt: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  fetchData = (chartCode) => {
    FetchQueryChartIndexData({
      chartCode: chartCode,
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ serviceTrackStat: data });
          data.forEach( e => {
            if(e.ACCOUNTCONTENT === '资金账户开户') {
              this.setState({ fundAccountOpen: e });
            } else if (e.ACCOUNTCONTENT === '资金账户销户') {
              this.setState({ fundAccountClose: e });
            } else if (e.ACCOUNTCONTENT === '资金账户开户变更') {
              this.setState({ fundAccountChange: e });
            } else if (e.ACCOUNTCONTENT === '证券账户开户') {
              this.setState({ bondAccountOpen: e });
            } else if (e.ACCOUNTCONTENT === '证券账户销户') {
              this.setState({ bondAccountClose: e });
            }
          })
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  render() {
    const { errOrImpRpt = [], fundAccountOpen = {}, fundAccountClose = {}, fundAccountChange = {}, bondAccountClose = {}, bondAccountOpen = {} } = this.state;
    const { dispatch, chartConfigStat = [], chartConfigDtl = []} = this.props;
    if(chartConfigStat.length && chartConfigStat[0].chartCode) {
      this.fetchData(chartConfigStat[0].chartCode);
    }
    return (
      <div className="h70 pd10">
        <div className="ax-card flex-c flex1" style={{wdith: '100%', height: '100%'}}>
          <div className="card-title title-r">业务实时追踪</div>

          <div style={{display: 'flex', flexDirection: 'row', width: '100%', height: '60%'}}>

            <div style={{width: '48%', height: '100%', position: 'relative'}}>

              <div style={{height:'55%',width:'10%',marginLeft: '3rem',  backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-line2.png")+")", backgroundRepeat: 'no-repeat'}}></div>
              <div style={{position: 'absolute', left: '20%', top: '0', color: '#00ACFF', fontWeight: 'bold'}}>证券账户</div>
              <div style={{width: '80%', height: '20%', position: 'absolute', top: '13%', left:'20%', background: 'linear-gradient(-89deg, #142F95, #11276F)'}}>
                <div style={{margin: '1.5rem 0 0 2rem'}}>证券账户开户</div>
                <div style={{margin: '2.5rem 1rem 1rem 2rem', justifyContent:'space-between', display: 'flex'}} >
                  <span>已完成<span style={{color: '#00ACFF'}}>{bondAccountOpen.FINISH}</span></span>
                  <span style={{}}>进行中<span style={{color: '#F7B432'}}>{bondAccountOpen.PROCESS}</span></span>
                  <span style={{}}>超时<span style={{color: '#FF0000'}}>{bondAccountOpen.OVERTIME}</span></span>
                </div>
              </div>

              <div style={{width: '80%', height: '20%', position: 'absolute', top: '45%', left:'20%', background: 'linear-gradient(-89deg, #142F95, #11276F)'}}>
                <div style={{margin: '1.5rem 0 0 2rem'}}>证券账户销户</div>
                <div style={{margin: '2.5rem 1rem 1rem 2rem', justifyContent:'space-between', display: 'flex'}} >
                  <span>已完成<span style={{color: '#00ACFF'}}>{bondAccountClose.FINISH}</span></span>
                  <span style={{}}>进行中<span style={{color: '#F7B432'}}>{bondAccountClose.PROCESS}</span></span>
                  <span style={{}}>超时<span style={{color: '#FF0000'}}>{bondAccountClose.OVERTIME}</span></span>
                </div>
              </div>

            </div>

            <div style={{width: '48%', height: '100%', position: 'relative'}}>
              <div style={{height:'80%',width:'10%',marginLeft: '3rem',  backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-line3.png")+")", backgroundRepeat: 'no-repeat'}}></div>
              <div style={{position: 'absolute', left: '20%', top: '0', color: '#00ACFF', fontWeight: 'bold'}}>资金账户</div>
              <div style={{width: '80%', height: '20%', position: 'absolute', top: '12%', left:'20%', background: 'linear-gradient(-89deg, #142F95, #11276F)'}}>
                <div style={{margin: '1.5rem 0 0 2rem'}}>资金账户开户</div>
                <div style={{margin: '2.5rem 1rem 1rem 2rem', justifyContent:'space-between', display: 'flex'}} >
                  <span>已完成<span style={{color: '#00ACFF'}}>{fundAccountOpen.FINISH}</span></span>
                  <span style={{}}>进行中<span style={{color: '#F7B432'}}>{fundAccountOpen.PROCESS}</span></span>
                  <span style={{}}>超时<span style={{color: '#FF0000'}}>{fundAccountOpen.OVERTIME}</span></span>
                </div>
              </div>

              <div style={{width: '80%', height: '20%', position: 'absolute', top: '40%', left:'20%', background: 'linear-gradient(-89deg, #142F95, #11276F)'}}>
                <div style={{margin: '1.5rem 0 0 2rem'}}>资金账户销户</div>
                <div style={{margin: '2.5rem 1rem 1rem 2rem', justifyContent:'space-between', display: 'flex'}} >
                  <span>已完成<span style={{color: '#00ACFF'}}>{fundAccountClose.FINISH}</span></span>
                  <span style={{}}>进行中<span style={{color: '#F7B432'}}>{fundAccountClose.PROCESS}</span></span>
                  <span style={{}}>超时<span style={{color: '#FF0000'}}>{fundAccountClose.OVERTIME}</span></span>
                </div>
              </div>

              <div style={{width: '80%', height: '20%', position: 'absolute', top: '70%', left:'20%', background: 'linear-gradient(-89deg, #142F95, #11276F)'}}>
                <div style={{margin: '1.5rem 0 0 2rem'}}>资金账户开户变更</div>
                <div style={{margin: '2.5rem 1rem 1rem 2rem', justifyContent:'space-between', display: 'flex'}} >
                  <span>已完成<span style={{color: '#00ACFF'}}>{fundAccountChange.FINISH}</span></span>
                  <span style={{}}>进行中<span style={{color: '#F7B432'}}>{fundAccountChange.PROCESS}</span></span>
                  <span style={{}}>超时<span style={{color: '#FF0000'}}>{fundAccountChange.OVERTIME}</span></span>
                </div>
              </div>
            </div>


          </div>


          <div style={{height: '40%', margin: '0 5px 0 5px'}}>
            <EventReport showTitle={false} errOrImpRpt={errOrImpRpt} />
          </div>


        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(ServiceTrack);
