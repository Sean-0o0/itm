import React from 'react';
import { message, Progress } from 'antd';
import { Link } from 'dva/router';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';

class SubsidiaryIndex extends React.Component {
  state = {
    datas: [],
  };

  componentDidMount() {
    //查询指标状态
    this.fetchData();
  }

  //指标状态
  fetchData = () => {
    FetchQueryChartIndexData({
      //集团运营概况
      chartCode: 'GroupOpManagmHeadqrt',
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ datas: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //处理运行进度百分比
  getPercent = (data) => {
    return ((data.COMPLTASKS / data.TOTALTASKS) * 100);
  };

  //处理标题名称
  handleData = (data) => {
    return (data.GROUPNAME === "" ? '-' : data.GROUPNAME);
  };

  //处理运行进度
  handleDataSecond = (data) => {
    return ((data.COMPLTASKS === "" ? '-':data.COMPLTASKS)+"/"+(data.TOTALTASKS === "" ? '-':data.TOTALTASKS));
  };

  render() {

    const { datas } = this.state;

    return (
      <div className='h100 pd10 bg-img pos-r'>
        <div className='flex-r pos-jj'>
          {/*跳转至兴证基金PC大屏页面*/}
          <Link to={`/fund`}><img src={[require('../../../../../image/icon_xzjj.png')]} className='icon-size' alt='' /></Link>
          <div className='flex-c bg-style-l'>
            <div className='lh36'>{datas.length === 0 ? '-' : this.handleData(datas[0])}</div>
            <div className='lh18 fs18 blue'>运行进度：{datas.length === 0 ? '-/-' : this.handleDataSecond(datas[0])}</div>
            <div>
              <Progress percent={datas.length === 0 ? 0 : this.getPercent(datas[0])}
                        strokeColor={{ '0%': '#9000FF', '100%': '#00ACFF' }} showInfo={false} />
            </div>
          </div>
        </div>
        <div className='flex-r pos-gj'>
          <Link to={`/international`}><img src={[require('../../../../../image/icon_xzgj.png')]} className='icon-size'
                                           alt='' /></Link>
          <div className='flex-c bg-style-l'>
            <div className='lh36'>{datas.length === 0 ? '-' : this.handleData(datas[1])}</div>
            <div className='lh18 fs18 blue'>运行进度：{datas.length === 0 ? '-/-' : this.handleDataSecond(datas[1])}</div>
            <div>
              <Progress percent={datas.length === 0 ? 0 : this.getPercent(datas[1])}
                        strokeColor={{ '0%': '#9000FF', '100%': '#00ACFF' }} showInfo={false} />
            </div>
          </div>
        </div>
        <div className='flex-r pos-yy'>
          <Link to={`/international`}><img src={[require('../../../../../image/icon_yyglb.png')]} className='icon-size'
                                           alt='' /></Link>
          <div className='flex-c bg-style-l'>
            <div className='lh36'>{datas.length === 0 ? '-' : this.handleData(datas[2])}</div>
            <div className='lh18 fs18 blue'>运行进度：{datas.length === 0 ? '-/-' : this.handleDataSecond(datas[2])}</div>
            <div>
              <Progress percent={datas.length === 0 ? 0 : this.getPercent(datas[2])}
                        strokeColor={{ '0%': '#9000FF', '100%': '#00ACFF' }} showInfo={false} />
            </div>
          </div>
        </div>
        <div className='flex-r pos-qh'>
          <div className='flex-c bg-style-r'>
            <div className='lh36'>{datas.length === 0 ? '-' : this.handleData(datas[3])}</div>
            <div className='lh18 fs18 blue'>运行进度：{datas.length === 0 ? '-/-' : this.handleDataSecond(datas[3])}</div>
            <div>
              <Progress percent={datas.length === 0 ? 0 : this.getPercent(datas[3])}
                        strokeColor={{ '0%': '#9000FF', '100%': '#00ACFF' }} showInfo={false} />
            </div>
          </div>
          <Link to={`/futures`}><img src={[require('../../../../../image/icon_xzqh.png')]} className='icon-size'
                                     alt='' /></Link>
        </div>
        <div className='flex-r pos-zg'>
          <div className='flex-c bg-style-r'>
            <div className='lh36'>{datas.length === 0 ? '-' : this.handleData(datas[4])}</div>
            <div
              className='lh18 fs18 blue'>运行进度：{datas.length === 0 ? '-/-' : this.handleDataSecond(datas[4])}</div>
            <div>
              <Progress percent={datas.length === 0 ? 0 : this.getPercent(datas[4])}
                        strokeColor={{ '0%': '#9000FF', '100%': '#00ACFF' }} showInfo={false} />
            </div>
          </div>
          <Link to={`/oprtRiskOfAsset`}><img src={[require('../../../../../image/icon_xzzg.png')]} className='icon-size'
                                             alt='' /></Link>
        </div>
        <div className='pos-pro'>
          <div style={{ padding: '5rem 0 0 5rem' }}>
            <Progress type='dashboard' percent={datas.length === 0 ? 0 : this.getPercent(datas[5])}
                      strokeColor={{ '0%': '#00ACFF', '100%': '#9000FF' }}
                      format={() => <div className='por-circle'>{datas.length === 0 ? '-' : datas[5].COMPLTASKS}<span
                        className='fs22'>/{datas.length === 0 ? '-' : datas[5].TOTALTASKS}<br />{datas.length === 0 ? '-' : this.handleData(datas[5])}</span>
                      </div>}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SubsidiaryIndex;
