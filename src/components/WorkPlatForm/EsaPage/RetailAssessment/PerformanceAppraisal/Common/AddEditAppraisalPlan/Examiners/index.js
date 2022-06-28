import React, { Component, Fragment } from 'react';
import { Row, Form, Col, Tree } from 'antd';
import { FetchqueryListEmpClassLevel } from '../../../../../../../../services/EsaServices/performanceAssessment';
/**
 * 考核人员
 */
class Examiners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
    };
  }
  componentDidMount() {
    this.fetchqueryListEmpClassLevel();
    const { planDetail: { empClassLevel }, handleExaminersCheck, type } = this.props;
    if (type === '2' && empClassLevel) {
      const checkKeyList = empClassLevel.split(',').map(item => (
        {
          RYLB: Number(item.split('|')[0]),
          RYJBID: Number(item.split('|')[1]),
        }
      ));
      if (typeof handleExaminersCheck === 'function') {
        handleExaminersCheck(checkKeyList);
      }
    }
  }
  getDefaultKeys = (empClassLevel = '') => {
    const { type } = this.props;
    if (type === '1' || !empClassLevel) {
      return [];
    }
    return empClassLevel.split(',').map(item => (item.split('|')[1]));
  }
  fetchqueryListEmpClassLevel = () => {
    FetchqueryListEmpClassLevel().then(() => {
    }).catch((e) => {
      if (e.success) {
        this.structData(e.records);
      }
    });
  }
  structData = (records = []) => {
    const { vexamClass } = this.props;
    if (vexamClass) {
      records = records.filter(item => (
        vexamClass.split(';').some(item1 =>
          item.classNo === item1
        )
      ))
    }
    const dataList = [];
    for (let i = 0; i < records.length; i++) {
      const tempIndex = dataList.findIndex(item => item.classNo === records[i].classNo);
      const obj = records[i];
      if (tempIndex < 0) {
        dataList.push({ key: `0-${obj.classNo}`, title: obj.className, children: [{ key: obj.levelNo, title: obj.levelName, ...obj }], ...obj });
      } else {
        dataList[tempIndex].children.push({ key: obj.levelNo, title: obj.levelName, ...obj });
      }
    }
    this.setState({ treeData: dataList });
  }
  handleSubmit = () => {

  }
  handleCheck = (checkedKeys, { checkedNodes = [] }) => {
    const checkKeyList = [...checkedNodes]
      .filter(item => !item.key.startsWith('0-'))
      .map(({ props }) => ({ RYLB: Number(props.classNo), RYJBID: Number(props.levelNo) }));
    const { handleExaminersCheck } = this.props;
    if (typeof handleExaminersCheck === 'function') {
      handleExaminersCheck(checkKeyList);
    }
  }
  render() {
    const { treeData = [] } = this.state;
    const { planDetail: { empClassLevel } } = this.props;
    // //console.log('treeData', treeData);
    return (
      <Fragment>
        <Form className="m-form">
          <Row>
            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
              <Form.Item label={<span className="fwb">考核人员</span>} required colon={false} />
            </Col>
            <Col sm={24} md={24} lg={24} xl={24} xxl={24} style={{ padding: '0 2rem' }}>
              {treeData.length > 0 && (
                <Tree
                  className="m-tree"
                  multiple
                  checkable
                  treeData={treeData}
                  onCheck={this.handleCheck}
                  defaultCheckedKeys={this.getDefaultKeys(empClassLevel)}
                  defaultExpandedKeys={this.getDefaultKeys(empClassLevel)}
                />
              )}
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}

export default Examiners;
