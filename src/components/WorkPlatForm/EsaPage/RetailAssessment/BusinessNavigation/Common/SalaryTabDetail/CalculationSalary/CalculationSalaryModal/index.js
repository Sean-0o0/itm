import React, { Component, Fragment } from 'react';
import { Form, Radio, message } from 'antd';
import BasicModal from '../../../../../../../../Common/BasicModal';
import { FetchoperatePayTrialApply, FetchoperatePaySettlementApply, FetchoperatePaySettlementRollBack } from '../../../../../../../../../services/EsaServices/navigation';
import { getDictKey } from '../../../../../../../../../utils/dictUtils';

/**
 * 试算申请、结算申请、结算回退弹出框组件
 */

class CalculationSalaryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }
  handleOk = (e) => {
    if (e) e.preventDefault();
    const { operateType } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err || err.length === 0) { // 校验通过
        // eslint-disable-next-line no-console
        if (operateType === 1) { // 试算申请
          this.operatePayTrialApply(values);
        } else if (operateType === 2) { // 结算申请
          this.operatePaySettlementApply(values);
        } else if (operateType === 3) { // 结算回退
          this.operatePaySettlementRollBack(values);
        }
        this.handleCancel();
      }
    });
  }
  // 试算申请
  operatePayTrialApply = (params) => {
    FetchoperatePayTrialApply({ ...params }).then((res) => {
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
  // 结算申请
  operatePaySettlementApply = (params) => {
    FetchoperatePaySettlementApply({ ...params }).then((res) => {
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
  // 结算回退
  operatePaySettlementRollBack = (params) => {
    FetchoperatePaySettlementRollBack({ ...params }).then((res) => {
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
    const { confirmLoading } = this.state;
    const { visible = false, depClass = '', operateType = '', form = {}, orgNo, orgName, mon } = this.props;
    const { getFieldDecorator } = form;
    const modalProps = {
      // eslint-disable-next-line no-nested-ternary
      title: operateType === 1 ? '营业部薪酬计算' : operateType === 2 ? '结算申请' : '结算回退',
      width: '75rem',
      visible,
      confirmLoading,
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
            {operateType === 1 ? (
              <Form.Item
                className="wid50"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="重算指标"
              >{getFieldDecorator('returnIndi', {
                rules: [{ required: true, message: '请勾选重算指标!' }],
                initialValue: "1",
              })(<Radio.Group><Radio value="1">是 </Radio><Radio value="0">否</Radio></Radio.Group>)}
              </Form.Item>
            ) : ''}
          </Form>
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(CalculationSalaryModal);
