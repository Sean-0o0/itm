import React from 'react';
import { message } from 'antd';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/src/styles/css/swiper.css';
import Clearing from './Clearing';
import Fund from './Fund';
import CentralOperation from './CentralOperation';
import Bond from './Bond';
import CallCenter from './CallCenter';
import RunManage from './RunManage';
import EventReport from './EventReport';
import {
    FetchQueryOptIdxStateStat,
    FetchQueryChartIndexData,
    FetchQueryChartESBData,
    FetchQueryErrOrImpRpt,
} from '../../../../services/largescreen';

class HeadQuarters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optIdxStateStat: [],  // 运作类指标状态统计（总部清算业务状态统计）
            clearingPlace: [],  // 总部清算业务
            fundBus: [],  // 总部资金业务
            centralOperation: [],  // 总部集中运营
            top10BusVolDis: [],  // 总部集中运营(图表,TOP10业务量展示)
            runManageStateStat: [],  // 总部运行管理业务（状态统计）
            runManageData: [],  // 总部运行管理业务数据
            errOrImpRpt: [],  // 重大事项查询
        };
        this.swiperRef = React.createRef();
    }


    componentDidMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage');
        this.fetchAllInterface();
        this.fetchInterval = setInterval(() => {
            const loginStatus = localStorage.getItem('loginStatus');
            if (loginStatus !== '1') {
                this.props.dispatch({
                    type: 'global/logout',
                });
            }
            this.fetchAllInterface();
        }, Number.parseInt(refreshWebPage, 10) * 1000);
    }

    componentWillUnmount() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
        }
    }

    fetchAllInterface = () => {
        this.fetchOptIdxStateStat();
        this.fetchClearingPlace();
        this.fetchFundBus();
        this.fetchErrOrImpRpt();
        this.fetchCentralOperation();
        this.fetchCentralOperationChartt();
        this.fetchRunManageStateStat();
        this.fetchRunManageData();
    }

    // 运作类指标状态统计
    fetchOptIdxStateStat = () => {
        FetchQueryOptIdxStateStat({
            chartCode: "ZbqueryTaskStatestat",
        }).then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                this.setState({ optIdxStateStat: records });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    // 总部清算业务
    fetchClearingPlace = () => {
        FetchQueryChartIndexData({
            chartCode: "ZBQSYW"
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0) {
                this.setState({ clearingPlace: data });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    // 总部资金业务
    fetchFundBus = () => {
        FetchQueryChartIndexData({
            chartCode: "ZBJSYW"
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0) {
                this.setState({ fundBus: data });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    // 总部集中运营
    fetchCentralOperation = () => {
        FetchQueryChartIndexData({
            chartCode: "ZBJZYY"
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0) {
                this.setState({ centralOperation: data });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    // 总部集中运营(图表)
    fetchCentralOperationChartt = () => {
        //TOP10业务量展示
        FetchQueryChartESBData({
            chartCode: "TOP10BusVolDis"
        }).then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                this.handleTop10BusVolDis(records)
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    handleTop10BusVolDis = records => {
        const item = records.map(m => m.ywdm || '');
        const busiTotal = records.map(m => m.zywbs || '');
        const top10BusVolDis = [];
        for (let i = 0; i < item.length; i++) {
            let tmpl = {
                name: item[i],
                value: busiTotal[i]
            };
            top10BusVolDis.push(tmpl);
        }
        this.setState({
            top10BusVolDis: top10BusVolDis,
        });
    };

    // 总部运行管理业务（状态统计）
    fetchRunManageStateStat = () => {
        FetchQueryOptIdxStateStat({
            chartCode: "Zbyxstatestat",
        }).then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                this.setState({ runManageStateStat: records });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    // 总部运行管理业务数据
    fetchRunManageData = () => {
        FetchQueryChartIndexData({
            chartCode: "ZBYXGLC"
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0) {
                this.setState({ runManageData: data });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    //重大事项查询
    fetchErrOrImpRpt = () => {
        FetchQueryErrOrImpRpt({
            screenPage: 0,
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0) {
                this.setState({ errOrImpRpt: data });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    // setAutoplay = (isAutoplay) => {
    //     this.setState({
    //         autoplay: isAutoplay
    //     })
    // }
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
        const {
            optIdxStateStat = [],
            clearingPlace = [],
            fundBus = [],
            centralOperation = [],
            errOrImpRpt = [],
            top10BusVolDis = [],
            runManageStateStat = [],
            runManageData = [],
        } = this.state;
        const { dispatch, records = [] } = this.props;

        let params = {
            slidesPerView: 3,
            // spaceBetween: 5,
            freeMode: false,
            // loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            }
        }

        let title = {};
        records.forEach((item) => {
            const { chartCode, chartTitle } = item;
            switch (chartCode) {
                case 'ZBQS':
                    title.ZBQS = chartTitle;
                    break;
                case 'ZBJS':
                    title.ZBJS = chartTitle;
                    break;
                case 'ZBJZYY':
                    title.ZBJZYY = chartTitle;
                    break;
                case 'ZBYHJ':
                    title.ZBYHJ = chartTitle;
                    break;
                case 'HJZX':
                    title.HJZX = chartTitle;
                    break;
                case 'ZBYXGLC':
                    title.ZBYXGLC = chartTitle;
                    break;
                default:
                    break;
            }
        })

        return (
            <div className="h38 pd6">
                <div className="ax-card flex-c">
                    <div className="pos-r">
                        <div className="card-title title-c">兴业证券集团总部</div>
                    </div>
                    <div className="flex-r zb-data-wrap">

                        <div style={{ width: '80%', height: '100%' }} onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
                            <Swiper ref={this.swiperRef}
                                {...params}
                            >
                                <div><Clearing chartTitle={title.ZBQS} optIdxStateStat={optIdxStateStat} clearingPlace={clearingPlace} /></div>
                                <div><Fund chartTitle={title.ZBJS} fundBus={fundBus} /></div>
                                <div><CentralOperation chartTitle={title.ZBJZYY} centralOperation={centralOperation} top10BusVolDis={top10BusVolDis} /></div>
                                <div><Bond chartTitle={title.ZBYHJ} dispatch={dispatch} /></div>
                                <div><CallCenter chartTitle={title.HJZX} dispatch={dispatch} /></div>
                                <div><RunManage chartTitle={title.ZBYXGLC} runManageStateStat={runManageStateStat} runManageData={runManageData} /></div>
                            </Swiper>
                        </div>
                        {/* <div style={{ width: '27%' }}>
                            <Clearing optIdxStateStat={optIdxStateStat} clearingPlace={clearingPlace} />
                        </div>
                        <div style={{ width: '27%' }}>
                            <Fund fundBus={fundBus} />
                        </div>
                        <div style={{ width: '27%' }}>
                            <CallCenter dispatch={dispatch} />
                        </div> */}
                        <div style={{ width: '19%' }}>
                            <EventReport errOrImpRpt={errOrImpRpt} />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default HeadQuarters;
