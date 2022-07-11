import React, { Component } from 'react';
import { Icon } from 'antd';

export class InfoData extends Component {

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
    const { item = {}, ischange = 1 } = this.props;
    const { data = [] } = item;
    const [ info1 = {}, info2 = {} ] = data;
    const { INDEXNAME = '-', INDEXVALUE = '0' } = info1;
    const { INDEXNAME: INDEXNAME2 = '-', INDEXVALUE: INDEXVALUE2 = '0' } = info2;
    const { show } =this.state
    return (
      <div className='flex1 flex-r left-data-box'>
        <div className='flex-r left-data-sub'>
          <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem', color: 'transparent' }} />
          {item.SUBGROUP ? item.SUBGROUP : '-'}
        </div>
        <div className='flex1 flex-r blue'>
          <div className='flex1 tr' style={{ color: ischange === 0||INDEXVALUE === '0'?'#00ACFF':'#F7B432'}}>{INDEXNAME}&nbsp;<span className="fs21 fwb">{INDEXVALUE}</span></div>
          <div className='flex1 tr' style={{ color: '#00ACFF'}}>{INDEXNAME2}&nbsp;
            <span className="fs21 fwb">
              {
                show ? '' : INDEXVALUE2
              }
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default InfoData
