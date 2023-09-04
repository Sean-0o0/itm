import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Form,
  message,
  Modal,
  Spin,
  DatePicker,
  InputNumber,
  Upload,
  Icon,
  Row,
  Col,
} from 'antd';
import moment from 'moment';
import { InsertProjectUpdateInfo } from '../../../../../services/pmsServices';
const { RangePicker } = DatePicker;
//评估信息录入
export default Form.create()(function OprtModal(props) {
  const { xmid, modalData, setModalData, getIterationCtn, form } = props;
  const { visible, data = {} } = modalData;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [upldData, setUpldData] = useState({
    pgbg: [], //评估报告
    psjy: [], //评审纪要
    xqqd: [], //需求清单
    cpsjg: [], //产品设计稿
    pgbgRed: false,
    psjyRed: false,
    xqqdRed: false,
    cpsjgRed: false,
  }); //上传数据
  const [monthRange, setMonthRange] = useState({
    value: [],
    isTrunRed: false,
    mode: ['month', 'month'],
  }); //example

  useEffect(() => {
    return () => {};
  }, []);

  //提交数据
  const handleOk = () => {
    let haveError = false;
    if (monthRange.value.length === 0) {
      setMonthRange(p => ({ ...p, isTrunRed: true }));
      haveError = true;
    }
    if (upldData.pgbg.length === 0) {
      setUpldData(p => ({ ...p, pgbgRed: true }));
      haveError = true;
    }
    if (upldData.psjy.length === 0) {
      setUpldData(p => ({ ...p, psjyRed: true }));
      haveError = true;
    }
    if (upldData.xqqd.length === 0) {
      setUpldData(p => ({ ...p, xqqdRed: true }));
      haveError = true;
    }
    if (upldData.cpsjg.length === 0) {
      setUpldData(p => ({ ...p, cpsjgRed: true }));
      haveError = true;
    }
    validateFields(err => {
      if (haveError) {
        return;
      }
      if (!err) {
        // setIsSpinning(true);
        // InsertProjectUpdateInfo({
        //   date: Number(getFieldValue('sjrq').format('YYYYMMDD')),
        //   frequency: type === 'ADD' ? -1 : data.times,
        //   id: type === 'ADD' ? -1 : data.key,
        //   info: getFieldValue('sjnr'),
        //   operateType: type,
        //   projectId: Number(xmid),
        // })
        //   .then(res => {
        //     if (res?.success) {
        //       message.success('操作成功', 1);
        //       getIterationCtn();
        //       setIsSpinning(false);
        //       setModalData({ visible: false, data: {}, type: 'ADD' });
        //       resetFields();
        //     }
        //   })
        //   .catch(e => {
        //     console.error('🚀InsertProjectUpdateInfo', e);
        //     message.error('操作失败', 1);
        //     setIsSpinning(false);
        //   });
      }
    });
  };

  //取消
  const handleCancel = () => {
    setModalData({ visible: false, data: {}, type: 'ADD' });
    resetFields();
    setUpldData({
      pgbg: [], //评估报告
      psjy: [], //评审纪要
      xqqd: [], //需求清单
      cpsjg: [], //产品设计稿
      pgbgRed: false,
      psjyRed: false,
      xqqdRed: false,
      cpsjgRed: false,
    });
    setMonthRange({ value: [], isTrunRed: false, mode: ['month', 'month'] });
  };

  const getDatePicker = () => {
    return (
      <Col span={12}>
        <Form.Item
          label="评估周期"
          required
          help={monthRange.isTrunRed ? '评估周期不能为空' : ''}
          validateStatus={monthRange.isTrunRed ? 'error' : 'success'}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <RangePicker
            style={{ minWidth: '100%' }}
            mode={monthRange.mode}
            value={monthRange.value}
            placeholder="请选择"
            format="YYYY-MM"
            allowClear
            onPanelChange={dates => {
              setMonthRange(p => ({ ...p, value: dates, isTrunRed: dates.length === 0 }));
            }}
          />
        </Form.Item>
      </Col>
    );
  };

  //输入框 - 灰
  const getInputDisabled = (label, value, labelCol, wrapperCol) => {
    return (
      <Col span={12}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          <div
            style={{
              width: '100%',
              height: '32px',
              backgroundColor: '#F5F5F5',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              marginTop: '5px',
              lineHeight: '32px',
              paddingLeft: '10px',
              fontSize: '14px',
            }}
          >
            {value}
          </div>
        </Form.Item>
      </Col>
    );
  };

  //输入框
  const getInputNumber = ({
    label,
    labelCol,
    wrapperCol,
    dataIndex,
    initialValue,
    rules,
    maxLength,
  }) => {
    maxLength = maxLength || 150;
    return (
      <Col span={12}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules,
          })(
            <InputNumber
              style={{ width: '100%' }}
              max={99999999999.99}
              min={0}
              step={0.01}
              precision={2}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  const getMultipleUpload = ({
    label,
    labelCol,
    wrapperCol,
    fileList = [],
    setFileList,
    isTrunRed,
    setIsTurnRed,
  }) => {
    const onUploadDownload = file => {
      if (!file.url) {
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
      <Col span={12}>
        <Form.Item
          label={label}
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
          required
          help={isTrunRed ? label + '不允许空值' : ''}
          validateStatus={isTrunRed ? 'error' : 'success'}
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
    );
  };

  const modalProps = {
    wrapClassName: 'editMessage-modify add-valuation-info-modal',
    width: 900,
    maskClosable: false,
    style: { top: 10 },
    maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
    zIndex: 103,
    title: null,
    visible: visible,
    destroyOnClose: true,
    onCancel: handleCancel,
    footer: (
      <div className="modal-footer">
        <Button className="btn-default" onClick={handleCancel}>
          取消
        </Button>
        <Button loading={isSpinning} className="btn-primary" type="primary" onClick={handleOk}>
          保存
        </Button>
      </div>
    ),
  };

  return (
    <Modal {...modalProps}>
      <div className="body-title-box">
        <strong>评估信息录入</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          <Row>
            {getDatePicker()}
            {getInputNumber({
              label: '人力成本(人月)',
              dataIndex: 'rlcb',
              initialValue: undefined,
              labelCol: 8,
              wrapperCol: 16,
              maxLength: 99999999,
              rules: [
                {
                  required: true,
                  message: '人力成本不允许空值',
                },
              ],
            })}
          </Row>
          <Row>
            {getInputDisabled('人力单价(元/人月)', 25000, 8, 16)}
            {getInputNumber({
              label: '优惠率(%)',
              dataIndex: 'yhl',
              initialValue: undefined,
              labelCol: 8,
              wrapperCol: 16,
              maxLength: 100,
              rules: [
                {
                  required: true,
                  message: '优惠率不允许空值',
                },
              ],
            })}
          </Row>
          <Row>{getInputDisabled('总成本(元)', 25000, 8, 16)}</Row>
          <Row>
            {getMultipleUpload({
              label: '评估报告',
              labelCol: 8,
              wrapperCol: 16,
              fileList: upldData.pgbg,
              setFileList: v => setUpldData(p => ({ ...p, pgbg: v })),
              isTrunRed: upldData.pgbgRed,
              setIsTurnRed: v => setUpldData(p => ({ ...p, pgbgRed: v })),
            })}
            {getMultipleUpload({
              label: '评审纪要',
              labelCol: 8,
              wrapperCol: 16,
              fileList: upldData.psjy,
              setFileList: v => setUpldData(p => ({ ...p, psjy: v })),
              isTrunRed: upldData.psjyRed,
              setIsTurnRed: v => setUpldData(p => ({ ...p, psjyRed: v })),
            })}
          </Row>
          <Row>
            {getMultipleUpload({
              label: '需求清单',
              labelCol: 8,
              wrapperCol: 16,
              fileList: upldData.xqqd,
              setFileList: v => setUpldData(p => ({ ...p, xqqd: v })),
              isTrunRed: upldData.xqqdRed,
              setIsTurnRed: v => setUpldData(p => ({ ...p, xqqdRed: v })),
            })}
            {getMultipleUpload({
              label: '产品设计稿',
              labelCol: 8,
              wrapperCol: 16,
              fileList: upldData.cpsjg,
              setFileList: v => setUpldData(p => ({ ...p, cpsjg: v })),
              isTrunRed: upldData.cpsjgRed,
              setIsTurnRed: v => setUpldData(p => ({ ...p, cpsjgRed: v })),
            })}
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});
