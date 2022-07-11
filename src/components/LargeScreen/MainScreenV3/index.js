import React from 'react';
import { connect } from 'dva';
import Manage from './Manage';
import MiddleBlock from './MiddleBlock';
import RightBlock from './RightBlock';
import Swiper from 'react-id-swiper';
import { FetchQueryCallInfo, FetchQueryChartIndexData, FetchQueryErrOrImpRpt } from '../../../services/largescreen';
import { message } from 'antd';
import EventReport from './EventReport';

class MainScreen extends React.Component {

    constructor(props) {
        super(props);
        this.swiperRef = React.createRef();
        this.state = {
            errOrImpRpt: [], //重大事项查询
            timer: '',
            hightLight: 1
        };
    }

    componentWillMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage') ? localStorage.getItem('refreshWebPage') : "20";
        this.state.timer = setInterval(() => {
            //定时刷新
            // const loginStatus = localStorage.getItem('loginStatus');
            // if (loginStatus !== '1') {
            //     this.props.dispatch({
            //         type: 'global/logout',
            //     });
            // }
            this.fetchAllInterface();
        }, Number.parseInt(refreshWebPage, 10) * 1000);
      this.state.timer = setInterval(() => {
        const { hightLight } = this.state;
        if ( hightLight === 5 ){
          this.setState({ hightLight: 1 });
        }else {
          this.setState({ hightLight: hightLight + 1 });
        }
      }, Number.parseInt("10", 10) * 1000);
        this.fetchAllInterface();
    }

    componentWillUnmount() {
        if (this.state.timer) {
            clearInterval(this.state.timer);
        }
    }

    // 查询所有接口
    fetchAllInterface = async () => {
        await this.fetchErrOrImpRpt();
        this.fetchData("GroupOperOverview");
        this.fetchData("GroupOpManagmHeadqrt");
        this.fetchData("AssetmMontSerComplt");
        this.fetchData("AssetmServiceCheckIndMont");
        this.fetchData("MProgIndcPubOfferingProd");
        this.fetchData("MFutuOperOverview");
        this.fetchData("MFutuKeyIndicDetl");
        this.fetchData("FndClearingbusiness1");
        this.fetchData("MFndTAFASurvey");
        this.fetchData("MinterKeyIndicDetl");
        this.fetchData("MinterLiqdStatic");
        this.fetchCallInfoData();
    }

    //数据查询
    fetchData = (chartCode) => {
        FetchQueryChartIndexData({
            chartCode: chartCode
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ [chartCode]: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    //呼入咨询服务查询
    fetchCallInfoData = () => {
        FetchQueryCallInfo({
            chartCode: ""
        })
            .then((ret = {}) => {
                const { code = 0, waitcnt = '' } = ret;
                if (code > 0) {
                    this.setState({ callIn: waitcnt });
                }
            })
        //   .catch(error => {
        //     message.error(!error.success ? error.message : error.note);
        //   });
    };


    //重大事项查询
    fetchErrOrImpRpt = async () => {
        try {
            const res = await FetchQueryErrOrImpRpt({
                screenPage: 0,
            })
            const { data = [], code = 0 } = res;
            if (code > 0) {
                this.setState({ errOrImpRpt: data });
            }
        } catch (error) {
            message.error(!error.success ? error.message : error.note)
        }
    };

    render() {
      const refreshWebPage = localStorage.getItem('refreshWebPage');
        const { errOrImpRpt,
            GroupOperOverview = [],
            GroupOpManagmHeadqrt = [],
            AssetmMontSerComplt = [],
            AssetmServiceCheckIndMont = [],
            MProgIndcPubOfferingProd = [],
            MFutuOperOverview = [],
            MFutuKeyIndicDetl = [],
            MFndTAFASurvey = [],
            FndClearingbusiness1 = [],
            MinterKeyIndicDetl = [],
            MinterLiqdStatic = [],
            callIn = '',
            hightLight
        } = this.state;

        return (
            <div className="h100 flex-c cont-wrap-main mainScreen">
                <div className=" flex-r" style={{ height: "calc(100% - 5rem)", color: '#C6E2FF' }}>
                    <div className="wid25 h100 pd10">
                        <Manage GroupOperOverview={GroupOperOverview} callIn={callIn} hightLight={hightLight}/>
                    </div>
                    <div className="wid50">
                        <MiddleBlock
                            GroupOpManagmHeadqrt={GroupOpManagmHeadqrt}
                            MFutuKeyIndicDetl={MFutuKeyIndicDetl}
                            MFutuOperOverview={MFutuOperOverview}
                            MinterKeyIndicDetl={MinterKeyIndicDetl}
                            MinterLiqdStatic={MinterLiqdStatic}
                            hightLight={hightLight}/>
                    </div>
                    <div className="wid25">
                        <RightBlock
                            FndClearingbusiness={FndClearingbusiness1}
                            MFndTAFASurvey={MFndTAFASurvey}
                            AssetmMontSerComplt={AssetmMontSerComplt}
                            MProgIndcPubOfferingProd={MProgIndcPubOfferingProd}
                            AssetmServiceCheckIndMont={AssetmServiceCheckIndMont}
                            hightLight={hightLight}
                        />
                    </div>

                </div>
                <div className="flex-r" style={{ height: "6rem" }}>
                    <EventReport errOrImpRpt={errOrImpRpt} />
                    {/* <div className="flex1 wid100 h100 pd10">
                        <div className="ax-card flex-r">


                            <Swiper ref={this.swiperRef}
                                {...params}
                            >
                                {errOrImpRpt.map((item = {}, index) => {
                                    return <div className="flex-r" style={{ lineHeight: "4.2rem" }} key={index}>
                                        <div className="blue pr15" style={{ padding: "0 2rem" }}><img className="col-icon" src={[require("../../../image/icon_exception.png")]} alt="" />{item.PRO_NAME ? item.PRO_NAME : '-'}</div>
                                        <div className="pr15">{item.TIME ? item.TIME : '-'}</div>
                                        <div className="pr15">{item.CONTG ? item.CONTG : '-'}</div>
                                    </div>
                                })

                                }
                            </Swiper>
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(MainScreen);
