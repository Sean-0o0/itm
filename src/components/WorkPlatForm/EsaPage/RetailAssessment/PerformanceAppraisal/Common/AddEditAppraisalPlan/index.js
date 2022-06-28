import React, { Component, Fragment } from 'react';
import { Row, Col, Button, message } from 'antd';
import BaseInfo from './BaseInfo';
import MandatorySelectedIndex from './MandatorySelectedIndex';
import AlternativeIndex from './AlternativeIndex';
import Examiners from './Examiners';
import IndexModal from './IndexModal';
import AssessmentYearModal from './AssessmentYearModal';
import SalesDepartmentModal from './SalesDepartmentModal';

/**
 * 新增修改方案
 */
class AddEditPlanModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexModal: { // 指标modal
        visible: false,
      },
      assessmentYearModal: { // 考核年度
        visible: false,
      },
      salesDepartmentModal: { // 营业部
        visible: false,
      },
    };
  }
  // 指标modal取消
  onIndexModalCancel=() => {
    const { indexModal } = this.state;
    this.setState({ indexModal: { ...indexModal, visible: false } });
  }
  // 考核年度modal取消
  onAssessmentYearModalCancel=() => {
    const { assessmentYearModal } = this.state;
    this.setState({ assessmentYearModal: { ...assessmentYearModal, visible: false } });
  }
  // 营业部取消
  onSalesDepartmentModalCancel=() => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: false } });
  }
  // 添加指标
  handleIndexAdd=() => {
    const { indexModal } = this.state;
    this.setState({ indexModal: { ...indexModal, visible: true } });
  }

  // 选择考核年度
  handleAssessmentYearSelect=() => {
    const { assessmentYearModal } = this.state;
    this.setState({ assessmentYearModal: { ...assessmentYearModal, visible: true } });
  }
  // 选择营业部
  handleSalesDepartmentSelect=() => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: true } });
  }
  handleOk = () => {
    const { confirmLoading } = this.state;
    if (!confirmLoading) {
      this.handleSubmit();
    }
  }
  handleCancel = () => {
    const { confirmLoading } = this.state;
    if (confirmLoading) {
      message.warning('正在执行中,请勿关闭窗口!');
    } else {
      const { onCancel } = this.props;
      if (onCancel) {
        onCancel();
      }
    }
  }
  handleSubmit = (e) => {
    if (e) e.preventDefault();
  }

  render() {
    const { indexModal, assessmentYearModal, salesDepartmentModal } = this.state;
    const { id } = this.props;
    return (
      <Fragment>
        <Row className="m-row-form">
          <Col sm={18} md={18} lg={18} xl={18} xxl={18} style={{ borderRight: '1px solid #e8e8e8' }}>
            <BaseInfo
              type={id && '2'}
              handleAssessmentYearSelect={this.handleAssessmentYearSelect}
              handleSalesDepartmentSelect={this.handleSalesDepartmentSelect}
            />
            <MandatorySelectedIndex />
            <AlternativeIndex handleIndexAdd={this.handleIndexAdd} />
          </Col>
          <Col sm={6} md={6} lg={6} xl={6} xxl={6}>
            <Examiners />
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24} lg={24} xl={24} xxl={24} className="tr">
            <Button className="m-btn-radius m-btn-headColor" onClick={this.handleOk}>确定</Button>
            <Button className="m-btn-radius m-btn-gray" onClick={this.handleCancel}>取消</Button>
          </Col>
        </Row>
        <IndexModal {...indexModal} onCancel={this.onIndexModalCancel} />
        <AssessmentYearModal {...assessmentYearModal} onCancel={this.onAssessmentYearModalCancel} />
        <SalesDepartmentModal {...salesDepartmentModal} onCancel={this.onSalesDepartmentModalCancel} />
      </Fragment>
    );
  }
}

export default AddEditPlanModal;
