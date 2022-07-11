import React from 'react';
// import { message } from 'antd';
import { connect } from 'dva';
import { FetchQueryChartIndexData, FetchQueryErrOrImpRpt } from '../../../../../services/largescreen';
import { message } from 'antd';
import Swiper from 'react-id-swiper';


class RiskNote extends React.Component {
  state = {
    fxtsData: []
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
          this.setState({ fxtsData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };




  render() {

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
    const {chartConfig = []} = this.props;
    if(chartConfig.length && chartConfig[0].chartCode) {
      this.fetchData(chartConfig[0].chartCode);
    }
    const { fxtsData = [] } = this.state;

    return (
      <div className="h20 pd10">
        <div className="ax-card flex-c flex1">
          <div className="card-title title-r">风险提示</div>
          <div style={{ height: 'calc(100% - 3.66rem)', padding: '1rem 0 0 0' }}>
            {fxtsData.length === 0 ?
              (<React.Fragment>
                <div className="evrt-bg evrt-bgimg"></div>
                <div className="tc blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
              </React.Fragment>) :
              (<ul className='report-list' ref={this.list} style={{ overflow: 'hidden' }}
                   onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                    <React.Fragment>
                      <Swiper ref={this.swiperRef}
                              {...params}>
                        {fxtsData.map((item = {}, index) => {
                          const { RISKNAME = '-'} = item;
                          return <div style={{ padding: '0 2rem', paddingBottom: '1rem', fontSize: '1.633rem' }}>
                            <div className='flex1 flex-r data-box-r data-style bg_table' style={{boxShadow: '0 0 1rem #40A0ED inset', height: '4rem'}}>
                              <div className='flex-r'>
                                <img style={{width: '0.667rem', height: '0.667rem',marginTop: '1.5rem', marginLeft: '1rem'}} src={[require("../../../../../image/icon_exception.png")]} alt=""/>
                              </div>
                              <div className='flex-r data-sub data-font '  style={{marginTop: '1rem',marginLeft: '1rem'}}>
                                {RISKNAME}
                              </div>
                            </div>
                          </div>
                        })}
                      </Swiper>
                    </React.Fragment>
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
