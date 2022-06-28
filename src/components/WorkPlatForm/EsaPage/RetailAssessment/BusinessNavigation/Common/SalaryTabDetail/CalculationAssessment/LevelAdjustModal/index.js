import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, Select, message } from 'antd';
import BasicModal from '../../../../../../../../Common/BasicModal';
import { getDictKey } from '../../../../../../../../../utils/dictUtils';
import ManualLevelAdjustModal from './ManualLevelAdjustModal';
import { FetchoperateExamManualLvlAdj } from '../../../../../../../../../services/EsaServices/navigation';

/**
 * 手工级别调整弹出框
 */
class LevelAdjustModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manualLevelAdjustModal: { // 手动调整级别子弹出框
        visible: false,
        handleOk: this.manualLevelAdjustModalOk,
        onCancel: this.manualLevelAdjustModalCancel,
      },
      levelNo: '',
    };
  }
  // 手动调整级别子弹出框取消
  manualLevelAdjustModalCancel = () => {
    const { manualLevelAdjustModal } = this.state;
    this.setState({ manualLevelAdjustModal: { ...manualLevelAdjustModal, visible: false } });
  }
  // 打开手动调整级别子弹出框
  openManualLevelAdjustModal = () => {
    const { manualLevelAdjustModal } = this.state;
    this.setState({ manualLevelAdjustModal: { ...manualLevelAdjustModal, visible: true } });
  }
  // 手动调整级别子弹出框确定
  manualLevelAdjustModalOk = (selectItem) => {
    this.props.form.setFieldsValue({ adjLvl: selectItem.LEVEL_NAME });
    this.setState({ levelNo: selectItem.ID });
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }
  // 级别手动调整操作操作
  operateExamManualLvlAdj = (params) => {
    FetchoperateExamManualLvlAdj({ ...params }).then((res) => {
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
  handleOk = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err || err.length === 0) { // 校验通过
        // eslint-disable-next-line no-param-reassign
        values.adjLvl = this.state.levelNo;
        const { mon, orgNo, depClass, empNo, adjLvl, adjAssisSts, adjRemk } = values;
        this.operateExamManualLvlAdj({ mon, orgNo, depClass, empNo, adjLvl, adjAssisSts, adjRemk });
        const { resetSelectData } = this.props;
        if (resetSelectData) {
          resetSelectData();
        }
        this.handleCancel();
      }
    });
  }
  render() {
    const { manualLevelAdjustModal } = this.state;
    const {
      dictionary: { [getDictKey('ASSIS_STS')]: adjAssisStsData = [] },
      visible = false,
      form = {},
      selectData = {},
    } = this.props;
    const { getFieldDecorator } = form;
    const modalProps = {
      title: '手工级别调整',
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
            <Row>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="考核月份 " >
                  {getFieldDecorator('mon', {
                    initialValue: selectData.mon ? selectData.mon : '0',
                    rules: [{ required: true }],
                  })(<span>{selectData.mon}</span>)}
                </Form.Item>
              </Col>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="营业部">
                  {getFieldDecorator('orgNo', {
                    initialValue: selectData.orgId ? selectData.orgId : '0',
                    rules: [{ required: true }],
                  })(<span>{selectData.orgName}</span>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="部门类别" >
                  {getFieldDecorator('depClass', {
                    initialValue: selectData.depClass ? selectData.depClass : '0',
                    rules: [{ required: true }],
                  })(<span>{selectData.depClassName}</span>)}
                </Form.Item>
              </Col>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="人员">
                  {getFieldDecorator('empNo', {
                    initialValue: selectData.empNo ? selectData.empNo : '0',
                    rules: [{ required: true }],
                  })(<span>{selectData.empName}</span>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="原类别" >
                  {getFieldDecorator('origClass', {
                    initialValue: selectData.origClass ? selectData.origClass : '0',
                    rules: [{ required: true }],
                  })(<span>{selectData.origClassName}</span>)}
                </Form.Item>
              </Col>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="原级别">
                  {getFieldDecorator('origLevel', {
                    initialValue: selectData.origLevel ? selectData.origLevel : '0',
                    rules: [{ required: true }],
                  })(<span>{selectData.origLevelName}</span>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="升降" >
                  {getFieldDecorator('upDown', {
                    initialValue: selectData.upDown ? selectData.upDown : '0',
                    rules: [{ required: true }],
                  })(<span>{selectData.upDownName}</span>)}
                </Form.Item>
              </Col>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="应调级别">
                  {getFieldDecorator('trueLevel', {
                    initialValue: selectData.trueLevel ? selectData.trueLevel : '0',
                    rules: [{ required: true }],
                  })(<span>{selectData.trueLevelName}</span>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="计算日期" >
                  {getFieldDecorator('calDate', {
                    initialValue: selectData.calDate ? selectData.calDate : '0',
                    rules: [{ required: true }],
                  })(<span>{selectData.calDate}</span>)}
                </Form.Item>
              </Col>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="处理标志">
                  {getFieldDecorator('dealFlag', {
                    initialValue: selectData.dealFlag ? selectData.dealFlag : '0',
                    rules: [{ required: true }],
                  })(<span>{selectData.dealFlagName}</span>)}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              label="手动调整级别"
            >{getFieldDecorator('adjLvl', {
            })(<Input.Search
              readOnly
              placeholder="请选择"
              onSearch={this.openManualLevelAdjustModal}
            />)}
            </Form.Item>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              label="手动调整辅助状态"
            >{getFieldDecorator('adjAssisSts', {
            })(<Select
              className="esa-select m-select m-select-default"
              placeholder="请选择"
            >
              {
                adjAssisStsData.map(item => (
                  <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>
                ))
              }
              {/* eslint-disable-next-line react/jsx-indent */}
            </Select>)
              }
            </Form.Item>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              label="手动调整说明"
            >{getFieldDecorator('adjRemk', {
              rules: [{ required: true, message: '请输入内容!' }],
              initialValue: selectData.remk,
            })(<Input.TextArea rows={2} placeholder="请输入内容" />)}
            </Form.Item>
          </Form>
          <ManualLevelAdjustModal {...manualLevelAdjustModal} selectData={selectData}/>
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(LevelAdjustModal);
