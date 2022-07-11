import React from 'react';
// import { message } from 'antd';
import { connect } from 'dva';
import { FetchQueryChartIndexData, FetchQueryErrOrImpRpt } from '../../../../../services/largescreen';
import { message } from 'antd';
import Swiper from 'react-id-swiper';


class RiskNote extends React.Component {
  state = {
    useSwiper: true,
    riskList: []
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
          this.setState({ riskList: data });
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
    const params = {
      direction: 'vertical',
      speed: 5000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      freeMode: true,
      slidesPerView: 'auto',
      autoHeight: true,
      initialSlide: 0,
      loop: true,
      loopedSlides: 10,
      centeredSlides: true,
      centeredSlidesBounds: true,
      mousewheel: true,
      grabCursor: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      shouldSwiperUpdate: true,
    };
    const {  riskList = [], useSwiper = false} = this.state;

    return (
      <div className="h30 pd10">
        <div className="ax-card flex-c flex1">
          <div className="card-title title-r">{chartConfig.length && chartConfig[0].chartCode ? chartConfig[0].chartTitle : ''}</div>
          <div style={{ height: 'calc(100% - 3.66rem)', padding: '1rem 0 0 0' }}>
            {riskList.length === 0 ?
              (<React.Fragment>
                <div className="evrt-bg evrt-bgimg"></div>
                <div className="tc blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
              </React.Fragment>) :
              (<ul className='report-list' ref={this.list} style={{ overflow: 'hidden' }}
                   onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                {useSwiper === false ?
                  (
                    <div className='er-box' ref={this.box}>
                      {riskList.map((item = {}, index) => {
                        const { RISKNAME = '-', ALERT = '0' } = item;
                        return <div style={{ padding: '0 2rem', paddingBottom: '1rem', fontSize: '1.633rem', }}>
                          <div className={ALERT === '0' ?'flex1 flex-r data-box-r data-style bg_table':'flex1 flex-r data-box-r data-style'} style={{boxShadow: ALERT === '0' ? '0 0 1rem #40A0ED inset': '0 0 1rem #e23c39 inset', height: '4rem'}}>
                            <div className='flex-r '>
                              {ALERT === '0' ? <img className="data-item-img" src={[require("../../../../../image/icon-note2.png")]} alt="" style={{ marginRight: '2rem', marginTop: '1rem', width:'2rem',height: '2rem' }} /> :
                                <img className="data-item-img" src={[require("../../../../../image/icon-note.png")]} alt="" style={{ marginRight: '2rem',marginTop: '1rem', width:'2rem',height: '2rem'  }} />
                              }
                            </div>
                            <div className='flex-r data-sub data-font ' style={{marginTop: '1rem'}}>
                              {RISKNAME}
                            </div>
                          </div>
                        </div>
                      })}

                    </div>)
                  : (
                    <React.Fragment>
                      <Swiper ref={this.swiperRef}
                              {...params}>
                        {riskList.map((item = {}, index) => {
                          const { RISKNAME = '-', ALERT = '0' } = item;
                          return <div style={{ padding: '0 2rem', paddingBottom: '1rem', fontSize: '1.633rem' }}>
                            <div className={ALERT === '0' ?'flex1 flex-r data-box-r data-style bg_table':'flex1 flex-r data-box-r data-style'} style={{boxShadow: ALERT === '0' ? '0 0 1rem #40A0ED inset': '0 0 1rem #e23c39 inset', height: '4rem'}}>
                              <div className='flex-r '>
                                {ALERT === '0' ? <img className="data-item-img" src={[require("../../../../../image/icon-note.png")]} alt="" style={{ marginRight: '2rem', marginTop: '1rem', width:'2rem',height: '2rem' }} /> :
                                  <img className="data-item-img" src={[require("../../../../../image/icon-note2.png")]} alt="" style={{ marginRight: '2rem', marginTop: '1rem', width:'2rem',height: '2rem'  }} />
                                }
                              </div>
                              <div className='flex-r data-sub data-font '  style={{marginTop: '1rem'}}>
                                {RISKNAME}
                              </div>
                            </div>
                          </div>
                        })}
                      </Swiper>
                    </React.Fragment>
                  )}
              </ul>)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(RiskNote);
