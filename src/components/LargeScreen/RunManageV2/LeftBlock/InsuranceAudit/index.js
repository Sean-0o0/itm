import React from 'react';
import RowItem from './RowItem';
import RowItem2 from './RowItem2';

class InsuranceAudit extends React.Component {
  //获取当前步骤
  getCurrent = (item = {}) => {
    const { data = [] } = item;
    let name = '-';
    for (let i = 0; i < data.length; i++) {
      const ele = data[i] || {};
      if (i === 0) {
        if (ele.INDEXSTATUS === '0' || ele.INDEXSTATUS === '1' || ele.INDEXSTATUS === '3') {
          name = ele.INDEXNAME || '-';
          break;
        } else if (ele.INDEXSTATUS === '2' && data.length === 1) {
          name = ele.INDEXNAME || '-';
          break;
        }
      } else if (i > 0) {
        if (ele.INDEXSTATUS === '1' || ele.INDEXSTATUS === '3') {
          name = ele.INDEXNAME || '-';

          break;
        } else if (i === data.length - 1 && ele.INDEXSTATUS === '2') {
          name = ele.INDEXNAME;
        }
      }
    }
    return name;
  };

  //获取当前步骤
  getCurrentIndex = (item = {}) => {
    let curentIndex = 0;
    for (let i = 0; i < item.length; i++) {
      const ele = item[i] || {};
      if (i === 0) {
        if (ele.INDEXSTATUS === '0' || ele.INDEXSTATUS === '1' || ele.INDEXSTATUS === '3') {
          curentIndex = 0;//状态为未开始则当前步为第一条
          break;
        } else if (ele.INDEXSTATUS === '2' && item.length === 1) {
          curentIndex = 0;//状态为未开始则当前步为第一条
          break;
        }
      } else if (i > 0) {
        if (ele.INDEXSTATUS === '1' || ele.INDEXSTATUS === '3') {
          curentIndex = i;//状态进行中，获取当前步
          break;
        } else if (i === item.length - 1 && ele.INDEXSTATUS === '2') {
          curentIndex = item.length - 1;//状态为已完成则当前步为最后一条
        }
      }
    }
    return curentIndex;
  };


