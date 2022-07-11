import React from 'react';
import 'react-id-swiper/src/styles/css/swiper.css';
import Swiper from 'react-id-swiper';

class RiskWarning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      useSwiper: false,
      isContinue: true,
    };
    this.list = React.createRef();
    this.box = React.createRef();
    this.swiperRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { riskIndex = [] } = this.props;
    let { isContinue = false } = this.state;
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      isContinue = true;
    }
    if (riskIndex.length && isContinue && this.box.current && this.list.current) {
      const listHeight = this.list.current.offsetHeight ? this.list.current.offsetHeight : 0;
      const boxHeight = this.box.current.offsetHeight ? this.box.current.offsetHeight : 0;
      if (listHeight < boxHeight) {
        this.setState({
          useSwiper: true,
          isContinue: false,
        });
      } else {
        this.setState({
          useSwiper: false,
          isContinue: false,
        });
      }
    }
  }

  startAutoplay = () => {
    if (this.swiperRef.current && this.swiperRef.current.swiper) {
      this.swiperRef.current.swiper.autoplay.start();
    }
  };

  stopAutoplay = () => {
    if (this.swiperRef.current && this.swiperRef.current.swiper) {
      this.swiperRef.current.swiper.autoplay.stop();
    }
  };

  render() {
    const { riskIndex = [] } = this.props;
    const { useSwiper } = this.state;
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

    return (
      <div className='ax-card flex-c left-cont FundSettlement'>
        <div className='pos-r'>
          <div className='card-title title-r'>风险提示（交收、网银、其他）</div>
        </div>
        <div style={{ height: 'calc(100% - 3.66rem)', padding: '1rem 0 0 0' }}>
          {riskIndex.length === 0 ?
            (<React.Fragment>
              <div className="evrt-bg evrt-bgimg"></div>
              <div className="tc blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
            </React.Fragment>) :
            (<ul className='report-list' ref={this.list} style={{ overflow: 'hidden' }}
              onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
              {useSwiper === false ?
                (
                  <div className='er-box' ref={this.box}>
                    {riskIndex.map((item = {}, index) => {
                      const { projectName = '-', expireDate = '-' } = item;
                      return <div style={{ padding: '0rem 2rem', fontSize: '1.633rem' }} key={index}>
                        <div className='flex1 flex-r data-box data-style'>
                          <div className='flex-r '>
                            <img className="data-item-img" src={[require("../../../../../image/prompt.png")]} alt="" style={{marginRight: '2rem'}}/>
                          </div>
                          <div className='flex-r data-sub data-font '>
                            {projectName} {expireDate} 到期
                          </div>
                        </div>
                      </div>
                    })}
                  </div>)
                : (
                  <React.Fragment>
                    <Swiper ref={this.swiperRef}
                      {...params}>
                      {riskIndex.map((item = {}, index) => {
                        const { projectName = '-', expireDate = '-' } = item;
                        return <div style={{ padding: '0rem 2rem', fontSize: '1.633rem' }} key={index}>
                          <div className='flex1 flex-r data-box data-style'>
                            <div className='flex-r '>
                              <img className="data-item-img" src={[require("../../../../../image/prompt.png")]} alt="" style={{marginRight: '2rem'}}/>
                            </div>
                            <div className='flex-r data-sub data-font '>
                              {projectName} {expireDate} 到期
                            </div>
                          </div>
                        </div>
                      })}
                    </Swiper>
                  </React.Fragment>
                )}
            </ul>)
            // (<React.Fragment>
            //   {riskIndex.map((item = {}, index) => {
            //     const { projectName = '-', expireDate = '-' } = item;
            //     return <div style={{ padding: '0rem 2rem', fontSize: '1.633rem' }} key={index}>
            //       <div className='flex1 flex-r data-box data-style'>
            //         <div className='flex-r '>
            //           <img className="data-item-img" src={[require("../../../../../image/icon_abnormal.png")]} alt="" />
            //         </div>
            //         <div className='flex-r data-sub data-font '>
            //           {projectName} {expireDate} 到期
            //         </div>
            //       </div>
            //     </div>
            //   })}
            // </React.Fragment>)
          }
        </div>

      </div>


    );
  }
}

export default RiskWarning;

