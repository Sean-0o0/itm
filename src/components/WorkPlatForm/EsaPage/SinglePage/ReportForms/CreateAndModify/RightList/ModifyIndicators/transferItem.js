import React from 'react';
import TreeItemTransfer from '../../../../../../Common/TreeItemTransfer';

class TransferItem extends React.Component {
  render() {
    const { allDatas = [], selectedKeys, selectedTitles } = this.props;
    const treeItemTransferProps = {
      keyName: 'id',
      pKeyName: 'fid',
      titleName: 'mc',
      dataSource: allDatas,
      selectedKeys,
      selectedTitles,
      onChange: this.props.handleTransferSelect,
      sortable: true, // 是否排序 0:是|1:否
    };
    return (
      <div style={{ backgroundColor: '#fff', height: '35rem' }}>
        <TreeItemTransfer
          {...treeItemTransferProps}
        />
      </div>
    );
  }
}
export default TransferItem;