  render() {
    const { InsurAuditData = [], list1 = [], list2 = [], list3 = [], firstMaxTime = '', firstMinTime = '', secondMaxTime = '', secondMinTime = '' } = this.props;


    return (
      <div className=' ax-card current  Oprtanagement'>
        <div className='card-title title-l'>投保稽核</div>
        {InsurAuditData.length === 0 ?
          (<React.Fragment>
            <div className='evrt-bg evrt-bgimg'></div>
            <div className='tc blue' style={{ fontSize: '1.633rem' }}>暂无数据</div>
          </React.Fragment>) :
          (<div className='in-side-sub flex-r flex1' style={{ height: 'calc(100% - 4.167rem)', position: 'relative', top: '1%', paddingBottom: '3rem' }}>
            <div className='wid20' style={{ padding: '2.2rem 1.5rem 0 1.5rem' }}>
              <div className='pos-border bg_border bg_border_style'>
                <img className='item-img' src={[require('../../../../../image/icon_dyp.png')]} alt='' />
                <div className='in-side-sub-title in-side-sub-item'
                  style={{ position: 'absolute', left: '32%', bottom: 'calc(50% - 4rem)', whiteSpace: 'pre-line', width: '6.6rem', wordBreak: 'break-all', wordWrap: 'break-word' }}>
                  {list1[0] ? list1[0].GROUPNAME : '-'}
                </div>
                {/*<div style={{ position: 'absolute', left: '27%', top: '63%',textAlign: 'center', width:'50%' }}>*/}
                {/*  {list1[0] ?list1[0].GROUPSTARTDT : ''}*/}
                {/*  <div className='tc'>--</div>*/}
                {/*  {list1[0] ?list1[0].GROUPENDDT : ''}*/}
                {/*</div>*/}
              </div>
            </div>
            <div className='wid40 flex-c' style={{ paddingTop: '2.2rem' }}>
              {/*<div className="h100">*/}
              <ul className='timeline-wrapper h100 flex-c rm-last-block' style={{ marginBottom: '0' }}>
                {list1.map((item, index) =>
                  (<RowItem item={item} order={index} last={list1.length - 1} current={this.getCurrentIndex(list1)} key={index} />),
                )
                }
              </ul>
              {/*</div>*/}
            </div>
            <div className='flex-c wid60'>
              <div className='flex-r wid100 h50'>
                <div className='wid33' style={{ padding: '2.2rem 1.5rem 0 1.5rem' }}>
                  <div className='pos-border2 bg_border bg_border_style'>
                    <img className='item-img' src={[require('../../../../../image/icon_dyp.png')]} alt='' />
                    <div className='in-side-sub-title in-side-sub-item'
                      style={{
                        position: 'absolute', left: '32%', bottom: 'calc(50% - 4rem)', whiteSpace: 'pre-line', width: '6.6rem', wordBreak: 'break-all', wordWrap: 'break-word'
                      }}>

                      {list2[0] ? list2[0].GROUPNAME : '-'}
                    </div>
                    {/*<div style={{ position: 'absolute', left: '27%', top: '63%',textAlign: 'center', width:'50%' }}>*/}
                    {/*  {list2[0] ? list2[0].GROUPSTARTDT : ''}*/}
                    {/*  <div className='tc'>--</div>*/}
                    {/*  {list2[0] ? list2[0].GROUPENDDT : ''}*/}
                    {/*</div>*/}
                  </div>
                </div>
                <div className='wid67 h100' style={{ paddingTop: '2.2rem' }}>
                  <ul className='flex-c timeline-wrapper h100 rm-last-block' style={{ marginBottom: '0' }}>
                    {list2.map((item, index) =>
                      (<RowItem2 item={item} order={index} last={list2.length - 1} current={this.getCurrentIndex(list2)} key={index} />),
                    )
                    }
                  </ul>
                </div>
              </div>
              <div className='flex-r wid100 h50'>
                <div className='wid33' style={{ padding: '2.2rem 1.5rem 0 1.5rem' }}>
                  <div className='pos-border2 bg_border bg_border_style'>
                    <img className='item-img' src={[require('../../../../../image/icon_dyp.png')]} alt='' />
                    <div className='in-side-sub-title in-side-sub-item'
                      style={{
                        position: 'absolute', left: 'calc(50% - 3.5rem)', bottom: 'calc(50% - 4rem)', whiteSpace: 'pre-line', width: '7.2rem', wordBreak: 'break-all', wordWrap: 'break-word'
                      }}>

                      {list3[0] ? list3[0].GROUPNAME : '-'}
                    </div>
                    {/*<div style={{ position: 'absolute', left: '27%', top: '63%',textAlign: 'center', width:'50%' }}>*/}
                    {/*  {list2[0] ? list2[0].GROUPSTARTDT : ''}*/}
                    {/*  <div className='tc'>--</div>*/}
                    {/*  {list2[0] ? list2[0].GROUPENDDT : ''}*/}
                    {/*</div>*/}
                  </div>
                </div>
                <div className='wid67 h100' style={{ paddingTop: '2.2rem' }}>
                  <ul className='flex-c timeline-wrapper h100 rm-last-block ul-sp' style={{ marginBottom: '0' }}>
                    {list3.map((item, index) =>
                      (<RowItem2 item={item} order={index} last={list3.length - 1} current={this.getCurrentIndex(list3)} key={index} />),
                    )
                    }
                    <div className='flex1 flex-r h100' style={{
                      width: '100%',
                      padding: '.2rem',
                      color: 'rgb(226, 60, 57)',
                      fontWeight: '600', lineHeight: '2rem', paddingLeft: '1.068rem',
                      alignItems: 'center', fontSize: '1.725rem',
                      paddingLeft: '7.6rem',
                    }}>{list3.length && Object.prototype.toString.call(list3[list3.length - 1]) === '[object Object]'&& list3[list3.length - 1].EXCEPTIONRSON &&list3[list3.length - 1].EXCEPTIONRSON}
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    );
  }

}
export default InsuranceAudit;
