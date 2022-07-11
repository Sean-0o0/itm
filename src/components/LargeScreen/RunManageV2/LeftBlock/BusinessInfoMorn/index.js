import React from 'react';
import InfoItem from './InfoItem';
import IndexItem from '../../../OprtRiskOfAsseV2/FootBlock/IndexItem';

// import InfoItem from './InfoItem';

class BusinessInfoMorn extends React.Component {
  render() {
    const { datas = [] } = this.props;
    let titleArr = '参数设置及会员业务';
    let firstTitle = '两融参数维护';
    let secondTitle = '任务及提醒';
    let thirdTitle = '参数文件接收';
    let forthTitle = '数据申报';
    // let fifthTitle = '投保稽核';
    let firstArr = [];
    let secondArr = [];
    let thirdArr = [];
    let forthArr = [];
    // let fifthArr = [];
    datas.forEach(element => {
      if (element.IDX_GRD === '0') {
        titleArr = element.IDX_NM;
      }
      if (element.IDX_CODE === 'YXGL0501') {
        firstTitle = element.IDX_NM;
      }
      if (element.IDX_CODE === 'YXGL0502') {
        secondTitle = element.IDX_NM;
      }
      if (element.IDX_CODE === 'YXGL0503') {
        thirdTitle = element.IDX_NM;
      }
      if (element.IDX_CODE === 'YXGL0504') {
        forthTitle = element.IDX_NM;
      }
      // if (element.IDX_CODE === 'YXGL0505') {
      //   fifthTitle = element.IDX_NM;
      // }
      if (element.FID === '1069') {
        firstArr.push(element);
      } else if (element.FID === '1070') {
        secondArr.push(element);
      } else if (element.FID === '1072') {
        thirdArr.push(element);
      } else if (element.FID === '1073') {
        forthArr.push(element);
      }
      // else if (element.FID === '1076'){
      //   fifthArr.push(element)
      // }
    });
    return (
      <div className=' ax-card current  Oprtanagement'>
        <div className='card-title title-l'>{titleArr}</div>
        <div className='flex-r' style={{ padding: '3rem 0 1rem 1rem' }}>
          <div className='in-side-sub flex-c' style={{ width: '33%' }}>
            <div className='in-side-sub-title in-side-sub-item'>{firstArr.length ? firstTitle : ''}</div>
            {firstArr.length ?
              <div style={{ paddingTop: '1.5rem' }}>
                {firstArr.map((e) => <InfoItem infoItem={e} />)}
              </div> : <div></div>
            }
          </div>
          <div className='in-side-sub flex-c' style={{ width: '33%' }}>
            <div className='in-side-sub-title in-side-sub-item'>{secondArr.length ? secondTitle : ''}</div>
            {secondArr.length ?
              <div style={{ paddingTop: '1.5rem' }}>
                {secondArr.map((e) => <InfoItem infoItem={e} />)}
              </div> : <div></div>
            }
          </div>
          <div className='in-side-sub flex-c' style={{ width: '33%' }}>
            <div className='in-side-sub-title in-side-sub-item'>{thirdArr.length ? thirdTitle : ''}</div>
            {thirdArr.length ?
              <div style={{ paddingTop: '1.5rem' }}>
                {thirdArr.map((e) => <InfoItem infoItem={e} />)}
              </div> : <div></div>
            }
            <div className='in-side-sub-title in-side-sub-item' style={{paddingTop: '1.5rem'}}>{forthArr.length ? forthTitle : ''}</div>
            {forthArr.length ?
              <div style={{ paddingTop: '1.5rem' }}>
                {forthArr.map((e) => <InfoItem infoItem={e} />)}
              </div> : <div></div>
            }
            {/*<div className='in-side-sub-title in-side-sub-item' style={{paddingTop: '1.5rem'}}>{fifthArr.length ? fifthTitle : ''}</div>*/}
            {/*{fifthArr.length ?*/}
            {/*  <div style={{ paddingTop: '1.5rem' }}>*/}
            {/*    {fifthArr.map((e) => <InfoItem infoItem={e} />)}*/}
            {/*  </div> : <div></div>*/}
            {/*}*/}
          </div>
        </div>
        {/*<div className='flex-r ' style={{ padding: '3rem 0 1rem 1rem' }}>*/}
        {/*  <div className='in-side-sub flex-c' style={{width:'50%'}}>*/}
        {/*    <div className='in-side-sub-title in-side-sub-item'>{firstArr.length ? firstArr[0].IDX_NM : ''}</div>*/}

        {/*    <div style={{ paddingTop: '1.5rem' }}>*/}
        {/*      {[1, 2, 3, 4, 5].map(i => (*/}
        {/*        <InfoItem infoItem={firstArr.length ? firstArr[i] : {}} key={i}/>))}*/}
        {/*    </div>*/}
        {/*    <div className='in-side-sub-title in-side-sub-item'>  {thirdArr.length ? thirdArr[0].IDX_NM : ''}</div>*/}
        {/*    <div style={{ paddingTop: '1.5rem' }}>*/}
        {/*      {[1].map(i => (*/}
        {/*        <InfoItem infoItem={thirdArr.length ? thirdArr[i] : {}} key={i}/>))}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className='in-side-sub flex-c' style={{width:'50%'}}>*/}
        {/*    <div style={{ padding: '0 0 3.4rem 0' }}/>*/}
        {/*    <div className="bg_table table_style" style={{width:'33rem'}}>*/}
        {/*      <div className=' table_font '>*/}
        {/*        {secondArr.length ? secondArr[0].IDX_NM : ''}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*    <div style={{ paddingTop: '1.5rem' }}>*/}
        {/*      {[1, 2, 3, 4, 5].map(i => (*/}
        {/*        <InfoItem infoItem={secondArr.length ? secondArr[i] : {}} key={i}/>))}*/}
        {/*    </div>*/}

        {/*    <div style={{paddingTop:'1.5rem'}} />*/}
        {/*    <div className="bg_table table_style" style={{width:'21rem'}}>*/}
        {/*      <div className=' table_font '>*/}
        {/*        {forthArr.length ? forthArr[0].IDX_NM : ''}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*    <div style={{ paddingTop: '1.5rem' }}>*/}
        {/*      {[1].map(i => (*/}
        {/*        <InfoItem infoItem={forthArr.length ? forthArr[i] : {}} key={i}/>))}*/}
        {/*    </div>*/}

        {/*  </div>*/}

        {/*</div>*/}
      </div>
    );
  }
};

export default BusinessInfoMorn;
