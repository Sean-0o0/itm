/* eslint-disable react/jsx-indent */
import React, { Component, Fragment } from 'react';
import { Form, Radio, message, Input } from 'antd';
import BasicModal from '../../../../../../../../Common/BasicModal';
import EmpClassSelectModal from './EmpClassSelectModal';
import { FetchoperateExamExec, FetchoperateExamFinish } from '../../../../../../../../../services/EsaServices/navigation';
import { getDictKey } from '../../../../../../../../../utils/dictUtils';

/**
 * 级别计算、完成级别考核弹出框
 */

class LevelCalculationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empClassSelectModal: { // 手动调整级别子弹出框
        visible: false,
        handleOk: this.empClassSelectModalOk,
        onCancel: this.empClassSelectModalCancel,
      },
      classId: '', // 考核人员类别
    };
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    this.setState({ classId: '' });
    if (onCancel) {
      onCancel();
    }
  }
  // 级别计算子弹出框取消
  empClassSelectModalCancel = () => {
    const { empClassSelectModal } = this.state;
    this.setState({ empClassSelectModal: { ...empClassSelectModal, visible: false } });
  }
  // 打开级别计算子弹出框
  openEmpClassSelectModal = () => {
    const { empClassSelectModal } = this.state;
    this.setState({ empClassSelectModal: { ...empClassSelectModal, visible: true } });
  }
  // 级别计算子弹出框确定
  empClassSelectModalOk = (selectItems) => {
    const length = selectItems.length - 1;
    let classIdTmp = '';
    let classNameTmp = '';
    selectItems.forEach((item, index) => {
      if (index !== length) {
        classIdTmp += `${item.ID};`;
        classNameTmp += `${item.CLASS_NAME};`;
      } else {
        classIdTmp += `${item.ID}`;
        classNameTmp += `${item.CLASS_NAME}`;
      }
    });
    this.props.form.setFieldsValue({ className: classNameTmp });
    this.setState({ classId: classIdTmp });
  }
  handleOk = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err || err.length === 0) { // 校验通过
        const { operateType } = this.props;
        if (operateType === 0) {
          this.operateExamExec(values);
        } else if (operateType === 1) {
          this.operateExamFinish(values);
        }
        this.handleCancel();
      }
    });
  }
  // 级别计算
  operateExamExec = (params) => {
    const { classId } = this.state;
    Reflect.set(params, 'classId', classId);
    Reflect.deleteProperty(params, 'className');
    FetchoperateExamExec({ ...params, levelId: '', type: 1 }).then((res) => {
      const { code, note } = res;
      if (code > 0) {
        message.success(note);
        const { refreshNumAdd } = this.props;
        if (typeof refreshNumAdd === 'function') {
          refreshNumAdd();
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  // 完成级别考核
  operateExamFinish = (params) => {
    FetchoperateExamFinish({ ...params }).then((res) => {
      const { code, note } = res;
      if (code > 0) {
        message.success(note);
        const { refreshNumAdd } = this.props;
        if (typeof refreshNumAdd === 'function') {
          refreshNumAdd();
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  getDepClassName = (depclass) => {
    const { [getDictKey('BMLB')]: depClassDic = [] } = this.props.dictionary;
    let name = '--';
    depClassDic.forEach(item => {
      if (Number(item.ibm) === depclass) {
        name = item.note;
      }
    })
    return name;
  }
  render() {
    const { empClassSelectModal } = this.state;
    const { visible = false, depClass = '', operateType = '', form = {}, mon, orgName, orgNo } = this.props;
    const { getFieldDecorator } = form;

    const modalProps = {
      title: operateType === 0 ? '级别计算' : '完成级别考核',
      width: '75rem',
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    return (
      <Fragment>
        <BasicModal
          {...modalProps}
        >
          <Form className="m-form">
            <Form.Item
              className="wid50"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="营业部"
            >{getFieldDecorator('orgNo', {
              rules: [{ required: true }],
              initialValue: orgNo,
            })(<span>{orgName}</span>)}
            </Form.Item>
            <Form.Item
              className="wid50"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="部门类别"
            >{getFieldDecorator('depClass', {
              rules: [{ required: true }],
              initialValue: depClass,
            })(<span>{this.getDepClassName(depClass)}</span>)}
            </Form.Item>
            <Form.Item
              className="wid50"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="月份"
            >{getFieldDecorator('mon', {
              rules: [{ required: true }],
              initialValue: mon,
            })(<span>{mon}</span>)}
            </Form.Item>
            {operateType === 0 ? (
              <div>
                <Form.Item
                  className="wid50"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label="考核类别"
                >{getFieldDecorator('className', {
                })(<Input.Search
                  readOnly
                  placeholder="请选择"
                  onSearch={this.openEmpClassSelectModal}
                />)}
                </Form.Item>
                <Form.Item
                  className="wid50"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label="重算指标"
                >{getFieldDecorator('returnIndi', {
                  rules: [{ required: true, message: '请勾选重算指标!' }],
                })(<Radio.Group><Radio value="1">是 </Radio><Radio value="0">否</Radio></Radio.Group>)}
                </Form.Item>
              </div>
            ) : ''}
          </Form>
          <EmpClassSelectModal {...empClassSelectModal} />
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(LevelCalculationModal);
