import React, { Component, Fragment } from 'react';
import { Form, Row, Col, message } from 'antd';
import BasicModal from '../../../../../../../Common/BasicModal';
import DepartmentTree from './DepartmentTree';
import { fetchUserAuthorityDepartment } from '../../../../../../../../services/commonbase/userAuthorityDepartment';

/**
 * 营业部modal
 */
class SalesDepartmentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deptList: [], // 营业部
    };
  }
  componentDidMount() {
    this.fetchDeptList();
  }
  handleOk = () => {
    this.handleCancel();
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }
  fetchDeptList=() => {
    fetchUserAuthorityDepartment({}).then((res) => {
      const { note, code, records = [] } = res;
      if (code > 0) {
        this.setState({ deptList: records });
      } else {
        message.error(note);
      }
      // //console.log('res', res);
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  render() {
    const { deptList } = this.state;
    const { visible = false, handleSelect, selectedKeys } = this.props;
    const modalProps = {
      title: '选择记录',
      width: '75rem',
      className: 'esa-scrollbar',
      bodyStyle: { height: '55rem', overflow: 'auto' },
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    return (
      <Fragment>
        <BasicModal {...modalProps}>
          <Row className="m-row-form mt10">
            <Col sm={24} md={24} lg={24} xl={24} xxl={24} className="m-form ant-form" style={{ margin: '0', padding: '1rem' }}>
              <DepartmentTree deptList={deptList} handleSelect={handleSelect} selectedKeys={selectedKeys} />
            </Col>
          </Row>
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(SalesDepartmentModal);
