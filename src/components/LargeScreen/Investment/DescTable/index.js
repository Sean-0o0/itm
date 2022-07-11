import React from 'react';
import { Tooltip } from 'antd';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/src/styles/css/swiper.css';
import TdItem from './TdItem';

class DescTable extends React.Component {
    constructor(props) {
        super(props)
        this.swiperRef = React.createRef();
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
        const { indIvOutProject = [], chartConfig = [] } = this.props;
        const pageArr = [];
        for (let i = 0; i < Math.ceil(indIvOutProject.length / 3); i++) {
            pageArr.push([]);
        }
        for (let i = 0; i < pageArr.length; i++) {
            pageArr[i].push(indIvOutProject[3 * i] ? indIvOutProject[3 * i] : {});
            pageArr[i].push(indIvOutProject[3 * i + 1] ? indIvOutProject[3 * i + 1] : {});
            pageArr[i].push(indIvOutProject[3 * i + 2] ? indIvOutProject[3 * i + 2] : {});
        }
        const params = {
            freeMode: false,
            speed: 2000,
            effect: 'fade',
            fadeEffect: {
                crossFade: true,
            },
            autoplay: {
                delay: 10000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            shouldSwiperUpdate: true,
        }

        return (
            <div className="ax-card pos-r flex-c" style={{overflow: "hidden"}}>
                <div className="pos-r">
                    <div className="card-title title-c">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                        {chartConfig.length && chartConfig[0].chartNote ?
                            (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                            </Tooltip>) : ''
                        }
                    </div>
                </div>
                <div className="flex1 pos-r" onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                    <div className="iv-desc-table">
                        {pageArr.length ?
                            (<Swiper ref={this.swiperRef}
                                {...params}>
                                {
                                    pageArr.map((item, index) =>
                                        (<table width='100%' key={index}>
                                            <col style={{width: "5%"}} />
                                            <col style={{width: "39%"}} />
                                            <col style={{width: "25%"}} />
                                            <col style={{width: "17%"}} />
                                            <col style={{width: "14%"}} />
                                            <tbody>
                                                <tr>
                                                    <th></th>
                                                    <th>项目名称</th>
                                                    <th>分类</th>
                                                    <th>投资年限</th>
                                                    <th>回报率</th>
                                                </tr>
                                                {item.map((element, i) => (
                                                    <TdItem itemData={element} index={(index) * 3 + i + 1} key={i} />
                                                ))}
                                            </tbody>
                                        </table>)
                                    )
                                }
                            </Swiper>) : ''
                        }


                    </div>

                </div>
            </div>
        );
    }
}
export default DescTable;
