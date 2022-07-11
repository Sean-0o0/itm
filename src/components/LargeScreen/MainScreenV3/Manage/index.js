import React from 'react';
import { Icon } from 'antd';
import RowItem from './RowItem';
import RowTwoItem from './RowTwoItem';
import RowHalfItem from './RowHalfItem';
import BondItem from './BondItem';
import RowWhole from './RowWhole';
import InfoItem from './InfoItem';
import StatusRow from './StatusRow';
import InfoData from './InfoData';
import { Link } from 'dva/router';
class Monitor extends React.Component {
  state = {
  };

  sortArr = (arr, name) => {
    let map = {};
    let myArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][name]) {
        if (!map[arr[i][name]]) {
          myArr.push({
            [name]: arr[i][name],
            data: [arr[i]]
          });
          map[arr[i][name]] = arr[i]
        } else {
          for (let j = 0; j < myArr.length; j++) {
            if (arr[i][name] === myArr[j][name]) {
              myArr[j].data.push(arr[i]);
              break
            }
          }
        }
      }
    }
    return myArr;
  }

  //设置初始值
  getElement = (object) => {
    const { data = [] } = object;
    return data;
  }

  render() {

    const {
      GroupOperOverview = [], callIn = '', hightLight
    }= this.props;
    const operOverview = this.sortArr(GroupOperOverview, "LARGEGROUP");
    operOverview.forEach((ele, index) => {
      if (index < 2 || index === 3) {
        let { data = [] } = ele;
        data = this.sortArr(data, "SUBGROUP");
        ele.data = data;
      }
    })
    const [firstData = {}, secondData = {}, thirdData = {}, fourthData = {}, fifthData = {}, sixthData = {}] = operOverview;

    return (
      <div className={hightLight === 1 ? 'ax-card2 flex-c left-cont' : 'ax-card flex-c left-cont'}>
        <div className='pos-r'>
          <div className='card-title title-c'>兴业证券</div>
        </div>
        <div style={{ padding: '1rem 2rem', height: 'calc(100% - 3.667rem)', fontSize: '1.5rem' }}>
          <div className='flex-c' style={{ paddingBottom: '3%', height: '17%' }}>
            <div className='flex-r left-cont-box'>
              <div className='flex-r left-cont-title'>
                <Link to={`/clearingPlace`} style={{color: '#00ACFF'}} target='_blank'>
                  <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem' }} />
                  {firstData.LARGEGROUP ? firstData.LARGEGROUP : '-'}
                </Link>
              </div>
              <div className='flex1 flex-r' style={{color: '#00ACFF'}}>
                <div className='flex1 tr'>待处理</div>
                <div className='flex1 tr'>异常</div>
                <div className='flex1 tr'>已完成</div>
              </div>
            </div>
            {this.getElement(firstData).map((item, index) => {
              return <RowItem item={item} key={index} hightLight={hightLight}/>;
            })
            }
          </div>

          <div className='h13 flex-c' style={{ paddingBottom: '3%' }}>
            <div className='flex-r left-cont-box'>
              <div className='flex-r left-cont-title'>
                <Link to={`/fundSettlement`} style={{color: '#00ACFF'}} target='_blank'>
                  <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem' }} />
                  {secondData.LARGEGROUP ? secondData.LARGEGROUP : '-'}
                </Link>
              </div>
              <div className='flex1 flex-r' style={{color: '#00ACFF'}}>
                <div className='flex1 tr'>待处理</div>
                <div className='flex1 tr'>异常</div>
                <div className='flex1 tr'>已完成</div>
              </div>
            </div>
            {this.getElement(secondData).map((item, index) => {
              return <RowItem item={item} key={index} hightLight={hightLight}/>;
            })
            }
          </div>

          <div className='h14 flex-c' style={{ paddingBottom: '3%' }}>
            <div className='flex-r left-cont-box'>
              <div className='flex-r left-cont-title' style={{ width: '20rem' }}>
                <Link to={`/bond`} style={{color: '#00ACFF'}} target='_blank'>
                  <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem' }} />
                  {thirdData.LARGEGROUP ? thirdData.LARGEGROUP : '-'}
                </Link>
              </div>
            </div>
            <div className="flex1 flex-r">
              <BondItem pos={1} item={this.getElement(thirdData)[0]} hightLight={hightLight}/>
              <BondItem item={this.getElement(thirdData)[1]} hightLight={hightLight}/>
            </div>
            <div className="flex1 flex-r">
              <BondItem pos={1} item={this.getElement(thirdData)[2]} hightLight={hightLight}/>
              <BondItem item={this.getElement(thirdData)[3]} isWhole = {1} hightLight={hightLight}/>
            </div>
          </div>

          <div className='h27 flex-c' style={{ paddingBottom: '3%' }}>
            <div className='flex-r left-cont-box'>
              <div className='flex-r left-cont-title'>
                <Link to={`/runManage`} style={{color: '#00ACFF'}} target='_blank'>
                  <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem' }} />
                  {fourthData.LARGEGROUP ? fourthData.LARGEGROUP : '-'}
                </Link>
              </div>
            </div>
            <StatusRow item={this.getElement(fourthData)[0]} hightLight={hightLight}/>
            <InfoData item={this.getElement(fourthData)[1]} hightLight={hightLight}/>
            <InfoData item={this.getElement(fourthData)[2]} hightLight={hightLight}/>
            <InfoData item={this.getElement(fourthData)[3]} hightLight={hightLight}/>
            <InfoData item={this.getElement(fourthData)[4]} ischange={0} hightLight={hightLight}/>
          </div>

          {/* 集中运营 */}
          <div className='h14 flex-c' style={{ paddingBottom: '3%' }}>
            <div className='flex-r left-cont-box'>
              <div className='flex-r left-cont-title' style={{ width: '18rem' }}>
                <Link to={`/centralOpert`} style={{color: '#00ACFF'}} target='_blank'>
                  <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem' }} />
                  {fifthData.LARGEGROUP ? fifthData.LARGEGROUP : '-'}
                </Link>
              </div>
            </div>
            <div className="flex1 flex-r">
              <RowHalfItem pos={1} item={this.getElement(fifthData)[0]} hightLight={hightLight}/>
              <RowHalfItem item={this.getElement(fifthData)[1]} change={1} hightLight={hightLight}/>
            </div>
            <div className="flex1 flex-r">
              <RowHalfItem isWhole={1} item={this.getElement(fifthData)[2]} hightLight={hightLight}/>
            </div>
          </div>
          {/* 集团客服中心业务 */}
          <div className='h15 flex-c' style={{ paddingBottom: '3%' }}>
            <div className='flex-r left-cont-box'>
              <div className='flex-r left-cont-title' style={{ width: '18rem' }}>
                <Link to={`/callCenter`} style={{color: '#00ACFF'}} target='_blank'>
                  <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem' }} />
                  {sixthData.LARGEGROUP ? sixthData.LARGEGROUP : '-'}
                </Link>
              </div>
            </div>
            <div className="flex1 flex-r">
              <RowHalfItem pos={1} item={this.getElement(sixthData)[0]} hightLight={hightLight}/>
              <InfoItem  callIn={callIn} hightLight={hightLight}/>
            </div>
            <div className="flex1 flex-r">
              <RowHalfItem isWhole={1} item={this.getElement(sixthData)[2]} hightLight={hightLight}/>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default Monitor;
