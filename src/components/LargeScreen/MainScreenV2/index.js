import React from 'react';
import { connect } from 'dva';
import Manage from './Manage';
import MiddleBlock from './MiddleBlock';
import RightBlock from './RightBlock';
import Swiper from 'react-id-swiper';
import { FetchQueryChartIndexConfig,FetchQueryChartIndexData, FetchQueryModuleChartConfig } from '../../../services/largescreen';
import { message } from 'antd';

class MainScreen extends React.Component {

    constructor(props) {
        super(props);
        this.swiperRef = React.createRef();
    this.state = {
      xzjjSettleCompletion: [],//核心运营情况
      moduleCharts: [],
      indexConfig: [],
      errOrImpRpt: [], //重大事项查询
      timer: '',
      sfjyr: '1',
      datas: [],
    };
    }

    componentDidMount() {
    // const refreshWebPage = localStorage.getItem('refreshWebPage');
    // this.state.timer = setInterval(() => {
    //   //定时刷新
    //   const loginStatus = localStorage.getItem('loginStatus');
    //   if (loginStatus !== '1') {
    //     this.props.dispatch({
    //       type: 'global/logout',
    //     });
    //   }
    //   this.fetchAllInterface();
    // }, Number.parseInt(refreshWebPage, 10) * 1000);
    // this.fetchAllInterface();
    // this.fetchIndexConfigData();
    // this.fetchChartConfigData();
  }

  // // 图表配置数据
  // fetchChartConfigData = () => {
  //   FetchQueryModuleChartConfig({
  //     screenPage: 0,
  //   })
  //     .then((ret = {}) => {
  //       const { code = 0, records = [] } = ret;
  //       if (code > 0) {
  //         this.handleChartConfigData(records);
  //   }
  //     })
  //     .catch(error => {
  //       message.error(!error.success ? error.message : error.note);
  //     });
  // };
  //
  //   componentWillUnmount() {
  //   if (this.state.timer) {
  //     clearInterval(this.state.timer);
  //   }
  // }

  // // 查询所有接口
  // fetchAllInterface = () => {
  //   //this.fetchData();
  // };
  // // 指标配置数据
  // fetchIndexConfigData = () => {
  //   FetchQueryChartIndexConfig({
  //     screenPage: 0,
  //   })
  //     .then((ret = {}) => {
  //       const { code = 0, records = [] } = ret;
  //       if (code > 0) {
  //         this.handleIndexConfigData(records);
  //       }
  //     })
  //     .catch(error => {
  //       message.error(!error.success ? error.message : error.note);
  //     });
  // };
  // handleIndexConfigData = records => {
  //   const codeArr = records.map(m => m.chartCode);
  //   const tmpl = {};
  //   codeArr.forEach(item => {
  //     tmpl[item] = [];
  //   });
  //   records.forEach(item => {
  //     if (tmpl[item.chartCode]) {
  //       tmpl[item.chartCode].push(item);
  //   }
  //   });
  //   this.setState({ indexConfig: tmpl });
  // };
  // handleChartConfigData = records => {
  //   const tmpl = [];
  //   for (let i = 1; i <= records.length; i++) {
  //     tmpl.push([]);
  //   }
  //   records.forEach(item => {
  //     if (item.chartType !== '0') {
  //       const { displayOrder } = item;
  //       const orderNum = Number.parseInt(displayOrder);
  //       tmpl[orderNum - 1].push(item);
  //     }
  //   });
  //   this.setState({ moduleCharts: tmpl });
  // };


    render() {
    const { dispatch } = this.props;
        let params = {

            // spaceBetween: 5,
            speed: 25000,
            // loop: true,
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
            <div className="h100 flex-c cont-wrap-main mainScreen">
                <div className=" flex-r"  style={{height:"calc(100% - 5rem)"}}>
                    <div className="wid25 h100 pd10">
                        <Manage dispatch={dispatch}/>
                    </div>
                    <div className="wid50">
                        <MiddleBlock dispatch={dispatch}/>
                    </div>
                    <div className="wid25">
                        <RightBlock dispatch={dispatch}/>
                    </div>

                </div>
                <div className="flex-r" style={{height:"6rem"}}>
                    <div className="flex1 wid100 h100 pd10">
                        <div className="ax-card flex-r">

                            <Swiper ref={this.swiperRef}
                                {...params}
                            >
                                <div className="flex-r" style={{lineHeight:"4.2rem"}}>
                                    <div style={{padding:"0 2rem"}}>集团运营工作提示</div>
                                    <div className="blue pr15"><img className="col-icon"  src={[require("../../../image/icon_exception.png")]}  alt=""/>份额登记异常-资金结算\系统类事件\未处理</div>
                                    <div className="pr15">2020-09-18 12:23</div>
                                    <div className="pr15">【事件描述】XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
                                </div>
                                    <div className="flex-r" style={{lineHeight:"4.2rem"}}>
                                <div style={{padding:"0 2rem"}}>集团运营工作提示</div>
                                    <div className="blue pr15"><img className="col-icon"  src={[require("../../../image/icon_exception.png")]}  alt=""/>份额登记异常-资金结算\系统类事件\未处理2</div>
                                    <div className="pr15">2020-09-18 12:23</div>
                                    <div className="pr15">【事件描述】XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
                                </div>
                                <div className="flex-r" style={{lineHeight:"4.2rem"}}>
                                    <div style={{padding:"0 2rem"}}>集团运营工作提示</div>
                                    <div className="blue pr15"><img className="col-icon"  src={[require("../../../image/icon_exception.png")]}  alt=""/>份额登记异常-资金结算\系统类事件\未处理3</div>
                                    <div className="pr15">2020-09-18 12:23</div>
                                    <div className="pr15">【事件描述】XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
                                </div>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(MainScreen);
