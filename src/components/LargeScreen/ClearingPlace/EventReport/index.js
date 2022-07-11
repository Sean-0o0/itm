import React from 'react';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/src/styles/css/swiper.css';
import EventList from './EventList';
import { Tooltip } from 'antd';

class EventReport extends React.Component {
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
        const { errOrImpRpt = [] } = this.props;
        let { isContinue = false } = this.state;
        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            isContinue = true;
        }
        if (errOrImpRpt.length && isContinue && this.box.current && this.list.current) {
            const listHeight = this.list.current.offsetHeight ? this.list.current.offsetHeight : 0
            const boxHeight = this.box.current.offsetHeight ? this.box.current.offsetHeight : 0
            if (listHeight < boxHeight) {
                this.setState({
                    useSwiper: true,
                    isContinue: false,
                })
            } else {
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
        const { errOrImpRpt = [], chartConfig = [], showTitle = true } = this.props;
        const tmpl = [];
        const { useSwiper } = this.state;
        for (let i = 0; i < errOrImpRpt.length; i++) {
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
          <React.Fragment>
            <div className="flex-c flex1 ax-card" style={{border: showTitle? 'border: 1px solid transparent' : '0px', boxShadow:  showTitle ? '0 0 1rem #00acff80 inset' : '0 0 0rem #00acff80 inset'}}>
              {showTitle === true ? (
                <div className="card-title title-r">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : '综合信息'}
                  {chartConfig.length && chartConfig[0].chartNote ?
                    (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                      <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                    </Tooltip>) : ''
                  }
                </div>
              ): null}
              <div className="chart-box tl pos-r" style={{ overflow: 'hidden' }}>
                {tmpl.length === 0 ?
                  (<React.Fragment>
                    <div className="evrt-bg evrt-bgimg"></div>
                    <div className="tc pt10per blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
                  </React.Fragment>) :
                  (<ul className="report-list" ref={this.list} style={{ overflow: "hidden" }} onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                      {useSwiper === false ?
                        (
                          <div className="er-box" ref={this.box}>
                            {tmpl.map(i => (
                              <div key={i}>
                                <EventList
                                  infoItem={errOrImpRpt[i]}
                                />
                              </div>

                            ))}
                          </div>
                        )
                        : (
                          <React.Fragment>
                            <Swiper ref={this.swiperRef}
                                    {...params}>
                              {tmpl.map(i => (
                                <div key={i}>
                                  <EventList
                                    position={1}
                                    infoItem={errOrImpRpt[i]}
                                  />
                                </div>
                              ))}
                            </Swiper>
                          </React.Fragment>)
                      }
                    </ul>
                  )
                }

              </div>
            </div >
          </React.Fragment>
        );
    }
}
export default EventReport;


