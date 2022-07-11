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
    const { INDEXVALUE = '-', INDEXNAME='-', INDEXNO='-'} = item;
    const jszt = INDEXVALUE.split('|')[0];
    let color = '#00ACFF';
    if(Number.parseInt(INDEXVALUE)){
      if(change === 1 && Number.parseInt(INDEXVALUE)>0){
        color = '#F7B432';
      }
    }
    

    return (
      <div className='flex1 flex-r left-data-box' style={{ marginRight: pos ? '.5rem' : '0', paddingRight: '.5rem' }}>
        
        {isWhole ?
            <React.Fragment>
                <div className='flex-r flex1' style={{ alignItems: 'center' }}>
                    <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem', color: 'transparent' }} />
                    {INDEXNAME}
                </div>
                <div className='flex-r blue' style={{ width: '9rem' }}>
                    <div className='flex1 tr' style={{ color:jszt==='已结算'? '#00ACFF':'#F7B432' }}>
                    <span className="fwb fs20">{jszt}</span> 
                    </div>
                </div>
            </React.Fragment>
          : 
          <React.Fragment>
              <div className='flex-r flex1' style={{ alignItems: 'center' }}>
                    <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem', color: 'transparent' }} />
                    {INDEXNAME}
              </div>
              <div className='flex-r blue' style={{ width: '9rem' }}>
                <div className='flex1 tr' style={{ color: color }}>
                <span className="fwb fs20">{INDEXVALUE}</span> / <span className="fwb fs20">{INDEXNO}</span> 笔
                </div>
              </div>
          </React.Fragment>
        }

      </div>
    )
  }
}

export default RowHalfItem
