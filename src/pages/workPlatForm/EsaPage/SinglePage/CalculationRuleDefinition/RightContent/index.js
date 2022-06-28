/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { Row, Col, Tree, Tag, Input } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
// import TreeUtils from '../../../../../../../src/utils/treeUtils';


const { Search } = Input;
const { TreeNode } = Tree;
class RightContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paramsArr: [], // 指标参数数组
      operatorData: [], // 操作符

    };
  }


  // 操作符
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
    // this.fetchMonthlyStatistics();
  }

  componentWillReceiveProps(nextprops) {
    const { indiParam = [] } = nextprops.ruleData;
    if (indiParam.length !== 0) {
      const paramsArr = JSON.parse(indiParam);
      this.setState({
        paramsArr,
      });
    }
  }


  // // 关键字搜索
  handleOnkeyWord = (e) => {
    const keyWord = e.target.value;

    const { indiParam = '' } = this.props.ruleData;
    if (indiParam) {
      const paramsArr = JSON.parse(indiParam);
      const temp = paramsArr.filter((item) => {
        return item.paramName.indexOf(keyWord) !== -1;
      });
      this.setState({
        paramsArr: temp,

      });
    }
  }

  // 点击操作符
  handleOnClick = (item) => {
    this.props.getOperatorData(item);
  }


  //  选中树形数据
  onSelect = (selectedKeys, e) => {
    if (selectedKeys.length > 0 && selectedKeys[0] !== 'indiParam') {
      const obj = {};
      obj.value = e.selectedNodes[0].props.value;
      obj.title = e.selectedNodes[0].props.title;
      obj.key = selectedKeys;
      this.props.getOperatorData(obj);
    }
  }


  render() {
    const { operatorData = [], paramsArr = [] } = this.state;

    // const { indiParam = '' } = this.props.ruleData;
    // let paramsArr = [];
    // if (indiParam.length !== 0) {
    //   paramsArr = JSON.parse(indiParam);
    // }


    return (
      <Fragment>
        <Scrollbars
          autoHide
          style={{ width: '100%', height: '42rem' }}
        >
          <div className="m-hsts-box">
            <Row >
              {operatorData.map((item, index) => {
                return (
                  <Col xs={6} sm={6} lg={6} xl={6} style={{ padding: '0.3rem 0' }} key={index}>
                    <Tag className="m-tag m-header" style={{ padding: '0', width: '80%', height: '30px', textAlign: 'center' }} key={item.key} onClick={() => this.handleOnClick(item)} >{item.title}</Tag>
                  </Col>
                );
              })}
            </Row>
            <Row style={{ padding: '1rem 0' }}>
              <Search style={{ marginBottom: 8 }} placeholder="请输入关键字检索" onChange={e => this.handleOnkeyWord(e)} />
              {/* <Tree
                onSelect={this.onSelect}
                treeData={customerMonthlyStatistics}
              /> */}


              <Tree
                showLine
                className="m-tree-info"
                onSelect={this.onSelect}

              >

                <TreeNode title="指标参数" key="indiParam" >
                  {paramsArr.map(item => (
                    <TreeNode title={item.paramName} key={item.corrSeq} value={`\${${item.paramName}}`} />
                  ))}
                  {/* {
                      paramsArr.length > 0 && <TreeNode title="折算系数" key="1" value={'${' + '折算系数' + '}'} />
                    } */}
                </TreeNode>

              </Tree>
            </Row>
          </div>

        </Scrollbars>

      </Fragment>
    );
  }
}

export default RightContent;
