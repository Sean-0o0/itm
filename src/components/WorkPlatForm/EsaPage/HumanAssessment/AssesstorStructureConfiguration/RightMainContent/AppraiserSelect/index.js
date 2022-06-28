/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import React from 'react';
import { Transfer, Tree } from 'antd';
import TreeUtils from '../../../../../../../utils/treeUtils';

const { TreeNode } = Tree;
/**
 * 右侧配置主要内容
 */

class AppraiserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [],
      kpryNameTreeData: [],
      kpryNameList: [],
      expandedKeys: [],
      leftExpandedKeys: [],
      autoExpandParent: true,
      targetKeysList: [],
      leftTreeData: [],
      rightTreeData: [],
      checkedKeysAlready: [],
    };
  }
  componentDidMount() {
    this.fetchKpryName();
  }

  // 获取公司部门名称
  fetchKpryName = () => {
    const kpryName = {};
    const data = [
      { yybid: '1', fid: '0', grade: '0', yybmc: '董事长', yyqz: '5' },
      { yybid: '101', fid: '1', grade: '1', yybmc: '杨某某' },
      { yybid: '102', fid: '1', grade: '1', yybmc: '刘某某' },
      { yybid: '2', fid: '0', grade: '0', yybmc: '分管领导', yyqz: '2' },
      { yybid: '201', fid: '2', grade: '1', yybmc: '张某某' },
    ];
    const datas = TreeUtils.toTreeData(data, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'key' }, true);
    kpryName.datas = [];
    datas.forEach((item) => {
      const { children } = item;
      kpryName.datas.push(...children);
    });
    kpryName.dataLoaded = true;

    const expandedKeys = [];
    data.forEach((item) => {
      expandedKeys.push(item.yybid);
    });

    const checkedKeysAlready = [];
    const { checkData } = this.props;
    checkData.forEach((checkItem) => {
      const kprData = checkItem.kpr.split(',');
      kprData.forEach((kprItem) => {
        data.forEach((item) => {
          if (kprItem === item.yybmc) {
            checkedKeysAlready.push(item.yybid);
          }
        });
      });
    });
    if (checkData.length !== 0) {
      this.onChange(checkedKeysAlready, data);
    }
    this.setState({
      kpryNameTreeData: kpryName.datas,
      kpryNameList: data,
      leftTreeData: kpryName.datas,
      expandedKeys,
      targetKeys: checkedKeysAlready,
    });
  }
  // 关键字搜索
  handleOnkeyWord = (direction, value) => {
    const keyWord = value;

    // 筛选数据
    const { kpryNameList } = this.state;
    const newTreeList = kpryNameList.filter((item) => {
      if (item.yybmc.indexOf(keyWord) !== -1) {
        return true;
      }
      return false;
    });

    const newTreeParent = [];
    const expandedKeys = [];
    // 获取所有子节点的父节点
    newTreeList.forEach((item) => {
      expandedKeys.push(item.yybid);
      // 不是根节点
      newTreeParent.push(item);
      for (let i = item.grade; i > 0; i--) {
        const newParent = this.getByChildId(newTreeParent[newTreeParent.length - 1].fid);
        newTreeParent.push(newParent[0]);
        expandedKeys.push(newParent[0].yybid);
      }
    });

    // 合并数组
    const tempNewData = [...newTreeParent, ...newTreeList];

    // 数组去重
    let newData = new Set(tempNewData);
    newData = [...newData];

    // 构造树形数据
    const newTreeData = [];
    const datas = TreeUtils.toTreeData(newData, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'key' }, true);
    newTreeData.datas = [];
    datas.forEach((item) => {
      const { children } = item;
      newTreeData.datas.push(...children);
    });
    newTreeData.dataLoaded = true;

    this.setState({
      leftTreeData: newTreeData.datas,
      expandedKeys,
      autoExpandParent: true,
    });
  }

  // 根据子节点找到父节点
  getByChildId(childId, List) {
    return List.filter((item) => {
      return item.yybid === childId;
    });
  }
  // 根据父节点找到子节点
  getByFatherdId(fatherId) {
    return this.state.kpryNameList.filter((item) => {
      return item.fid === fatherId;
    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onChange = (targetKeys, value) => {
    // 构造树形数据
    // if (direction === 'right') {
    const newTreeList = [];
    let kpryNameList = [];
    targetKeys.forEach((key) => {
      if (value === 'right' || value === 'left') {
        kpryNameList = this.state.kpryNameList;
      } else {
        kpryNameList = value;
      }
      kpryNameList.forEach((item) => {
        if (item.yybid.indexOf(key) !== -1) {
          newTreeList.push(item);
        }
      });
    });
    const newTreeParent = [];
    const expandedKeys = [];
    // 获取所有子节点的父节点
    newTreeList.forEach((item) => {
      expandedKeys.push(item.yybid);
      // 不是根节点
      newTreeParent.push(item);
      for (let i = item.grade; i > 0; i--) {
        const newParent = this.getByChildId(newTreeParent[newTreeParent.length - 1].fid, kpryNameList);
        newTreeParent.push(newParent[0]);
        expandedKeys.push(newParent[0].yybid);
      }
    });

    // 合并数组
    const tempNewData = [...newTreeParent, ...newTreeList];

    // 数组去重
    let newData = new Set(tempNewData);
    newData = [...newData];
    const newTreeData = [];
    const datas = TreeUtils.toTreeData(newData, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'key' }, true);
    newTreeData.datas = [];
    datas.forEach((item) => {
      const { children } = item;
      newTreeData.datas.push(...children);
    });
    newTreeData.dataLoaded = true;
    this.setState({
      rightTreeData: newTreeData.datas,
      rightTreeList: newTreeList,
      targetKeys,
      leftExpandedKeys: expandedKeys,
    });
    const { kprySelect } = this.props;
    if (kprySelect) {
      kprySelect(newData);
    }
  };

  isChecked = (selectedKeys, eventKey) => {
    return selectedKeys.indexOf(eventKey) !== -1;
  };

  generateTree = (treeNodes = [], checkedKeys = []) => {
    return treeNodes.map(({ children, ...props }) => (
      <TreeNode {...props} disabled={checkedKeys.includes(props.key)} key={props.key}>
        {this.generateTree(children, checkedKeys)}
      </TreeNode>
    ));
  };
  render() {
    const { targetKeys, leftTreeData, rightTreeData, expandedKeys, leftExpandedKeys } = this.state;
    const transferDataSource = [];
    function flatten(list = []) {
      list.forEach((item) => {
        transferDataSource.push(item);
        flatten(item.children);
      });
    }
    flatten(leftTreeData);
    return (
      <Transfer
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        listStyle={{
          width: 250,
          height: 300,
        }}
        render={item => item.title}
        titles={['待选择记录', '已选择记录']}
        onChange={this.onChange}
        showSearch
        onSearch={this.handleOnkeyWord}
      >
        {({ direction, onItemSelect, selectedKeys }) => {
            if (direction === 'left') {
              const checkedKeys = [...selectedKeys, ...targetKeys];
              return (
                <Tree
                  blockNode
                  checkable
                  checkStrictly
                  expandedKeys={expandedKeys}
                  checkedKeys={checkedKeys}
                  onExpand={this.onExpand}
                  onCheck={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                this.setState({ targetKeysList: _ });
                onItemSelect(eventKey, !this.isChecked(checkedKeys, eventKey));
              }}
                  onSelect={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                this.setState({ targetKeysList: _ });
                onItemSelect(eventKey, !this.isChecked(checkedKeys, eventKey));
              }}
                >
                  {this.generateTree(leftTreeData, targetKeys)}
                </Tree>
              );
            } else if (direction === 'right') {
              const checkedKeysRight = [...selectedKeys];
              return (
                <Tree
                  blockNode
                  checkable
                  checkStrictly
                  checkedKeys={checkedKeysRight}
                  treeData={rightTreeData}
                  expandedKeys={leftExpandedKeys}
                  onExpand={this.onExpand}
                  onCheck={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !this.isChecked(checkedKeysRight, eventKey));
              }}
                  onSelect={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !this.isChecked(checkedKeysRight, eventKey));
              }}
                />
                //   {this.generateTree(rightTreeData, targetKeys)}
                // </Tree>
              );
            }
          }}
      </Transfer>
    );
  }
}

export default AppraiserSelect;
