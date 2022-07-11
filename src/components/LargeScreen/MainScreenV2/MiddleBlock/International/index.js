import React from 'react';
import { connect } from 'dva';
import { message, Progress, Tooltip } from 'antd';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';
import HandleDataUtils from '../../HandleDataUtils';

class Asset extends React.Component {
  state = {
    topDatas: [],
    datas0: [],
    datas1: [],
    datas2: [],
    datas3: [],
  };

  componentDidMount() {
    //查询指标状态
    this.fetchData();
    //查询指标状态(图表)
    this.fetchDataTop();
  }

  componentWillUnmount() {

  }

  //指标状态(图表)
  fetchDataTop = () => {
    FetchQueryChartIndexData({
      //集团运营概况对应的chartCode
      chartCode: 'MinterLiqdStatic',
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ topDatas: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //指标状态
  fetchData = () => {
    FetchQueryChartIndexData({
      //集团运营概况对应的chartCode
      chartCode: 'MinterKeyIndicDetl',
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          const sorted = this.handleDataByGroup(data, function (item) {
            //按照LARGEGROUP进行分组
            return [item.GROUPNAME];
          });
          //将data分成三组,三组样式不一样。【0-2,3,4-5】
          this.setState({
            data0: sorted.slice(0, 1),
            data1: sorted.slice(1, 2),
            data2: sorted.slice(2, 3),
            data3: sorted.slice(3, 4),
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //数据分组方法
  handleDataByGroup = (data, f) => {
    const groups = {};
    data.forEach(function (o) { //注意这里必须是forEach 大写
      const group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  };


  render() {

    const { topDatas = [], data0 = [], data1 = [], data2 = [], data3 = [] } = this.state;
    console.log("---data0----data0", data0);
    return (
      <div className="ax-card flex-c">
        <div className="pos-r">
          <div className="card-title title-c">兴证国际</div>
        </div>
        <div className="flex-r h27 mt20" style={{ justifyContent: "space-around" }}>
          {topDatas.map(item => {
            return (<div className="pos-r">
              <Tooltip title="基金行情复核">
                <Progress type="dashboard"
                  percent={HandleDataUtils.getPercent(item)}
                  format={() => <div
                    style={{ color: HandleDataUtils.handleStyle(item) }}>{HandleDataUtils.handleDataSecond(item)}<br /><span
                      className="fs16">{HandleDataUtils.handleComplete(item)}</span>
                  </div>}
                  strokeColor={HandleDataUtils.handleStyle(item)} />
              </Tooltip>
              <div className="pos-a pgs-pos" style={{ width: '8rem', left: 'calc(50% - 4rem)' }}>
                {HandleDataUtils.handleData(item)}
              </div>
            </div>)
          })
          }
        </div>
        <div className="flex-r" style={{ height: 'calc(73% - 3.667rem)'}}>
          <div className="flex1 flex-c" style={{ padding: "1rem 2.5rem" }}>
            <div className="flex1 flex-r">
              <div className="col-title flex-r" style={{ alignItems: "center" }}>{data0.length <= 0 ? "" : data0[0][0].GROUPNAME}</div>
              <div className="flex-c flex1 pr10">
                {data0.map(item => {
                  return item.map((item, key) => {
                    return (key >= 1 ? (<div className="col-cont flex1 mt6">{item.INDEXNAME}<span className="fr"><img className="col-icon" src={[require("../../../../../image/icon_completed.png")]} alt="" /></span></div>) : (<div className="col-cont flex1">{item.INDEXNAME}<span className="fr"><img className="col-icon" src={[require("../../../../../image/icon_completed.png")]} alt="" /></span></div>))
                  })
                })
                }
                {/*<div className="col-cont flex1">股份配售清算<span className="fr"><img className="col-icon"  src={[require("../../../../../image/icon_completed.png")]}  alt=""/></span></div>*/}
                {/*  <div className="col-cont flex1 mt6">新股认购清算<span className="fr"><img className="col-icon"  src={[require("../../../../../image/icon_completed.png")]}  alt=""/></span></div>*/}
                {/*  <div className="col-cont flex1 mt6">现金或红利入账<span className="fr"><img className="col-icon"  src={[require("../../../../../image/icon_completed.png")]}  alt=""/></span></div>*/}
                {/*  <div className="col-cont flex1 mt6">供股业务清算<span className="fr"><img className="col-icon"  src={[require("../../../../../image/icon_completed.png")]}  alt=""/></span></div>*/}
              </div>
            </div>
            <div className="flex-r pt10">
              {/*  <div className="flex1 flex-r pt10">*/}
              <div className="col-title flex-r" style={{ alignItems: "center" }}>{data1.length <= 0 ? "" : data1[0][0].GROUPNAME}</div>
              <div className="flex-c flex1 pr10">
                {data1.map(item => {
                  return item.map((item, key) => {
                    return (key >= 1 ? (<div className="col-cont flex1 mt6">{item.INDEXNAME}<span className="fr"><img className="col-icon" src={[require("../../../../../image/icon_completed.png")]} alt="" /></span></div>) : (<div className="col-cont flex1">{item.INDEXNAME}<span className="fr"><img className="col-icon" src={[require("../../../../../image/icon_completed.png")]} alt="" /></span></div>))
                  })
                })
                }
                {/*<div className="col-cont flex1" style={{lineHeight:"7.5rem"}}>证券对账<span className="fr"><img className="col-icon"  src={[require("../../../../../image/icon_completed.png")]}  alt=""/></span></div>*/}
              </div>
              {/*</div>*/}
            </div>
          </div>
          <div className="flex1 flex-c" style={{ padding: "1rem 2.5rem 1rem 0" }}>
            <div className="flex-r">
              <div className="col-title flex-r" style={{ alignItems: "center" }}>{data2.length <= 0 ? "" : data2[0][0].GROUPNAME}</div>
              <div clasName="flex-c flex1 pr10">
                {data2.map(item => {
                  return item.map((item, key) => {
                    return (key >= 1 ? (<div className="col-cont flex1 mt6">{item.INDEXNAME}<span className="fr"><img className="col-icon" src={[require("../../../../../image/icon_completed.png")]} alt="" /></span></div>) : (<div className="col-cont flex1">{item.INDEXNAME}<span className="fr"><img className="col-icon" src={[require("../../../../../image/icon_completed.png")]} alt="" /></span></div>))
                  })
                })
                }
                {/*<div className="col-cont flex1">资金划拨<span className="fr"><img className="col-icon"  src={[require("../../../../../image/icon_completed.png")]}  alt=""/></span></div>*/}
                {/*<div className="col-cont flex1 mt6">资金对账<span className="fr"><img className="col-icon"  src={[require("../../../../../image/icon_completed.png")]}  alt=""/></span></div>*/}
              </div>
            </div>
            <div className="flex1 flex-r pt10" style={{ lineHeight: "5rem" }}>
              <div className="col-title flex-r" style={{ alignItems: "center" }}>{data3.length <= 0 ? "" : data3[0][0].GROUPNAME}</div>
              <div className="flex-c flex1 pr10">
                {data3.map(item => {
                  return item.map((item, key) => {
                    return (key >= 1 ? (<div className="col-cont flex1 mt6">{item.INDEXNAME}<span className="fr"><img className="col-icon" src={[require("../../../../../image/icon_completed.png")]} alt="" /></span></div>) : (<div className="col-cont flex1">{item.INDEXNAME}<span className="fr"><img className="col-icon" src={[require("../../../../../image/icon_completed.png")]} alt="" /></span></div>))
                  })
                })
                }
                {/*<div className="col-cont flex1">公募产品及客户信息确认<span className="fr"><img className="col-icon"  src={[require("../../../../../image/icon_completed.png")]}  alt=""/></span></div>*/}
                {/*  <div className="col-cont flex1 mt6">公募产品估值确认<span className="fr"><img className="col-icon"  src={[require("../../../../../image/icon_completed.png")]}  alt=""/></span></div>*/}
                {/*  <div className="col-cont flex1 mt6">公募产品资金交收<span className="fr"><img className="col-icon"  src={[require("../../../../../image/icon_completed.png")]}  alt=""/></span></div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(Asset);
