import React from 'react';
// import { Scrollbars } from 'react-custom-scrollbars';
import 'react-id-swiper/src/styles/css/swiper.css';
import RowItem from './RowItem';
import Swiper from 'react-id-swiper';

class Provision extends React.Component {
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
    const { ProvData = [] } = this.props;
    let { isContinue = false } = this.state;
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      isContinue = true;
    }
    if (ProvData.length && isContinue && this.box.current && this.list.current) {
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
    const { ProvData = [] } = this.props;
    const { useSwiper } = this.state;
    // for (let i = 0; i < ProvData.length; i++) {
    //   tmpl.push(i);
    // }
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
          <div className='card-title title-c'>备付金尚未支付</div>
        </div>
        <div style={{ height: 'calc(100% - 3.66rem)', padding: '1.5rem 2rem 0 2rem', fontSize: '1.633rem' }}>
          <div className='flex-c h100'>
            <div className='flex-c h16'>
              <div className='bg_table table_style flex-r fwb' style={{ padding: '0rem 2rem' }}>
                <div className='flex1'>账户</div>
                <div className='tr' style={{ width: '10rem' }}>可用余额</div>
                <div className='tr' style={{ width: '10rem' }}>未支付金额</div>
              </div>
            </div>

            <div style={{ overflow: 'hidden', height: '84%' }}>
              {ProvData.length === 0 ?
                (<React.Fragment>
                  <div className='evrt-bg evrt-bgimg'></div>
                  <div className='tc blue' style={{ fontSize: '1.633rem' }}>暂无数据</div>
                </React.Fragment>) :
                (<ul className='report-list' ref={this.list} style={{ overflow: 'hidden' }}
                  onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                  {useSwiper === false ?
                    (
                      <div className='er-box' ref={this.box}>
                        {ProvData.map((item, index) => (
                          <RowItem item={item} key={index} />
                        ))}
                      </div>)
                    : (
                      <React.Fragment>
                        <Swiper ref={this.swiperRef}
                          {...params}>
                          {ProvData.map((item, index) => (
                            <div key={index}>
                              <RowItem
                                item={item}
                              />
                            </div>

                          ))}
                        </Swiper>
                      </React.Fragment>
                    )}
                </ul>)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Provision;
