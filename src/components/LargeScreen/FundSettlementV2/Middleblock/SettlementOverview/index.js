import React from 'react';


class SettlementOverview extends React.Component {
  render() {
    const { overviewData = [] } = this.props;
    return (
      <div className='h100 pd10 FundSettlement'>
        <div className='flex-r '>
          <div className='flex-r pos-jszje'>
            <div className='flex-c bg-style-r'>
              <div className='fwb data-font tr' style={{
                fontSize: '1.633rem',
                padding: '2rem 1rem 1.5rem 0',
              }}>{overviewData[0] ? overviewData[0].INDEXNAME : '-'}
              </div>
              <div className='tr blue1' style={{ paddingRight: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                  {overviewData[0] ? overviewData[0].INDEXVALUE : '-'}
                </span>
                <span style={{ fontSize: '1.633rem', fontWeight: '600', verticalAlign: '-10%' }}>
                  {overviewData[0] ? overviewData[0].VALUEUNIT : '-'}
                </span></div>
            </div>
            {/*交收总金额*/}
            <img src={[require('../../../../../image/icon_jszje2.png')]} className='icon-style' alt='' />
          </div>

          <div className='flex-r pos-rtgs'>
            <div className='flex-c bg-style-r'>
              <div className='fwb data-font tr' style={{
                fontSize: '1.633rem',
                padding: '2rem 1rem 1.5rem 0',
              }}>{overviewData[1] ? overviewData[1].INDEXNAME : '-'}</div>
              <div className='tr blue1' style={{ paddingRight: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                  {overviewData[1] ? overviewData[1].INDEXVALUE : '-'}
                </span>
                <span style={{ fontSize: '1.633rem', fontWeight: '600', verticalAlign: '-10%' }}>
                  {overviewData[1] ? overviewData[1].VALUEUNIT : '-'}
                </span></div>
            </div>
            {/*RTGS*/}
            <img src={[require('../../../../../image/icon_rtgs2.png')]} className='icon-style' alt='' />
          </div>

          <div className='flex-r pos-dxjrcp'>
            <div className='flex-c bg-style-r'>
              <div className='fwb data-font tr' style={{
                fontSize: '1.633rem',
                padding: '2rem 1rem 1.5rem 0',
              }}>{overviewData[2] ? overviewData[2].INDEXNAME : '-'}
              </div>
              <div className='tr blue1' style={{ paddingRight: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                  {overviewData[2] ? overviewData[2].INDEXVALUE : '-'}
                </span>
                <span style={{ fontSize: '1.633rem', fontWeight: '600', verticalAlign: '-10%' }}>
                  {overviewData[2] ? overviewData[2].VALUEUNIT : '-'}
                </span></div>
            </div>
            {/*代销金融产品*/}
            <img src={[require('../../../../../image/icon_dxjrcp2.png')]} className='icon-style' alt='' />
          </div>

          <div className='flex-r pos-ptbzj'>
            {/*普通保证金*/}
            <img src={[require('../../../../../image/icon_ptbzj2.png')]} className='icon-style' alt='' />
            <div className='flex-c bg-style-l'>
              <div className='fwb data-font tl' style={{
                fontSize: '1.633rem',
                padding: '2rem 0 1.5rem 1rem',
              }}>{overviewData[3] ? overviewData[3].INDEXNAME : '-'}
              </div>
              <div className='blue1' style={{ paddingLeft: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                  {overviewData[3] ? overviewData[3].INDEXVALUE : '-'}
                </span>
                <span style={{ fontSize: '1.633rem', fontWeight: '600', verticalAlign: '-10%' }}>
                  {overviewData[3] ? overviewData[3].VALUEUNIT : '-'}
                </span></div>
            </div>
          </div>

          <div className='flex-r pos-xybzj'>
            {/*信用保证金*/}
            <img src={[require('../../../../../image/icon_xybzj2.png')]} className='icon-style' alt='' />
            <div className='flex-c bg-style-l'>
              <div className='fwb data-font tl' style={{
                fontSize: '1.633rem',
                padding: '2rem 0 1.5rem 1rem',
              }}>{overviewData[4] ? overviewData[4].INDEXNAME : '-'}
              </div>
              <div className='blue1' style={{ paddingLeft: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                  {overviewData[4] ? overviewData[4].INDEXVALUE : '-'}
                </span>
                <span style={{ fontSize: '1.633rem', fontWeight: '600', verticalAlign: '-10%' }}>
                  {overviewData[4] ? overviewData[4].VALUEUNIT : '-'}
                </span></div>
            </div>
          </div>

          <div className='flex-r pos-jszbs'>
            {/*交收总笔数*/}
            <img src={[require('../../../../../image/icon_jszb2.png')]} className='icon-style' alt='' />
            <div className='flex-c bg-style-l'>
              <div className='fwb data-font tl' style={{
                fontSize: '1.633rem',
                padding: '2rem 0 1.5rem 1rem',
              }}>{overviewData[5] ? overviewData[5].INDEXNAME : '-'}
              </div>
              <div className='blue1' style={{ paddingLeft: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: '600', marginRight: '.5rem', verticalAlign: 'middle' }}>
                  {overviewData[5] ? parseInt(overviewData[5].INDEXVALUE) : '-'}
                </span>
                <span style={{ fontSize: '1.633rem', fontWeight: '600', verticalAlign: '-10%' }}>
                  {overviewData[5] ? overviewData[5].VALUEUNIT : '-'}
                </span></div>
            </div>
          </div>

          <div className='pos-pro'>
            <div style={{ padding: '5rem 0 0 5.6rem' }}>
              <div className='por-circle'>
                <span
                  style={{ padding: '0rem 4.57rem 0rem 4.57rem', fontSize: '2.464rem', color: '#C6E2FF' }}>交收总览</span>
              </div>
            </div>
            {/*<div className='por-circle'/>*/}
            {/*<div className='fwb data-font' style={{ fontSize: '2.564rem', color:'#C6E2FF' }}>交收总览</div>*/}
          </div>
        </div>
      </div>
    );
  }
}

export default SettlementOverview;
