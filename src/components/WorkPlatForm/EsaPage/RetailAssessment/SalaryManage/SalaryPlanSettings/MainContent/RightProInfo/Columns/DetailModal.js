/* eslint-disable react/sort-comp */
import React from 'react';
import { Card, Row, Col, Table, Checkbox, Select } from 'antd';

class DetailModal extends React.Component {
  // 结算状态改变
  handleJsztChange = (values = [], payCodeId) => {
    const { handleCheckboxChange } = this.props;
    const settRestr = values.join(';');
    if (handleCheckboxChange) {
      handleCheckboxChange(settRestr, payCodeId, 'settRestr');
    }
  }
  // 结算类型改变
  handleSettTypeChange(value, payCodeId) {
    const { handleCheckboxChange } = this.props;
    if (handleCheckboxChange) {
      handleCheckboxChange(value, payCodeId, 'settType');
    }
  }

  // 离职是否计算改变
  handleSfjsChange = (flag, payCodeId) => {
    const { handleCheckboxChange } = this.props;
    const leaveIsCal = flag ? '1' : '0';
    if (handleCheckboxChange) {
      handleCheckboxChange(leaveIsCal, payCodeId, 'leaveIsCal');
    }
  }

  getDataSource = () => {
    const { record: { payProgram = [] }, salaryData = [] } = this.props;
    const dataSource = [];
    payProgram.forEach((item) => {
      const tmpl = item;
      tmpl.payCodeName = salaryData.find(salaryItem => salaryItem.ID === item.payCodeId).PAY_NAME;
      dataSource.push(tmpl);
    });
    return dataSource;
  }

  assembleColumns = () => {
    // PAY_SETT_TYPE|结算类型;EMP_POST_STS|结算状态
    const { dictionary: { PAY_SETT_TYPE = [], EMP_STS = [] } } = this.props;
    const columns = [{
      title: '薪酬项目',
      dataIndex: 'payCodeName',
      render: text => text || '--',
    }, {
      title: '结算类型',
      dataIndex: 'settType',
      render: (text, record) => {
        return (
          <Select value={text} onChange={value => this.handleSettTypeChange(value, record.payCodeId)}>
            {
              PAY_SETT_TYPE.map((item) => { 
                return <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>; })
            }
          </Select>
        );
      },
    }, {
      title: '适合结算账户状态',
      dataIndex: 'settRestr',
      className: 'small-ptb',
      render: (text = '', record) => {
        const settRestr = text.split(';');
        const handleChange = (values) => {
          this.handleJsztChange(values, record.payCodeId);
        };
        // 默认结算状态0：正常，2：离岗
        return (
          <Checkbox.Group onChange={handleChange} defaultValue={settRestr}>
            {
              EMP_STS.map(item => <Checkbox value={item.ibm} key={item.ibm}>{item.note}</Checkbox>)
            }
          </Checkbox.Group>
        );
      },
    }, {
      title: '当月离职是否计算',
      dataIndex: 'leaveIsCal',
      align: 'right',
      render: (text = '', record) => {
        const handleChange = (e) => {
          this.handleSfjsChange(e.target.checked, record.payCodeId);
        };
        return <Checkbox onChange={handleChange} defaultChecked={text !== '0'} />;
      },
    }];
    return columns;
  }

  render() {
    const { selectedYybName = '', record = {} } = this.props;
    const infoObjs = [
      { col: { xs: 24, sm: 24, lg: 24 }, label: '营业部', text: selectedYybName || '全部' },
      { col: { xs: 8, sm: 8, lg: 8 }, label: '考核地区', text: '无' },
      { col: { xs: 8, sm: 8, lg: 8 }, label: '人员类别', text: record.className || '--' },
      { col: { xs: 8, sm: 8, lg: 8 }, label: '人员级别', text: record.levelName || '--' },
    ];
    return (
      <Card
        className="m-card m-card-pay"
        style={{ maxHeight: '38rem', overflowY: 'auto' }}
      >
        <div className="m-pay-right-box">
          <Row className="m-task-info-flex">
            {
              infoObjs.map((item, index) => (
                <Col {...item.col} key={index}>
                  <div className="m-basic-info m-basic-small">
                    <div className="m-basic-label">
                      <span className="gray">{item.label}</span>
                    </div>
                    <div className="m-basic-control-wrapper">
                      <div className="m-basic-item-control">
                        <span className="m-basic-text">{item.text}</span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            }
          </Row>
          <div className="m-pay-pt">
            <Table
              className="m-table-customer m-table-bortop"
              dataSource={this.getDataSource()}
              columns={this.assembleColumns()}
              pagination={false}
            />
          </div>
        </div>
      </Card>
    );
  }
}

export default DetailModal;
