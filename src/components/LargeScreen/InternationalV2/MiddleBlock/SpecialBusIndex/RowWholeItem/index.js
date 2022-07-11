import React from 'react';

class RowWholeItem extends React.Component {
  render() {
    const {  item = [] } = this.props;
    let name = '';
    let value = '';
    let redalarm = '';
    if (item) {
      value = item.INDEXVALUE;
      name = item.INDEXNAME;
      redalarm = item.REDALARM;
    }
    return (
      <div  style={{ alignItems: 'center', fontWeight: '600', lineHeight: '2rem', width:'100%'  }}>
        <div className='flex1 in-sp-item' style={{ margin:'.8rem' }}>
          <div className='data-item flex-r'
               style={{ border:  redalarm === '1' ? '1px solid rgba(226, 60, 57, 1)' : '' , boxShadow:  redalarm === '1' ? '0 0 1rem rgb(226, 60, 57, 0.7) inset' : '', borderRadius: '0.4rem'}}>
            <div className='flex1'
                 style={{ marginRight: '.3rem' }}>{name}</div>
            <div className='tr data-item-value' style={{ paddingRight:'1rem', color: redalarm === '1'?'rgba(226, 60, 57, 1)':'' }}>{value}</div>
          </div>
        </div>
      </div>
    );
  }

}
export default RowWholeItem;
