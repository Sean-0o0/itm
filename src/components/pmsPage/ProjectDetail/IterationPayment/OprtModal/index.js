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
  Tooltip,
} from 'antd';
import moment from 'moment';
import Decimal from 'decimal.js';
import {
  InsertEvaluateInfo,
  InsertProjectUpdateInfo,
  QueryEvaluateInfo,
} from '../../../../../services/pmsServices';
const { RangePicker } = DatePicker;
//评估信息录入
export default Form.create()(function OprtModal(props) {
  const { form, dataProps = {}, funcProps = {} } = props;
  const { xmid, modalData = {}, rldj, djlx } = dataProps;
  const { setModalData, getIterationPayment } = funcProps;
  const { visible, infoId = -1, type = 'ADD', paymentNum = 0 } = modalData;
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
    isTurnRed: false,
    open: false,
    flag: 0,
  });
  const [updateData, setUpdateData] = useState({
    rlcb: undefined,
    yhl: undefined,
    fkcs: 1,
  }); //修改回显
  const isNumberic = value => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };
  let ZCB =
    rldj &&
    parseFloat(
      Decimal(isNumberic(getFieldValue('rlcb')) ? getFieldValue('rlcb') : 0)
        .times(Decimal(100).minus(isNumberic(getFieldValue('yhl')) ? getFieldValue('yhl') : 0))
        .times(Decimal(rldj))
        .div(100)
        .toFixed(2),
    );

  useEffect(() => {
    if (visible && type === 'UPDATE') {
      getData();
    }
    return () => {};
  }, [visible, djlx, type]);

  //获取评估信息
  const getData = () => {
    setIsSpinning(true);
    QueryEvaluateInfo({
      infoId,
    })
      .then(res => {
        if (res?.success) {
          const obj = JSON.parse(res.result)[0] || {};
          const {
            RLCB,
            YHL,
            KSSJ = '',
            JSSJ = '',
            PGBG = [],
            PSJY = [],
            XQQD = [],
            CPSJG = [],
          } = obj;
          // console.log('🚀 ~ QueryEvaluateInfo ~ res', JSON.parse(res.result));
          setUpdateData({
            rlcb: RLCB,
            yhl: YHL,
          });
          setMonthRange(p => ({
            ...p,
            value: [moment(String(KSSJ)), moment(String(JSSJ))],
          }));
          const getFileArr = (arr = []) => {
            return (
              arr.map((x, i) => ({
                uid: Date.now() + '-' + i,
                name: x.fileName,
                status: 'done',
                url: x.url,
                base64: x.data,
              })) ?? []
            );
          };
          setUpldData(p => ({
            ...p,
            pgbg: getFileArr(PGBG), //评估报告
            psjy: getFileArr(PSJY), //评审纪要
            xqqd: getFileArr(XQQD), //需求清单
            cpsjg: getFileArr(CPSJG), //产品设计稿
          }));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀评估信息', e);
        message.error('评估信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  //提交数据
  const handleOk = () => {
    let haveError = false;
    if (monthRange.value.length === 0) {
      setMonthRange(p => ({ ...p, isTurnRed: true }));
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
    validateFields(async err => {
      if (haveError) {
        return;
      }
      if (!err) {
        function convertFilesToBase64(fileArray, type = '') {
          return Promise.all(
            fileArray.map(file => {
              if (file.url !== undefined)
                //查询到的已有旧文件的情况
                return new Promise((resolve, reject) => {
                  resolve({ name: file.name, data: file.base64, type });
                });
              return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = function() {
                  const base64 = reader.result.split(',')[1];
                  const fileName = file.name;
                  resolve({ name: fileName, data: base64, type });
                };

                reader.onerror = function(error) {
                  reject(error);
                };

                reader.readAsDataURL(file);
              });
            }),
          );
        }
        let pgbgArr = await convertFilesToBase64(
          upldData.pgbg?.map(x => x.originFileObj || x),
          '评估报告',
        );
        let psjyArr = await convertFilesToBase64(
          upldData.psjy?.map(x => x.originFileObj || x),
          '评审纪要',
        );
        let xqqdArr = await convertFilesToBase64(
          upldData.xqqd?.map(x => x.originFileObj || x),
          '需求清单',
        );
        let cpsjgArr = await convertFilesToBase64(
          upldData.cpsjg?.map(x => x.originFileObj || x),
          '产品设计稿',
        );
        const fileInfo = pgbgArr.concat(psjyArr, xqqdArr, cpsjgArr);
        let submitProps = {
          startDate: Number((monthRange.value[0] || moment()).format('YYYYMM')),
          endDate: Number((monthRange.value[1] || moment()).format('YYYYMM')),
          fileInfo,
          infoId: type === 'ADD' ? -1 : infoId,
          laborCost: String(getFieldValue('rlcb')),
          operateType: type,
          planId: type === 'ADD' ? paymentNum + 1 : paymentNum, //传第几次付款，没数据传1
          preferential: String(getFieldValue('yhl')),
          projectId: Number(xmid),
          totalCost: ZCB,
          unitPrice: String(rldj),
        };
        // console.log('🚀 ~ file: index.js:90 ~ handleOk ~ submitProps :', submitProps);
        setIsSpinning(true);
        InsertEvaluateInfo(submitProps)
          .then(res => {
            if (res?.success) {
              getIterationPayment();
              message.success('操作成功', 1);
              setIsSpinning(false);
              handleCancel();
            }
          })
          .catch(e => {
            console.error('🚀InsertProjectUpdateInfo', e);
            message.error('操作失败', 1);
            setIsSpinning(false);
          });
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
    setMonthRange({ value: [], isTurnRed: false, open: false });
    setUpdateData({});
  };

  const getDatePicker = () => {
    return (
      <Col span={12}>
        <Form.Item
          label="评估周期"
          required
          help={monthRange.isTurnRed ? '评估周期不能为空' : ''}
          validateStatus={monthRange.isTurnRed ? 'error' : 'success'}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <RangePicker
            style={{ minWidth: '100%' }}
            mode={djlx === '1' ? ['date', 'date'] : ['month', 'month']}
            value={monthRange.value}
            placeholder="请选择"
            format={djlx === '1' ? 'YYYY-MM-DD' : 'YYYY-MM'}
            allowClear
            open={monthRange.open}
            onOpenChange={v => setMonthRange(p => ({ ...p, open: v, flag: 0 }))}
            onChange={dates => {
              console.log('🚀 ~ file: index.js:268 ~ getDatePicker ~ dates:', dates);
              setMonthRange(p => ({
                ...p,
                value: dates,
                isTurnRed: dates.length === 0,
                // open: p.flag + 1 < 2,
              }));
            }}
            onPanelChange={dates => {
              setMonthRange(p => ({
                ...p,
                value: dates,
                isTurnRed: dates.length === 0,
                flag: p.flag + 1,
                open: p.flag + 1 < 2,
              }));
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
  const getInputNumber = ({ label, labelCol, wrapperCol, dataIndex, initialValue, rules, max }) => {
    return (
      <Col span={12}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules,
          })(
            <InputNumber
              style={{ width: '100%' }}
              max={max}
              min={0}
              step={0.01}
              precision={2}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              // parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
    isTurnRed,
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
        <strong>评估信息{type === 'ADD' ? '录入' : '修改'}</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          <Row>
            {getDatePicker()}
            {getInputNumber({
              label: `人力成本(人${djlx === '1' ? '日' : '月'})`,
              dataIndex: 'rlcb',
              initialValue: updateData.rlcb,
              labelCol: 8,
              wrapperCol: 16,
              max: 99999999.99,
              rules: [
                {
                  required: true,
                  message: '人力成本不允许空值',
                },
              ],
            })}
          </Row>
          <Row>
            {getInputDisabled(`人力单价(元/人${djlx === '1' ? '日' : '月'})`, rldj, 8, 16)}
            {getInputNumber({
              label: '优惠率(%)',
              dataIndex: 'yhl',
              initialValue: updateData.yhl,
              labelCol: 8,
              wrapperCol: 16,
              max: 100,
              rules: [
                {
                  required: true,
                  message: '优惠率不允许空值',
                },
              ],
            })}
          </Row>
          <Row>
            {getInputDisabled(
              <span>
                总成本(元) &nbsp;
                <Tooltip
                  title="总成本 = 人力成本 * 人力单价 * (1 - 优惠率)"
                  overlayStyle={{ maxWidth: 300 }}
                >
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>,
              ZCB,
              8,
              16,
            )}
          </Row>
          <Row>
            {getMultipleUpload({
              label: '评估报告',
              labelCol: 8,
              wrapperCol: 16,
              fileList: upldData.pgbg,
              setFileList: v => setUpldData(p => ({ ...p, pgbg: v })),
              isTurnRed: upldData.pgbgRed,
              setIsTurnRed: v => setUpldData(p => ({ ...p, pgbgRed: v })),
            })}
            {getMultipleUpload({
              label: '评审纪要',
              labelCol: 8,
              wrapperCol: 16,
              fileList: upldData.psjy,
              setFileList: v => setUpldData(p => ({ ...p, psjy: v })),
              isTurnRed: upldData.psjyRed,
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
              isTurnRed: upldData.xqqdRed,
              setIsTurnRed: v => setUpldData(p => ({ ...p, xqqdRed: v })),
            })}
            {getMultipleUpload({
              label: '产品设计稿',
              labelCol: 8,
              wrapperCol: 16,
              fileList: upldData.cpsjg,
              setFileList: v => setUpldData(p => ({ ...p, cpsjg: v })),
              isTurnRed: upldData.cpsjgRed,
              setIsTurnRed: v => setUpldData(p => ({ ...p, cpsjgRed: v })),
            })}
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});
