import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { Link } from 'dva/router';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';
import ProgressChart from './ProgressChart';
import ItemList from './ItemList';

class International extends React.Component {
  state = {
    datas: [],
    datas0: [],
    datas1: [],
    datas2: [],
    datas3: [],
    operOverview: [],
    keyIndicDetl: []
  };

  // componentDidMount() {
  //   //查询指标状态(图表)
  //   this.fetchDataTop();
  //   //查询指标状态(图表下面的数据)
  //   this.fetchData();
  // }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      const { MinterKeyIndicDetl: arr = [], MinterLiqdStatic = [] } = nextProps;
      let map = {};
      let myArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].GROUPNAME) {
          if (!map[arr[i].GROUPNAME]) {
            myArr.push({
              GROUPNAME: arr[i].GROUPNAME,
              data: [arr[i]]
            });
            map[arr[i].GROUPNAME] = arr[i]
          } else {
            for (let j = 0; j < myArr.length; j++) {
              if (arr[i].GROUPNAME === myArr[j].GROUPNAME) {
                myArr[j].data.push(arr[i]);
                break
              }
            }
          }
        }
      }
      this.setState({
        operOverview: MinterLiqdStatic,
        keyIndicDetl: myArr
      });
    }
  }


  //指标状态
  fetchDataTop = () => {
    FetchQueryChartIndexData({
      //集团运营概况对应的chartCode
      chartCode: 'MFutuOperOverview',
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

  //指标状态
  fetchData = () => {
    FetchQueryChartIndexData({
      //集团运营概况对应的chartCode
      chartCode: 'MFutuKeyIndicDetl',
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
    const { operOverview = [], keyIndicDetl = [] } = this.state;
    const { hightLight = 0 } = this.props
    return (
      <div className='flex1 pd10'>
        <div className={ hightLight === 2 ? 'ax-card2 flex-c' : 'ax-card flex-c'}>
          <div className='pos-r'>
            <div className='card-title title-c'><Link to={`/international`} style={{color: '#C6E2FF'}} target='_blank'>兴证国际</Link></div>
          </div>
          <div style={{ height: 'calc(100% - 3.66rem)', padding: '1rem 0' }}>
            <div className='flex-r h30' style={{ justifyContent: 'space-around' }}>
              {operOverview.map((item, index) => {
                return <ProgressChart key={index} item={item} hightLight={hightLight} />
              })
              }
            </div>
            <div className='h70 flex-r' style={{ padding: '1rem 1rem 0' }}>
              <div className='flex1 flex-c h100'>
                <div className="h74 flex-c" style={{ padding: '0 0 1rem 1rem' }}>
                  <ItemList item={keyIndicDetl[0]} total={4}/>
                </div>
                <div className="h26 flex-c" style={{ paddingLeft: '1rem' }}>
                  <ItemList item={keyIndicDetl[1]} total={1}/>
                </div>
              </div>
              <div className='flex1 flex-c h100'>
                <div className="h45 flex-c" style={{ padding: '0 0 1rem 1rem' }}>
                  <ItemList item={keyIndicDetl[2]} total={2}/>
                </div>
                <div className="h55 flex-c" style={{ paddingLeft: '1rem' }}>
                  <ItemList item={keyIndicDetl[3]} total={3}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default International;
