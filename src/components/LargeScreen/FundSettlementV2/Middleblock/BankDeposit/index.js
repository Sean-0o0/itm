import React from 'react';
import RowItem from './RowItem';
import { Scrollbars } from 'react-custom-scrollbars';
import Swiper from 'react-id-swiper';

class BankDeposit extends React.Component {
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
    const { BankDepositData = [] } = this.props;
    let { isContinue = false } = this.state;
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      isContinue = true;
    }
    if (BankDepositData.length && isContinue && this.box.current && this.list.current) {
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
    const { BankDepositData = [] } = this.props;
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
          <div className='card-title title-c'>银行存放比</div>
        </div>

        <div style={{ height: 'calc(100% - 3.66rem)', padding: '1.5rem 2rem 0 2rem', fontSize: '1.633rem' }}>
          <div className='flex-c h100'>
            <div className='flex-c h13'>
              <div className='bg_table table_style flex-r fwb' style={{ padding: '0rem 2rem' }}>
                <div className='flex1'>存管银行</div>
                <div className='tr' style={{ width: '13rem' }}>保证金</div>
                <div className='tr' style={{ width: '13rem' }}>实际存放比</div>
              </div>
            </div>
            <div style={{ overflow: 'hidden', height: '86%' }}>
              {BankDepositData.length === 0 ?
                (<React.Fragment>
                  <div className='evrt-bg evrt-bgimg'></div>
                  <div className='tc blue' style={{ fontSize: '1.633rem' }}>暂无数据</div>
                </React.Fragment>) :
                (<ul className='report-list' ref={this.list} style={{ overflow: 'hidden' }}
                  onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                  {useSwiper === false ?
                    (
                      <div className='er-box' ref={this.box}>
                        {BankDepositData.map((item, index) => (
                          <RowItem item={item} key={index} />
                        ))}
                      </div>)
                    : (<Swiper ref={this.swiperRef}
                      {...params}>
                        {BankDepositData.map((item, index) => (
                          <div key={index}>
                            <RowItem item={item} />
                          </div>
                        ))}
                    </Swiper>)}
                </ul>)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default BankDeposit;
