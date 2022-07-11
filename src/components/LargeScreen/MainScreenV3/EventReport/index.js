import React from 'react';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/src/styles/css/swiper.css';

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
            const listHeight = this.list.current.offsetWidth ? this.list.current.offsetWidth : 0
            const visitedRoutes = document.getElementsByClassName('ap-list') || [];
            let totalWidth = 0;
            for (let i = 0; i < visitedRoutes.length; i++) {
                totalWidth += visitedRoutes[i].offsetWidth;
            }
            if (listHeight < totalWidth) {
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
        let { errOrImpRpt = [] } = this.props;
        const { useSwiper } = this.state;
        let params = {
            speed: 40000,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            freeMode: true,
            slidesPerView: 'auto',
            autoWidth: true,
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
            <div className="flex1 wid100 h100 pd10">
                <div className="ax-card flex-r">
                    {errOrImpRpt.length === 0 ?
                        (<div style={{ padding: "0 2rem", lineHeight: "4.2rem" }}>暂无数据</div>) :
                        (<ul ref={this.list} style={{ overflow: "hidden", width: '100%', height: '100%' }} onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                            {useSwiper === false ?
                                (
                                    <div className="er-box h100" style={{ width: 'auto' }} ref={this.box}>
                                        {errOrImpRpt.map((item = {}, index) => {
                                            return <div className="flex-r h100" style={{ lineHeight: "4.2rem", width: 'auto' }} key={index}>
                                                <div className="blue pr15 ap-list" style={{ padding: "0 2rem" }}><img className="col-icon" src={[require("../../../../image/icon_exception.png")]} alt="" />{item.PRO_NAME ? item.PRO_NAME : '-'}</div>
                                                <div className="pr15 ap-list">{item.TIME ? item.TIME : ''}</div>
                                                <div className="pr15 ap-list" style={{ width: 'auto', whiteSpace: 'nowrap' }}>{item.CONTG ? item.CONTG : '-'}</div>
                                            </div>
                                        })

                                        }
                                    </div>
                                )
                                : (
                                    <React.Fragment>
                                        <Swiper ref={this.swiperRef}
                                            {...params}
                                        >
                                            {errOrImpRpt.map((item = {}, index) => {
                                                return (
                                                    <div className="flex-r" style={{ lineHeight: "4.2rem", width: 'auto' }} key={index}>
                                                        <div className="blue pr15 ap-list" style={{ padding: "0 2rem" }}><img className="col-icon" src={[require("../../../../image/icon_exception.png")]} alt="" />{item.PRO_NAME ? item.PRO_NAME : '-'}</div>
                                                        <div className="pr15 ap-list">{item.TIME ? item.TIME : ''}</div>
                                                        <div className="pr15 ap-list" style={{ width: 'auto', whiteSpace: 'nowrap' }}>{item.CONTG ? item.CONTG : '-'}</div>
                                                    </div>
                                                )
                                            })
                                            }
                                            {errOrImpRpt.length===1?<div style={{width: 0}}></div>:null}
                                        </Swiper>
                                    </React.Fragment>)
                            }
                        </ul>
                        )
                    }

                </div>
            </div>);
    }
}

export default EventReport;


