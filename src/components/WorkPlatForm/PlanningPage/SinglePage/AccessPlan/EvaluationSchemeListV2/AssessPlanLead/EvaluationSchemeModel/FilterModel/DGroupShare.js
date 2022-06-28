import React from 'react';
import { Row, Col, Tree, message, Transfer, Table, Input } from 'antd';
import lodash from 'lodash';
import difference from 'lodash/difference';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import TreeUtils from '../../../../../../../../../utils/treeUtils';
import { fetchUserAuthorityDepartment } from '../../../../../../../../../services/commonbase/userAuthorityDepartment';
import { FetchQueryUserList } from '../../../../../../../../../services/planning/planning';

const { TreeNode } = Tree;
const { Search } = Input;

/**
 * TableTransfer 把表格封装进穿梭框 实现分页
 */
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} showSearch showSelectAll={false}>
    {({
          direction,
          filteredItems,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns;

          const rowSelection = {
            getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
            onSelectAll(selected, selectedRows) {
              const treeSelectedKeys = selectedRows
                .filter(item => !item.disabled)
                .map(({ key }) => key);
              const diffKeys = selected
                ? difference(treeSelectedKeys, listSelectedKeys)
                : difference(listSelectedKeys, treeSelectedKeys);
              onItemSelectAll(diffKeys, selected);
            },
            onSelect({ key }, selected) {
              onItemSelect(key, selected);
            },
            selectedRowKeys: listSelectedKeys,
          };

          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              style={{ pointerEvents: listDisabled ? 'none' : null }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) return;
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
            />
          );
        }}
  </Transfer>
);

