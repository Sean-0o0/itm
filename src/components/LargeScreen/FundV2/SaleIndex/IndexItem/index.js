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

  // handleStatus = (status) =>{
  //   let style = { bgcolor:'', height:'', boxShadow:'', border:'', position:'', paddingTop:'' }
  //   if(status) {
  //     switch (status) {
  //       case '0':
  //         style.height = '4.5rem';
  //         style.boxShadow = '0 0 1rem rgba(0, 172, 255, 0.6) inset';
  //         style.border= '1px solid rgba(0, 172, 255, 0.6)';
  //         style.position= 'relative';
  //         style.paddingTop = '1.4rem';
  //         break;
  //       case '1':
  //         style.height = '4.5rem';
  //         style.boxShadow = '0 0 1rem rgba(0, 172, 255, 0.6) inset';
  //         style.border= '1px solid rgba(0, 172, 255, 0.6)';
  //         style.position= 'relative';
  //         style.paddingTop = '1.4rem';
  //         break;
  //       case '2':
  //         style.height = '4.5rem';
  //         style.boxShadow = '0 0 1rem rgba(226, 60, 57, 0.7) inset';
  //         style.border= '1px solid #E23C39';
  //         style.position= 'relative';
  //         style.paddingTop = '1.4rem';
  //         break;
  //       case '3':
  //         style.height = '4.5rem';
  //         style.boxShadow = '0 0 1rem rgba(240, 180, 50, 0.7) inset';
  //         style.border= '1px solid #F7B432';
  //         style.position= 'relative';
  //         style.paddingTop = '1.4rem';
  //         break;
  //       default:
  //         style.height = '4.5rem';
  //         style.boxShadow = '0 0 1rem rgba(0, 172, 255, 0.6) inset';
  //         style.border= '1px solid rgba(0, 172, 255, 0.6)';
  //         style.position= 'relative';
  //         style.paddingTop = '1.4rem';
  //         break;
  //     }
  //   }
  //   return style
  // }

  render() {
    const { itemData = {} } = this.props;
    const name = itemData.INDEXNAME;
    const status = itemData.INDEXSTATUS;
    const content = (
      <div style={{ color: '#fff', fontSize: '1.333rem', width: '25rem' }}>
        <p>检查结果状态：<span style={{ whiteSpace: '' }}>{itemData.INDEXSTATUSN}</span></p>
        <p>正常产品的数量：<span>{itemData.COMPLDATA}</span></p>
        <p>手工确认产品的数量：<span>{itemData.MANUACONFMDT}</span></p>
        <p>手工确认的原因：<span style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>{itemData.MANUACONFMINSTR}</span></p>
        <p>异常检查的产品数量：<span>{itemData.EXCEPTNUM}</span></p>
        <p>异常的具体产品内容：<span style={{
          whiteSpace: 'normal',
          wordBreak: 'break-all',
        }}>{itemData.EXCEPTINSTR}</span></p>
      </div>
    );
    return (
        <div style={{ display:'inline-block',width:'50%'}}>
            <div className='in-side-sub-item' style={{paddingBottom:'1rem'}}>
                {name === '' ? '' :
                (<React.Fragment>
                    {
                    status === '2' ||status === '3' ? (
                        <Popover content={content} title={name}>
                        <div style={{paddingRight:'1.068rem',paddingTop:'.3rem'}}><img className='jk-side-img' src={[require('../../../../../image/'+this.getIcon(status))]} alt='' /></div>
                        </Popover>
                    ) :  <div style={{paddingRight:'1.068rem',paddingTop:'.3rem'}}><img className='jk-side-img' src={[require('../../../../../image/'+this.getIcon(status))]} alt='' /></div>
                    }
                    <div className='flex1 flex-r h100' style={{
                    width: '24.49rem',
                    padding: '.2rem .2rem .2rem 1.068rem', alignItems: 'center',
                    color: status === '2' ? '#D34643' :'',
                    background: this.getBackgroud(status),
                    fontWeight:'600',
                    }}>{name}</div>
                </React.Fragment>)
                }
            </div>
        </div>

    );
  }
}

export default IndexItem;
