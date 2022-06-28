import React, { Component, Fragment } from 'react';
import { Row, Col, message } from 'antd';
import BasicModal from '../../../../../Common/BasicModal';
import AssessmentLevelTable from './AssessmentLevelTable';

/**
 * 考核级别弹窗
 */
class SalesDepartmentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectItem: {}, // 选择的考核级别数据
    };
  }

  componentDidMount() {
  }

  // 获取表格点击行
  onClickRow = (record) => {
    this.setState({
      selectItem: record,
    });
  }

  // 点击弹框确定
  handleOk = () => {
    const { handleOk } = this.props;
    const { selectItem = {} } = this.state;
    if (Object.keys(selectItem).length === 0) {
      message.warning('请选择一条记录');
    } else if (typeof handleOk === 'function') {
      handleOk(selectItem);
    }
    this.setState({
      selectItem: {},
    });
  }

  // 点击弹框取消
  handleCancel = () => {
    const { handleCancel } = this.props;
    if (typeof handleCancel === 'function') {
      handleCancel();
    }
    this.setState({
      selectItem: {},
    });
  }

  render() {
    const { visible = false, modalProps = {}, classId = '', className = '' } = this.props;
    const currentModalProps = {
      title: '选择记录',
      width: '75rem',
      className: 'esa-scrollbar',
      bodyStyle: { height: '55rem', overflow: 'auto' },
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      destroyOnClose: true,
      ...modalProps,
    };
    return (
      <Fragment>
        <BasicModal {...currentModalProps}>
          <Row className="m-row-form mt10">
            <Col sm={24} md={24} lg={24} xl={24} xxl={24} className="m-form ant-form" style={{ margin: '0', padding: '1rem' }}>
              <AssessmentLevelTable onClickRow={this.onClickRow} classId={classId} className={className} />
            </Col>
          </Row>
        </BasicModal>
      </Fragment>
    );
  }
}

export default SalesDepartmentModal;
