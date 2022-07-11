import React, { Component } from 'react';
import { Icon } from 'antd';

export class RowHalfItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const {  hightLight : newTemp } = nextProps;
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
    const { pos = 0, item = {}, isWhole = 0, change = 0} = this.props;
    const { INDEXVALUE = '-', INDEXNAME='-'} = item;
    let color = '#00ACFF';
    if(Number.parseInt(INDEXVALUE)){
      if(change === 1 && Number.parseInt(INDEXVALUE)>0){
        color = '#F7B432';
      }
    }
    const { show } =this.state

    return (
      <div className='flex1 flex-r left-data-box' style={{ marginRight: pos ? '.5rem' : '0', paddingRight: '.5rem' }}>
        <div className='flex-r flex1' style={{ alignItems: 'center' }}>
          <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem', color: 'transparent' }} />
          {INDEXNAME}
        </div>
        {isWhole ?
          <div className='flex-r blue' style={{ width: '15rem' }}>
            <div className='flex1 tr' style={{ color: '#00ACFF' }}>
              <span className="fwb fs21">
                {
                  show ? '' : isNaN(INDEXVALUE)?INDEXVALUE:INDEXVALUE+'笔'
                }</span>
            </div>
          </div>
          : <div className='flex-r blue' style={{ width: '6.7rem' }}>
            <div className='flex1 tr' style={{ color: color }}>
              <span className="fwb fs21">
                {
                  show ? '' : isNaN(INDEXVALUE)?INDEXVALUE:INDEXVALUE+'笔'
                }</span> 
            </div>
          </div>
        }

      </div>
    )
  }
}

export default RowHalfItem
