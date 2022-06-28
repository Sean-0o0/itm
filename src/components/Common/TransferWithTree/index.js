import React, { Component } from 'react';
import classnames from 'classnames';
import { Row, Col, Tree } from 'antd';
import BasicTransfer from '../BasicTransfer';
import TreeUtils from '../../../utils/treeUtils';
import styles from './index.less';

const { TreeNode } = Tree;

class TransferWithTree extends Component {
  constructor(props) {
    super(props);
    const { tree: { keyName = 'id', pKeyName = 'pid', titleName = 'name', dataSource = [] } } = props;
    const treeDataSource = TreeUtils.toTreeData(dataSource, { keyName, pKeyName, titleName, normalizeTitleName: 'title', normalizeKeyName: 'key' });
    this.state = {
      tree: {
        nodesData: treeDataSource,
      },

    };
  }
  componentWillReceiveProps = (nextProps) => {
    const { tree: { keyName = 'id', pKeyName = 'pid', titleName = 'name', dataSource = [] } } = nextProps;
    const treeDataSource = TreeUtils.toTreeData(dataSource, { keyName, pKeyName, titleName, normalizeTitleName: 'title', normalizeKeyName: 'key' });
    this.setState({
      tree: {
        nodesData: treeDataSource,
      },
    });
  }
  // 判断是否是叶子节点
  isLeaf = (key) => { // eslint-disable-line
    const { tree: { pKeyName = 'pid', dataSource = [] } } = this.props;
    let leaf = true;
    dataSource.forEach((data) => {
      const ckey = (data[pKeyName] || '').toString();
      if (ckey === key.toString()) {
        leaf = false;
        return false;
      }
    });
    return leaf;
  }
  // 处理树的选中事件
  handleTreeSelect = (selectedKeys) => {
    const { tree: { onSelect } } = this.props;
    const key = selectedKeys[0];
    // 如果是叶子节点,选中后触发onSelect函数
    if (key && onSelect && this.isLeaf(key)) {
      onSelect(selectedKeys);
    }
  }
  // 递归获取所有的节点的JSX结构
  getTreeNode = (nodes) => {
    return nodes.map((node) => {
      const { key, title, children } = node;
      // 叶子节点
      if (!children) {
        return <TreeNode key={key} title={title} />;
      }
      // 非叶子节点
      return (
        <TreeNode key={key} title={title}>
          {
            this.getTreeNode(children)
          }
        </TreeNode>
      );
    });
  }
  // 渲染tree及其节点信息
  renderTree = () => {
    const { tree: { nodesData } } = this.state;
    const { tree: { treeClassName, defaultExpandAll, selectedKeys = [] } } = this.props;
    const treeClass = 'm-tree';
    // 获取根节点
    const rootNode = nodesData[0] || [];
    // 渲染数据
    return (
      <Tree
        showLine
        defaultExpandAll={defaultExpandAll}
        defaultExpandedKeys={rootNode.children[0] ? [rootNode.children[0].key.toString()] : []}
        selectedKeys={selectedKeys}
        className={classnames(styles.tree, treeClassName, treeClass)}
        onSelect={this.handleTreeSelect}
      >
        {
          this.getTreeNode(rootNode.children)
        }
      </Tree>
    );
  }
  handleTransferChange = (e) => {
    const { targetKeys, targetTitles } = e;
    const { transfer: { onChange } } = this.props;
    if (onChange) {
      onChange(targetKeys, targetTitles);
    }
  }
  // 渲染transfer穿梭框
  renderTransfer = () => {
    const { transfer: { transferClassName, sortable = false, rowKey = 'id', titleKey = 'name', targetKeys = [], targetTitles = [], dataSource = [] } } = this.props;
    return (
      <BasicTransfer
        showSearch
        sortable={sortable}
        dataSource={dataSource.map((item) => { return { key: item[rowKey], title: item[titleKey] }; })}
        className={transferClassName}
        targetKeys={targetKeys}
        targetTitles={targetTitles}
        onChange={this.handleTransferChange}
      />
    );
  }
  render() {
    const { className, layout = {} } = this.props;
    const cls = classnames(className, styles.transferWithTree);
    const { tree: treeLayout = { span: 8 }, transfer: transferLayout = { span: 16 } } = layout;
    return (
      <Row className={cls} style={{ paddingTop: '0.75rem', paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingBottom: '0.75rem', height: '100%' }}>
        <Col {...treeLayout} xs={24} sm={24} md={6} lg={6}>
          {
            this.renderTree()
          }
        </Col>
        <Col {...transferLayout} xs={24} sm={24} md={18} lg={18}>
          {
            this.renderTransfer()
          }
        </Col>
      </Row>
    );
  }
}

export default TransferWithTree;
