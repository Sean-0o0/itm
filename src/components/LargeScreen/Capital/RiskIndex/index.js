import React from 'react';
import { Tooltip } from 'antd';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/src/styles/css/swiper.css';
import EventList from '../../ClearingPlace/EventReport/EventList';

class RiskIndex extends React.Component {
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
        const { riskEvent = [] } = this.props;
        let { isContinue = false } = this.state;
        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            isContinue = true;
        }
        if (riskEvent.length && isContinue) {
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
        const { riskEvent = [], note = '', indIv = [], tClass = '', chartConfig = [] } = this.props;
        const { useSwiper } = this.state;
        const tmpl = [];
        let noteArr = [];
        if(note){
            noteArr = note.split(';');
        }
        let text = ['估值方法变动项目数','基金资金规拨异常次数'];
        let detail = [noteArr[0]||'',noteArr[1]||''];
        
        indIv.forEach(item => {
            if (item.IDX_CODE === 'XZTZ0401') {
                text[0] = (item.NAME || '');
                detail[0] = (item.RESULT || '');
            }
            if (item.IDX_CODE === 'XZTZ0402') {
                text[1] = (item.NAME || '');
                detail[1] = (item.RESULT || '');
            }
        });
        for (let i = 0; i < riskEvent.length; i++) {
            tmpl.push(i);
        }
        const titleClass = `card-title ${tClass}`;
        const params = {
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            speed: 5000,
            direction: 'vertical',
            loop: true,
            freeMode: true,
            slidesPerView: 'auto',
            loopedSlides: 10,
            centeredSlides: true,
            autoHeight: true,
            mousewheel: true,
            grabCursor: true,
            observer:true,
            observeParents: true,
            observeSlideChildren:true,
            watchOverflow: true,
            shouldSwiperUpdate: true,
        }

        return (
            <div className="ax-card flex-c flex1" style={{ overflow: "hidden" }}>
                <div className={titleClass}>
                    {chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                    {chartConfig.length && chartConfig[0].chartNote ?
                        (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map(item => { return <span>{item}<br /></span> })}</div>}>
                            <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                        </Tooltip>) : ''}
                </div>
                <div className="flex-r" style={{ height: (note?'12rem':'8rem')}}>
                    <div className="flex1 flex-c cp-center">
                        <div className="cp-index-cont">
                            {detail[0] ? detail[0] : ''}
                        </div>
                        <div className="cp-index-title">{text[0] ? text[0] : ''}</div>
                    </div>
                    <div className="flex1 flex-c cp-center">
                        <div className="cp-index-cont2">
                            {detail[1] ? detail[1] : ''}
                        </div>
                        <div className="cp-index-title">{text[1] ? text[1] : ''}</div>
                    </div>
                </div>
                <div style={{ height: (note? 'calc(100% - 16.167rem)':'calc(100% - 12.167rem)')}}>
                {tmpl.length === 0 ?
                        '' :
                        (<ul className="cp-report-list" ref={this.list} style={{ overflow: "hidden" }} onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                            {useSwiper === false ?
                                (
                                    <div className="er-box" ref={this.box}>
                                        {tmpl.map(i => (
                                            <div key={i}>
                                                <EventList
                                                    key={i}
                                                    infoItem={riskEvent[i]}
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
                                                        infoItem={riskEvent[i]}
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
                                                        infoItem={riskEvent[i]}
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
export default RiskIndex;
