import React from 'react';
import 'react-id-swiper/src/styles/css/swiper.css';
import Swiper from 'react-id-swiper';

class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            useSwiper: false,
            isContinue: true,
        };
        this.list = React.createRef();
        this.box = React.createRef();
        this.swiperRef = React.createRef();
    }

    // componentWillMount() {
    //     this.setState({
    //         data: [
    //         ],
    //     })

    // }

    componentDidMount() {
        this.setState({
            data: [
                { NOTE: '营运平台待办', value: '8' },
                { NOTE: '营运平台待办', value: '8' },
                { NOTE: '营运平台待办', value: '8' },
                { NOTE: '营运平台待办', value: '8' },
                { NOTE: '营运平台待办', value: '8' },
                { NOTE: '营运平台待办', value: '8' },
                { NOTE: '营运平台待办', value: '8' },
                { NOTE: '营运平台待办', value: '8' },
            ],
        })
    }

    componentDidUpdate(prevProps) {
        const { data = [] } = this.state;
        let { isContinue = false } = this.state;
        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            isContinue = true;
        }
        if (data.length && isContinue && this.box.current && this.list.current) {
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
        // const { data = [] } = this.props;
        const { useSwiper, data = [] } = this.state;
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
            <div className='subsidiary-digital' style={{ padding: '0 3rem' }}>
                <ul className='report-list' ref={this.list} style={{ overflow: 'hidden' }}
                    onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                    {useSwiper === false ?
                        (
                            <div className='er-box' ref={this.box}>
                                {data.map((item = {}, index) => {
                                    const { NOTE = '-', value = '-' } = item;
                                    return <div className='flex-r item-label'>
                                        <div>{NOTE}</div>
                                        <div className="flex1 item-value">{value}&nbsp;<span className="unit">笔</span></div>
                                    </div>
                                })}

                            </div>)
                        : (
                            <React.Fragment>
                                <Swiper ref={this.swiperRef}
                                    {...params}>
                                    {data.map((item = {}, index) => {
                                        const { NOTE = '-', value = '-' } = item;
                                        return <div className='flex-r item-label'>
                                            <div>{NOTE}</div>
                                            <div className="flex1 item-value">{value}&nbsp;<span className="unit">笔</span></div>
                                        </div>
                                    })}
                                </Swiper>
                            </React.Fragment>
                        )}
                </ul>
            </div>
        );
    }
}

export default Information;

