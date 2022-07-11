import React, { Component } from 'react';
import { Icon } from 'antd';

export class InfoItem extends Component {

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

  render() {
    const { pos = 0, item = {}, isWhole = 0, change = 0, callIn = '' } = this.props;
    let color = '#00ACFF';
    if(Number.parseInt(callIn)){
      if(change === 1 && Number.parseInt(callIn)>0){
        color = '#F7B432';
      }
    }
    const { show } =this.state

    return (
      <div className='flex1 flex-r left-data-box' style={{ marginRight: pos ? '.5rem' : '0', paddingRight: '.5rem' }}>
        <div className='flex-r flex1' style={{ alignItems: 'center' }}>
          <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem', color: 'transparent' }} />
          呼入咨询服务待处理
        </div>
        {isWhole ?
          <div className='flex-r blue' style={{ width: '15rem' }}>
            <div className='flex1 tr' style={{ color: '#00ACFF' }}>
              <span className="fwb fs21">
                {
                  show ? '' : callIn ? callIn : '-'
                }
              </span>
            </div>
          </div>
          : <div className='flex-r blue' style={{ width: '5.5rem' }}>
            <div className='flex1 tr' style={{ color: color }}>
              <span className="fwb fs21">
                {
                  show ? '' : callIn ? callIn : '-'
                }
              </span> 笔
            </div>
          </div>
        }

      </div>
    )
  }
}

export default InfoItem
