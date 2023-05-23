import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, message, Spin, Input, Row, Col, Select, Upload, Button, Icon } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

function EmploymentApplicationModal(props) {
  const { visible, setVisible, form, RYXQ = [] } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [isSpinning, setIsSpinning] = useState(false); //
  const [isTurnRed, setIsTurenRed] = useState(false); //上传标红
  const [fileList, setFileList] = useState([]); //文件列表

  useEffect(() => {
    return () => {};
  }, []);

  const handleOk = () => {
    form.validateFieldsAndScroll(err => {
      if (!err) {
        setVisible(false);
      }
    });
  };

  const handleCancel = () => {
    resetFields();
    setVisible(false);
  };

  const handleContinue = () => {};

  return (
    <Modal
      wrapClassName="editMessage-modify employment-application-modal"
      width={'720px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '60px' }}
      title={null}
      visible={visible}
      onCancel={handleCancel}
      footer={
        <div className="modal-footer">
          <Button className="btn-default" onClick={handleCancel}>
            取消
          </Button>
          <Button
            loading={isSpinning}
            className="btn-primary"
            type="primary"
            onClick={handleContinue}
          >
            确认并继续
          </Button>
          <Button loading={isSpinning} className="btn-primary" type="primary" onClick={handleOk}>
            确认
          </Button>
        </div>
      }
    >
      <div className="body-title-box">
        <strong>账号新增</strong>
      </div>
      <Spin spinning={isSpinning}>
        <Form className="content-box">
          <Row>
            <Col span={12}>
              <Form.Item label="所属项目" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('ssxm', {
                  // initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '所属项目不允许空值',
                    },
                  ],
                })(
                  <Select
                    className="item-selector"
                    placeholder="请选择"
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {/* {RYXQ.map(x => {
                    return (
                      <Option key={x} value={x}>
                        {x}
                      </Option>
                    );
                  })} */}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="人员名称" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('rymc', {
                  // initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '人员名称不允许空值',
                    },
                  ],
                })(
                  <Select
                    className="item-selector"
                    placeholder="请选择"
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {/* {RYXQ.map(x => {
                    return (
                      <Option key={x} value={x}>
                        {x}
                      </Option>
                    );
                  })} */}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="性别" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('xb', {
                  // initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '性别不允许空值',
                    },
                  ],
                })(
                  <Select
                    className="item-selector"
                    placeholder="请选择"
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {/* {RYXQ.map(x => {
                    return (
                      <Option key={x} value={x}>
                        {x}
                      </Option>
                    );
                  })} */}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="简历"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                // help={isTurnRed ? `简历不允许空值` : ''}
                // validateStatus={isTurnRed ? 'error' : 'success'}
              >
                <Upload
                  action={'/api/projectManage/queryfileOnlyByupload'}
                  showUploadList={{
                    showRemoveIcon: true,
                    showPreviewIcon: true,
                  }}
                  multiple={true}
                  onChange={info => {
                    let list = [...info.fileList];
                    setFileList(list);
                    if (list.length === 0) {
                      setIsTurenRed(true);
                    } else {
                      setIsTurenRed(false);
                    }
                  }}
                  beforeUpload={(file, fileList) => {
                    let arr = [];
                    fileList.forEach(item => {
                      let reader = new FileReader(); //实例化文件读取对象
                      reader.readAsDataURL(item); //将文件读取为 DataURL,也就是base64编码
                      reader.onload = e => {
                        //文件读取成功完成时触发
                        let urlArr = e.target.result.split(',');
                        arr.push({
                          name: item.name,
                          base64: e.target.result,
                        });
                        if (arr.length === fileList.length) {
                          debounce(() => {
                            // setOaData(p => [...arr]);
                            console.log('🚀 ~ file: index.js ~ line 407 ~ debounce ~ [...arr]', [
                              ...arr,
                            ]);
                          }, 500);
                        }
                      };
                    });
                  }}
                  accept={
                    '.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  }
                  fileList={fileList}
                >
                  <Button type="dashed">
                    <Icon type="upload" />
                    点击上传
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
}
export default Form.create()(EmploymentApplicationModal);
