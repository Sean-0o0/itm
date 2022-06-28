import React, { Component } from 'react';
import classnames from 'classnames';
import { Row, Col, Tree, List, Checkbox, Input } from 'antd';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import TreeUtils from '../../../utils/treeUtils';
import styles from './index.less';

const { TreeNode } = Tree;

const SortableItem = SortableElement(({ item, selectedKeys, render, onRowClick }) => {
  const { key, title, disabled = false } = item;
  return (
    <a className={styles.listItem} herf="#" onClick={e => onRowClick(e, key)}>
      <List.Item>
        <List.Item.Meta
          avatar={<Checkbox key={key} disabled={disabled} checked={selectedKeys.includes(key)} />}
          description={render ? render(item) : title}
        />
      </List.Item>
    </a>
  );
});

const SortableList = SortableContainer(({ items, rightClassName, renderHeader, ...itemParams }) => {
  return (
    <List
      className={classnames(styles.list, styles.rightList, rightClassName)}
      itemLayout="horizontal"
      header={renderHeader()}
    >
      <div style={{ height: '380px', overflowY: 'auto' }}>
        {items.map((item, index) => (
          <SortableItem key={item.key} index={index} item={item} {...itemParams} />
        ))}
      </div>
    </List>
  );
});

class TreeItemTransfer extends Component {
  constructor(props) {
    super(props);
    const { keyName = 'id', pKeyName = 'pid', titleName = 'name', dataSource = [], selectedKeys = [], selectedTitles = [] } = props;
    const treeDatasTemp = TreeUtils.toTreeData(dataSource, { keyName, pKeyName, titleName, normalizeTitleName: 'title', normalizeKeyName: 'key' });
    let treeNodesData = [];
    if (treeDatasTemp && treeDatasTemp[0] && treeDatasTemp[0].children && treeDatasTemp[0].children.length > 0) {
      treeNodesData = treeDatasTemp[0].children;
    }
    this.state = {
      treeNodesData,
      selectedKeys,
      selectedTitles,
      searchValue: '',
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      keyName = 'id', pKeyName = 'pid', titleName = 'name',
      dataSource: nextDataSource = [], selectedKeys: nextSelectedKeys = [], selectedTitles: nextSelectedTitles,
    } = nextProps;
    const { treeNodesData: treeNodesDataInstate, selectedKeys = [] } = prevState || {};
    if (treeNodesDataInstate.length === 0 || nextSelectedKeys !== selectedKeys) {
      const treeDatasTemp = TreeUtils.toTreeData(nextDataSource, { keyName, pKeyName, titleName, normalizeTitleName: 'title', normalizeKeyName: 'key' });
      let treeNodesData = [];
      if (treeDatasTemp && treeDatasTemp[0] && treeDatasTemp[0].children && treeDatasTemp[0].children.length > 0) {
        treeNodesData = treeDatasTemp[0].children;
      }
      return {
        dataSource: nextDataSource,
        treeNodesData,
        selectedKeys: nextSelectedKeys,
        selectedTitles: nextSelectedTitles,
      };
    }
    // 默认不改动 state
    return null;
  }
  // 搜索
  onSearchChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  }
  // 选中树的checkbox
  onTreeCheck = (checkedKeys) => {
    const { selectedKeys, searchValue = '' } = this.state;
    const { keyName = 'id', titleName = 'name', dataSource = [] } = this.props;
    // 获取可能受影响的键值的key
    const curSelKeys = this.getCleanCheckedKeys(dataSource, selectedKeys, searchValue);
    const delKeys = curSelKeys.filter(key => !checkedKeys.includes(key)); // 删除的项
    const addKeys = checkedKeys.filter(key => !curSelKeys.includes(key) && this.isLeaf(key)); // 新增的项
    const currentSelectedKeys = selectedKeys.filter(key => !delKeys.includes(key));
    currentSelectedKeys.push(...addKeys);
    const currentSelectedTitles = currentSelectedKeys.map(key => (dataSource.find(item => item[keyName] === key) || {})[titleName] || '');
    this.setState({ selectedKeys: currentSelectedKeys, selectedTitles: currentSelectedTitles });
    this.triggerChange({ selectedKeys: currentSelectedKeys, selectedTitles: currentSelectedTitles });
  }
  // 处理树的选中事件
  onTreeSelect = (selectedKeys) => {
    const { onSelect } = this.props;
    const key = selectedKeys[0];
    // 如果是叶子节点,选中后触发onSelect函数
    if (key && onSelect && this.isLeaf(key)) {
      onSelect(selectedKeys);
    }
  }
  // 选中一条记录
  onRowClick = (e, key) => {
    e.preventDefault();
    const { selectedKeys, selectedTitles } = this.state;
    if (selectedKeys.includes(key)) {
      const index = selectedKeys.indexOf(key);
      selectedKeys.splice(index, 1);
      selectedTitles.splice(index, 1);
    }
    this.setState({ selectedKeys, selectedTitles });
    this.triggerChange({ selectedKeys, selectedTitles });
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { selectedKeys, selectedTitles } = this.state;
    const newSelectedKeys = arrayMove(selectedKeys, oldIndex, newIndex);
    const newSelectedTitles = arrayMove(selectedTitles, oldIndex, newIndex);
    this.setState({
      selectedKeys: newSelectedKeys,
      selectedTitles: newSelectedTitles,
    });
    this.triggerChange({ selectedKeys: newSelectedKeys, selectedTitles: newSelectedTitles });
  };
  getSelectedItems = () => {
    const { selectedKeys, selectedTitles } = this.state;
    const { keyName = 'id', titleName = 'name', dataSource = [] } = this.props;
    return selectedKeys.map((key, index) => {
      const title = selectedTitles[index];
      const element = dataSource.find(item => item[keyName] === key) || {};
      return {
        ...element,
        key: key || element[keyName],
        title: title || element[titleName],
      };
    });
  }
  // 递归获取输入搜索条件之后的树的节点数据
  getSearchNodesData = (nodes, searchValue) => {
    const nodesData = [];
    nodes.forEach((node) => {
      const { title, children } = node;
      if (children) { // 若为父节点,递归检查其子节点
        const tempData = this.getSearchNodesData(children, searchValue);
        if (tempData && tempData.length > 0) {
          nodesData.push({
            ...node,
            children: tempData,
          });
        }
      } else if (title.includes(searchValue)) { // 若为叶子节点,直接判断是否包含搜索条件的字符
        nodesData.push(node);
      }
    });
    return nodesData;
  }
  // 获取树形结构,当前选中的项(将已选的,但是当前树上没有的项给去掉)
  getCleanCheckedKeys = (dataSource, selectedKeys, searchValue) => {
    const { keyName = 'id', titleName = 'name' } = this.props;
    return selectedKeys.filter((key) => {
      const item = dataSource.find(element => element[keyName] === key);
      return item && item[titleName] && item[titleName].includes(searchValue);
    });
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
  // 判断是否是叶子节点
  isLeaf = (key) => {
    const { pKeyName = 'pid', dataSource = [] } = this.props;
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
  // 向外层的form表单暴露的triggerChange函数(antd的form控件需求)
  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }
  renderHeader = () => {
    const { selectedKeys } = this.state;
    const { sortable = false } = this.props;
    return (
      <div className={styles.listHeader}>
        <div className={classnames(styles.checkAllBox, 'clearfix')}>
          <span>
            已选{selectedKeys.length }条
          </span>
          {
            sortable && <span style={{ float: 'right', fontSize: '12px', color: '#9e9e9e' }}>提示: 按住可以拖拽排序</span>
          }
        </div>
      </div>
    );
  }
  renderItem = (item) => {
    const { key, title, disabled = false } = item;
    const { selectedKeys } = this.state;
    const { render } = this.props;
    return (
      <a className={styles.listItem} herf="#" onClick={e => this.onRowClick(e, key)}>
        <List.Item>
          <List.Item.Meta
            avatar={<Checkbox key={key} disabled={disabled} checked={selectedKeys.includes(key)} />}
            description={render ? render(item) : title}
          />
        </List.Item>
      </a>
    );
  }
  render() {
    const { treeNodesData, selectedKeys, searchValue = '' } = this.state;
    const { className, leftClassName, rightClassName, defaultExpandAll = false, sortable = false, render, dataSource } = this.props;
    const treeClass = 'm-tree';
    let treeDatas = [];
    let treeCheckedKeys = [];
    if (searchValue !== '') {
      treeDatas = this.getSearchNodesData(treeNodesData, searchValue);
      treeCheckedKeys = this.getCleanCheckedKeys(dataSource, selectedKeys, searchValue);
    } else {
      treeDatas = [...treeNodesData];
      treeCheckedKeys = [...selectedKeys];
    }
    return (
      <Row className={classnames(styles.treeItemTransfer, className)} type="flex" align="middle" gutter={2} style={{ paddingTop: '0.75rem', paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingBottom: '0.75rem', height: '100%' }}>
        <Col span={12}>
          <div className={styles.treeContent} style={{ height: '30rem' }}>
            <Input.Search style={{ display: 'block', width: '95%', height: '3rem', margin: '0.5rem auto' }} placeholder="搜索" onChange={this.onSearchChange} />
            <div style={{ height: '25.8rem', padddingBottom: '0.2rem', overflowY: 'auto' }}>
              { treeDatas.length === 0 && <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>暂无数据</div> }
              { treeDatas.length > 0 && (
                <Tree
                  showLine
                  checkable
                  checkedKeys={treeCheckedKeys}
                  onCheck={this.onTreeCheck}
                  autoExpandParent
                  defaultExpandAll={searchValue !== '' ? true : defaultExpandAll}
                  defaultExpandedKeys={treeDatas[0] ? [treeDatas[0].key] : []}
                  // selectedKeys={selectedKeys}
                  className={classnames(styles.tree, leftClassName, treeClass)}
                  // onSelect={this.handleTreeSelect}
                >
                  {
                    this.getTreeNode(treeDatas)
                  }
                </Tree>
              )}
            </div>
          </div>
        </Col>
        <Col span={12}>
          {
            sortable ? (
              <div>
                <SortableList
                  lockAxis="y"
                  helperClass={styles.helperClass}
                  rightClassName={rightClassName}
                  renderHeader={this.renderHeader}
                  items={this.getSelectedItems()}
                  onSortEnd={this.onSortEnd}
                  selectedKeys={selectedKeys}
                  render={render}
                  onRowClick={this.onRowClick}
                />
              </div>
            ) : (
              <List
                className={classnames(styles.list, styles.rightList, rightClassName)}
                itemLayout="horizontal"
                header={this.renderHeader()}
                dataSource={this.getSelectedItems()}
                renderItem={this.renderItem}
              />
            )
          }
        </Col>
      </Row>
    );
  }
}

export default TreeItemTransfer;
