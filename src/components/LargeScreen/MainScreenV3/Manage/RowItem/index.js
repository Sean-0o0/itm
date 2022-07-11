import React, { Component } from 'react';
import { Icon } from 'antd';

export class RowItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { show = false, hightLight : newTemp } = nextProps;
    const { hightLight : oldTemp } = this.props
    if( newTemp === 1 && newTemp !== oldTemp){
      this.setState({ show: true });
      setTimeout(()=>{
        this.setState({ show: false });
      }, 1000);
    } else {
      this.setState({ show: false });
    }
  }

  getEle = (data) => {
    const arr = [0, 0, 0];
    data.forEach((element = {}) => {
      if (element.INDEXNAME && element.INDEXNAME === '待处理') {
        if(element.INDEXVALUE){
          arr[0] = element.INDEXVALUE
        }
      } else if (element.INDEXNAME && element.INDEXNAME === '异常') {
        if(element.INDEXVALUE){
          arr[1] = element.INDEXVALUE
        }
      } else if (element.INDEXNAME && element.INDEXNAME === '已完成') {
        if(element.INDEXVALUE){
          arr[2] = element.INDEXVALUE
        }
      }
    });
    return arr;
  }

  render() {
    const { item = {} } = this.props;
    const { data = [] } = item;
    const values = this.getEle(data);
    const { show } =this.state
    return (
      <div className='flex1 flex-r left-data-box'>
        <div className='flex-r left-data-sub'>
          <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem', color: 'transparent' }} />
          {item.SUBGROUP ? item.SUBGROUP : '-'}
        </div>
        <div className='flex1 flex-r blue fs21'>
          <div className='flex1 tr fwb' style={{ color: '#F7B432' }}>
            {
              show ? '' : values[0]
            }
          </div>
          <div className='flex1 tr fwb' style={{ color: values[1] > 0? '#E23C39':'#AAA' }}>
            {
              show ? '' : values[1]
            }
          </div>
          <div className='flex1 tr fwb' style={{ color: '#00ACFF' }}>
            {
              show ? '' : values[2]
            }
          </div>
        </div>
      </div>
    )
  }
}

export default RowItem
