import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, message, Spin, Input, Row, Col, Select, Upload, Button, Icon } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

function UploadModal(props) {
  const { visible, setVisible, RYXQ = [] } = props;
  const [isTurnRed, setIsTurenRed] = useState(false); //上传标红
  const [fileList, setFileList] = useState([]); //文件列表

  useEffect(() => {
    console.log('fileList', fileList);
    return () => {};
  }, []);

  const handleOk = () => {
    if (fileList.length === 0) {
      setIsTurenRed(true);
    } else if (!isTurnRed) {
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setFileList([]);
    setIsTurenRed(false);
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
            <Form.Item
              label="简历"
              required
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              help={isTurnRed ? `简历不能为空` : ''}
              validateStatus={isTurnRed ? 'error' : 'success'}
              style={{ marginBottom: 0 }}
            >
              <Upload
                action={'/api/projectManage/queryfileOnlyByupload'}
                showUploadList={{
                  showRemoveIcon: true,
                  // showPreviewIcon: true,
                  // showDownloadIcon: true,
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
                      }
                    };
                  });
                }}
                accept={
                  '.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                }
                fileList={fileList}
              >
                <Button
                  type="dashed"
                  style={
                    isTurnRed
                      ? {
                          borderColor: '#f5222d',
                        }
                      : {}
                  }
                >
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
export default UploadModal;
