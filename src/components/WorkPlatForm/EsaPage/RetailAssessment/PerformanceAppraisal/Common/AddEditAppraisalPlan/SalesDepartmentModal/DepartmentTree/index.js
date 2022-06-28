import React, { Component, Fragment } from 'react';
import { Tree, Input } from 'antd';
import TreeUtils from '../../../../../../../../../utils/treeUtils';

class DepartmentTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
    };
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onChange = (e) => {
    const { deptList = [] } = this.props;
    const { value } = e.target;
    const expandedKeys = deptList.map((item) => {
      if (item.yybmc.indexOf(value) > -1) {
        return item.fid;
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };
  getTreeData=(data) => {
    let treedata = TreeUtils.toTreeData(data, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'key' }, true);
    if (treedata.length > 0) {
      const { children = [] } = treedata[0];
      if (children.length > 0) {
        treedata = treedata[0].children;
      }
    }
    return treedata;
  }
  handleSelect=(selectedKeys, e) => {
    const { handleSelect } = this.props;
    if (typeof handleSelect === 'function') {
      handleSelect(selectedKeys, e);
    }
  }

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const { selectedKeys = [], deptList = [] } = this.props;
    const newExpandedKeys = [...expandedKeys, ...selectedKeys];
    const filterTreeData = data =>
      data.map((item) => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ background: '#f50', color: '#fff' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) { return { title, key: item.key, children: filterTreeData(item.children) }; }
        return { title, key: item.key };
      });
    return (
      <Fragment>
        <Input.Search style={{ marginBottom: 8 }} placeholder="输入关键字进行过滤" onChange={this.onChange} suffix={null} />
        <Tree
          className="m-tree"
          onExpand={this.onExpand}
          expandedKeys={!searchValue ? newExpandedKeys : expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={filterTreeData(this.getTreeData(deptList))}
          onSelect={this.handleSelect}
          defaultSelectedKeys={selectedKeys}
        />
      </Fragment>
    );
  }
}

export default DepartmentTree;
