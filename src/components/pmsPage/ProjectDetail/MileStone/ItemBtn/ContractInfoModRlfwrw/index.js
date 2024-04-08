import React, { Fragment, useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Row, Spin, Steps, Col, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import {
  FetchQueryGysInZbxx,
  FetchqueryOutsourceRequirement,
  OperateHumanServiceContract,
  QueryHumanServiceContract,
  QueryPaymentAccountList,
  QueryWinningBidderInfo,
  QueryXCContractInfo,
} from '../../../../../../services/pmsServices';
import TableBox from './TableBox';
import TableBoxRldj from './TableBoxRldj';
import InfoOprtModal from '../../../../SupplierDetail/TopConsole/InfoOprtModal';
import SupplierConfirm from './SupplierConfirm';
import {
  convertFilesToBase64,
  getUUID,
  handleFileStrParse,
} from '../../../../../../utils/pmsPublicUtils';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(
  Form.create()(function ContractInfoModRlfwrw(props) {
    const {
      visible,
      setVisible,
      xmid = -1,
      type = 'ADD',
      form = {},
      refresh = () => {},
      dictionary = {},
      prjYear = moment().year(), //项目年份
    } = props;
    const { RLRWHTQSZT = [], GYSLX = [], ZDTSNRPZ = [] } = dictionary;
    const { getFieldDecorator, validateFields, resetFields, validateFieldsAndScroll } = form;
    const [isSpinning, setIsSpinning] = useState(false); //加载状态
    const [curStep, setCurStep] = useState(0); //当前tab ID
    const [oaData, setOaData] = useState({}); //新增时给的默认数据
    const [updateData, setUpdateData] = useState({}); //修改时回显的数据
    const [addGysModalVisible, setAddGysModalVisible] = useState(false); //新增供应商弹窗显隐
    const [sltData, setSltData] = useState({}); //下拉框数据
    const [tableData, setTableData] = useState({
      rldj: [],
      rwgys: [],
    }); //表格数据
    const [editData, setEditData] = useState({
      rldj: [],
      rwgys: [],
    }); //编辑的数据
    const [delData, setDelData] = useState({
      rldj: [],
      rwgys: [],
    }); //删除的数据
    const labelCol = 6;
    const wrapperCol = 18;

    useEffect(() => {
      if (visible) {
        initData(type);
      }
      return () => {};
    }, [visible, type, xmid]);

    //获取数据
    const initData = async type => {
      try {
        setIsSpinning(true);
        const p1 = FetchqueryOutsourceRequirement({
          cxlx: 'RYDJ',
          xqid: 0,
        });
        const p2 = QueryPaymentAccountList({
          type: 'ALL',
          current: 1,
          pageSize: 20,
          paging: 1,
          sort: '',
          total: -1,
          zhid: -1,
        });
        const p3 = FetchQueryGysInZbxx({
          paging: -1,
          sort: '',
          current: 1,
          pageSize: 20,
          total: -1,
        });
        const p4 =
          type === 'ADD'
            ? QueryXCContractInfo({
                current: 1,
                pageSize: 9999,
                paging: 1,
                sort: 'QDRQ ASC',
                total: -1,
                projectId: Number(xmid),
              })
            : QueryHumanServiceContract({ projectID: Number(xmid) });
        const p5 = QueryWinningBidderInfo({
          projectID: Number(xmid),
        });
        const [rydjRes, accountRes, gysRes, res, bidRes] = await Promise.all([p1, p2, p3, p4, p5]);
        if (rydjRes?.success && accountRes?.success && gysRes?.success && res?.success) {
          setSltData({
            rydj: JSON.parse(rydjRes.rydjxx),
            skzh: accountRes.record,
            qszt: RLRWHTQSZT,
            gys: gysRes.record,
          });
          if (type === 'ADD') {
            setOaData(JSON.parse(res.result)[0] || {});
            handleDefaultAddRow();
            if (bidRes.success) {
              const data = JSON.parse(bidRes.result)[0] || {};
              let rwgys = [];
              rwgys = (data.shortlistedVendor?.split(',') || []).map(x => {
                let UUID = getUUID();
                return {
                  ...x,
                  ID: UUID,
                  ['GYS' + UUID]: x,
                  ['QSZT' + UUID]: '1',
                  ['QSSM' + UUID]: undefined,
                  ['GYSZH' + UUID]: undefined,
                  accountObj: undefined,
                  fileList: [],
                  isNew: true,
                };
              });
              setTableData(p => ({ ...p, rwgys }));
              setEditData(p => ({ ...p, rwgys: JSON.parse(JSON.stringify(rwgys)) }));
            }
          } else {
            //修改时回显
            const data = JSON.parse(res.result)[0] || {};
            console.log('🚀 ~ initData ~ data:', data);
            //人力单价
            const manpowerUnit = data.manpowerUnit?.map(x => ({
              ID: x.id,
              ['DJ' + x.id]: x.rankId,
              ['RLDJ' + x.id]: x.price === undefined ? undefined : Number(x.price),
            }));
            //入围供应商数据
            const vendor = await Promise.all(
              data.vendor?.map(async x => ({
                ID: x.id,
                fileList: await handleFileStrParse(x.file, {
                  objectName: 'TRLFWXM_HTXX_RWGYS',
                  columnName: 'FJ',
                  id: x.id,
                }), // 合同
                accountObj: {
                  id: x.account,
                  khmc: x.accountName,
                  yhkh: x.cardNumber,
                  ssr: x.owner,
                  wdmc: x.openOutlet,
                }, // 收款账户
                ['GYS' + x.id]: x.vendor, //供应商id
                ['QSSM' + x.id]: x.illustrate, //签署说明
                ['QSZT' + x.id]: x.sigState, //签署状态
              })),
            );
            console.log('🚀 ~ vendor ~ manpowerUnit:', vendor, manpowerUnit);
            setUpdateData(data);
            setTableData({
              rldj: manpowerUnit,
              rwgys: vendor,
            });
          }
          setIsSpinning(false);
        }
      } catch (e) {
        console.error('🚀数据初始化', e);
        message.error('数据初始化失败', 1);
        setIsSpinning(false);
      }
    };

    // 查询供应商下拉列表
    const fetchQueryGysInZbxx = () => {
      setIsSpinning(true);
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
            setSltData(p => ({ ...p, gys: rec }));
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('供应商信息查询失败', e);
          message.error('供应商信息查询失败', 1);
          setIsSpinning(false);
        });
    };

    //默认新增一行
    const handleDefaultAddRow = () => {
      const UUID = getUUID();
      const obj = {
        rldj: [{ ID: UUID, ['DJ' + UUID]: undefined, ['RLDJ' + UUID]: undefined }],
        rwgys: [
          {
            ID: UUID,
            ['GYS' + UUID]: undefined,
            ['QSZT' + UUID]: '1',
            ['QSSM' + UUID]: undefined,
            ['GYSZH' + UUID]: undefined,
            accountObj: undefined,
            fileList: [],
            isNew: true,
          },
        ],
      };
      setTableData(obj);
      setEditData(JSON.parse(JSON.stringify(obj)));
    };

    //简单常用表单组件
    const COMPONENT = {
      //输入框
      getInput: (label, dataIndex, initialValue, labelCol, wrapperCol, componentProps = {}) => {
        return (
          <Col span={12}>
            <Form.Item
              label={label}
              labelCol={{ span: labelCol }}
              wrapperCol={{ span: wrapperCol }}
            >
              {getFieldDecorator(dataIndex, {
                initialValue,
                rules: [
                  {
                    required: true,
                    message: label + '不允许空值',
                  },
                ],
              })(
                <Input
                  placeholder={'请输入' + label}
                  allowClear
                  style={{ width: '100%' }}
                  {...componentProps}
                />,
              )}
            </Form.Item>
          </Col>
        );
      },
      //日期选择器
      getDatePicker: (
        label,
        dataIndex,
        initialValue,
        labelCol,
        wrapperCol,
        componentProps = {},
      ) => {
        return (
          <Col span={12}>
            <Form.Item
              label={label}
              labelCol={{ span: labelCol }}
              wrapperCol={{ span: wrapperCol }}
            >
              {getFieldDecorator(dataIndex, {
                initialValue,
                rules: [
                  {
                    required: true,
                    message: label + '不允许空值',
                  },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={'请选择' + label}
                  {...componentProps}
                />,
              )}
            </Form.Item>
          </Col>
        );
      },
    };
    const { getInput, getDatePicker } = COMPONENT;

    //提交数据
    const onOk = () => {
      validateFields(async (err, values) => {
        if (!err) {
          setIsSpinning(true);
          let manpowerPrice = tableData.rldj.map(x => ({
            DJ: String(x['DJ' + x.ID]),
            RLDJ: String(x['RLDJ' + x.ID]),
          }));
          let shortlistedVendor = await Promise.all(
            editData.rwgys.map(async x => ({
              id: x.isNew ? -1 : Number(x.ID),
              vendor: Number(x['GYS' + x.ID]),
              state: Number(x['QSZT' + x.ID]),
              illustrate: x['ASSM' + x.ID],
              account: x.accountObj?.id === undefined ? -1 : Number(x.accountObj?.id),
              sysAccount: x.ZHID === undefined ? -1 : Number(x.ZHID),
              operateType: x.isNew ? 'ADD' : 'UPDATE',
              file: await convertFilesToBase64(x.fileList.map(x => x.originFileObj || x)),
            })),
          );
          console.log('🚀 ~ shortlistedVendor:', shortlistedVendor);
          let shortlistedVendor_Del = delData.rwgys.map(x => ({
            id: Number(x.ID),
            vendor: -1,
            state: -1,
            illustrate: '-1',
            account: -1,
            sysAccount: -1,
            operateType: 'DELETE',
            file: [],
          }));
          const params = {
            id: type === 'ADD' ? undefined : Number(updateData.id),
            projectID: Number(xmid),
            oaContractID: type === 'ADD' ? -1 : Number(updateData.oaContract ?? -1),
            contractName: values.htmc,
            contractCode: values.htbh,
            sigDate: Number(values.qsrq.format('YYYYMMDD')),
            manpowerPrice: JSON.stringify(manpowerPrice),
            manpowerPriceCount: manpowerPrice.length,
            shortlistedVendor: JSON.stringify(shortlistedVendor.concat(shortlistedVendor_Del)),
            operateType: type,
          };
          console.log('🚀 ~ validateFields ~ type, params:', type, params);
          OperateHumanServiceContract(params)
            .then(res => {
              if (res?.success) {
                refresh();
                message.success('操作成功', 1);
                onCancel();
                setIsSpinning(false);
              }
            })
            .catch(e => {
              console.error('🚀', e);
              message.error('操作失败', 1);
              setIsSpinning(false);
            });
        }
      });
    };

    //取消
    const onCancel = () => {
      resetFields();
      setTableData({
        rldj: [],
        rwgys: [],
      });
      setEditData({
        rldj: [],
        rwgys: [],
      });
      setDelData({
        rldj: [],
        rwgys: [],
      });
      setOaData({});
      setUpdateData({});
      setVisible(false);
    };

    //下一步
    const handleNext = () => {
      validateFieldsAndScroll(err => {
        if (tableData.rldj.length === 0 || tableData.rwgys.length === 0) {
          tableData.rldj.length === 0 && message.error('人力单价不允许空值', 2);
          tableData.rwgys.length === 0 && message.error('入围供应商不允许空值', 2);
          return;
        }
        if (!err) {
          setCurStep(1);
        }
      });
    };

    //上一步
    const handleLast = () => {
      setCurStep(0);
    };

    //切换顶部步骤tab
    const onStepChange = v => {
      if (v === 1) {
        handleNext();
      } else setCurStep(v);
    };

    //弹窗参数
    const modalProps = {
      wrapClassName: 'contract-info-mod-modal',
      width: 1200, // todo
      maskClosable: false,
      style: { top: 10 }, // todo
      maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
      zIndex: 100,
      title: null,
      visible,
      onCancel,
      onOk,
      footer: (
        <div className="modal-footer">
          <Button className="btn-default" onClick={onCancel}>
            取消
          </Button>
          {curStep === 0 ? (
            <Button
              loading={isSpinning}
              className="btn-primary"
              type="primary"
              onClick={handleNext}
            >
              下一步
            </Button>
          ) : (
            <Fragment>
              <Button
                loading={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={handleLast}
              >
                上一步
              </Button>
              <Button loading={isSpinning} className="btn-primary" type="primary" onClick={onOk}>
                保存
              </Button>
            </Fragment>
          )}
        </div>
      ),
    };

    return (
      <Modal {...modalProps}>
        <div className="body-title-box">
          <strong>合同信息录入修改</strong>
        </div>
        <Spin spinning={isSpinning} tip="加载中">
          <Steps
            current={curStep}
            onChange={onStepChange}
            type="navigation"
            style={{ marginBottom: 16, marginTop: 6 }}
          >
            <Steps.Step title="合同信息录入" status={curStep === 0 ? 'process' : 'wait'} />
            <Steps.Step title="供应商确认" status={curStep === 1 ? 'process' : 'wait'} />
          </Steps>
          <Form className="content-box" style={curStep === 0 ? {} : { display: 'none' }}>
            <Row>
              {getInput(
                '合同名称',
                'htmc',
                type === 'ADD' ? oaData.HTMC : updateData.contractName,
                4,
                wrapperCol,
              )}
              {getInput(
                '合同编号',
                'htbh',
                type === 'ADD' ? oaData.HTBH : updateData.contractCode,
                labelCol,
                wrapperCol,
              )}
            </Row>
            <Row>
              {getDatePicker(
                '签署日期',
                'qsrq',
                type === 'ADD'
                  ? oaData.QDRQ
                    ? moment(String(oaData.QDRQ))
                    : null
                  : updateData.sigDate
                  ? moment(String(updateData.sigDate))
                  : null,
                4,
                wrapperCol,
              )}
            </Row>
            <TableBoxRldj
              labelProps={{
                label: '人力单价',
                labelCol: { span: 2 },
                wrapperCol: { span: 22 },
                required: true,
              }}
              sltData={sltData}
              setTableData={v => setTableData(p => ({ ...p, rldj: v }))}
              tableData={tableData.rldj}
              form={form}
              setAddGysModalVisible={setAddGysModalVisible}
            />
            <TableBox
              labelProps={{
                label: '入围供应商',
                labelCol: { span: 2 },
                wrapperCol: { span: 22 },
                required: true,
              }}
              sltData={sltData}
              setTableData={v => setTableData(p => ({ ...p, rwgys: v }))}
              setEditData={v => setEditData(p => ({ ...p, rwgys: v }))}
              setDelData={v => setDelData(p => ({ ...p, rwgys: v }))}
              tableData={tableData.rwgys}
              editData={editData.rwgys}
              delData={delData.rwgys}
              form={form}
              tableScroll={true}
              setAddGysModalVisible={setAddGysModalVisible}
            />
          </Form>
          <Form
            className="content-box supplier-confirm-box"
            style={curStep === 1 ? {} : { display: 'none' }}
          >
            <SupplierConfirm
              tableData={tableData.rwgys}
              editData={editData.rwgys}
              setTableData={v => setTableData(p => ({ ...p, rwgys: v }))}
              setEditData={v => setEditData(p => ({ ...p, rwgys: v }))}
              RLRWHTQSZT={RLRWHTQSZT}
              curStep={curStep}
              prjYear={prjYear}
              ZDTSNRPZ={ZDTSNRPZ}
              setIsSpinning={setIsSpinning}
            />
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
