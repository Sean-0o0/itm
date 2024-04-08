import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Icon, message, Modal, Spin, Upload } from 'antd';
import moment from 'moment';
import { connect } from 'dva';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(
  Form.create()(function UploadModal(props) {
    const {
      visible,
      setVisible,
      data = {},
      setTableData,
      tableData = [],
      editData = [],
      setEditData,
    } = props;
    const [fileList, setFileList] = useState([]); //附件数据

    useEffect(() => {
      if (visible) {
        let obj = { ...data };
        let arr = [...(obj.fileList || [])];
        setFileList(arr);
        console.log('上传数据初始化', arr);
      }
      return () => {};
    }, [visible, data]);

    //提交数据
    const onOk = () => {
      const tableDataArr = [...tableData];
      const index = tableDataArr.findIndex(item => data.ID === item.ID);
      if (index !== -1) {
        tableDataArr.splice(index, 1, {
          ...tableDataArr[index],
          fileList: [...fileList],
        });
      }
      const editDataArr = [...editData];
      const index2 = editDataArr.findIndex(item => data.ID === item.ID);
      if (index2 !== -1) {
        editDataArr.splice(index2, 1, {
          ...editDataArr[index2],
          fileList: [...fileList],
        });
      } else {
        editDataArr.push({
          ...tableDataArr[index],
          fileList: [...fileList],
        });
      }
      setTableData(tableDataArr);
      setEditData(editDataArr);
      onCancel();
    };

    //取消
    const onCancel = () => {
      setFileList([]);
      setVisible(false);
    };

    //多附件上传
    const getMultipleUpload = ({
      label,
      labelCol,
      wrapperCol,
      fileList = [],
      setFileList,
      isTurnRed = false,
      setIsTurnRed = () => {},
      componentProps = {},
    }) => {
      const onUploadDownload = file => {
        if (!file.url) {
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
        <Form.Item
          label={label}
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
          // required
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
            {...componentProps}
          >
            <Button type="dashed">
              <Icon type="upload" />
              点击上传
            </Button>
          </Upload>
        </Form.Item>
      );
    };

    //弹窗参数
    const modalProps = {
      wrapClassName: 'contract-info-mod-default-modal',
      width: 650, // todo
      maskClosable: false,
      style: { top: 60 },
      maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
      zIndex: 103,
      title: null,
      visible,
      onCancel,
      onOk,
    };

    return (
      <Modal {...modalProps}>
        <div className="body-title-box">
          <strong>合同上传</strong>
        </div>
        <Form className="content-box">
          {getMultipleUpload({
            label: '合同',
            labelCol: 4,
            wrapperCol: 20,
            fileList,
            setFileList,
          })}
        </Form>
      </Modal>
    );
  }),
);
