/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { Row, Col, Input, Tree } from 'antd';
import TreeUtils from '../../../../../../utils/treeUtils';


/**
 * 左侧查询搜索组件
 */

class LeftSearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyNameTreeData: [],
      companyNameList: [],
      expandedKeys: [],
      autoExpandParent: true,
    };
  }

  componentDidMount() {
    this.fetchCompanyName();
  }

  // 获取公司部门名称
  fetchCompanyName = () => {
    const companyName = {};
    const data = [
      { yybid: '1', fid: '0', grade: '0', yybmc: '银河证券' },
      { yybid: '101', fid: '1', grade: '1', yybmc: '海南分公司辖区' },
      { yybid: '1011', fid: '101', grade: '2', yybmc: '三亚' },
      { yybid: '1012', fid: '101', grade: '2', yybmc: '海口' },
      { yybid: '102', fid: '1', grade: '1', yybmc: '福建分公司辖区' },
      { yybid: '1021', fid: '102', grade: '2', yybmc: '福州分公司辖区' },
      { yybid: '10211', fid: '1021', grade: '3', yybmc: '鼓楼营业部' },
      { yybid: '10212', fid: '1021', grade: '3', yybmc: '金山营业部' },
      { yybid: '1022', fid: '102', grade: '2', yybmc: '泉州分公司辖区' },
      { yybid: '1023', fid: '102', grade: '2', yybmc: '三明分公司辖区' },
      { yybid: '103', fid: '1', grade: '1', yybmc: '信息部' },
    ];

    const datas = TreeUtils.toTreeData(data, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'key' }, true);
    companyName.datas = [];
    datas.forEach((item) => {
      const { children } = item;
      companyName.datas.push(...children);
    });
    companyName.dataLoaded = true;
    this.setState({ companyNameTreeData: companyName.datas, companyNameList: data });
  }

  // 关键字搜索
  handleOnkeyWord = (e) => {
    const keyWord = e.target.value;

    // 筛选数据
    const { companyNameList } = this.state;
    const newTreeList = companyNameList.filter((item) => {
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
      companyNameTreeData: newTreeData.datas,
      expandedKeys,
      autoExpandParent: true,
    });
  }

  // 根据子节点找到父节点
  getByChildId(childId) {
    return this.state.companyNameList.filter((item) => {
      return item.yybid === childId;
    });
  }
  // 选中树形数据，构造参数结构
  onSelect = (selectedKeys) => {
    const select = this.state.companyNameList.filter((item) => {
      return item.yybid === selectedKeys[0];
    });

    if (select && select.length > 0) {
      this.props.setCompany(select[0]);
    }
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  render() {
    const { companyNameTreeData, autoExpandParent, expandedKeys } = this.state;
    return (
      <Fragment >
        <Row>
          <Col xs={24} sm={24} lg={24} xl={24}>
            {/* 搜索框 */}
            <Input style={{ marginBottom: 8 }} placeholder="公司查询" onChange={e => this.handleOnkeyWord(e)} />
            <Tree
              onSelect={this.onSelect}
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={companyNameTreeData}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default LeftSearchComponent;
