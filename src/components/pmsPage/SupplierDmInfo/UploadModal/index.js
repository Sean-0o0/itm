import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, message, Spin, Input, Row, Col, Select, Upload, Button, Icon } from 'antd';
import { UploadCurriculumVitae } from '../../../../services/pmsServices';
import config from '../../../../utils/config';
import axios from 'axios';

const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

function UploadModal(props) {
  const { visible, setVisible, data = {}, reflush } = props;
  const { jldata = {}, ryxqid, gysid, xqid } = data;
  const [isTurnRed, setIsTurenRed] = useState(false); //上传标红
  const [fileList, setFileList] = useState([]); //文件列表
  const [newAddData, setNewAddData] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  //防抖定时器
  let timer = null;

  useEffect(() => {
    // setFileList([...jldata]);
    let jlArr =
      jldata.JLXX?.items?.map((x, i) => ({
        uid: Date.now() + i,
        name: x[1],
        status: 'done',
        // url: res.url,
        new: false,
        number: x[0],
      })) ?? [];
    // console.log('🚀 ~ file: index.js:25 ~ jlArr ~ jlArr:', jlArr);
    setFileList(jlArr);
    return () => {
      clearTimeout(timer);
    };
  }, [JSON.stringify(jldata)]);

  const handleOk = () => {
    if (fileList.length === 0) {
      setIsTurenRed(true);
    } else if (!isTurnRed) {
      setIsSpinning(true);
      let newAdd = [...newAddData].map(x => ({
        number: x.number,
        fileName: x.fileName,
        data: x.data,
      })); //新增简历数据
      let updateArr = [...fileList]
        .filter(x => !x.new)
        .map(y => ({
          number: y.number,
          fileName: y.name,
        }));
      updateArr.sort((a, b) => Number(a.number) - Number(b.number));
      // console.log('🚀 ~ file: index.js:59 ~ handleOk ~ pdateArr:', updateArr);
      let params = {
        demandId: Number(xqid),
        memberDemandId: Number(ryxqid),
        newCVInfo: newAdd,
        nextId: newAdd.length,
        operateType: 'ADD',
        supplierId: Number(gysid),
      };

      if (JSON.stringify(jldata) !== '{}') {
        params = {
          ...params,
          cvId: Number(jldata.JLID ?? -1),
          nextId: updateArr[updateArr.length - 1].number + 1,
          operateType: 'UPDATE',
          updateCVInfo: updateArr,
        };
      }
      console.log('🚀 ~ file: index.js:33 ~ handleOk ~ params:', params);
      UploadCurriculumVitae(params)
        .then(res => {
          if (res?.success) {
            message.success('上传成功', 1);
            reflush();
            setIsSpinning(false);
            setVisible(false);
          }
        })
        .catch(e => {
          message.error('上传失败', 1);
          setIsSpinning(false);
        });
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setFileList([]);
    setIsTurenRed(false);
  };

  //防抖
  const debounce = (fn, waits) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
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
        <strong>上传简历</strong>
      </div>
      <Spin spinning={isSpinning}>
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
                    showDownloadIcon: true,
                  }}
                  onDownload={file => {
                    if (file.new) {
                      console.log('🚀 ~ file: index.js:147 ~ UploadModal ~ file:', file);
                      let reader = new FileReader();
                      reader.readAsDataURL(file.originFileObj);
                      reader.onload = e => {
                        var link = document.createElement('a');
                        link.href = e.target.result;
                        link.download = file.name;
                        link.click();
                        window.URL.revokeObjectURL(link.href);
                      };
                    } else {
                      setIsSpinning(true);
                      axios({
                        method: 'POST',
                        url: queryFileStream,
                        responseType: 'blob',
                        data: {
                          objectName: 'TWBXQ_JLSC',
                          columnName: 'JL',
                          id: jldata.JLID ?? -1,
                          title: file.name,
                          extr: file.number,
                          type: '',
                        },
                      })
                        .then(res => {
                          const href = URL.createObjectURL(res.data);
                          const a = document.createElement('a');
                          a.download = file.name;
                          a.href = href;
                          a.click();
                          window.URL.revokeObjectURL(a.href);
                          setIsSpinning(false);
                        })
                        .catch(err => {
                          setIsSpinning(false);
                          message.error('简历下载失败', 1);
                        });
                    }
                  }}
                  multiple={true}
                  onChange={async info => {
                    let list = [...info.fileList];
                    function readFile(file) {
                      return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = function() {
                          const arrayBuffer = reader.result;
                          const headerBytes = new Uint8Array(arrayBuffer, 0, 8);
                          const headerInfoHex = Array.from(headerBytes)
                            .map(byte => byte.toString(16).padStart(2, '0'))
                            .join('')
                            .slice(0, 8);
                          console.log(
                            '🚀 ~ file: index.js:229 ~ returnnewPromise ~ headerInfoHex:',
                            headerInfoHex,
                            ['504b0304', '25504446'],
                          );
                          if (!['504b0304', '25504446'].includes(headerInfoHex)) {
                            resolve(false);
                          } else {
                            resolve(true);
                          }
                        };
                        reader.onerror = function() {
                          reject(reader.error);
                        };
                        reader.readAsArrayBuffer(file);
                      });
                    }
                    const typeAuth = await readFile(info.file);
                    if (
                      [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      ].includes(info.file.type)
                    ) {
                      if (typeAuth) {
                        setFileList(
                          list.map(x => ({
                            ...x,
                            uid: x.uid,
                            name: x.name,
                            status: x.status,
                            new: x.uid === +x.uid ? false : true,
                            number: x.number || '',
                          })),
                        );
                        if (list.length === 0) {
                          setIsTurenRed(true);
                        } else {
                          setIsTurenRed(false);
                        }
                        let newArr = newAddData.filter(
                          x => !(x.uid === info.file.uid && info.file.status === 'removed'),
                        );
                        // console.log('🚀 ~ file: index.js:144 ~ UploadModal ~ newArr:', newArr);
                        setNewAddData([...newArr]);
                      }
                    }
                  }}
                  beforeUpload={async (file, fileList) => {
                    function readFile(file) {
                      return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = function() {
                          const arrayBuffer = reader.result;
                          const headerBytes = new Uint8Array(arrayBuffer, 0, 8);
                          const headerInfoHex = Array.from(headerBytes)
                            .map(byte => byte.toString(16).padStart(2, '0'))
                            .join('')
                            .slice(0, 8);
                          console.log(
                            '🚀 ~ file: index.js:229 ~ returnnewPromise ~ headerInfoHex:',
                            headerInfoHex,
                            ['504b0304', '25504446'],
                          );
                          if (!['504b0304', '25504446'].includes(headerInfoHex)) {
                            resolve(false);
                          } else {
                            resolve(true);
                          }
                        };
                        reader.onerror = function() {
                          reject(reader.error);
                        };
                        reader.readAsArrayBuffer(file);
                      });
                    }
                    const typeAuth = await readFile(file);
                    if (
                      ![
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      ].includes(file.type)
                    ) {
                      message.error('仅支持doc、docx、pdf格式文件', 1);
                      return false;
                    }
                    if (!typeAuth) {
                      message.error('仅支持doc、docx、pdf格式文件', 1);
                      console.log(typeAuth, 2);
                      return false;
                    }
                    console.log(typeAuth, 3);
                    let arr = [];
                    fileList.forEach((item, index) => {
                      let reader = new FileReader(); //实例化文件读取对象
                      reader.readAsDataURL(item); //将文件读取为 DataURL,也就是base64编码
                      reader.onload = e => {
                        //文件读取成功完成时触发
                        let urlArr = e.target.result.split(',');
                        arr.push({
                          number: String(index),
                          uid: item.uid,
                          fileName: item.name,
                          data: urlArr[1],
                          // new: true,
                        });
                        if (arr.length === fileList.length) {
                          debounce(() => {
                            setNewAddData(p => {
                              // console.log([...p, ...arr]);
                              return [...p, ...arr];
                            });
                          }, 500);
                        }
                      };
                    });
                  }}
                  accept={['.doc', '.docx', '.pdf']}
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
      </Spin>
    </Modal>
  );
}
export default UploadModal;
