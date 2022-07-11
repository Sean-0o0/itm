import React from 'react';
import TreeItemTransfer from '../../../../Common/TreeItemTransfer';

class TransferItem extends React.Component {
  render() {
    const { allDatas = [], selectedKeys, selectedTitles } = this.props;
    const treeItemTransferProps = {
      keyName: 'key',
      pKeyName: 'fid',
      titleName: 'title',
      dataSource: allDatas,
      selectedKeys,
      selectedTitles,
      onChange: this.props.handleTransferSelect,
      // sortable: true, // 是否排序 0:是|1:否
      clearable: true
    };
    return (
      <div className='display-columns' style={{ backgroundColor: '#fff', height: '55rem' }}>
        <TreeItemTransfer
          {...treeItemTransferProps}
        />
      </div>
    );
  }
}
export default TransferItem;
