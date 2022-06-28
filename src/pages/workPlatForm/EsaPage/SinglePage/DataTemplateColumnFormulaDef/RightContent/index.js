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
    };
  }


  componentWillMount = () => {
    const { indicators = [] } = this.props;
    const paramsArr = indicators;
    this.setState({
      paramsArr,
    });
  }

  componentDidMount() {
    // this.fetchMonthlyStatistics();

  }

  componentWillReceiveProps(nextprops) {
    const { indicators = [] } = nextprops;
      const paramsArr = indicators;
      this.setState({
        paramsArr,
      });
  }


  // // 关键字搜索
  handleOnkeyWord = (e) => {
    const keyWord = e.target.value;
    const indicators = this.props.indicators;
    if (indicators) {
      const paramsArr = indicators;
      const temp = paramsArr.filter((item) => {
        return item.fileColName.indexOf(keyWord) !== -1;
      });
      this.setState({
        paramsArr: temp,
      });
    }
  }

  // 点击指标
  handleOnClick = (item) => {
    this.props.getOperatorData(item);
  }


  //  选中树形数据
  onSelect = (selectedKeys, e) => {
    this.props.getOperatorData(e.node.props.value);
  }


  render() {
    const { paramsArr=[] } = this.state;
    return (
      <Fragment>
        <Scrollbars
          autoHide
          style={{ width: '100%', height: '42rem' }}
        >
          <div className="m-hsts-box">
            <Row style={{ padding: '1rem 0' }}>
              <Search style={{ marginBottom: 8 }} placeholder="请输入关键字检索" onChange={e => this.handleOnkeyWord(e)} />
              <Tree
                className="m-tree-info"
                onSelect={this.onSelect}
              >
                {paramsArr.map(item => (
                  item.tmplDtlId != this.props.tmplDtlId ?
                    <TreeNode title={item.fileColName} key={item.tmplDtlId} value={`\${${item.fileColName}}`} /> : null
                ))}
              </Tree>
            </Row>
          </div>

        </Scrollbars>

      </Fragment>
    );
  }
}

export default RightContent;
