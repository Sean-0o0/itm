import React from 'react';
import { Tree, Input } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

const { TreeNode } = Tree;
/**
 * 数据模板列的新增和修改
 */
class TreeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ marginLeft: '15%' }}>
          <Input placeholder="输入关键字检索" style={{ maxWidth: '300px', height: '30px', margin: 5 }} onChange={this.handChange} />
          <Scrollbars
            autoHide
            style={{ width: '100%', height: '13rem' }}
          >
            <Tree
              onExpand={this.onExpand}
              // expandedKeys={expandedKeys}
              // autoExpandParent={autoExpandParent}
              className="m-tree-info"
              onSelect={this.onSelect}
            >
              <TreeNode title="收入1" key="key-1" />
              <TreeNode title="合计1" key="key-2" />
              <TreeNode title="收入2" key="key-3" />
              <TreeNode title="合计2" key="key-4" />
            </Tree>
          </Scrollbars>
        </div>
      </React.Fragment>
    );
  }
}

export default TreeSelect;
