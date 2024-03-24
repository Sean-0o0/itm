import React, { Fragment, useEffect, useState } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { IndividuationGetOAResult, QueryProjectApplicationFlow } from '../../../../services/pmsServices';
import BasicInfoContent from './basicInfoContent'
import ProjectInfoContent from './projectInfoContent'
import AttachmentInfoContent from './attachmentInfoContent'
import AssociationFlowContent from './associationFlowContent'
import Lodash from 'lodash'


export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(
  //项目立项申请——弹窗
  Form.create()(function ProjectApprovalApplicate(props) {

    const { userBasicInfo = {}, dictionary = {}, visible, setVisible, form, xmbh, currentXmid,
      getTableData, tableData
    } = props;

    const { getFieldDecorator, getFieldValue, validateFields, resetFields, setFieldsValue } = form;

    const [isSpinning, setIsSpinning] = useState(false); //大弹窗加载状态

    const [isUnfold, setIsUnfold] = useState({  //group是否展开
      basicInfo: true,
      projectInfo: true,
      attachmentInfo: true,
      gllc: false,  //false别改true，CV的代码
    });

    const [gllcData, setGllcData] = useState({//关联流程数据
      list: [],
      modalVisible: false,
    });

    const [XWHmotionData, setXWHmotionData] = useState([]) //信委会议案
    const [XWHsummaryData, setXWHsummaryData] = useState([])  //信委会会议纪要
    const [ZBHmotionData, setZBHmotionData] = useState([]) //总办会提案
    const [ZBHsummaryData, setZBHsummaryData] = useState([])  //总办会会议纪要
    const [BQHYscannerData, setBQHYscannerData] = useState([])  //标前会议纪要扫描件
    const [ZBshoppingData, setZBshoppingData] = useState([])  //招标采购文件
    const [otherUplodData, setOtherUplodData] = useState([])  //其他附件

    /**
    * 项目预算金额(元)- 项目名称.框架采购金额 (元) > 比较值
    * @param {*} bundaryMoney 比较值（右）
    */
    function judgeMoneyHanlde(bundaryMoney) {
      const a = parseFloat(getFieldValue('xmysje') || 0).toFixed(2);
      const b = parseFloat(0).toFixed(2);
      const result = parseFloat(a) - parseFloat(b);
      return result >= parseFloat(bundaryMoney);
    }

    /** 成功回调 */
    const onSuccess = (name) => {
      name && message.success(name + '成功')
      getTableData({
        current: tableData.current,
        pageSize: tableData.pageSize,
        sort: tableData.sort,
        title: '',
        year: ''
      })
    }

    /**
     * 浙商要求的文件转化
     * @param {*} fileArray 文件数组
     * @param {*} fileTypeName 表单标签名称
     * @returns
     */
    function convertFilesToBase64(fileArray, fileTypeName) {
      if (fileArray.length === 0) return [];
      return Promise.all(
        fileArray.map(file => {
          if (file.url !== undefined)
            //查询到的已有旧文件的情况
            return new Promise((resolve, reject) => {
              resolve({
                content: file.base64,
                nrtitle: file.name,
                nrtype: '1',
                filetype: fileTypeName,
              });
            });
          return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function () {
              const base64 = reader.result.split(',')[1];
              const fileName = file.name;
              resolve({
                content: base64,
                nrtitle: fileName,
                nrtype: '1',
                filetype: fileTypeName,
              });
            };

            reader.onerror = function (error) {
              reject(error);
            };

            reader.readAsDataURL(file);
          });
        }),
      );
    }


    //弹窗点击确定（提交数据）
    const submitHandle = () => {
      validateFields(async (err, values) => {
        if (err === null) {

          //附件数据
          const arr1 = await convertFilesToBase64(XWHmotionData.map(x => x.originFileObj || x), '信委会议案');
          const arr2 = await convertFilesToBase64(XWHsummaryData.map(x => x.originFileObj || x), '信委会会议纪要');
          const arr3 = await convertFilesToBase64(ZBHmotionData.map(x => x.originFileObj || x), '总办会提案');
          const arr4 = await convertFilesToBase64(ZBHsummaryData.map(x => x.originFileObj || x), '总办会会议纪要');
          const arr5 = await convertFilesToBase64(BQHYscannerData.map(x => x.originFileObj || x), '标前会议纪要扫描件');
          const arr6 = await convertFilesToBase64(ZBshoppingData.map(x => x.originFileObj || x), '招标采购文件');
          const arr7 = await convertFilesToBase64(otherUplodData.map(x => x.originFileObj || x), '其他附件');
          let mergedFileArray = [...arr5, ...arr6, ...arr7]

          //空附件校验 和  设置附件值
          if (judgeMoneyHanlde(500000) === true) {
            if (XWHmotionData.length === 0) {
              message.warn('请上传"信委会议案"附件！'); return;
            }
            if (XWHsummaryData.length === 0) {
              message.warn('请上传"信委会会议纪要"附件！'); return;
            }
            mergedFileArray = [...mergedFileArray, ...arr1, ...arr2]
          }
          if (
            (getFieldValue('xmlx') === 1 && judgeMoneyHanlde(4000000) === true)
            || (getFieldValue('xmlx') === 2 && judgeMoneyHanlde(2000000) === true)
            || (getFieldValue('xmlx') === 3 && judgeMoneyHanlde(1000000) === true)
          ) {
            if (ZBHmotionData.length === 0) {
              message.warn('请上传"总办会提案"附件！'); return;
            }
            if (ZBHsummaryData.length === 0) {
              message.warn('请上传"总办会会议纪要"附件！'); return;
            }
            mergedFileArray = [...mergedFileArray, ...arr3, ...arr4]
          }


          //解析数据
          const { bgrq, bt, jjcd, xmlx, sfzjss, xmysje, qsbgnr } = values

          //表单数据
          const mergedFormdata = {
            extinfo: {
              busdata: {
                BGRQ: String(bgrq.format('YYYYMMDD')), // 报告日期
                QSBGNR: qsbgnr,   //请示报告内容
                // YSLX: '1',          // 预算类型 字典YSLX 固定传1，不要显示                    //测试不传，生产传
                // XMLX: String(xmlx),       // 2| 货物类(软硬件); 3| 服务类(人力); 1| 工程类    //测试不传，生产传
                BM1: '',          //传空
                BM2: '',          //传空
                NGR1: '',         //传空
                NGR2: '',         //传空
              }
            },
            filerela: gllcData.list?.map(x => x.id) || [], //关联文件id，数组形式，多个id用“,”隔开，比如[102, 102],
            issend: Number(sfzjss),  //是否直接送审
            je: xmysje,      //项目预算金额
            loginname: userBasicInfo.userid,  //登录用户userid
            title: bt,       //标题
            urgent: Number(jjcd),    //紧急程度id
            groupno: String(xmbh)    //项目编号
          }

          //关联流程数据
          const flowdata = {
            xmmc: String(currentXmid),        //项目的id
            bm: String(userBasicInfo.orgid),  //部门id
          };

          const queryParams = {
            czr: '0',
            objectclass: '项目立项申请',
            formdata: JSON.stringify(mergedFormdata),
            attachments: mergedFileArray,
            flowdata: JSON.stringify(flowdata),
          }

          try {
            setIsSpinning(true)

            console.log('项目立项申请的查询参数为', { mergedFormdata, mergedFileArray, flowdata }, queryParams)

            const res = await IndividuationGetOAResult(queryParams)

            console.log('xxxxxxxx项目立项申请的结果xxxxxxxxxxx', res)

            const { code = -1 } = res;
            if (code > 0) {
              setIsSpinning(false)
              setVisible(false);
              //刷新数据
              onSuccess('项目立项申请发起');
            }
          }
          catch (err) {
            console.log('项目立项申请发起失败', err)
            setIsSpinning(false)
            message.error(`项目立项申请发起失败${!err.success ? err.message : err.note}`, 3)
          }
        }
      })
    }


    //关闭弹窗
    const closeHandle = () => {
      setVisible(false);
    };

    /**清空弹窗数据 */
    const clearDataHandle = () => {
      resetFields()
      setXWHmotionData([])
      setXWHsummaryData([])
      setZBHmotionData([])
      setZBHsummaryData([])
      setBQHYscannerData([])
      setZBshoppingData([])
      setOtherUplodData([])
      setGllcData({
        list: [],
        modalVisible: false,
      })
    }

    /** 分组标题 */
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

    //单选按钮
    const getRadio = ({ label, dataIndex, initialValue, radioArr = [], labelCol, wrapperCol, labelNode }) => {
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
    const getInputNumber = ({ label, labelCol, wrapperCol, dataIndex, initialValue, rules, max, }) => {
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
                placeholder={'请输入' + label}
              // parser={value => value.replace(/$\s?|(,*)/g, '')}
              />,
            )}
          </Form.Item>
        </Col>
      );
    };

    /** 给子组件的复用的封装组件 */
    const componentsObj = {
      getTitle,
      getInputDisabled,
      getDatePicker,
      getRadio,
      getInput,
      getInputNumber
    }

    /** 给子组件的状态 */
    const stateObj = {
      isUnfold, setIsUnfold,
    }

    /** 给子组件的数据 */
    const dataObj = {
      userBasicInfo,
      dictionary,
      currentXmid,
      XWHmotionData, setXWHmotionData,//信委会议案
      XWHsummaryData, setXWHsummaryData,//信委会会议纪要
      ZBHmotionData, setZBHmotionData,//总办会提案
      ZBHsummaryData, setZBHsummaryData, //总办会会议纪要
      BQHYscannerData, setBQHYscannerData,//标前会议纪要扫描件
      ZBshoppingData, setZBshoppingData, //招标采购文件
      otherUplodData, setOtherUplodData,//其他附件
      gllcData, setGllcData, //关联流程
    }


    return (
      <Modal
        wrapClassName='software-payment-wht-modal ProjectApprovalApplicate'
        width={864}
        maskClosable={false}
        style={{ top: 10 }}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
        zIndex={100}
        title={null}
        visible={visible}
        onCancel={closeHandle}
        onOk={submitHandle}
        destroyOnClose={true}
        footer={
          [
            <Popconfirm
              title={`确定清空内容吗?`}
              onConfirm={() => clearDataHandle()}>
              <Button key="clear">
                清空内容
              </Button>
            </Popconfirm>,
            <Button key="close" onClick={() => closeHandle()}>
              关闭
            </Button>,
            <Button key="submit" type="primary" onClick={() => submitHandle()} loading={isSpinning}>
              确定
            </Button>,
          ]
        }
      >
        <div className="body-title-box">
          <strong>项目立项申请发起</strong>
        </div>

        <Spin spinning={isSpinning} tip="加载中">
          <Form className="content-box">
            <BasicInfoContent
              componentsObj={componentsObj}
              stateObj={stateObj}
              dataObj={dataObj}
              form={form}
            />

            <ProjectInfoContent
              componentsObj={componentsObj}
              stateObj={stateObj}
              dataObj={dataObj}
              form={form}
            />

            <AttachmentInfoContent
              componentsObj={componentsObj}
              stateObj={stateObj}
              dataObj={dataObj}
              form={form}
              judgeMoneyHanlde={judgeMoneyHanlde}
            />

            <AssociationFlowContent
              componentsObj={componentsObj}
              stateObj={stateObj}
              dataObj={dataObj}
              form={form}
              onSuccess={onSuccess}
              xmbh={xmbh}
            />



          </Form>
        </Spin>
      </Modal >
    )
  })
)
