import React, { Component } from 'react';
import { Popover } from 'antd';

export class IndexItem extends Component {

  getIcon = (status) =>{
    if(status === '1'){
        return 'icon_completed.png';
    }else if(status === '2'){
        return 'icon_abnormal.png';
    }else if(status === '3'){
        return 'icon_edit.png';
    }else {
        return 'icon_nostart.png';
    }
  }

  getBackgroud = (status) =>{
    if(status === '2'){
        return 'linear-gradient(90deg, rgba(226, 60, 57, 0.8) 0%, rgba(226, 60, 57, 0) 100%)';
    }else if(status === '3'){
        return 'linear-gradient(90deg, #F7B432 0%, rgba(247, 180, 50, 0) 100%)';
    }else{
      return '';
    }
  }

  render() {
    const { itemData = {} } = this.props;
    const name = itemData.INDEXNAME;
    const status = itemData.INDEXSTATUS;
    const content = (
      <div style={{ color: '#fff', fontSize: '1.333rem', width: '25rem' }}>
        <p>检查结果状态：<span style={{ whiteSpace: '', color:status === '2'?'#E23C39':'#F7B432' }}>{itemData.INDEXSTATUSN}</span></p>
        <p>正常产品的数量：<span>{itemData.COMPLDATA}</span></p>
        <p>手工确认产品的数量：<span style={{color:itemData.MANUACONFMDT === '0'?'':'#F7B432' }}>{itemData.MANUACONFMDT}</span></p>
        <p>手工确认的原因：<span style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>{itemData.MANUACONFMINSTR}</span></p>
        <p>异常检查的产品数量：<span style={{color:itemData.EXCEPTNUM === '0'?'':'#E23C39' }}>{itemData.EXCEPTNUM}</span></p>
        <p>异常的具体产品内容：<span style={{
          whiteSpace: 'normal',
          wordBreak: 'break-all',
        }}>{itemData.EXCEPTINSTR}</span></p>
      </div>
    );
    return (
      <div className='in-side-sub-item' style={{paddingBottom:'1rem'}}>
        {name === '' ? '' :
          (<React.Fragment>
            {
              status === '2' ||status === '3' ? (
                <Popover content={content} title={name}>
                  <div style={{paddingRight:'1.068rem',paddingTop:'.6rem'}}><img className='jk-side-img' src={[require('../../../../../image/'+this.getIcon(status))]} alt='' /></div>
                </Popover>
              ) :  <div style={{paddingRight:'1.068rem',paddingTop:'.6rem'}}><img className='jk-side-img' src={[require('../../../../../image/'+this.getIcon(status))]} alt='' /></div>
            }
            <div className='flex1 flex-r h100' style={{
              width: '24.49rem',
              padding: '.2rem .2rem .2rem 1.068rem', alignItems: 'center',
              background: this.getBackgroud(status),
              fontWeight:'800',
              lineHeight:'2rem',
              borderRadius:'0.5rem'
            }}>{name}</div>
          </React.Fragment>)
        }
      </div>
    );
  }
}

export default IndexItem;
