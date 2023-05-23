import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, message, Spin, Input, Row, Col, Select, Upload, Button, Icon } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

function EmploymentApplicationModal(props) {
  const { visible, setVisible, form, RYXQ = [] } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
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
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="body-title-box">
        <strong>提交录用申请</strong>
      </div>
      <Form className="content-box">
        <Row>
          <Col span={24}>
            <Form.Item label="录用备注" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              {getFieldDecorator('lybz', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: `录用备注不能为空`,
                  },
                ],
              })(
                <TextArea
                  placeholder="请输入录用备注"
                  maxLength={1000}
                  autoSize={{ maxRows: 6, minRows: 3 }}
                ></TextArea>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="综合评测底稿"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              help={isTurnRed ? `综合评测底稿不允许空值` : ''}
              validateStatus={isTurnRed ? 'error' : 'success'}
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
    </Modal>
  );
}
export default Form.create()(EmploymentApplicationModal);
