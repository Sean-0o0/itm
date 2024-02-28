import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  message,
  Modal,
  Popconfirm,
  Spin,
  Select,
  Upload,
  Col,
  Icon,
  TreeSelect,
} from 'antd';
import config from '../../../../../utils/config';
import axios from 'axios';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;
import { EditDocTemplate, QueryDocType } from '../../../../../services/pmsServices';
import { setParentSelectableFalse } from '../../../../../utils/pmsPublicUtils';

export default Form.create()(function OprtModal(props) {
  const { visible, setVisible, form = {}, data = {} } = props;
  const { existingTypes = [], id, type, typeName, wdmb, operateType = 'ADD', refresh } = data;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [upldData, setUpldData] = useState([]); //文件数据
  const [isTurnRed, setIsTurnRed] = useState(false); //报红
  const [typeSlt, setTypeSlt] = useState([]); //文档类型下拉数据

  useEffect(() => {
    if (visible) {
      if (wdmb !== undefined) {
        setIsSpinning(true);
        handleFileStrParse(wdmb, {
          objectName: 'TWD_WDMB',
          columnName: 'WDMB',
          id,
        }).then(res => {
          setUpldData(res || []);
          if (operateType === 'ADD') {
            getDocType();
          } else {
            setTypeSlt([{ title: typeName, value: type }]);
            setIsSpinning(false);
          }
        });
      } else {
        if (operateType === 'ADD') {
          getDocType();
        } else {
          setTypeSlt([{ title: typeName, value: type }]);
          setIsSpinning(false);
        }
      }
    }
    return () => {};
  }, [visible, wdmb, id, operateType, type, typeName]);

  //处理附件数据
  const handleFileStrParse = async (fjStr = {}, { objectName, id, columnName }) => {
    function convertBlobsToBase64(fileArray) {
      return Promise.all(
        fileArray.map((file, index) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function() {
              const base64 = reader.result.split(',')[1];
              const fileName = file.name;
              resolve({
                uid: Date.now() + '-' + index,
                name: fileName,
                status: 'done',
                base64,
                blob: file.blob,
                url: '',
              });
            };
            reader.onerror = function(error) {
              reject(error);
            };
            reader.readAsDataURL(file.blob);
          });
        }),
      );
    }
    const fjObj = fjStr;
    const fjPromiseArr =
      fjObj.items?.map(x =>
        axios({
          method: 'POST',
          url: queryFileStream,
          responseType: 'blob',
          data: {
            objectName,
            columnName,
            id,
            title: x[1],
            extr: x[0],
            type: '',
          },
        }),
      ) || [];
    const resArr = await Promise.all(fjPromiseArr);
    return convertBlobsToBase64(
      resArr.map(x => ({ name: JSON.parse(x?.config?.data || '{}').title, blob: x.data })),
    );
  };

  //获取文档类型
  const getDocType = () => {
    setIsSpinning(true);
    QueryDocType({})
      .then(res => {
        if (res?.success) {
          //转树结构
          function toTreeData(list, label = 'title', value = 'value') {
            let map = {};
            let treeData = [];

            list.forEach(item => {
              map[item.ID] = item;
              item[value] = item.ID;
              item[label] = item.NAME;
              item.children = [];
            });

            // 递归遍历树，处理没有子节点的元素
            const traverse = node => {
              if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                  traverse(child);
                });
              } else {
                // 删除空的 children 数组
                delete node.children;
              }
            };

            list.forEach(item => {
              let parent = map[item.FID];
              if (!parent) {
                treeData.push(item);
              } else {
                parent.children.push(item);
                item.FID = parent.ID;
              }
            });

            // 处理没有子节点的元素
            treeData.forEach(node => {
              traverse(node);
            });

            return treeData;
          }
          let arr = JSON.parse(res.result).filter(x => !existingTypes.includes(Number(x.ID)));
          let finalArr = toTreeData(arr);
          finalArr.forEach(node => setParentSelectableFalse(node));
          setTypeSlt(finalArr);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀文档类型', e);
        message.error('文档类型获取失败', 1);
        setIsSpinning(false);
      });
  };

  //单选普通下拉框
  const getSingleSelector = () => {
    return (
      <Col span={24}>
        <Form.Item label="文件类型" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          {getFieldDecorator('wjlx', {
            initialValue: type,
            rules: [
              {
                required: true,
                message: '文件类型不允许空值',
              },
            ],
          })(
            <TreeSelect
              style={{ width: '100%' }}
              showSearch
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              dropdownClassName="newproject-treeselect"
              allowClear
              treeNodeFilterProp="title"
              showCheckedStrategy="SHOW_CHILD"
              treeData={typeSlt}
              disabled={operateType === 'UPDATE'}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  //多附件上传
  const getMultipleUpload = ({
    label,
    labelCol,
    wrapperCol,
    fileList = [],
    setFileList,
    isTurnRed,
    setIsTurnRed,
  }) => {
    const onUploadDownload = file => {
      if (file.url === undefined || file.url === '') {
        let reader = new FileReader();
        reader.readAsDataURL(file.originFileObj || file.blob);
        reader.onload = e => {
          var link = document.createElement('a');
          link.href = e.target.result;
          link.download = file.name;
          link.click();
          window.URL.revokeObjectURL(link.href);
        };
      } else {
        var link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    };
    const onUploadChange = info => {
      let list = [...info.fileList]; //每次改变后的数据列表
      if (list.length > 0) {
        list.forEach(item => {
          if (fileList.findIndex(x => x.uid === item.uid) === -1) {
            //原来没有，则为新数据，加进去
            setFileList([
              ...fileList,
              {
                ...item,
                uid: item.uid,
                name: item.name,
                status: item.status === 'uploading' ? 'done' : item.status,
              },
            ]);
          } else {
            //原来有的数据，判断是否已移除
            setFileList(fileList.filter(x => x.status !== 'removed'));
            setIsTurnRed(fileList.length === 0);
          }
        });
      } else {
        setFileList([]);
        setIsTurnRed(true);
      }
    };
    const onBeforeUpload = () => {};
    return (
      <Col span={24}>
        <Form.Item
          label={label}
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
          required
          help={isTurnRed ? label + '不允许空值' : ''}
          validateStatus={isTurnRed ? 'error' : 'success'}
        >
          <Upload
            action={'/api/projectManage/queryfileOnlyByupload'}
            onDownload={onUploadDownload}
            showUploadList={{
              showDownloadIcon: true,
              showRemoveIcon: true,
              showPreviewIcon: false,
            }}
            multiple={true}
            onChange={onUploadChange}
            beforeUpload={onBeforeUpload}
            accept={'*'}
            fileList={fileList}
          >
            <Button type="dashed">
              <Icon type="upload" />
              点击上传
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    );
  };

  //提交数据
  const onOk = () => {
    validateFields(async (err, values) => {
      if (upldData.length === 0) {
        setIsTurnRed(true);
      } else if (!err && !isTurnRed) {
        function convertFilesToBase64(fileArray) {
          return Promise.all(
            fileArray.map(file => {
              if (file.url !== undefined || file.url === '')
                //查询到的已有旧文件的情况
                return new Promise((resolve, reject) => {
                  resolve({ name: file.name, data: file.base64 });
                });
              return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = function() {
                  const base64 = reader.result.split(',')[1];
                  const fileName = file.name;
                  resolve({ name: fileName, data: base64 });
                };

                reader.onerror = function(error) {
                  reject(error);
                };

                reader.readAsDataURL(file);
              });
            }),
          );
        }
        setIsSpinning(true)
        // console.log(upldData);
        const file = await convertFilesToBase64(upldData.map(x => x.originFileObj || x));
        let submitProps = {
          id: operateType === 'ADD' ? -1 : id,
          type: values.wjlx,
          file: JSON.stringify(file),
          operateType,
        };
        console.log('🚀 ~ handleOk ~ submitProps :', submitProps);
        EditDocTemplate(submitProps)
          .then(res => {
            if (res?.success) {
              refresh({});
              message.success('操作成功', 1);
              setIsSpinning(false);
              onCancel();
            }
          })
          .catch(e => {
            console.error('🚀EditDocTemplate', e);
            message.error('操作失败', 1);
            setIsSpinning(false);
          });
      }
    });
  };

  //取消
  const onCancel = () => {
    resetFields();
    setUpldData([]);
    setIsTurnRed(false);
    setVisible(false);
  };

  //删除
  const handleDelete = () => {
    EditDocTemplate({
      id,
      type,
      file: '[]',
      operateType: 'DELETE',
    })
      .then(res => {
        if (res?.success) {
          refresh({});
          message.success('操作成功', 1);
          setIsSpinning(false);
          onCancel();
        }
      })
      .catch(e => {
        console.error('🚀InsertIteContract', e);
        message.error('操作失败', 1);
        setIsSpinning(false);
      });
  };

  //弹窗参数
  const modalProps = {
    wrapClassName: 'doc-template-oprt-modal',
    width: 580,
    maskClosable: false,
    style: { top: 60 },
    maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
    zIndex: 103,
    title: null,
    visible,
    onCancel,
    footer: (
      <div className="modal-footer">
        <Button loading={isSpinning} className="btn-default" onClick={onCancel}>
          取消
        </Button>
        {operateType === 'UPDATE' && (
          <Popconfirm title="确定删除吗？" onConfirm={handleDelete}>
            <Button loading={isSpinning} className="btn-primary" type="primary">
              删除模板
            </Button>
          </Popconfirm>
        )}
        <Button loading={isSpinning} className="btn-primary" type="primary" onClick={onOk}>
          保存
        </Button>
      </div>
    ),
  };

  return (
    <Modal {...modalProps}>
      <div className="body-title-box">
        <strong>{operateType === 'ADD' ? '上传' : '编辑'}模板</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          {getSingleSelector()}
          {getMultipleUpload({
            label: '模板',
            labelCol: 4,
            wrapperCol: 20,
            fileList: upldData,
            setFileList: setUpldData,
            isTurnRed,
            setIsTurnRed,
          })}
        </Form>
      </Spin>
    </Modal>
  );
});
