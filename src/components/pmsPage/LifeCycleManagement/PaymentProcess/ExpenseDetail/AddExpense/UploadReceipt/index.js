import React, { useEffect, useState, useMemo } from 'react';
import { Form, Upload, Modal, Icon, Button, Spin, message } from 'antd';
import { CheckInvoice } from '../../../../../../../services/pmsServices';
const UploadReceipt = props => {
  const [receiptFileUrl, setReceiptFileUrl] = useState([]);
  const [receiptFileName, setReceiptFileName] = useState([]);
  const [receiptFileList, setReceiptFileList] = useState([]);
  const [receiptIsTurnRed, setReceiptIsTurnRed] = useState(false);
  const [receiptIsError, setReceiptIsError] = useState(0); //数目
  const [receiptNew, setReceiptNew] = useState([]); //发票新增的数据
  const [receiptNew2, setReceiptNew2] = useState([]); //发票新增的数据
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
  useEffect(() => {
    setReceiptNew2(p => [...receiptNew2, ...receiptNew]);
    console.log('🚀 ~ file: index.js ~ line 33 ~ useEffect ~ [...receiptNew2, ...receiptNew]', [
      ...receiptNew2,
      ...receiptNew,
    ]);
    return () => {};
  }, [receiptNew]);

  const handleSubmit = () => {
    if (receiptFileList.length === 0) {
      setReceiptIsTurnRed(true);
    } else if (isSpinning) {
      message.info('发票查验中，请稍等', 1);
      return;
    } else if (receiptIsError > 0) {
      message.error('存在不合法的发票', 1);
    } else {
      setVisible(false);
      setSelectReceiptVisible(true);
      setReceiptIsError(0);
      setReceiptFileList([]);
      setReceiptFileName([]);
      setReceiptFileUrl([]);
      setReceiptData(p => [...receiptNew2]);
    }
  };
  const handleClose = () => {
    if (isSpinning) {
      message.info('发票查验中，请稍等', 1);
      return;
    }
    setVisible(false);
    setReceiptIsTurnRed(false);
    setReceiptIsError(0);
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
      width={'560px'}
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
              let count = 0;
              receiptFileList?.forEach(x => {
                if (x.status === 'error') {
                  count++;
                }
              });
              setReceiptIsError(count);
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
                        invoiceData: urlArr,
                        staffId: userykbid,
                      }).then(res => {
                        let unCheckArr = [];
                        let checkArr = [];
                        res.result?.forEach((x, i) => {
                          if (x?.isCheck === 'false') {
                            unCheckArr.push(i);
                          } else {
                            checkArr.push(x);
                          }
                        });
                        let receiptDataArr = [...checkArr];
                        receiptDataArr?.forEach(x => {
                          x.base64 = e.target.result;
                          x.source = '电子发票文件';
                          x.checked = false;
                          x.loading = false;
                          x.isHover = false;
                        });
                        // console.log(
                        //   '🚀 ~ file: index.js ~ line 150 ~ fn ~ receiptDataArr',
                        //   receiptDataArr,
                        // );
                        setReceiptNew(p => [...receiptDataArr]);
                        let list = [...fileList];
                        list.forEach((x, i) => {
                          if (unCheckArr.includes(i)) {
                            x.status = 'error';
                            x.response = res?.result[i]?.message;
                          }
                        });
                        setReceiptIsError(unCheckArr.length);
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
