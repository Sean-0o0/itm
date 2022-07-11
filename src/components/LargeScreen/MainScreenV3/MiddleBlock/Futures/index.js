import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import ProgressChart from './ProgressChart';
import ItemList from './ItemList';
import LastList from './LastList';

class Futures extends React.Component {
  state = {
    keyIndicDetl: [],
    operOverview: []
  };

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      const { MFutuOperOverview = [], MFutuKeyIndicDetl:arr = [] } = nextProps;
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
        operOverview: MFutuOperOverview,
        keyIndicDetl: myArr
      });
    }
  }

  render() {

    const {  operOverview = [], keyIndicDetl = [] } = this.state;
    const { hightLight = 0 } = this.props
    return (
      <div className='h100 pd10'>
        <div className={ hightLight === 3 ? 'ax-card2 flex-c' : 'ax-card flex-c'}>
          <div className='pos-r'>
            <div className='card-title title-c'><Link to={`/futures`} style={{color: '#C6E2FF'}} target='_blank'>兴证期货</Link></div>
          </div>
          <div style={{ height: 'calc(100% - 3.66rem)', padding: '1rem 0' }}>
            <div className='flex-r h30' style={{ justifyContent: 'space-around' }}>
              {operOverview.map((item, index) => {
                return <ProgressChart key={index} item={item} hightLight={hightLight} />
              })
              }
            </div>
            <div className='h70' style={{ padding: '1rem 1rem 0' }}>
              <div className="h55 flex-r" style={{ paddingBottom: '1rem' }} >
                <ItemList item={keyIndicDetl[0]} total = {3}/>
                <ItemList item={keyIndicDetl[2]} total = {3}/>
              </div>
              <div className="h45 flex-r">
                <ItemList item={keyIndicDetl[1]} total = {2}/>
                <LastList item={keyIndicDetl[3]} total = {2}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Futures
