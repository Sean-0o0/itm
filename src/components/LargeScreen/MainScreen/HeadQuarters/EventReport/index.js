import React from 'react';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/src/styles/css/swiper.css';
import EventList from '../../../ClearingPlace/EventReport/EventList';

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
        if (errOrImpRpt.length && isContinue) {
            const listHeight = this.list.current.offsetHeight;
            const boxHeight = this.box.current.offsetHeight;
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
        const { errOrImpRpt = [] } = this.props;
        const tmpl = [];
        const { useSwiper } = this.state;
        for (let i = 0; i < errOrImpRpt.length; i++) {
            tmpl.push(i);
        }
        const params = {
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                // waitForTransition: false,
            },
            speed: 5000,
            direction: 'vertical',
            loop: true,
            freeMode: true,
            slidesPerView: 'auto',
            loopedSlides: 30,
            initialSlide: 0,
            centeredSlides: true,
            centeredSlidesBounds: true,
            autoHeight: true,
            mousewheel: true,
            grabCursor: true,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            shouldSwiperUpdate: true,
            // watchOverflow: true,
        }


        return (
            <div className="flex1 flex-c zb-data-item" style={{ overflow: "hidden" }}>
                <div className="card-title-sec">异常或重大事项报告</div>
                <div className="chart-box2 tl">
                    {tmpl.length === 0 ?
                        (<React.Fragment>
                            <div className="evrt-bg evrt-bgimg"></div>
                            <div className="tc pt10per blue">暂无重大事项</div>
                        </React.Fragment>) :
                        (<ul className="report-list" ref={this.list} style={{ overflow: "hidden" }} onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                            {useSwiper === false ?
                                (
                                    <div className="er-box" ref={this.box}>
                                        {tmpl.map(i => (
                                            <div key={i}>
                                                <EventList
                                                    key={i}
                                                    infoItem={errOrImpRpt[i]}
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
                                                    <EventList
                                                        key={i}
                                                        infoItem={errOrImpRpt[i]}
                                                    />
                                                </div>

                                            ))}
                                        </div>
                                        <Swiper ref={this.swiperRef}
                                            {...params}>
                                            {tmpl.map(i => (
                                                <div key={i}>
                                                    <EventList
                                                        key={i}
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
        );
    }
}
export default EventReport;