const dataList = [];

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.value === key)) {
        parentKey = node.value;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

class DGroupShare extends React.Component {
  state = {
    shareType: lodash.get(this.shareTypes, '[0].value', 2),
    gxyyb: {
      isloading: true,
      dataLoaded: false,
      searchValue: '',
      datas: [],
    },
    dataSource: [], // 人员/营业部列表
    allStaffDataSource: [], // 所有营业部人员
    targetTranKeys: this.props.selectedKeys || [], // 已勾选人员
    yybCheckedKeys: [], // 选中的营业部
    firstYybid: '', // 默认的营业部
    expandedKeys: [],
    autoExpandParent: true,
    searchValue: '', // 搜索框值
  }

  componentDidMount() {
    this.fetchGxyybList();
  }

  shareTypes = [{ value: 2, label: '营业部' }]; // 9-6/去掉人员类

  onShareChange = (e) => {
    this.setState({
      shareType: e.target.value,
      targetTranKeys: [], // 清空选项
      dataSource: [], // 清空数据源
      allStaffDataSource: [],
    });
    const { /* dictionary: { CIS_GXLX = [] }, */onChangeGXLX } = this.props;
    if (onChangeGXLX) {
      //console.log("-----e.target---",e.target);
      onChangeGXLX(e.target.value);
    }
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => { // eslint-disable-line
    const { handleRemeberSelected } = this.props;
    if (handleRemeberSelected) {
      handleRemeberSelected(nextTargetKeys, this.getNameByKey(nextTargetKeys));
    }
    this.setState({ targetTranKeys: nextTargetKeys });
  };

  // 通过id查询人员姓名
  getNameByKey = (keys = []) => {
    const titles = [];
    const { allStaffDataSource = [] } = this.state;
    keys.forEach((id) => {
      const temp = allStaffDataSource.filter(item => item.key === id);
      if (temp.length > 0) {
        titles.push(lodash.get(temp, '[0].userName'));
      }
    });
    return titles;
  }

  //查询人员列表数据
  fetchMember = async (shareType = 2, gxlx = '', branchId = '') => { // shareType:共享类型 1:人员|2:营业部 gxlx:关系类型
    const commonParam = { paging: 0, current: 1, pageSize: 10, total: -1, sort: '' };
    const params = shareType === 1 ? {
      ...commonParam,
      // gxlx,
      orgId:1,
      type:0
    } : {
      ...commonParam,
      orgId: branchId,
      type:0,
    };
    await FetchQueryUserList({ ...params }).then((ret) => {
      const { code = 0, note = '', records = [] } = ret;
      if (code > 0) {
        const result = records.map((item) => {
          return {
            ...item,
            key: item.userId,
            label: item.userName,
          };
        });

        this.setState({
          dataSource: result,
        });
      } else {
        message.error(note);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取管辖营业部的数据
  fetchGxyybList = async (gxyyb = this.state.gxyyb) => {
    const gxyybCurrent = gxyyb;
    await fetchUserAuthorityDepartment({ paging: 0, current: 1, pageSize: 10, total: -1, sort: '' }).then((result) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
        gxyybCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          gxyybCurrent.datas.push(...children);
        });
        gxyybCurrent.dataLoaded = true;
        this.getDefaultSelectedKey(datas);
        this.setState({ gxyyb: gxyybCurrent, firstYybid: records[0].yybid });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });

    const commonParam = { paging: 0, current: 1, pageSize: 10, total: -1, sort: '' };
    await FetchQueryUserList({
      ...commonParam,
      // yyb: '',
      orgId:1,
      type:0
    }).then((ret) => {
      const { code = 0, note = '', records = [] } = ret;
      if (code > 0) {
        const result = records.map((item) => {
          return {
            ...item,
            key: item.userId,
            label: item.userName,
          };
        });
        this.setState({
          dataSource: result,
          allStaffDataSource: result,
        });
      } else {
        message.error(note);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  getDefaultSelectedKey = (datas) => {
    if (datas[0].children && datas[0].children.length) {
      this.getDefaultSelectedKey(lodash.get(datas, '[0].children', []));
    }
  }

  filterOption = (inputValue, option) => option.userName.indexOf(inputValue) > -1;

  /**
   * 关系选中变化
   */
  onCheck = (relationCheckedKeys) => {
    this.onSelectMember(relationCheckedKeys);
  };

  onSelectMember = (relationCheckedKeys) => { // eslint-disable-line
    const { firstYybid } = this.state;
    const gxlx = Array.isArray(relationCheckedKeys) ? relationCheckedKeys.join(',') : '';
    this.fetchMember(this.state.shareType, gxlx, firstYybid);
  }

  /**
   * 营业部选中变化
   */
  onyybCheck = (yybCheckedKeys) => {
    //console.log("---onyybCheck--yybCheckedKeys-----",yybCheckedKeys);
    this.setState({ yybCheckedKeys });
    this.onSelectBranch(yybCheckedKeys);
  };

  onSelectBranch = (yybCheckedKeys) => { // eslint-disable-line
    //console.log("---onSelectBranch--yybCheckedKeys-----",yybCheckedKeys);
    const { firstYybid } = this.state;
    const branchId = Array.isArray(yybCheckedKeys) ? yybCheckedKeys.join(',') : firstYybid;
    this.fetchMember(this.state.shareType, '', branchId);
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e) => {
    const { gxyyb: { datas } } = this.state;
    const { value } = e.target;
    const expandedKeys = dataList.map((item) => {
      if (item.label.indexOf(value) > -1) {
        return getParentKey(item.value, datas);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      searchValue: value,
      expandedKeys,
      autoExpandParent: true,
    });
  };

  // 递归获取输入搜索条件之后的树的节点数据
  getSearchNodesData = (nodes, searchValue) => {
    const nodesData = [];
    nodes.forEach((node) => {
      const { label, children } = node;
      if (children) { // 若为父节点,递归检查其子节点
        const tempData = this.getSearchNodesData(children, searchValue);
        if (tempData && tempData.length > 0) {
          nodesData.push({
            ...node,
            children: tempData,
          });
        }
      } else if (label.includes(searchValue)) { // 若为叶子节点,直接判断是否包含搜索条件的字符
        nodesData.push(node);
      }
    });
    return nodesData;
  }

  // 递归获取所有的节点的JSX结构
  getTreeNode = (nodes) => {
    return nodes.map((node) => {
      const { value, label, children } = node;
      // 叶子节点
      if (!children) {
        return <TreeNode key={value} title={label} />;
      }
      // 非叶子节点
      return (
        <TreeNode key={value} title={label}>
          {
            this.getTreeNode(children)
          }
        </TreeNode>
      );
    });
  }

  render() {
    const tableColumns = [
      {
        dataIndex: 'userName',
        title: '人员姓名',
      },
    ];
    const { gxyyb,dataSource,searchValue,targetTranKeys,yybCheckedKeys, autoExpandParent} = this.state;
    //console.log("-----gxyyb.datas[0]-----",gxyyb);
    //console.log("----- this.state-----",this.state);
    const treeClass = 'm-tree';
    let treeDatas = [];
    let treeCheckedKeys = [];
    if (searchValue !== '') {
      treeDatas = this.getSearchNodesData(gxyyb.datas, searchValue);
    } else {
      treeDatas = [...gxyyb.datas];
    }

    return (
      <React.Fragment>
        <Row className="m-row-form" style={{ minHeight: '31rem', marginTop: '1rem' }}>
          <Col sm={7} md={7} xxl={7}>
            <Scrollbars autoHide style={{ width: '100%', height: '48rem' }} >
              <Search style={{ marginBottom: 8 }} placeholder="搜索营业部" onChange={this.onChange} />
              { treeDatas.length > 0 && (
              <Tree
                checkedKeys={yybCheckedKeys}
                onCheck={this.onyybCheck}
                onSelect={(selectedTeeKeys, e) => { this.onSelectBranch(selectedTeeKeys, e); }}
                // expandAction="click"
                // onExpand={this.onExpand}
                defaultExpandAll={searchValue !== ''}
                defaultExpandedKeys={treeDatas[0] ? [treeDatas[0].key] : []}
                // expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
              >
                {
                  this.getTreeNode(treeDatas)
                }
              </Tree>
          )}
            </Scrollbars>
          </Col>
          <Col sm={17} md={17} xxl={17}>
            {
              <TableTransfer
                dataSource={dataSource}
                listStyle={{
                height: '50rem',
                }}
                showSearch
                filterOption={this.filterOption}
                targetKeys={targetTranKeys}
                onChange={this.handleChange}
                leftColumns={tableColumns}
                rightColumns={tableColumns}
              />
              // )
              }
          </Col>

        </Row>
      </React.Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(DGroupShare);
