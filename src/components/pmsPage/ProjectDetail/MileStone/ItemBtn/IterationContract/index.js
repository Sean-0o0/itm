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
  Radio,
  Select,
  Tooltip,
} from 'antd';
import moment from 'moment';
import {
  FetchQueryGysInZbxx,
  InsertIteContract,
  QueryIteContractInfo,
  QueryIteContractList,
} from '../../../../../../services/pmsServices';
import config from '../../../../../../utils/config';
import axios from 'axios';
const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

//评估信息录入
export default Form.create()(function IterationContract(props) {
  const { form, dataProps = {}, funcProps = {} } = props;
  const { modalData = {} } = dataProps;
  const { setModalData, refresh } = funcProps;
  const { visible, type = 'ADD', xmid } = modalData;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [upldData, setUpldData] = useState([]); //附件上传数据
  const [gysData, setGysData] = useState([]); //供应商下拉数据
  const [oldData, setOldData] = useState({}); //修改时回显数据
  const [glqtkjhtData, setGlqtkjhtData] = useState([]); //关联其他框架合同下拉框数据

  useEffect(() => {
    if (visible) {
      if (type === 'UPDATE') getOldData();
      getGysData();
      getGlqtkjhtData();
    }
    return () => {};
  }, [visible, type]);

  //供应商下拉数据
  const getGysData = () => {
    FetchQueryGysInZbxx({
      paging: -1,
      sort: '',
      current: 1,
      pageSize: 10,
      total: -1,
    })
      .then(res => {
        if (res.success) {
          let rec = res.record;
          console.log('🚀 ~ file: index.js:47 ~ getGysData ~ rec:', rec);
          setGysData(rec);
        }
      })
      .catch(e => {
        message.error('供应商信息查询失败', 1);
      });
  };

  //获取关联其他框架合同下拉框数据
  const getGlqtkjhtData = () => {
    setIsSpinning(true);
    QueryIteContractList({ contractId: -1 })
      .then(res => {
        if (res?.success) {
          console.log('🚀 ~ QueryIteContractList ~ res', res, JSON.parse(res.result));
          setGlqtkjhtData(JSON.parse(res.result));
          //to do ...
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀关联其他框架合同下拉框数据', e);
        message.error('关联其他框架合同下拉框数据获取失败', 1);
        setIsSpinning(false);
      });
  };

  //获取迭代合同信息
  const getOldData = () => {
    setIsSpinning(true);
    QueryIteContractInfo({
      projectId: Number(xmid),
    })
      .then(res => {
        if (res?.success) {
          console.log('🚀 ~ QueryIteContractInfo ~ res', JSON.parse(res.result));
          const rec = JSON.parse(res.result)[0] || {};
          setOldData({
            ...rec,
          });
          const arr =
            rec.FJ?.map((x, i) => ({
              uid: Date.now() + '-' + i,
              name: x.fileName,
              status: 'done',
              url: x.url,
              base64: x.data,
            })) ?? [];
          setUpldData(arr);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀迭代合同信息', e);
        message.error('迭代合同信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  //提交数据
  const handleOk = () => {
    validateFields(async (err, values) => {
      if (!err) {
        setIsSpinning(true);
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
        const fileInfo = await convertFilesToBase64(upldData.map(x => x.originFileObj || x));
        let submitProps = {
          id: type === 'ADD' ? -1 : Number(oldData.ID),
          priceType: values.djlx,
          projectId: Number(xmid),
          unitPrice: values.rldj,
          signingDate: Number(values.qsrq.format('YYYYMMDD')),
          vendorId: Number(values.gys),
          fileInfo,
          operateType: type,
          relContract: Number(values.glqtkjht || -1),
        };
        console.log('🚀 ~ file: index.js:90 ~ handleOk ~ submitProps :', submitProps);
        InsertIteContract(submitProps)
          .then(res => {
            if (res?.success) {
              refresh();
              setIsSpinning(false);
              message.success('操作成功', 1);
              setModalData({ visible: false, data: {}, type: 'ADD' });
              resetFields();
            }
          })
          .catch(e => {
            console.error('🚀InsertIteContract', e);
            message.error('操作失败', 1);
            setIsSpinning(false);
          });
      }
    });
  };

  //取消
  const handleCancel = () => {
    setModalData(p => ({ ...p, visible: false, type: 'ADD' }));
    resetFields();
    setUpldData([]);
  };

  const getSelector = () => {
    return (
      <Col span={12}>
        <Form.Item label="供应商" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('gys', {
            initialValue: oldData.GYS,
            rules: [
              {
                required: true,
                message: '供应商不允许空值',
              },
            ],
          })(
            <Select placeholder="请选择" optionFilterProp="children" showSearch allowClear>
              {gysData.map(x => (
                <Select.Option key={x.id} value={x.id}>
                  {x.gysmc}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Col>
    );
  };

  const getDatePicker = () => {
    return (
      <Col span={12}>
        <Form.Item label="签署日期" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('qsrq', {
            initialValue: oldData.QSRQ ? moment(oldData.QSRQ) : null,
            rules: [
              {
                required: true,
                message: '签署日期不允许空值',
              },
            ],
          })(<DatePicker style={{ width: '100%' }} placeholder="请选择" allowClear />)}
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
      <Col span={12}>
        <Form.Item
          label={label}
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
          // required
          // help={isTurnRed ? label + '不允许空值' : ''}
          // validateStatus={isTurnRed ? 'error' : 'success'}
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

  //单选框
  const getRadio = () => {
    return (
      <Col span={12}>
        <Form.Item label="单价类型" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('djlx', {
            initialValue: Number(oldData.DJLX) || 2,
            rules: [
              {
                required: true,
                message: '单价类型不允许空值',
              },
            ],
          })(
            <Radio.Group>
              <Radio value={1}>人日</Radio>
              <Radio value={2}>人月</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
      </Col>
    );
  };

  //获取关联其他框架合同下拉框数据
  const getGlqtkjhtSelector = () => {
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
    const onChange = async (v, option) => {
      setIsSpinning(true);
      if (option !== undefined) {
        const obj = option.props.htdata || {};
        const fjObj = JSON.parse(obj.fj || '{}');
        const fjPromiseArr =
          fjObj.items?.map(x =>
            axios({
              method: 'POST',
              url: queryFileStream,
              responseType: 'blob',
              data: {
                objectName: 'TXMXX_DDXM_HTXX',
                columnName: 'FJ',
                id: obj.id,
                title: x[1],
                extr: x[0],
                type: '',
              },
            }),
          ) || [];
        // console.log('🚀 ~ file: index.js:404 ~ onChange ~ fjPromiseArr:', fjPromiseArr);
        const resArr = await Promise.all(fjPromiseArr);
        const fjArr = await convertBlobsToBase64(
          resArr.map(x => ({ name: JSON.parse(x?.config?.data || '{}').title, blob: x.data })),
        );
        console.log('🚀 ~ file: index.js:432 ~ onChange ~ fjArr:', fjArr);
        setUpldData(fjArr);
        setOldData(p => ({
          ...p,
          GYS: String(obj.gys),
          DJLX: obj.djlx,
          QSRQ: String(obj.qsrq),
          RLDJ: obj.rldj,
          GLDDHT: obj.id,
        }));
      }
      setIsSpinning(false);
    };
    return (
      <Col span={12}>
        <Form.Item label="关联其他框架合同" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('glqtkjht', {
            initialValue: oldData.GLDDHT ? Number(oldData.GLDDHT) : undefined,
            // rules: [
            //   {
            //     required: true,
            //     message: '关联其他框架合同不允许空值',
            //   },
            // ],
          })(
            <Select
              placeholder="请选择"
              onChange={onChange}
              showSearch
              allowClear
              optionFilterProp="optionfilter"
            >
              {glqtkjhtData.map(x => (
                <Select.Option optionfilter={x.xm} key={x.id} value={x.id} htdata={x}>
                  <Tooltip title={x.xm} placement="topLeft">
                    {x.xm}
                  </Tooltip>
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Col>
    );
  };

  const modalProps = {
    wrapClassName: 'editMessage-modify add-valuation-info-modal',
    width: 800,
    maskClosable: false,
    style: { top: 60 },
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
        <strong>迭代合同信息{type === 'ADD' ? '录入' : '修改'}</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box" style={{ paddingLeft: 24 }}>
          <Row>
            {getGlqtkjhtSelector()}
            {getDatePicker()}
          </Row>
          <Row>
            {getSelector()}
            {getRadio()}
          </Row>
          <Row>
            {getInputNumber({
              label: '人力单价(元)',
              dataIndex: 'rldj',
              initialValue: oldData.RLDJ,
              labelCol: 8,
              wrapperCol: 16,
              max: 99999999,
              rules: [
                {
                  required: true,
                  message: '人力单价不允许空值',
                },
              ],
            })}
            {getMultipleUpload({
              label: '附件',
              labelCol: 8,
              wrapperCol: 16,
              fileList: upldData,
              setFileList: setUpldData,
              isTurnRed: false,
              setIsTurnRed: () => {},
            })}
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
});
