/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { Row, Col, Tree, Tag, Input } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import TreeUtils from '../../../../../../../../../utils/treeUtils';


const { Search } = Input;

class RightContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operatorData: '', // 操作符
      customerMonthlyStatistics: [], // 客户月度统计树形数据
      statisticsList: [], // 客户月度统计列表

    };
  }


  componentWillMount = () => {
    const operatorData = [
      { title: '+', key: '+', value: '+', regStr: '\\+' },
      { title: '-', key: '-', value: '-', regStr: '\\-' },
      { title: '*', key: '*', value: '*', regStr: '\\*' },
      { title: '/', key: '/', value: '÷', regStr: '\\÷' },
      { title: '最大', key: ' max ', value: 'max', regStr: '\\s{1}[m][a][x]\\s{1}' },
      { title: '最小', key: ' min ', value: 'min', regStr: '\\s{1}[m][i][n]\\s{1}' },
      { title: '并且', key: ' and ', value: '且', regStr: '\\s{1}[a][n][d]\\s{1}' },
      { title: '或者', key: ' or ', value: '或', regStr: '\\s{1}[o][r]\\s{1}' },
      { title: '＞', key: '>', value: '>', regStr: '\\>' },
      { title: '≥', key: '>=', value: '>=', regStr: '\\>\\=' },
      { title: '＜', key: '<', value: '<', regStr: '\\<' },
      { title: '≤', key: '=<', value: '=<', regStr: '\\=\\<' },
      { title: '等于', key: '=', value: '=', regStr: '\\=' },
      { title: '不等于', key: '!=', value: '!=', regStr: '\\!\\=' },
      { title: '当', key: ' when ', value: '当', regStr: '\\s{1}[w][h][e][n]\\s{1}' },
      { title: '类似', key: ' like ', value: '类似', regStr: '\\s{1}[l][i][k][e]\\s{1}' },
    ];


    this.setState({
      operatorData,

    });
  }

  componentDidMount() {
    this.fetchMonthlyStatistics();
  }

  componentWillReceiveProps() {

  }

  // 递归获取对应节点的所有父节点
  forFn = (temp, arr, pid) => {
    for (const item of arr) {
      if (item.yybid === pid) {
        temp.push(item);
        this.forFn(temp, arr, item.fid);
      }
    }
  };

  // 关键字搜索
  handleOnkeyWord = (e) => {
    const keyWord = e.target.value;

    // 筛选数据
    const { statisticsList } = this.state;
    const newList = statisticsList.filter((item) => {
      if (item.yybmc.indexOf(keyWord) !== -1) {
        return true;
      }
      return false;
    });

    let newListParent = [];
    // 获取所有节点的父节点
    newList.forEach((item) => {
      // 不是根节点
      if (item.grade !== '0') {
        const temp = [];
        // 递归获取节点的所有父节点
        this.forFn(temp, this.state.statisticsList, item.fid);
        newListParent = newListParent.concat(temp);
      }
    });

    // 合并数组
    const tempNewData = [...newListParent, ...newList];

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
      customerMonthlyStatistics: newTreeData.datas,
    });
  }

  // 点击操作符
  handleOnClick = (item) => {
    this.props.getOperatorData(item);
  }

  // 获取操作符
  fetchOperatorData = () => {
    const operatorData = [
      { title: '+', key: '+', value: '+', regStr: '\\+' },
      { title: '-', key: '-', value: '-', regStr: '\\-' },
      { title: '*', key: '*', value: '*', regStr: '\\*' },
      { title: '/', key: '/', value: '÷', regStr: '\\÷' },
      { title: '最大', key: ' max ', value: 'max', regStr: '\\s{1}[m][a][x]\\s{1}' },
      { title: '最小', key: ' min ', value: 'min', regStr: '\\s{1}[m][i][n]\\s{1}' },
      { title: '并且', key: ' and ', value: '且', regStr: '\\s{1}[a][n][d]\\s{1}' },
      { title: '或者', key: ' or ', value: '或', regStr: '\\s{1}[o][r]\\s{1}' },
      { title: '＞', key: '>', value: '>', regStr: '\\>' },
      { title: '≥', key: '>=', value: '>=', regStr: '\\>\\=' },
      { title: '＜', key: '<', value: '<', regStr: '\\<' },
      { title: '≤', key: '=<', value: '=<', regStr: '\\=\\<' },
      { title: '等于', key: '=', value: '=', regStr: '\\=' },
      { title: '不等于', key: '!=', value: '!=', regStr: '\\!\\=' },
      { title: '当', key: ' when ', value: '当', regStr: '\\s{1}[w][h][e][n]\\s{1}' },
      { title: '类似', key: ' like ', value: '类似', regStr: '\\s{1}[l][i][k][e]\\s{1}' },
    ];


    return operatorData;
  }

  // 获取月度统计
  fetchMonthlyStatistics = () => {
    const monthlyStatistics = {};
    const data = [
      { yybid: '1', fid: '0', grade: '0', type: '1', orgtype: '0', ogrcode: '1', fdncode: '0', yybmc: 'XX证券', yybfl: '', note: '' },
      { yybid: '2', fid: '1', grade: '1', type: '0', orgtype: '1', ogrcode: '2', fdncode: '0.1', yybmc: 'XX分公司', yybfl: '', note: '' },
      { yybid: '3', fid: '1', grade: '1', type: '0', orgtype: '1', ogrcode: '3', fdncode: '0.1', yybmc: 'xx公司总部', yybfl: '', note: '' },
      { yybid: '9', fid: '2', grade: '2', type: '0', orgtype: '1', ogrcode: '9', fdncode: '0.1', yybmc: 'XX-111分公司', yybfl: '', note: '' },
      { yybid: '100', fid: '0', grade: '0', type: '1', orgtype: '0', ogrcode: '1', fdncode: '0', yybmc: 'yy证券', yybfl: '', note: '' },
      { yybid: '102', fid: '100', grade: '1', type: '0', orgtype: '1', ogrcode: '2', fdncode: '0.1', yybmc: 'yy分公司', yybfl: '', note: '' },
      { yybid: '109', fid: '102', grade: '2', type: '0', orgtype: '1', ogrcode: '109', fdncode: '0.1', yybmc: 'YY-111分公司', yybfl: '', note: '' },
      { yybid: '1000', fid: '0', grade: '0', type: '1', orgtype: '0', ogrcode: '1', fdncode: '0', yybmc: 'zz证券', yybfl: '', note: '' },


    ];

    const datas = TreeUtils.toTreeData(data, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'key' }, true);
    monthlyStatistics.datas = [];
    datas.forEach((item) => {
      const { children } = item;
      monthlyStatistics.datas.push(...children);
    });
    monthlyStatistics.dataLoaded = true;
    this.setState({ customerMonthlyStatistics: monthlyStatistics.datas, statisticsList: data });
  }


  // 选中树形数据，构造参数结构
  onSelect = (selectedKeys) => {
    const select = this.state.statisticsList.filter((item) => {
      if (item.grade !== '0') {
        return item.yybid === selectedKeys[0];
      }
      return false;
    });

    if (select && select.length > 0) {
      const obj = {};
      obj.value = select[0].yybmc;
      obj.title = select[0].yybmc;
      obj.key = select[0].yybid;
      this.props.getOperatorData(obj);
    }
  }


  render() {
    const { operatorData = [], customerMonthlyStatistics = [] } = this.state;
    return (
      <Fragment>
        <Scrollbars
          autoHide
          style={{ width: '100%', height: '42rem' }}
        >
          <div className="m-hsts-box">
            <Row >
              {operatorData.map((item) => {
                return (

                  <Col xs={6} sm={6} lg={6} xl={6} style={{ padding: '0.3rem 0' }}>
                    <Tag className="m-tag m-header" style={{ padding: '0', width: '80%', height: '30px', textAlign: 'center' }} key={item.key} onClick={() => this.handleOnClick(item)} >{item.title}</Tag>
                  </Col>
                );
              })}
            </Row>
            <Row style={{ padding: '1rem 0' }}>
              <Search style={{ marginBottom: 8 }} placeholder="请输入关键字检索" onChange={e => this.handleOnkeyWord(e)} />
              <Tree
                onSelect={this.onSelect}
                treeData={customerMonthlyStatistics}
              />
            </Row>
          </div>

        </Scrollbars>

      </Fragment>
    );
  }
}

export default RightContent;
