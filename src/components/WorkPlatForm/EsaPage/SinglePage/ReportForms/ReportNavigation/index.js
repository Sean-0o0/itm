import React from 'react';
import { message, BackTop, Card, Tabs, Row, Input, Form, Col, Button } from 'antd';
import StaffManagementTab from '../../../../../pages/workPlatForm/mainPage/staff/staffAdmission/staffManagementTab/index';
import { FetchReportNavigation } from '../../../../../services/reportcenter';
import TreeUtils from '../../../../../utils/treeUtils';

class ReportNavigationIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationDatas: [],
    };
  }
  componentDidMount() {
    this.fetchReportNavigation({ type: 1 });
  }
  fetchReportNavigation = (params = {}) => {
    FetchReportNavigation({ ...params }).then((ret) => {
      const { records = [] } = ret;
      const { authorities = [] } = this.props;
      // 获取有权限的节点信息
      const authednNvigationDatas = records.filter((item) => {
        const { type = '', qxbm = '' } = item;
        if (type === '2' && !Object.hasOwnProperty.call(authorities, qxbm)) { // 筛选掉没有权限的 type 1:流程分区|0:流程分组|2:流程明细
          return false;
        }
        return true;
      });
      const navigationTree = TreeUtils.toTreeData(authednNvigationDatas, { keyName: 'id', pKeyName: 'fid', titleName: 'xsmc' }, false) || [];
      // 获取符合条件的数据
      const navigationTreeData = ((navigationTree[0] || {}).children || []).filter(((item) => {
        const { children = [] } = item;
        if (!children || children.length === 0) {
          return false;
        }
        return children.some(child => child.children && child.children.length > 0);
      }));
      this.setState({
        navigationDatas: navigationTreeData,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleSubmit = () => {
    const values = this.props.form.getFieldsValue();
    const { reportName = '' } = values;
    this.fetchReportNavigation({ keyword: reportName, type: 1 });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { navigationDatas = [] } = this.state;
    return (
      <React.Fragment>
        <Row className="m-row" style={{ marginTop: '1.5rem' }}>
          <Card className="m-card myCard default" title="报表导航" style={{ minHeight: '65rem' }}>
            <div className="">
              <div className="m-yxhd-form-box">
                <Form className="m-form-default ant-advanced-search-form" >
                  <Row>
                    <Col xs={24} sm={12} md={8} xl={7}>
                      <Form.Item className="m-form-item" label="报表名称">
                        {getFieldDecorator('reportName', { initialValue: '',
                      })(<Input placeholder="请输入报表名称" />)}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={4} xl={5} style={{ padding: '0' }}>
                      <div>
                        <Button className="m-btn-radius m-btn-headColor" type="primary" onClick={this.handleSubmit}>查询</Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
            {
              navigationDatas.length > 0 && (
                <Tabs className="m-tabs-underline m-tabs-underline-small" onChange={this.handleTabsChange}>
                  {
                    navigationDatas.map((item) => {
                      const { id, xsmc = '--', children = [] } = item;
                      return (
                        <Tabs.TabPane tab={xsmc} key={id}>
                          <StaffManagementTab onRefresh={this.handleRefresh} wfData={children} authorities={this.props.authorities} />
                        </Tabs.TabPane>
                      );
                    })
                  }
                </Tabs>
              )
            }
          </Card>
        </Row>
        <BackTop visibilityHeight={40} />
      </React.Fragment>
    );
  }
}
export default Form.create()(ReportNavigationIndex);
