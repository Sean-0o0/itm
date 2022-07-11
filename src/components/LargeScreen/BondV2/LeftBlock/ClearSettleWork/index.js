import React from 'react';
import RowItem from './RowItem';

class ClearSettleWork extends React.Component {

  render() {
    const { sqsData = [], jsjdData = []} = this.props;
    const  jzyw = jsjdData[2], jejs = jsjdData[4];
    const jszt = jsjdData[2]?jsjdData[2].VALUE.split('|')[0]:'/';

    return (
      <div className='ax-card flex-c left-cont'>
        <div className='pos-r'>
          <div className='card-title title-l'>上清所结算业务</div>
        </div>
        {sqsData.length === 0 ?
          (<React.Fragment>
            <div className='evrt-bg evrt-bgimg'></div>
            <div className='tc blue' style={{ fontSize: '1.633rem' }}>暂无数据</div>
          </React.Fragment>) :
          (<div style={{ padding: '1.1rem 2rem 0 2rem', fontSize: '1.633rem', height: 'calc(100% - 3.66rem)' }}>
            <div className='flex-c h100'>
              <div className='flex-c h13'>
                <div className='bg_table table_style h100 flex-r fwb' style={{ padding: '0rem 2rem' }}>
                  <div className='flex1 '>业务</div>
                  <div className='tr' style={{ width: '9rem' }}>未完成</div>
                  <div className='tr' style={{ width: '9rem' }}>异常</div>
                  <div className='tr' style={{ width: '11rem' }}>手工结算</div>
                  <div className='tr' style={{ width: '9rem' }}>成功</div>
                </div>
              </div>
              <div className='flex-c h84'>
                <div className='flex-c h100'>
                  {sqsData.map((item, index) => (
                    <RowItem item={item} key={index}/>
                  ))}
                   <div className = "flex-r flex1">
                     <div className='squreKey h85 flex-r flex1 fwb' style={{ margin: '1rem 1rem 1rem 0' ,alignItems:'center'}}>
                       <div className = "wid45">
                        <img src={[require('../../../../../image/icon_jzjszt.png')]} className='icon-style' alt='' />
                       </div>
                       <div className = "flex-c">
                         <div className = "data-font" style ={{height:"3rem"}}>{jzyw?jzyw.NAME:"-"}</div>
                         <div style ={{color:jszt==='已结算'?"#00ACFF":"#F7B432",  fontWeight: "bold"}}>{jszt}</div>
                       </div>
                     </div>
                     <div className='squreKey h85 flex-r flex1 fwb' style={{ margin: '1rem 0rem 1rem 1rem',alignItems:'center' }}>
                       <div className = "wid45">
                        <img src={[require('../../../../../image/icon_jzjsje.png')]} className='icon-style' alt='' />
                       </div>
                       <div className = "flex-c">
                         <div className = "data-font" style ={{height:"3rem"}}>{jejs?jejs.NAME:"-"}</div>
                         <div style ={{color:"#00ACFF",  fontWeight: "bold"}}>{jejs?jejs.VALUE:"0"} 万元</div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    );
  }
}

export default ClearSettleWork;
