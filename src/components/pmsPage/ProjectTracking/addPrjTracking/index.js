/**
 * 项目跟踪信息————新建弹窗页面（不知道editPrjTracking被哪些地方复用，改入参麻烦）
 */
import {
  Row,
  Col,
  Modal,
  Form,
  Input,
  message,
  Select,
  Spin,
  Button,
  InputNumber,
} from 'antd';

const { Option } = Select;
import React from 'react';
import { connect } from 'dva';
import {
  WriteProjectTrackingReport
} from '../../../../services/pmsServices';
import moment from "moment";

class EditPrjTracking extends React.Component {
  state = {
    isSpinning: false,
  };

  componentDidMount() {
    const { record } = this.props
    // console.log("新建弹窗入参", record)
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      progress: record.DQJD?.replace('%', ''),
      importantNotes: record.ZYSXSM,
      nextWeek: record.XZGZAP,
      status: record.KXZT && JSON.parse(record.KXZT).filter(item => item.note === record.DQZT)[0]?.ibm,
      thisWeek: record.BZGZNR
    })
  }

  // 保存数据操作
  handleFormValidate = e => {
    e.preventDefault();
    const _this = this;
    _this.props.form.validateFields((err, values) => {
      if (err) {
        const errs = Object.keys(err);
        if (errs.includes('status')) {
          message.warn('请选择当前状态！');
          return;
        }
        if (errs.includes('progress')) {
          message.warn('请输入项目进度！');
          return;
        }
        if (errs.includes('thisWeek')) {
          message.warn('请输入本周工作内容！');
          return;
        }
        if (errs.includes('nextWeek')) {
          message.warn('请输入下周工作计划！');
          return;
        }
        if (errs.includes('importantNotes')) {
          message.warn('请输入重要事项说明！');
          return;
        }
      } else {
        _this.setState({
          isSpinning: true,
        });
        _this.writeProjectTrackingReport(values);
      }
    });
  };

  //发起流程到oa
  writeProjectTrackingReport = values => {
    const { getTableData, params } = this.props;
    // console.log("params", this.handleParams(values))
    return WriteProjectTrackingReport(this.handleParams(values))
      .then(result => {
        const { code = -1, record = [] } = result;
        if (code > 0) {
          this.setState({
            isSpinning: false,
          });
          this.props.closeContractModal();
          message.success(this.props.isFromToDo ? "填写成功！" : "新建成功！");
          getTableData({ ...params })
        }
      })
      .catch(error => {
        this.setState({
          isSpinning: false,
        });
        message.error(!error.success ? error.message : error.note);
      });
  };

  handleParams = values => {
    const { record, cycle } = this.props
    const params = {
      cycle,
      importantNotes: values.importantNotes,
      nextWeek: values.nextWeek,
      //TX|填写;XG|修改;ADD|新增; 正常情况下都是XG
      operateType: "ADD",
      progress: values.progress,
      projectId: record.XMID,
      status: values.status,
      thisWeek: values.thisWeek
    };
    // console.log("paramsparams", params)
    return params;
  };

  render() {
    const {
      isSpinning = false,

    } = this.state;
    const {
      contractSigningVisible,
      record,
    } = this.props;
    const time = moment(record.KSSJ, 'YYYY.MM.DD').format('YYYY.MM.DD') + '-' + moment(record.JSSJ, 'YYYY.MM.DD').format('YYYY.MM.DD')
    const { getFieldDecorator } = this.props.form;
    const basicFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <>
        <Modal
          wrapClassName="editMessage-modify"
          style={{ top: '10px' }}
          width={'860px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
          }}
          // onOk={e => this.handleFormValidate(e)}
          onCancel={this.props.closeContractModal}
          maskClosable={false}
          footer={
            <div className="modal-footer">
              <Button className="btn-default" onClick={this.props.closeContractModal}>
                取消
              </Button>
              {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        暂存草稿
      </Button> */}
              <Button
                disabled={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={e => this.handleFormValidate(e)}
              >
                确定
              </Button>
            </div>
          }
          visible={contractSigningVisible}
        >
          <div
            style={{
              height: '42px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#3361FF',
              color: 'white',
              // marginBottom: '16px',
              padding: '0 24px',
              borderRadius: '8px 8px 0 0',
              fontSize: '15px',
            }}
          >
            <strong>新增周概况</strong>
          </div>
          <Spin
            spinning={isSpinning}
            style={{ position: 'fixed' }}
            tip="加载中"
            size="large"
            wrapperClassName="contrast-signing-modal-spin"
          >
            <div style={{ padding: '0 24px' }}>
              <div className="steps-content">
                <React.Fragment>
                  <Form
                    {...basicFormItemLayout}
                    ref={e => (this.basicForm = e)}
                    style={{ width: '98%' }}
                  >
                    <div style={{ margin: '14px 0 0 0' }}>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item label="报告日期">
                            <Input
                              placeholder="请输入报告日期"
                              disabled={true}
                              value={time}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="当前里程碑">
                            <Input
                              placeholder="请输入当前里程碑"
                              disabled={true}
                              value={record?.DQLCB}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item label="当前状态">
                            {getFieldDecorator('status', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择当前状态',
                                },
                              ],
                              initialValue: '',
                            })(
                              <Select
                                showSearch
                                placeholder='请选择当前状态'
                                filterOption={(input, option) =>
                                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                {
                                  record.KXZT && JSON.parse(record.KXZT).map((item, index) => {
                                    return (
                                      <Option key={item.ibm} value={item.ibm}>{item.note}</Option>
                                    )
                                  })
                                }
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="当前进度(%)">
                            {getFieldDecorator('progress', {
                              // initialValue: "一般"
                              rules: [
                                {
                                  required: true,
                                  message: '当前进度不允许空值',
                                },
                              ],
                            })(
                              <InputNumber
                                placeholder="请输入当前进度"
                                min={0}
                                max={100}
                                style={{width: '100%'}}
                              />,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={24}>
                          <Form.Item
                            label="本周工作内容"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                          >
                            {getFieldDecorator('thisWeek', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入本周工作内容',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(
                              <Input.TextArea
                                autoSize={{ minRows: 3, }}
                                placeholder="请输入本周工作内容"
                              />,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={24}>
                          <Form.Item
                            label="下周工作计划"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                          >
                            {getFieldDecorator('nextWeek', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入下周工作计划',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(
                              <Input.TextArea
                                autoSize={{ minRows: 3, }}
                                placeholder="请输入下周工作计划"
                              />,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={24}>
                          <Form.Item
                            label="重要事项说明"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                          >
                            {getFieldDecorator('importantNotes', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入重要事项说明',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(
                              <Input.TextArea
                                autoSize={{ minRows: 3, }}
                                placeholder="请输入重要事项说明"
                              />,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                </React.Fragment>
              </div>
            </div>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(EditPrjTracking));
