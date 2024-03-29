import React, { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Radio,
  Spin,
  Row,
  InputNumber,
  Input,
  Upload,
  Icon,
  Select,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Edge from '@antv/g6/lib/item/edge';
import TableBox from './TableBox';
import {
  FetchQueryGysInZbxx,
  OperateWinningBidderInfo,
  QueryWinningBidderInfo,
} from '../../../../../../services/pmsServices';
import InfoOprtModal from '../../../../SupplierDetail/TopConsole/InfoOprtModal';
import { convertFilesToBase64, handleFileStrParse } from '../../../../../../utils/pmsPublicUtils';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(
  Form.create()(function BidInfoMod(props) {
    const {
      visible,
      setVisible,
      type = 'ADD',
      xmid = -1,
      form = {},
      refresh = () => {},
      dictionary = {},
      userBasicInfo = {},
      roleData = {},
    } = props;
    const {
      ZBXXZBQK = [], //中标情况
      GYSLX = [], //供应商类型
    } = dictionary;
    const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
    const [isSpinning, setIsSpinning] = useState(false); //加载状态
    const [fileList, setFileList] = useState([]); //上传文件
    const [isTurnRed, setIsTurnRed] = useState(false); //文件是否为空 报红
    const [gysSlt, setGysSlt] = useState([]); //供应商下拉框数据
    const [addGysModalVisible, setAddGysModalVisible] = useState(false); //新增供应商弹窗显隐
    const [updateData, setUpdateData] = useState({}); //修改时回显数据
    const [tableData, setTableData] = useState({
      qttbgys: [],
      rwgys: [],
      wrwgys: [],
    }); //表格数据
    const [editData, setEditData] = useState({
      qttbgys: [],
      rwgys: [],
      wrwgys: [],
    }); //编辑的数据-似乎没用到
    const labelCol = 8;
    const wrapperCol = 16;

    useEffect(() => {
      if (visible) {
        fetchQueryGysInZbxx(); //todo
        if (type === 'UPDATE' && xmid !== -1) {
          getBidInfo(Number(xmid));
        }
      }
      return () => {};
    }, [visible, type, xmid]);

    // 查询供应商下拉列表
    const fetchQueryGysInZbxx = () => {
      FetchQueryGysInZbxx({
        paging: -1,
        sort: '',
        current: 1,
        pageSize: 20,
        total: -1,
      })
        .then(res => {
          if (res.success) {
            let rec = res.record;
            setGysSlt(rec);
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('供应商信息查询失败', e);
          message.error('供应商信息查询失败', 1);
          setIsSpinning(false);
        });
    };

    //获取中标信息
    const getBidInfo = projectID => {
      setIsSpinning(true);
      QueryWinningBidderInfo({
        projectID,
      })
        .then(async res => {
          if (res?.success) {
            const data = JSON.parse(res.result)[0] || {};
            console.log('🚀 ~ queryWinningBidderInfo ~ res', data);
            setUpdateData(data);
            const file = await handleFileStrParse(data.report, {
              objectName: 'TXMXX_ZBXX',
              columnName: 'PBBG',
              id: data.id,
            });
            setFileList(file);
            console.log('🚀 ~ getBidInfo ~ file:', file);
            let qttbgys = [];
            let rwgys = [];
            let wrwgys = [];
            const UUID = new Date().getTime();
            if (data.state === '2') {
              qttbgys = data.otherVendor.map(x => ({ ...x, ID: x.id, ['GYS' + x.id]: x.vendorId }));
            }
            if (data.state === '3') {
              rwgys = (data.shortlistedVendor?.split(',') || []).map(x => ({
                ...x,
                ID: UUID,
                ['GYS' + UUID]: x,
              }));
              wrwgys = (data.notShortlistedVendor?.split(',') || []).map(x => ({
                ...x,
                ID: UUID,
                ['GYS' + UUID]: x,
              }));
            }
            setTableData({
              qttbgys,
              rwgys,
              wrwgys,
            });
            //to do ...
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('🚀中标信息', e);
          message.error('中标信息获取失败', 1);
          setIsSpinning(false);
        });
    };

    //简单常用表单组件
    const COMPONENT = {
      //输入框 - 数值型
      getInputNumber: ({
        label,
        labelCol,
        wrapperCol,
        dataIndex,
        initialValue,
        rules = [
          {
            required: true,
            message: label + '不允许空值',
          },
        ],
        max = 999999999,
        componentProps = {},
      }) => {
        return (
          <Col span={12}>
            <Form.Item
              label={label}
              labelCol={{ span: labelCol }}
              wrapperCol={{ span: wrapperCol }}
            >
              {getFieldDecorator(dataIndex, {
                initialValue,
                rules,
              })(
                <InputNumber
                  placeholder={'请输入' + label}
                  style={{ width: '100%' }}
                  max={max}
                  min={0}
                  step={0.01}
                  precision={2}
                  {...componentProps}
                />,
              )}
            </Form.Item>
          </Col>
        );
      },
      //单选框
      getRadio: ({
        label,
        dataIndex,
        initialValue,
        radioArr = [{ title: 'xx', value: 1 }],
        labelCol,
        wrapperCol,
        valueField,
        titleField,
        rules = [
          {
            required: true,
            message: label + '不允许空值',
          },
        ],
      }) => {
        return (
          <Col span={24}>
            <Form.Item
              label={label}
              labelCol={{ span: labelCol }}
              wrapperCol={{ span: wrapperCol }}
            >
              {getFieldDecorator(dataIndex, {
                initialValue,
                rules,
              })(
                <Radio.Group>
                  {radioArr.map(x => (
                    <Radio key={x[valueField]} value={x[valueField]}>
                      {x[titleField]}
                    </Radio>
                  ))}
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
        );
      },
      //多附件上传
      getMultipleUpload: ({
        label,
        labelCol,
        wrapperCol,
        fileList = [],
        setFileList,
        isTurnRed,
        setIsTurnRed,
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
                {...componentProps}
              >
                <Button type="dashed">
                  <Icon type="upload" />
                  点击上传
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        );
      },
      //文本域
      getTextArea: ({
        label,
        dataIndex,
        initialValue,
        labelCol,
        wrapperCol,
        maxLength,
        rules = [
          {
            required: true,
            message: label + '不允许空值',
          },
        ],
        componentProps = {},
      }) => {
        return (
          <Col span={24}>
            <Form.Item
              label={label}
              labelCol={{ span: labelCol }}
              wrapperCol={{ span: wrapperCol }}
            >
              {getFieldDecorator(dataIndex, {
                initialValue,
                rules,
              })(
                <Input.TextArea
                  placeholder={'请输入' + label}
                  maxLength={maxLength}
                  autoSize={{ maxRows: 6, minRows: 3 }}
                  allowClear
                  {...componentProps}
                ></Input.TextArea>,
              )}
            </Form.Item>
          </Col>
        );
      },
    };
    const { getInputNumber, getRadio, getMultipleUpload, getTextArea } = COMPONENT;

    //供应商下拉框
    const getGysSelector = () => {
      return (
        <Col span={12}>
          <Form.Item
            label="中标供应商"
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
          >
            {getFieldDecorator('zbgys', {
              initialValue: updateData.vendorId,
              rules: [
                {
                  required: true,
                  message: '中标供应商不允许空值',
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                placeholder={'请选择中标供应商'}
                showSearch
                allowClear
                className="gys-selector"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {gysSlt.map(x => (
                  <Select.Option key={x.id} value={x.id}>
                    {x.gysmc}
                  </Select.Option>
                ))}
              </Select>,
            )}
            <div
              style={{
                height: '20px',
                width: '1px',
                backgroundColor: '#c7c7c7',
                marginTop: '0px',
                cursor: 'pointer',
                position: 'absolute',
                top: '0',
                right: '34px',
              }}
            ></div>
            <i
              className="iconfont circle-add"
              onClick={() => setAddGysModalVisible(true)}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: '-10px',
                right: '8px',
                color: '#c7c7c7',
                fontSize: '20px',
              }}
            />
          </Form.Item>
        </Col>
      );
    };

    //提交数据
    const onOk = () => {
      validateFields(async (err, values) => {
        let judgeCondition = fileList.length === 0;
        if (values.zbqk === '2') {
          judgeCondition = tableData.qttbgys.length === 0 || fileList.length === 0;
        } else if (values.zbqk === '3') {
          judgeCondition =
            tableData.rwgys.length === 0 || tableData.wrwgys.length === 0 || fileList.length === 0;
        }
        if (judgeCondition) {
          fileList.length === 0 && setIsTurnRed(true);
          values.zbqk === '2' &&
            tableData.qttbgys.length === 0 &&
            message.error('其他投标供应商不允许空值', 2);
          values.zbqk === '3' &&
            tableData.rwgys.length === 0 &&
            message.error('入围供应商不允许空值', 2);
          values.zbqk === '3' &&
            tableData.wrwgys.length === 0 &&
            message.error('未入围供应商不允许空值', 2);
          return;
        }
        if (!err) {
          setIsSpinning(true);
          const file = await convertFilesToBase64(
            fileList.map(x => x.originFileObj || x),
            '评标报告',
          );
          let otherVendors = undefined;
          let otherVendorCount = undefined;
          let shortlistedVendor = undefined;
          let notShortlistedVendor = undefined;
          if (values.zbqk === '2') {
            let arr = tableData.qttbgys.map(x => ({ GYSID: String(x['GYS' + x.ID]) }));
            otherVendors = JSON.stringify(arr);
            otherVendorCount = arr.length;
          }
          if (values.zbqk === '3') {
            shortlistedVendor =
              tableData.rwgys.map(x => String(x['GYS' + x.ID])).join(',') || undefined;
            notShortlistedVendor =
              tableData.wrwgys.map(x => String(x['GYS' + x.ID])).join(',') || undefined;
          }
          const params = {
            id: type !== 'ADD' ? updateData.id : undefined,
            projectID: Number(xmid),
            state: values.zbqk === undefined ? values.zbqk : Number(values.zbqk),
            vendor: values.zbgys === undefined ? values.zbgys : Number(values.zbgys),
            bidBond: values.tbbzj,
            performanceBond: values.lybzj,
            file: JSON.stringify(file),
            otherVendors,
            otherVendorCount,
            shortlistedVendor,
            notShortlistedVendor,
            failDes: values.zbsbsm,
            operateType: type,
          };
          console.log('🚀 ~ validateFields ~ params:', params);
          OperateWinningBidderInfo(params)
            .then(res => {
              if (res?.success) {
                refresh();
                message.success('操作成功', 1);
                onCancel();
                setIsSpinning(false);
              }
            })
            .catch(e => {
              console.error('🚀OperateWinningBidderInfo', e);
              message.error('操作失败', 1);
              setIsSpinning(false);
            });
        }
      });
    };

    //取消
    const onCancel = () => {
      resetFields();
      setTableData({ qttbgys: [], rwgys: [], wrwgys: [] });
      setEditData({ qttbgys: [], rwgys: [], wrwgys: [] });
      setFileList([]);
      setIsTurnRed(false);
      setUpdateData({});
      setVisible(false);
    };

    //弹窗参数
    const modalProps = {
      wrapClassName: 'bid-info-mod-modal',
      width: 800, // todo
      maskClosable: false,
      style: { top: 10 }, // todo
      maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
      zIndex: 100,
      title: null,
      visible,
      onCancel,
      onOk,
      confirmLoading: isSpinning,
    };

    return (
      <Modal {...modalProps}>
        <div className="body-title-box">
          <strong>中标信息{type === 'ADD' ? '录入' : '修改'}</strong>
        </div>
        <Spin spinning={isSpinning} tip="加载中">
          <Form
            className="content-box"
            style={getFieldValue('zbqk') === '2' ? { paddingLeft: 24 } : {}}
          >
            <Row>
              {getRadio({
                label: '中标情况',
                dataIndex: 'zbqk',
                initialValue: updateData.state ?? '1',
                radioArr: ZBXXZBQK,
                titleField: 'note',
                valueField: 'ibm',
                labelCol: labelCol / 2,
                wrapperCol: 24 - labelCol / 2,
              })}
            </Row>
            <Row>
              {getFieldValue('zbqk') === '2' && getGysSelector()}
              {getInputNumber({
                label: '投标保证金',
                dataIndex: 'tbbzj',
                initialValue:
                  updateData.bidBond === undefined ? undefined : Number(updateData.bidBond),
                labelCol,
                wrapperCol,
                // max:
              })}
              {getInputNumber({
                label: '履约保证金',
                dataIndex: 'lybzj',
                initialValue:
                  updateData.performanceBond === undefined
                    ? undefined
                    : Number(updateData.performanceBond),
                labelCol,
                wrapperCol,
                // max:
              })}
              {getMultipleUpload({
                label: '评标报告',
                labelCol,
                wrapperCol,
                fileList,
                setFileList,
                isTurnRed,
                setIsTurnRed,
              })}
            </Row>
            {getFieldValue('zbqk') === '1' && (
              <Row>
                {getTextArea({
                  label: '招标失败说明',
                  dataIndex: 'zbsbsm',
                  initialValue: updateData.failDes,
                  labelCol: labelCol / 2,
                  wrapperCol: 24 - labelCol / 2,
                  maxLength: 600,
                })}
              </Row>
            )}
            {getFieldValue('zbqk') === '2' && (
              <TableBox
                labelProps={{
                  label: '其他投标供应商',
                  labelCol: { span: labelCol / 2 },
                  wrapperCol: { span: 24 - labelCol / 2 },
                  required: true,
                }}
                gysSlt={gysSlt}
                setTableData={v => setTableData(p => ({ ...p, qttbgys: v }))}
                setEditData={v => setEditData(p => ({ ...p, qttbgys: v }))}
                tableData={tableData.qttbgys}
                editData={editData.qttbgys}
                form={form}
                tableScroll={true}
              />
            )}
            {getFieldValue('zbqk') === '3' && (
              <Fragment>
                <TableBox
                  labelProps={{
                    label: '入围供应商',
                    labelCol: { span: labelCol / 2 },
                    wrapperCol: { span: 24 - labelCol / 2 },
                    required: true,
                  }}
                  gysSlt={gysSlt}
                  setTableData={v => setTableData(p => ({ ...p, rwgys: v }))}
                  setEditData={v => setEditData(p => ({ ...p, rwgys: v }))}
                  tableData={tableData.rwgys}
                  editData={editData.rwgys}
                  form={form}
                />
                <TableBox
                  labelProps={{
                    label: '未入围供应商',
                    labelCol: { span: labelCol / 2 },
                    wrapperCol: { span: 24 - labelCol / 2 },
                    required: true,
                  }}
                  gysSlt={gysSlt}
                  setTableData={v => setTableData(p => ({ ...p, wrwgys: v }))}
                  setEditData={v => setEditData(p => ({ ...p, wrwgys: v }))}
                  tableData={tableData.wrwgys}
                  editData={editData.wrwgys}
                  form={form}
                />
              </Fragment>
            )}
          </Form>
          <InfoOprtModal
            visible={addGysModalVisible}
            setVisible={setAddGysModalVisible}
            oprtType={'ADD'}
            GYSLX={GYSLX}
            getTableData={fetchQueryGysInZbxx}
          />
        </Spin>
      </Modal>
    );
  }),
);
