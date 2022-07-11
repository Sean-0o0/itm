import React from 'react';
import { Link } from 'dva/router';
import ProgressChart from './ProgressChart';
import ProgressLine from './ProgressLine';

class Asset extends React.Component {
  state = {
    datas1: [],
    datas2: [],
    StatusAndColor: {},

    datas3: [],
    datas4: [],
  };

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      const { AssetmMontSerComplt: data = [], MProgIndcPubOfferingProd = [], AssetmServiceCheckIndMont = [] } = nextProps;
      let map = {};
      let myArr = [];
      for (let i = 0; i < data.length; i++) {
        if (!map[data[i].GROUPCODE]) {
          myArr.push({
            GROUPCODE: data[i].GROUPCODE,
            GROUPNAME: data[i].GROUPNAME,
            GROUPSTEPNUM: data[i].GROUPSTEPNUM,
            COMPLTSTEPNUM: data[i].COMPLTSTEPNUM,
            STARTDATE: data[i].STARTDATE,
            ENDDATE: data[i].ENDDATE,
            CURRSTEP: data[i].CURRSTEP,
            GROUPSTATUS: data[i].GROUPSTATUS,
            data: [data[i]],
          });
          map[data[i].GROUPCODE] = data[i];
        } else {
          for (let j = 0; j < myArr.length; j++) {
            if (data[i].GROUPCODE === myArr[j].GROUPCODE) {
              myArr[j].data.push(data[i]);
              break;
            }
          }
        }
      }
      const datas1 = [];
      const datas2 = [];
      if (myArr.length > 0) {
        for (let i = 0; i < 3; i++) {
          datas1.push(myArr[i]);
        }
        for (let i = 3; i < 6; i++) {
          datas2.push(myArr[i]);
        }
      }
      this.setState({
        datas1: datas1,
        datas2: datas2,
        datas3: AssetmServiceCheckIndMont,
        datas4: MProgIndcPubOfferingProd
       });
    }
  }

  //处理运行进度百分比
  handlePercent = (data = {}) => {
    let percent = { one: '', two: '', three: '', four: '', five: '' };
    let total = 0;
    total = parseInt(data.NORMALTASKS) + parseInt(data.EXEPTTASKS) + parseInt(data.HANDTASKS) + parseInt(data.OUTSTTASKS);
    percent.one = ((data.COMPLTASKS / data.TOTALTASKS) * 100);
    percent.two = ((data.NORMALTASKS / total) * 100);
    percent.three = ((data.EXEPTTASKS / total) * 100);
    percent.four = ((data.HANDTASKS / total) * 100);
    percent.five = ((data.OUTSTTASKS / total) * 100);
    return percent;
  };

  //处理样式
  handleStyle = (data) => {
    return (data.COMPLTSTEPNUM === data.GROUPSTEPNUM ? '#00ACFF' : '#F7B432');
  };

  //处理完成比 n/m
  handleDataSecond = (data) => {
    return ((data.COMPLTASKS === '' ? '-' : data.COMPLTASKS) + '/' + (data.TOTALTASKS === '' ? '-' : data.TOTALTASKS));
  };

  render() {

    const { datas1 = [], datas2 = [], datas3 = [], datas4 = [] } = this.state;
    const { hightLight = 0 } = this.props
    return (
      <div className='flex1 h100 pd10'>
        <div className={ hightLight === 4 ? 'ax-card2 flex-c' : 'ax-card flex-c'}>
          <div className='pos-r'>
            <div className='card-title title-c'><Link to={`/oprtRiskOfAsset`} style={{color: '#C6E2FF'}} target='_blank'>兴证资管</Link></div>
          </div>
          <div className="flex-c" style={{ height: 'calc(100% - 3.66rem)', padding: '1rem 1rem' }}>
            <div className='flex-r h30' style={{ justifyContent: 'space-around' }}>
              {datas1.map((item, index) => {
                return (
                  <ProgressChart item={item} key={index} hightLight={hightLight}/>
                );
              })
              }
            </div>
            <div className='flex-r h30' style={{ justifyContent: 'space-around' }}>
              {datas2.map((item = {}, index) => {
                return (
                  <ProgressChart item={item} key={index} hightLight={hightLight}/>
                );
              })
              }
            </div>

            <div className='flex-r h25' style={{ paddingTop: '.5rem' }}>
              {datas3.map((item = {}, index) => {
                let percent = this.handlePercent(item);
                return <ProgressLine item={item} key={index} percent={percent} />;
              })}
            </div>
            <div className='flex-r flex1' style={{ alignItems: 'center', padding: '0 1rem' }}>
              <div className="last-line flex-r" style={{ alignItems: 'center' }}>
                <div style={{ width: '16rem' }}>公募化改造进度</div>
                <div className="flex1 flex-r">
                  {datas4.map((item, index) => {
                    if (index > 0) {
                      return <div className="flex1 tr" key={index} style={{ color: index === 1 ? '#00ACFF' : '#F7B432' }}>{item.INDEXNAME?item.INDEXNAME:'-'}&nbsp;&nbsp;<span className="fwb fs24">{item.INDEXVALUE?item.INDEXVALUE:'-'}</span></div>;
                    }
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default Asset;
