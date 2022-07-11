import React from 'react';
import { connect } from 'dva';
import ChartBox from '../centralOpert/ChartBox';
import RunEffect from './CenterPage/RunEffect';
import RunAccount from './CenterPage/RunAccount';
import RiskNote from './RightPage/RiskNote';
import ServiceTrack from './RightPage/ServiceTrack';
import {
  FetchQueryChartIndexConfig, FetchQueryChartIndexData,
  FetchQueryErrOrImpRpt,
  FetchQueryModuleChartConfig,
} from '../../../services/largescreen';
import { message } from 'antd';
import Swiper from 'react-id-swiper';


class SelfRun extends React.Component {
  state = {
    indexConfig: [],              //图标指标配置
    moduleCharts: [],             //图标模块配置
    callCen: [],                  //业务情况
    errOrImpRpt: [],
    useSwiper: false,
    fxtsData: [],                 //风险提示
    callIn: "",
    timer: '',
    // department: ['债衍', '证投', '金衍', '财富', '计财', '销交', '投行'],  // 属性分类
    department: [],  // 属性分类
    // departmentRatio: [100,49,11,5,3,3,2],
    departmentRatio: [],
    typeClassifyDepColorList: ['#157EF4','#1549F4', '#2515F4', '#5E15F4', '#A815F4','#F41554', '#F48315'],


    market: ['上交所', '深交所', '财基', '开基', '银行间', '中金所', '郑商所', '大商所', '能源中心', '上期所'],  // 属性分类
    marketRatio: [78,65,50,43,35,10,25,12,5,2],
    typeClassifyMarketColorList: ['#157EF4','#1549F4', '#2515F4', '#5E15F4', '#A815F4','#F41554', '#F48315', '#F4C215', '#C2F415']
  };

  componentDidMount() {
    this.fetchAllInterface();
    // this.fetchErrOrImpRpt();
  }

  // 查询所有接口
  fetchAllInterface = async () => {
    await this.fetchChartConfigData();
    this.fetchIndexConfigData();
  }

  // 图表配置数据
  fetchChartConfigData = async () => {
    try {
      const res = await FetchQueryModuleChartConfig({
        screenPage: 13,
      });
      const { records = [], code = 0, note = '' } = res;
      if (code > 0) {
        this.handleChartConfigData(records);
      }
    } catch (error) {
      message.error(!error.success ? error.message : error.note)
    }
  };

  //重大事项查询
  fetchErrOrImpRpt = () => {
    FetchQueryErrOrImpRpt({
      screenPage: 10,
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ errOrImpRpt: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  handleChartConfigData = records => {
    const tmpl = [];
    for (let i = 1; i <= records.length; i++) {
      tmpl.push([]);
    }
    records.forEach(item => {
      const { displayOrder } = item;
      const orderNum = Number.parseInt(displayOrder);
      tmpl[orderNum - 1].push(item);
    });
    this.setState({ moduleCharts: tmpl });
    // 获取自营账户属性分类情况(使用部门)的数据
    let department = tmpl[0];
    this.fetchData(department[0].chartCode, 0);
    // 获取自营账户属性分类情况(交易市场)的数据
    let classifyMarket = tmpl[1];
    this.fetchData(classifyMarket[0].chartCode, 1);
  };


  // 指标配置数据
  fetchIndexConfigData = () => {
    FetchQueryChartIndexConfig({
      screenPage: 13,
    })
      .then((ret = {}) => {
        const { code = 0, records = [] } = ret;
        if (code > 0) {
          this.handleIndexConfigData(records);
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  handleIndexConfigData = records => {
    const codeArr = records.map(m => m.chartCode);
    const tmpl = {};
    codeArr.forEach(item => {
      tmpl[item] = [];
    });
    records.forEach(item => {
      if (tmpl[item.chartCode]) {
        tmpl[item.chartCode].push(item);
      }
    });
    this.setState({ indexConfig: tmpl });
  };


  fetchData = (chartCode, index) => {
    FetchQueryChartIndexData({
      chartCode: chartCode,
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          if(index === 0) {
            const DEPARTMENT = [];
            const DEPARTMENTRATIO = [];
            data.map((item, index) => {
              DEPARTMENT.push(item.DEPARTMENT);
              DEPARTMENTRATIO.push(Number(item.DEPARTMENTRATIO));
            })
            this.setState({ departmentRatio: DEPARTMENTRATIO });
            this.setState({ department: DEPARTMENT });
          } else if (index === 1) {
            const MARKERT = [];
            const MARKETRATIO = [];
            data.map((item, index) => {
              MARKERT.push(item.MARKERT);
              MARKETRATIO.push(Number(item.MARKETRATIO));
            })
            this.setState({ marketRatio: MARKETRATIO });
            this.setState({ market: MARKERT });
          }
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
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
    };
    const { moduleCharts = [], indexConfig = [], departmentRatio = [],
      department = [], typeClassifyDepColorList = [],
      marketRatio = [], errOrImpRpt = [], fxtsData = [],
      market = [], typeClassifyMarketColorList = [], useSwiper = false} = this.state;
    const { dispatch } = this.props;
    // console.log(JSON.stringify(moduleCharts));
    // console.log(JSON.stringify(moduleCharts[2]));
    return (
      <div className="flex1 flex-r cont-wrap" style={{height: 'calc(100% - 5rem)' }}>
        <div className="wid33 h100 flex-c cont-left">
          <div className="h100 pd10">
            {
              <ChartBox
              data={departmentRatio}
              xAxisData={department}
              tClass='title-l'
              chartType='2'
              selfRun={true}
              colorList={typeClassifyDepColorList}
              gradientColor='true'
              chartConfig={moduleCharts[0]}/>}
          </div>
          <div className="h100 pd10">
            <ChartBox
              data={marketRatio}
              xAxisData={market}
              tClass='title-l'
              chartType='2'
              selfRun={true}
              colorList={typeClassifyMarketColorList}
              gradientColor='true'
              chartConfig={moduleCharts[1]} />
          </div>
        </div>
        <div className="wid34 flex-c">
          <RunAccount chartConfig={moduleCharts[2]}/>
          <RunEffect chartConfigTotal={moduleCharts[3]} chartConfigDetl={moduleCharts[4]}/>
        </div>
        <div className="wid33 flex-c">
          <RiskNote chartConfig={moduleCharts[7]} />
          <ServiceTrack chartConfigStat={moduleCharts[5]} chartConfigDtl={moduleCharts[6]}/>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(SelfRun);
