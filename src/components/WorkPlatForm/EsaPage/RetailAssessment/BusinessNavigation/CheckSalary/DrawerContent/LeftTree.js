
import React from 'react';
import { Tree, Icon } from 'antd';
import { Fragment } from 'react';

/**
 *  树
 */

class LeftTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalData: [], // 原始数据
      selectedKeys: [], // 选中的节点
      expandedKeys: [], // 展开节点
      autoExpandParent: true, // 自动展开父节点
    }
  }
  componentDidMount() {
    const { treeData = [] } = this.props;
    if (treeData.length > 0) {
      this.setState({ expandedKeys: [treeData[0].id] });
      // 默认选中第一项
      this.handleNodeClick([treeData[0].id])
    }
  }

  componentWillReceiveProps(nextProps) {
    const { treeData } = nextProps;
    if (JSON.stringify(treeData) !== JSON.stringify(this.props.treeData)) {
      if (treeData.length > 0) {
        this.setState({ expandedKeys: [treeData[0].id] });
        // 默认选中第一项
        this.handleNodeClick([treeData[0].id])
      }
    }
  }
  // 渲染树节点
  renderTree = (data) => {
    return data.map((item) => {
      if (!item.children) {
        return (
          <Tree.TreeNode
            className="esa-tree-list-node"
            title={<span>{item.name}<span className='fr'>{item.value}</span></span>}
            key={item.id}
          />
        );
      }
      return (
        <Tree.TreeNode
          className="esa-tree-list-node esa-tree-havechild-node"
          title={<span>{item.name}<span className='fr'>{item.value}</span></span>}
          key={item.id}
        >
          {this.renderTree(item.children)}
        </Tree.TreeNode>
      );
    });
  }
  // 选中节点
  handleNodeClick = (selectedKeys) => {
    const { handleNodeClick } = this.props;
    if (handleNodeClick) {
      handleNodeClick(selectedKeys);
    }
    this.setState({
      selectedKeys,
    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  render() {
    const { selectedKeys, expandedKeys, autoExpandParent } = this.state;
    const { treeData = [] } = this.props;
    return (
      <Fragment>
        <Tree
          className="esa-tree-list"
          // showLine
          switcherIcon={<Icon className="m-color" style={{ fontSize: '15px' }} type="down-square" />}
          selectedKeys={selectedKeys}
          onSelect={this.handleNodeClick}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          showIcon
          checkStrictly
          autoExpandParent={autoExpandParent}
        >
          {this.renderTree(treeData)}
        </Tree>
      </Fragment>
    );
  }
}

export default LeftTree;
