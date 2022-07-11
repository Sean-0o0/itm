import React, { Component } from 'react';

export class IndexItem extends Component {
  handleStatus = (data) =>{
    let IconAndpClass = { icon:'icon_nostart.png' , pClass: 'flex1 in-side-sub-item' , bgcolor:''}
    if(data.INDEXSTATUS) {
      switch (data.INDEXSTATUS) {
        case '0':
          IconAndpClass.icon = 'icon_nostart.png';
          break;
        case '1':
          IconAndpClass.icon = 'icon_underway.png';
          IconAndpClass.bgcolor = 'linear-gradient(90deg, rgb(247, 180, 50, 0.5) 0%, rgba(247, 180, 50, 0) 95%)'
          break;
        case '2':
          IconAndpClass.icon = 'icon_completed.png';
          break;
        case '3':
          IconAndpClass.icon = 'icon_abnormal.png';
          IconAndpClass.pClass += ' red';
          IconAndpClass.bgcolor = 'linear-gradient(90deg, rgba(226, 60, 57, 0.5) 0%, rgba(226, 60, 57, 0) 95%)'
          break;
        default:
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
            <div style={{ display:'inline-block',width:'25%'}}>
            <div className="in-side-sub-item" style={{paddingBottom:'1rem'}}>
              <React.Fragment>
              <div style={{paddingRight:'1.068rem',paddingTop:'.45rem'}}>
                <img className="jk-side-img" src={[require("../../../../../../image/" +`${this.handleStatus(item).icon}`) ]}   alt="" />
                </div>
                <div className="flex-r h100" style={{
                  width: '24.49rem',
                  padding: '.2rem',fontWeight:'800', lineHeight:'2rem',paddingLeft:'1.068rem',
                  alignItems: 'center',
                  background: this.handleStatus(item).bgcolor,
                }}>{item.INDEXNAME}</div>
              </React.Fragment>
            </div>
            </div>)
        })}
      </div>
    )
  }
};

export default IndexItem;
