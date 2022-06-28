import React from 'react';
// import BasicTransfer from '../../components/Common/BasicTransfer';
import TransferWithTree from '../../components/Common/TransferWithTree';

const datas = [
  { a: 1, b: 88, c: 'aaa' },
  { a: 2, b: 88, c: 'bbb' },
  { a: 7, b: 2, c: 'ccc' },
  { a: 8, b: 3, c: 'ddd' },
  { a: 3, b: 88, c: 'eee' },
  { a: 4, b: 1, c: 'fff' },
  { a: 5, b: 1, c: 'ggg' },
  { a: 6, b: 2, c: 'hhh' },
  { a: 9, b: 3, c: 'iii' },
];

const transferDatas = [
  { id: 1, name: '1111' },
  { id: 2, name: '222' },
  { id: 3, name: '333' },
  { id: 4, name: '444' },
  { id: 5, name: '5555' },
  { id: 6, name: '6666' },
  { id: 7, name: '7777' },
  { id: 8, name: '8888' },
  { id: 9, name: '9999' },
  { id: 10, name: '10101010' },
];

class TestPage extends React.Component {
  state = {
    transferWithTree: {
      treeSelectedKeys: ['4'],
      transferTargetKeys: [7, 8, 99],
      transferTargetTitles: ['7777', '8888', 'sss9999'],
    },
  }
  handleTreeSelect = (selectedKeys) => {
    const { transferWithTree } = this.state;
    transferWithTree.treeSelectedKeys = selectedKeys;
    this.setState({ transferWithTree });
  }
  handleTransferSelect = (targetKeys, targetTitles) => {
    const { transferWithTree } = this.state;
    transferWithTree.transferTargetKeys = targetKeys;
    transferWithTree.transferTargetTitles = targetTitles;
    this.setState({ transferWithTree });
  }
  render() {
    const { transferWithTree: { treeSelectedKeys, transferTargetKeys, transferTargetTitles } } = this.state;
    const transferWithTreeProps = {
      tree: {
        keyName: 'a',
        pKeyName: 'b',
        titleName: 'c',
        dataSource: datas,
        selectedKeys: treeSelectedKeys,
        onSelect: this.handleTreeSelect,
      },
      transfer: {
        rowKey: 'id',
        titleKey: 'name',
        dataSource: transferDatas,
        targetKeys: transferTargetKeys,
        targetTitles: transferTargetTitles,
        onChange: this.handleTransferSelect,
      },
    };

    // const basicTransferProps = {
    //   showSearch: true,
    // };

    return (
      <div style={{ backgroundColor: '#fff' }}>
        {/* <BasicTransfer
          {...basicTransferProps}
        /> */}
        <TransferWithTree
          {...transferWithTreeProps}
        />
      </div>
    );
  }
}

export default TestPage;
