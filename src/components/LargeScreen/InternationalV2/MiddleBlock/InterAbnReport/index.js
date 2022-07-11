import React from 'react';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/src/styles/css/swiper.css';
import InterAbnReporList from './InterAbnReportList'

class InterAbnReport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      useSwiper: false,
      isContinue: true,
    }
    this.list = React.createRef();
    this.box = React.createRef();
    this.swiperRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { InterAbnReport = [] } = this.props;
    let { isContinue = false } = this.state;
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      isContinue = true;
    }
    if (InterAbnReport.length && isContinue) {
      const listHeight = this.list.current.offsetHeight;
      const boxHeight = this.box.current.offsetHeight;
      if (listHeight < boxHeight) {
        this.setState({
          useSwiper: true,
          isContinue: false,
        })
      }else{
        this.setState({
          useSwiper: false,
          isContinue: false,
        })
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
    const { InterAbnReport = [],chartConfig=[] } = this.props;
    const tmpl = [];
    const { useSwiper } = this.state;
    for (let i = 0; i < InterAbnReport.length; i++) {
      tmpl.push(i);
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
    }


    return (
      <div className="ax-card flex-c flex1" >
        {/* <div className="card-title title-r">{title}</div> */}
        <div className="card-title title-r">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}</div>
        <div className="chart-box tl pos-r" style={{ overflow: 'hidden' }}>
          {tmpl.length === 0 ?
            (<React.Fragment>
              <div className="evrt-bg evrt-bgimg"></div>
              <div className="tc pt10per blue" style={{fontSize:'1.633rem'}}>暂无异常业务说明</div>
            </React.Fragment>) :
            (<ul className="report-list" ref={this.list} style={{ overflow: "hidden" }} onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                {useSwiper === false ?
                  (
                    <div className="er-box" ref={this.box}>
                      {tmpl.map(i => (
                        <div key={i}>
                          <InterAbnReporList
                            infoItem={InterAbnReport[i]}
                          />
                        </div>

                      ))}
                    </div>
                  )
                  : (
                    <React.Fragment>
                      <div className="er-box" ref={this.box} style={{ display: 'block',position: 'absolute', zIndex: '-1000' }}>
                        {tmpl.map(i => (
                          <div key={i}>
                            <InterAbnReporList
                              infoItem={InterAbnReport[i]}
                            />
                          </div>

                        ))}
                      </div>
                      <Swiper ref={this.swiperRef}
                              {...params}>
                        {tmpl.map(i => (
                          <div key={i}>
                            <InterAbnReporList
                              infoItem={InterAbnReport[i]}
                            />
                          </div>
                        ))}
                      </Swiper>
                      {/* <div className = 'shade'>
                      </div> */}
                    </React.Fragment>)
                }
              </ul>
            )
          }

        </div>
      </div >
    );
  }
}
export default InterAbnReport ;


