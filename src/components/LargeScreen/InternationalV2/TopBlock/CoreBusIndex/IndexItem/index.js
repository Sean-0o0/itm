import React, { Component } from 'react';
import { Popover } from 'antd';

export class IndexItem extends Component {
  handleStatus = (data) =>{
    let IconAndpClass = { icon:'icon_nostart.png' , pClass: 'flex1 in-side-sub-item' , bgcolor:'', height:'', boxShadow:'', border:'', position:'', paddingTop:'' }
    if(data.INDEXSTATUS) {
    switch (data.INDEXSTATUS) {
        case '0':
          IconAndpClass.icon = 'icon_nostart.png';
          IconAndpClass.paddingTop = '0.45rem';
          break;
        case '1':
          IconAndpClass.icon = 'icon_underway.png';
          IconAndpClass.paddingTop = '0.45rem';
          // IconAndpClass.bgcolor = '#F7B432'
          break;
        case '2':
          IconAndpClass.icon = 'icon_completed.png';
          IconAndpClass.paddingTop = '0.45rem';
          break;
        case '3':
          IconAndpClass.icon = 'icon_abnormal.png';
          IconAndpClass.pClass += ' red';
          IconAndpClass.height = '4.5rem';
          IconAndpClass.boxShadow = '0 0 1rem rgba(226, 60, 57, 0.7) inset';
          IconAndpClass.border= '1px solid #E23C39';
          IconAndpClass.position= 'relative';
          IconAndpClass.paddingTop = '1.1rem';
          IconAndpClass.bgcolor = '#D34643'
          break;
        case '4':
        IconAndpClass.icon = 'icon_nohappen.png';
          IconAndpClass.paddingTop = '0.45rem';
          break;
        default:
          IconAndpClass.icon = 'icon_nostart.png';
          IconAndpClass.paddingTop = '0.45rem';
          break;
      }
    }
    return IconAndpClass
  }
  render() {
    const { item = [] } = this.props;
    return (
      <div>
      {item.map((item) => {
        return(
          <div className="flex1 in-side-sub-item" style={{paddingBottom:'1rem'}}>
            {/*<div className="flex1 in-side-sub-item" style={{  borderRadius: '0.5rem',*/}
            {/*  boxShadow: this.handleStatus(item).boxShadow,*/}
            {/*  border: this.handleStatus(item).border,*/}
            {/*  position: this.handleStatus(item).position,*/}
            {/*  height: this.handleStatus(item).height}}>*/}
            <React.Fragment>
              <div style={{paddingRight:'1.068rem',paddingTop:"0.45rem"}}>
              <img className="jk-side-img" src={[require("../../../../../../image/" +`${this.handleStatus(item).icon}`) ]}   alt="" />
              </div>
            <div className="flex1 flex-r h100" style={{
              width: '24.49rem',
              padding: '.2rem',
              fontWeight:'600', lineHeight:'2rem',paddingLeft:'1.068rem',
              alignItems: 'center',
              color: this.handleStatus(item).bgcolor,
              // boxShadow: this.handleStatus(item).boxShadow,
              // border: this.handleStatus(item).border,
              // position: this.handleStatus(item).position,
              // height: this.handleStatus(item).height,
              // color: this.handleStatus(item).bgcolor,
            }}>{item.INDEXNAME}</div>
          </React.Fragment>
            {/*</div>*/}
          </div>)
        })}
      </div>
    )
  }
};

export default IndexItem;
