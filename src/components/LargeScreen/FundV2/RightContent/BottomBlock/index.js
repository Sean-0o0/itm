import React, { Component } from 'react'
import { Divider, Tooltip } from 'antd';
import Swiper from 'react-id-swiper';

export class BottomBlock extends Component {
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
        const { excptOrManual = [] } = this.props;
        let { isContinue = false } = this.state;
        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            isContinue = true;
        }
        if (excptOrManual.length && isContinue && this.box.current && this.list.current) {
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
        const { chartConfig = [], excptOrManual = [] } = this.props;

        const { useSwiper } = this.state;
        return (
            <div className="wid100 h100 pd10">
                <div className="ax-card pos-r flex-c">
                    <div className="pos-r">
                        <div className="card-title title-r">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : '异常/手工确认指标表'}
                            {chartConfig.length && chartConfig[0].chartNote ?
                                (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                    <img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
                                </Tooltip>) : ''
                            }
                        </div>
                    </div>
                    <div style={{height: 'calc(100% - 3.66rem)'}}>
                        {
                            excptOrManual.length === 0 ?
                                (<React.Fragment>
                                    <div className="evrt-bg evrt-bgimg"></div>
                                    <div className="tc pt10per blue" style={{ fontSize: '1.633rem' }}>暂无{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : '数据'}</div>
                                </React.Fragment>) :
                                (<ul className="report-list" ref={this.list} style={{ height:'100%', overflow: "hidden" }} onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                                    {useSwiper === false ?
                                        (
                                            <div className="er-box" ref={this.box}>
                                                {
                                                    excptOrManual.map((ele, index) => {
                                                        const { INDEXNAME, INDEXSTATUS, INDEXSTATUSN, OCCURRTIME } = ele
                                                        return (
                                                            <div key = {index}>
                                                                <div className="flex-r report-title pos-r" style={{ padding: "0.5rem 2rem" }}>
                                                                    <div className="pos-a" style={{ left: '1.5rem' }}>
                                                                        <img className="report-bottom-dot"
                                                                            src={INDEXSTATUS === '2' ?
                                                                                [require("../../../../../image/icon_abnormal.png")] :
                                                                                [require("../../../../../image/icon_edit.png")]}
                                                                            alt="" />
                                                                    </div>
                                                                    <div className="flex-c wid85" style={{ padding: '0 1.5rem', marginLeft: '1rem', background: 'linear-gradient(90deg, rgba(17, 39, 111, .4)  0%, rgba(17, 39, 111, .4)  100%)', borderRadius: '.5rem' }}>
                                                                        <div className="fs20 wid100">{INDEXNAME}</div>
                                                                        <div className="fs18 wid100">{OCCURRTIME}</div>
                                                                    </div>
                                                                    <div className="fs20 tr" style={{ width: '10rem', fontWeight: '800', color: INDEXSTATUS === '2' ? '#D34643' : '#d34643' }}>{INDEXSTATUSN}</div>
                                                                </div>
                                                                {/*<div className="wid70" style={{marginLeft: '5rem'}}>*/}
                                                                {/*  <Divider type="horizontal"  style={{background:'rgba(14, 38, 118, 1)',boxShadow: '0 0 1rem rgba(0,172,255,1) inset'}}/>*/}
                                                                {/*</div>*/}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                        : (
                                            <React.Fragment>

                                                <Swiper ref={this.swiperRef}
                                                    {...params}>
                                                    {
                                                        excptOrManual.map((e,index) => {
                                                            const { INDEXNAME, INDEXSTATUS, INDEXSTATUSN, OCCURRTIME } = e
                                                            return (
                                                                <div key = {index}>
                                                                    <div className="flex-r report-title pos-r" style={{ padding: "0.5rem 2rem" }}>
                                                                        <div className="pos-a" style={{ left: '1.5rem' }}>
                                                                            <img className="report-bottom-dot"
                                                                                src={INDEXSTATUS === '2' ?
                                                                                    [require("../../../../../image/icon_abnormal.png")] :
                                                                                    [require("../../../../../image/icon_edit.png")]}
                                                                                alt="" />
                                                                        </div>
                                                                        <div className="flex-c wid85" style={{ padding: '0 1.5rem', marginLeft: '1rem', background: 'linear-gradient(90deg, rgba(17, 39, 111, .4)  0%, rgba(17, 39, 111, .4)  100%)', borderRadius: '.5rem' }}>
                                                                            <div className="fs20 wid100">{INDEXNAME}</div>
                                                                            <div className="fs18 wid100">{OCCURRTIME}</div>
                                                                        </div>
                                                                        <div className="fs20 tr" style={{ width: '10rem', fontWeight: '800', color: INDEXSTATUS === '2' ? '#E23C39' : '#F7B432' }}>{INDEXSTATUSN}</div>
                                                                    </div>
                                                                    {/*<div  className="wid70" style={{marginLeft: '5rem'}}>*/}
                                                                    {/*  <Divider type="horizontal" style={{background:'rgba(14, 38, 118, 1)',boxShadow: '0 0 1rem rgba(0,172,255,1) inset'}}/>*/}
                                                                    {/*</div>*/}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Swiper>
                                            </React.Fragment>)
                                    }
                                </ul>
                                )
                            // <div className="h100">
                            //     <Swiper ref={this.swiperRef} {...params}>
                            //         {
                            //             excptOrManual.map((e, idx) => {
                            //                 const { INDEXNAME,INDEXSTATUS,INDEXSTATUSN,OCCURRTIME } = e
                            //                 return (
                            //                     <div className="flex-r report-title" style={{ padding: "0.5rem 2rem" }}>
                            //                         <div className="fwb fs16 wid50">
                            //                             <img className={"report-top-dot"}
                            //                                 src={INDEXSTATUS === '0' ?
                            //                                     [require("../../../../../image/icon_abnormal.png")] :
                            //                                     [require("../../../../../image/icon_edit.png")]}
                            //                                 alt="" />{INDEXNAME}</div>
                            //                         <div className={INDEXSTATUS === '0' ? "fs18 red wid20 talr" : "fs18 orange wid20 talr"}>{INDEXSTATUSN}</div>
                            //                         <div className="fs14 white wid30 talr">{OCCURRTIME}</div>
                            //                     </div>
                            //                 )
                            //             })
                            //         }
                            //     </Swiper>
                            // </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default BottomBlock

