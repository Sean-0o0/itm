import React, { useEffect, useState } from 'react';
import { Form, Upload, Modal, Icon, Button, Spin, message } from 'antd';
import { CheckInvoice } from '../../../../../../../services/pmsServices';
const UploadReceipt = props => {
  //弹窗全屏
  const [isModalFullScreen, setIsModalFullScreen] = useState(false);
  const [receiptFileUrl, setReceiptFileUrl] = useState([]);
  const [receiptFileName, setReceiptFileName] = useState([]);
  const [receiptFileList, setReceiptFileList] = useState([]);
  const [receiptIsTurnRed, setReceiptIsTurnRed] = useState(false);
  const [receiptIsError, setReceiptIsError] = useState(false);
  //加载状态
  const [isSpinning, setIsSpinning] = useState(false);
  const {
    visible,
    setVisible,
    form,
    userykbid,
    setSelectReceiptVisible,
    receiptData,
    setReceiptData,
  } = props;
  //防抖定时器
  let timer = null;

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = () => {
    if (receiptFileList.length === 0) {
      setReceiptIsTurnRed(true);
    } else if (receiptIsError) {
      message.error('存在不合法的发票', 1);
    } else {
      setVisible(false);
      setSelectReceiptVisible(true);
      setReceiptIsError(false);
      // console.log(
      //   '🚀 ~ file: index.js ~ line 42 ~ handleSubmit ~ receiptData',
      //   receiptData,
      // );
    }
  };
  const handleClose = () => {
    setVisible(false);
    setReceiptIsTurnRed(false);
    setReceiptIsError(false);
    setReceiptFileList([]);
    setReceiptFileName([]);
    setReceiptFileUrl([]);
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
      wrapClassName="editMessage-modify"
      centered
      width={'33vw'}
      maskClosable={false}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      zIndex={103}
      cancelText={'关闭'}
      bodyStyle={{
        padding: '0',
        overflow: 'hidden',
      }}
      title={null}
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
    >
      <div className="body-title-box">
        <strong>导入电子发票</strong>
      </div>
      <Spin spinning={isSpinning} tip="查验发票中">
        <Form.Item
          style={{ margin: '4.464rem 0' }}
          label="电子发票"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          required
          help={receiptIsTurnRed ? '电子发票不允许空值' : ''}
          validateStatus={receiptIsTurnRed ? 'error' : 'success'}
        >
          <Upload
            action={'/api/projectManage/queryfileOnlyByupload'}
            multiple={true}
            showUploadList={{
              showRemoveIcon: true,
              showPreviewIcon: true,
            }}
            onChange={info => {
              let list = [...info.fileList];
              setReceiptFileList(p => [...list]);
              if (list.length === 0) {
                setReceiptIsTurnRed(true);
              } else {
                setReceiptIsTurnRed(false);
              }
            }}
            beforeUpload={(file, fileList) => {
              let nameArr = [];
              let urlArr = [];
              setIsSpinning(true);
              fileList?.forEach((item, index) => {
                let reader = new FileReader(); //实例化文件读取对象
                reader.readAsDataURL(item); //将文件读取为 DataURL,也就是base64编码
                reader.onload = e => {
                  //文件读取成功完成时触发
                  let arr = e.target.result.split(',');
                  urlArr.push(arr[1]);
                  nameArr.push(item.name);
                  if (index === fileList.length - 1) {
                    const fn = () => {
                      CheckInvoice({
                        fileName: nameArr,
                        receiptData: urlArr,
                        staffId: userykbid,
                      }).then(res => {
                        let unCheckArr = [];
                        let receiptDataArr= [...receiptData, ...res.result];
                        receiptDataArr?.forEach(x=>{
                          x.base64 = arr[1];
                        })
                        setReceiptData(p => [...receiptDataArr]);
                        res.result?.forEach((x, i) => {
                          if (x?.isCheck === 'false') {
                            unCheckArr.push(i);
                          }
                        });
                        let list = [...fileList];
                        list.forEach((x, i) => {
                          if (unCheckArr.includes(i)) {
                            x.status = 'error';
                            x.response = res?.result[i]?.message;
                            setReceiptIsError(true);
                          }
                        });
                        setReceiptFileList(p => [...receiptFileList, ...list]);
                        setIsSpinning(false);
                      });
                    };
                    debounce(fn, 500);
                  }
                };
              });
              return false;
            }}
            accept={'.ofd,.pdf,.jpg,.jpeg,.png'}
            fileList={[...receiptFileList]}
          >
            <Button type="dashed">
              <Icon type="upload" />
              点击上传
            </Button>
            <div
              style={{ marginTop: '1.1904rem' }}
              onClick={e => {
                e.stopPropagation();
              }}
            >
              （仅支持jpg、jpeg、png、pdf、ofd格式文件）
            </div>
          </Upload>
        </Form.Item>
      </Spin>
    </Modal>
  );
};
export default Form.create()(UploadReceipt);
