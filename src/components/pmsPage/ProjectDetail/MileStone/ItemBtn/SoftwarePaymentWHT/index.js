import React, { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Row,
  Spin,
  Select,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Upload,
  Tooltip,
  Icon,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import AssociatedFile from '../../../../LifeCycleManagement/AssociatedFile';
import RichTextEditor from '../../../../LifeCycleManagement/ContractSigning/RichTextEditor';
import { connect } from 'dva';
import { IndividuationGetOAResult } from '../../../../../../services/pmsServices';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  dataAnonymization: global.dataAnonymization,
}))(
  Form.create()(function SoftwarePaymentWHT(props) {
    const {
      dataProps = {},
      funcProps = {},
      form = {},
      userBasicInfo = {},
      dictionary = {},
    } = props;
    const { visible, currentXmid, xmbh, FKJHID } = dataProps;
    const { setVisible, onSuccess } = funcProps;
    const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
    const { CXBM = [] } = dictionary;
    const [isSpinning, setIsSpinning] = useState(false); //加载状态
    const [upldData, setUpldData] = useState([]); //附件信息
    const [isUnfold, setIsUnfold] = useState({
      jbxx: true,
      htxx: true,
      fjxx: true,
      gllc: false,
    }); //是否展开
    const [gllcData, setGllcData] = useState({
      list: [],
      modalVisible: false,
    }); //关联流程
    const [bmValue, setBmValue] = useState({
      BM1: '',
      BM2: '',
    }); //handleBmChange

    const labelCol = 8;
    const wrapperCol = 16;

    //单选框、下拉框静态值
    const constData = {
      fylb: [
        { title: '<20万', value: 1 },
        { title: '≥20万 且 <50万', value: 2 },
        { title: '≥50万', value: 3 },
      ],
      jjcd: [
        { title: '一般', value: 1 },
        { title: '紧急', value: 2 },
        { title: '加急', value: 3 },
      ],
      xmlx: [
        { title: '货物类(软硬件)', value: 2 },
        { title: '服务类(人力)', value: 3 },
        { title: '工程类', value: 1 },
      ],
      lx: [
        { title: '5万以上或维护费超过前次10%', value: 1 },
        { title: '其他', value: 2 },
      ],
      sfzjss: [
        { title: '直接送审', value: 1 },
        { title: '发送至OA草稿箱', value: 2 },
      ],
    };

    useEffect(() => {
      return () => {};
    }, []);

    //分块标题
    const getTitle = (title, isUnfold, field) => {
      return (
        <div className="title" style={{ borderBottom: '1px solid #F1F1F1', marginBottom: 14 }}>
          <Icon
            type={isUnfold ? 'caret-down' : 'caret-right'}
            onClick={() => setIsUnfold(p => ({ ...p, [field]: !p[field] }))}
            style={{ fontSize: '14px', cursor: 'pointer' }}
          />
          <span style={{ paddingLeft: '10px', fontSize: '20px', color: '#3461FF' }}>{title}</span>
        </div>
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
    const getInput = (label, dataIndex, initialValue, labelCol, wrapperCol) => {
      return (
        <Col span={24}>
          <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
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
                maxLength={500}
                placeholder={'请输入' + label}
                allowClear
                style={{ width: '100%' }}
              />,
            )}
          </Form.Item>
        </Col>
      );
    };

    //输入框 - 数值型
    const getInputNumber = ({
      label,
      labelCol,
      wrapperCol,
      dataIndex,
      initialValue,
      rules,
      max,
    }) => {
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
                // parser={value => value.replace(/$\s?|(,*)/g, '')}
              />,
            )}
          </Form.Item>
        </Col>
      );
    };

    //日期选择器
    const getDatePicker = (label, dataIndex, initialValue, labelCol, wrapperCol) => {
      return (
        <Col span={12}>
          <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
            {getFieldDecorator(dataIndex, {
              initialValue,
              rules: [
                {
                  required: true,
                  message: label + '不允许空值',
                },
              ],
            })(<DatePicker style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
      );
    };

    //单选框
    const getRadio = ({
      label,
      dataIndex,
      initialValue,
      radioArr = [{ title: 'xx', value: 1 }],
      labelCol,
      wrapperCol,
      labelNode,
    }) => {
      return (
        <Col span={12}>
          <Form.Item
            label={labelNode ? labelNode : label}
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
              <Radio.Group>
                {radioArr.map(x => (
                  <Radio key={x.value} value={x.value}>
                    {x.title}
                  </Radio>
                ))}
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
      );
    };

    //单选普通下拉框
    const getSingleSelector = ({
      label,
      dataIndex,
      initialValue,
      labelCol,
      wrapperCol,
      sltArr = [],
      onChange = () => {},
    }) => {
      return (
        <Col span={12}>
          <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
            {getFieldDecorator(dataIndex, {
              initialValue,
              rules: [
                {
                  required: true,
                  message: label + '不允许空值',
                },
              ],
            })(
              <Select
                placeholder="请选择"
                onChange={onChange}
                optionFilterProp="children"
                showSearch
                allowClear
              >
                {sltArr.map(x => (
                  <Select.Option key={x.value} value={x.value}>
                    {x.title}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      );
    };

    //富文本
    const getRichTextArea = () => {
      return (
        <Col span={24}>
          <Form.Item label="请示报告内容" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('qsbgnr', {
              rules: [
                {
                  required: true,
                  message: '请输入请示报告内容',
                },
              ],
            })(<RichTextEditor className="w-e-menu w-e-text-container w-e-toolbar" />)}
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
      return (
        <Col span={12}>
          <Form.Item
            label={label}
            labelCol={{ span: labelCol }}
            wrapperCol={{ span: wrapperCol }}
            required={isTurnRed !== undefined}
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

    //关联流程
    const getGllc = () => {
      //关联文件 - 打开
      const handleAssociateFileOpen = () => {
        setGllcData(p => ({ ...p, modalVisible: true }));
      };

      //关联流程 - 点击
      const handleProcessItemClick = id => {
        window.open(
          'http://10.52.130.12/ZSZQOA/getURLSyncBPM.do?_BPM_FUNCCODE=C_FormSetFormData&_mode=4&_form_control_design=LABEL&_tf_file_id=' +
            id,
        );
      };
      //关联流程 - 删除
      const handleProcessItemDelete = id => {
        setGllcData(p => ({ ...p, modalVisible: false, list: p.list.filter(x => x.id !== id) }));
      };
      return (
        <Fragment>
          <div className="title" style={{ borderBottom: '1px solid #F1F1F1' }}>
            <Icon
              type={isUnfold.gllc ? 'caret-down' : 'caret-right'}
              onClick={() =>
                setIsUnfold(p => ({ ...p, gllc: gllcData.list?.length > 0 ? !p.gllc : p.gllc }))
              }
              style={{
                fontSize: '14px',
                cursor: gllcData.list?.length > 0 ? 'pointer' : 'default',
              }}
            />
            <span style={{ paddingLeft: '10px', fontSize: '20px', color: '#3461FF' }}>
              关联流程
            </span>
            <Icon
              type="plus-circle"
              theme="filled"
              onClick={() => handleAssociateFileOpen()}
              style={{ color: '#3461FF', paddingLeft: '7px', fontSize: '20px' }}
            />
          </div>
          <div style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: '350px' }}>
            {!isUnfold.gllc &&
              gllcData.list?.map((item, index) => (
                <div style={{ margin: '14px 47px' }} key={index}>
                  <Row gutter={24}>
                    <Col
                      span={24}
                      className="contract-signing-process-item"
                      style={{ display: 'flex' }}
                    >
                      <a
                        style={{ color: '#3361ff', marginRight: '1.14px' }}
                        F
                        onClick={() => handleProcessItemClick(item.id)}
                      >
                        {item?.title}
                      </a>
                      <Popconfirm
                        title="确定要删除吗?"
                        onConfirm={() => handleProcessItemDelete(item.id)}
                      >
                        <a>
                          <Icon style={{ color: 'red' }} type="close" />
                        </a>
                      </Popconfirm>
                    </Col>
                  </Row>
                </div>
              ))}
          </div>
        </Fragment>
      );
    };

    //提交数据
    const onOk = () => {
      validateFields(async (err, values) => {
        if (!err) {
          function convertFilesToBase64(fileArray) {
            return Promise.all(
              fileArray.map(file => {
                if (file.url !== undefined)
                  //查询到的已有旧文件的情况
                  return new Promise((resolve, reject) => {
                    resolve({
                      content: file.base64,
                      nrtitle: file.name,
                      nrtype: '1',
                      filetype: '附件',
                    });
                  });
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();

                  reader.onload = function() {
                    const base64 = reader.result.split(',')[1];
                    const fileName = file.name;
                    resolve({
                      content: base64,
                      nrtitle: fileName,
                      nrtype: '1',
                      filetype: '附件',
                    });
                  };

                  reader.onerror = function(error) {
                    reject(error);
                  };

                  reader.readAsDataURL(file);
                });
              }),
            );
          }
          setIsSpinning(true);
          //表单数据
          const formdata = {
            extinfo: {
              busdata: {
                BGRQ: Number(moment(values.bgrq).format('YYYYMMDD')), // 报告日期
                QSBGNR: values.qsbgnr, //请示报告内容
                LB: String(values.fylb), //费用类别
                // XMLB: String(values.xmlx), //项目类型
                SFFDHT: '0', //固定0
                LX: String(values.lx), //类型
                ...bmValue,
                NGR1: '', //传空
                NGR2: '', //传空
              },
            },
            //关联文件id，数组形式，多个id用“,”隔开，比如[102,102]
            filerela: gllcData.list?.map(x => x.id) || [],
            issend: Number(values.sfzjss), //是否直接送审
            je: values.xmysje, //金额
            loginname: userBasicInfo.userid, //登录用户userid
            title: values.sy, //标题
            urgent: Number(values.jjcd), //紧急程度id
            groupno: xmbh,
          };
          //附件数据
          const attachments = await convertFilesToBase64(upldData.map(x => x.originFileObj || x));
          const flowdata = {
            xmmc: String(currentXmid), //项目的id
            bm: String(userBasicInfo.orgid), //部门id
            fkjhid: FKJHID,
          };
          const params = {
            objectclass: '软件费用审批无合同流程',
            formdata: JSON.stringify(formdata),
            attachments,
            flowdata: JSON.stringify(flowdata),
          };
          console.log('🚀 ~ validateFields ~ params:', params);
          IndividuationGetOAResult(params)
            .then(result => {
              const { code = -1 } = result;
              if (code > 0) {
                //刷新数据
                onSuccess('软件费用审批流程-无合同发起');
                setVisible(false);
              }
            })
            .catch(error => {
              setVisible(false);
              console.error(!error.success ? error.message : error.note);
              message.error('操作失败', 1);
            });
        }
      });
    };

    //取消
    const onCancel = () => {
      setVisible(false);
    };

    //关联文件 - 确认
    const handleAssociateFileConfirm = (data = []) => {
      setGllcData(p => ({ ...p, modalVisible: false, list: data }));
    };

    //部门，chenxin特殊处理
    const handleBmChange = (v, option) => {
      setBmValue({
        BM1: option?.props?.value || '',
        BM2: option?.props?.children || '',
      });
    };

    //弹窗参数
    const modalProps = {
      wrapClassName: 'software-payment-wht-modal',
      width: 864,
      maskClosable: false,
      style: { top: 10 },
      maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
      zIndex: 100,
      title: null,
      visible,
      onCancel,
      onOk,
      destroyOnClose: true,
      confirmLoading: isSpinning,
    };

    return (
      <Modal {...modalProps}>
        <div className="body-title-box">
          <strong>软件费用审批流程-无合同发起</strong>
        </div>
        <Spin spinning={isSpinning} tip="加载中">
          {gllcData.modalVisible && (
            <AssociatedFile
              associatedFileVisible={gllcData.modalVisible}
              onConfirm={data => handleAssociateFileConfirm(data)}
              closeAssociatedFileModal={() => setGllcData(p => ({ ...p, modalVisible: false }))}
              onSuccess={() => onSuccess('关联文件')}
              xmbh={xmbh}
              list={gllcData.list}
            />
          )}
          <Form className="content-box">
            {getTitle('基本信息', isUnfold.jbxx, 'jbxx')}
            {isUnfold.jbxx && (
              <Fragment>
                <Row>
                  {Number(userBasicInfo.id) === 1884
                    ? getSingleSelector({
                        label: '部门',
                        dataIndex: 'bm',
                        initialValue: undefined,
                        labelCol: labelCol,
                        wrapperCol: wrapperCol,
                        sltArr: CXBM?.map(x => ({ title: x.note, value: x.ibm })) || [],
                        onChange: handleBmChange,
                      })
                    : getInputDisabled('部门', userBasicInfo.orgname, labelCol, wrapperCol)}
                  {getDatePicker('报告日期', 'bgrq', null, labelCol, wrapperCol)}
                </Row>
                <Row>
                  {getInputDisabled('拟稿人', userBasicInfo.name, labelCol, wrapperCol)}
                  {getRadio({
                    label: '费用类别',
                    dataIndex: 'fylb',
                    initialValue: 1,
                    radioArr: constData.fylb,
                    labelCol: labelCol,
                    wrapperCol: wrapperCol,
                  })}
                </Row>
                <Row>
                  {getSingleSelector({
                    label: '紧急程度',
                    dataIndex: 'jjcd',
                    initialValue: 1,
                    labelCol: labelCol,
                    wrapperCol: wrapperCol,
                    sltArr: constData.jjcd,
                  })}
                  {getRadio({
                    label: '项目类型',
                    dataIndex: 'xmlx',
                    initialValue: 2,
                    radioArr: constData.xmlx,
                    labelCol: labelCol,
                    wrapperCol: wrapperCol,
                    labelNode: (
                      <span>
                        项目类型 &nbsp;
                        <Tooltip
                          title={
                            <Fragment>
                              <div>货物类：一般软硬件设备采购项目为货物类</div>
                              <div>服务类：咨询服务、人力服务类项目为服务类</div>
                            </Fragment>
                          }
                          overlayStyle={{ maxWidth: 300 }}
                        >
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    ),
                  })}
                </Row>
                <Row>
                  {getInputNumber({
                    label: '项目预算金额(元)',
                    dataIndex: 'xmysje',
                    initialValue: undefined,
                    labelCol: labelCol,
                    wrapperCol: wrapperCol,
                    rules: [
                      {
                        required: true,
                        message: '项目预算金额不允许空值',
                      },
                    ],
                    max: 999999999,
                  })}
                  {getRadio({
                    label: '类型',
                    dataIndex: 'lx',
                    initialValue: 1,
                    radioArr: constData.lx,
                    labelCol: labelCol,
                    wrapperCol: wrapperCol,
                  })}
                </Row>
                <Row>
                  {getRadio({
                    label: '是否直接送审',
                    dataIndex: 'sfzjss',
                    initialValue: 1,
                    radioArr: constData.sfzjss,
                    labelCol: labelCol,
                    wrapperCol: wrapperCol,
                  })}
                </Row>
                <Row>{getInput('事由', 'sy', undefined, labelCol / 2, 24 - labelCol / 2)}</Row>
              </Fragment>
            )}
            {getTitle('合同信息', isUnfold.htxx, 'htxx')}
            {isUnfold.htxx && <Row>{getRichTextArea()}</Row>}
            {getTitle('附件信息', isUnfold.fjxx, 'fjxx')}
            {isUnfold.fjxx && (
              <Row>
                {getMultipleUpload({
                  label: '附件',
                  labelCol: labelCol,
                  wrapperCol: wrapperCol,
                  fileList: upldData,
                  setFileList: setUpldData,
                  isTurnRed: undefined,
                  setIsTurnRed: () => {},
                })}
              </Row>
            )}

            {getGllc()}
          </Form>
        </Spin>
      </Modal>
    );
  }),
);
