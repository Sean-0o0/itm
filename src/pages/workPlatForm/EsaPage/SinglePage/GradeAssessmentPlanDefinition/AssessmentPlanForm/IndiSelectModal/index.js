import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, Table, message } from 'antd';
import BasicModal from '../../../../../../../components/Common/BasicModal';
import { fetchObject } from '../../../../../../../services/sysCommon';

/**
 * 考核指标选择modal
 */
class IndiSelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      selectRecord: {},
      indiData: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  componentWillReceiveProps(nextProps) {
    this.fetchData('', nextProps.versionId);
  }
  handleOk = () => {
    const { selectRecord } = this.state;
    const { handleOk } = this.props;
    const { index } = this.props;
    if (typeof handleOk === 'function') {
      handleOk(selectRecord, index);
      this.handleCancel();
    }
  }
  handleRowSelect = (record) => {
    this.setState({ selectRecord: record });
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }
  fetchColumns = () => {
    const columns = [
      {
        title: '指标代码',
        dataIndex: 'INDI_CODE',
      },
      {
        title: '指标名称',
        dataIndex: 'INDI_NAME',
      },
    ];
    return columns;
  }
  fetchData = (value, versionId = this.props.versionId) => {
    // 查询 livebos对象
    let condition = {
      indi: value,
    }
    if (versionId) {
      condition.version = versionId;
    }
    fetchObject('XTZB', { condition}).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        this.setState({
          indiData: records.filter(m => m.VERSION === ''),
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  render() {
    const { total = 0, selectRecord = {}, indiData } = this.state;
    const { visible = false } = this.props;
    const modalProps = {
      title: '选择记录',
      width: '75rem',
      visible,
      centered: true,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      destroyOnClose: false,
    };
    return (
      <Fragment>
        <BasicModal
          {...modalProps}
        >
          <Row className="m-row-form mt10">
            <Col sm={24} md={8} lg={8} xl={8} xxl={8} className="m-form ant-form" style={{ margin: '0', padding: '1rem' }}>
              <Input.Search
                placeholder="请输入关键字进行搜索"
                onSearch={value => this.fetchData(value)}
              />
            </Col>
            <Col sm={24} md={24} lg={24} xl={24} xxl={24} >
              <Table
                rowKey="EMP_NO"
                size="small"
                columns={this.fetchColumns()}
                dataSource={indiData}
                pagination={{
                  total: indiData.length,
                  className: 'm-paging',
                  size: 'small',
                  showLessItems: true,
                  hideOnSinglePage: true,
                  pageSize: 8,
                }}
                rowClassName={record => (selectRecord.ID === record.ID ? 'clickRowStyle' : '')}
                onRow={(record, selected) => {
                  return {
                    onClick: () => this.handleRowSelect(record, selected),
                  };
                }}
              />
            </Col>
          </Row>
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(IndiSelectModal);
