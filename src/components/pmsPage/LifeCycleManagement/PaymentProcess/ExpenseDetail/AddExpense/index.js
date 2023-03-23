import React, { useEffect, useRef, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Upload,
  Select,
  Radio,
  Menu,
  InputNumber,
  Drawer,
  Button,
  Icon,
  Dropdown,
  TreeSelect,
} from 'antd';
import moment from 'moment';
import InputReceipt from './InputReceipt';
import UploadReceipt from './UploadReceipt';
import SelectReceipt from './SelectReceipt';
import { QueryCreatePaymentInfo } from '../../../../../../services/pmsServices';
import TreeUtils from '../../../../../../utils/treeUtils';
import { set } from 'store';
const { TextArea } = Input;

const AddExpense = props => {
  //弹窗全屏
  const [isModalFullScreen, setIsModalFullScreen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpenn] = useState(false);
  const [isTreeSelectorOpen, setIsTreeSelectorOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    expenseType: 0,
    receiptType: 0,
    isFinalPay: 1,
    amount: 0,
    consumeReason: '',
    //附件上传
    receiptFileUrl: '',
    receiptFileName: '',
    receiptFileList: [],
    receiptIsTurnRed: false,
    OAProcessFileUrl: '',
    OAProcessFileName: '',
    OAProcessFileList: [],
    OAProcessTurnRed: false,
    contractFileUrl: '',
    contractFileName: '',
    contractFileList: [],
    contractIsTurnRed: false,
    checkFileUrl: '',
    checkFileName: '',
    checkFileList: [],
    checkIsTurnRed: false,
  });
  //是否尾款
  const [isFinalPay, setIsFinalPay] = useState(2);
  //是否hover
  const [isHover, setIsHover] = useState(false);
  //新增发票
  const [inputReceiptVisible, setInputReceiptVisible] = useState(false);
  const [uploadReceiptVisible, setUploadReceiptVisible] = useState(false);
  const [selectReceiptVisible, setSelectReceiptVisible] = useState(false);
  //下拉框数据
  const [selectorData, setSelectorData] = useState([]);
  //费用类型数据 - 原非树数据
  const [fylxData, setFylxData] = useState([]);
  //预算项目数据 - 原非树数据
  const [ysxmData, setYsxmData] = useState([]);
  //是否有预算项目
  const [isBudget, setIsBudget] = useState(false);
  //费用类型数据
  const [fylxInfo, setFylxInfo] = useState({});
  //发票类型数据
  const [fplxInfo, setFplxInfo] = useState({});
  //预算项目数据
  const [ysxmInfo, setYsxmInfo] = useState({});
  //发票数据
  const [receiptData, setReceiptData] = useState([]); //发票数据-name,base64 - 电子上传
  const [inputReceiptData, setInputReceiptData] = useState([]); //发票数据-name,base64 - 手动录入
  const { visible, setVisible, form, userykbid, handleAddExpenseSuccess } = props;
  const { getFieldDecorator, getFieldValue, validateFields } = form;
  useEffect(() => {
    getSelectorAData();
    return () => {};
  }, []);

  //下拉框数据
  const getSelectorAData = () => {
    QueryCreatePaymentInfo({
      czr: 0,
    })
      .then(res => {
        if (res?.success) {
          let fyTree = TreeUtils.toTreeData(JSON.parse(res.fylxRecord), {
            keyName: 'ID',
            pKeyName: 'FID',
            titleName: 'NAME',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
            persistPrimaryData: true,
          })[0].children[0];
          setFylxData(p => [...JSON.parse(res.fylxRecord)]);
          let ysTree = TreeUtils.toTreeData(JSON.parse(res.ysxmRecord), {
            keyName: 'ID',
            pKeyName: 'FID',
            titleName: 'NAME',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
          })[0].children[0];
          setYsxmData(p => [...JSON.parse(res.ysxmRecord)]);
          let obj = {
            fylxData: fyTree,
            fplxData: JSON.parse(res.fplxRecord),
            ysxmData: ysTree,
          };
          setSelectorData(p => obj);
          // console.log('🚀 ~ file: index.js ~ line 110 ~ getSelectorAData ~ obj', obj);
        }
      })
      .catch(e => {
        console.error('QueryCreatePaymentInfo', e);
      });
  };

  //提交数据 - 确定
  const handleSubmit = () => {
    validateFields(err => {
      if (!err) {
        setVisible(false);
        let submitData = {
          consumptionReasons: getFieldValue('xfsy'),
          date: '',
          taxAmount: getFieldValue('se'),
          je: getFieldValue('je'),
          fylxInfo,
          fplxInfo,
          ysxmInfo,
          receiptFileInfo:
            formData?.receiptFileUrl === ''
              ? []
              : [
                  {
                    base64: formData?.receiptFileUrl,
                    name: formData?.receiptFileName,
                  },
                ],
          OAProcessFileInfo:
            formData?.OAProcessFileUrl === ''
              ? []
              : [
                  {
                    base64: formData?.OAProcessFileUrl,
                    name: formData?.OAProcessFileName,
                  },
                ],
          contractFileInfo:
            formData?.contractFileUrl === ''
              ? ''
              : {
                  base64: formData?.contractFileUrl,
                  name: formData?.contractFileName,
                },
          checkFileInfo:
            formData?.checkFileUrl === ''
              ? ''
              : {
                  base64: formData?.checkFileUrl,
                  name: formData?.checkFileName,
                },
          attachmentLength: 3,
        };
        handleAddExpenseSuccess(submitData);
        console.log('🚀 ~ file: index.js ~ line 135 ~ handleSubmit ~ submitData', submitData);
        //
      }
    });
  };

  //关闭弹窗
  const handleClose = () => {
    setVisible(false);
  };

  const handleReceiptMenuClick = e => {
    if (e.key === '1') {
      setUploadReceiptVisible(true);
      // setSelectReceiptVisible(true);
      return;
    }
    if (e.key === '2') {
      setInputReceiptVisible(true);
      return;
    }
  };
  // const handleDateChange = () => {};

  const handleFylxChange = id => {
    let obj = fylxData?.filter(x => x.ID === id)[0];
    setFylxInfo(obj);
    console.log('🚀 ~ file: index.js ~ line 156 ~ handleFylxChange ~ obj', obj);
    setIsBudget(obj.FID === '20'); //劳务费类型的id 20
  };
  const handleFplxChange = (id, node) => {
    setFplxInfo({ ID: id, NAME: node.props.children, BM: node.props.bm });
    console.log('🚀 ~ file: index.js ~ line 161 ~ handleFplxChange', {
      ID: id,
      NAME: node.props.children,
      BM: node.props.bm,
    });
  };
  const handleYsxmChange = id => {
    setYsxmInfo(ysxmData?.filter(x => x.ID === id)[0]);
    console.log(
      '🚀 ~ file: index.js ~ line 163 ~ handleYsxmChange ~ ysxmData?.filter(x=>x.ID===id)[0]',
      ysxmData?.filter(x => x.ID === id)[0],
    );
  };

  // //日期
  // const getDatePicker = () => {
  //   return (
  //     <Form.Item label="日期" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
  //       {getFieldDecorator('date', {
  //         initialValue: moment(),
  //         rules: [
  //           {
  //             required: true,
  //             message: '日期不允许空值',
  //           },
  //         ],
  //       })(<DatePicker style={{ width: '100%' }} onChange={handleDateChange} />)}
  //     </Form.Item>
  //   );
  // };
  //输入框
  const getInput = ({
    label,
    labelCol,
    wrapperCol,
    dataIndex,
    initialValue,
    rules,
    maxLength,
    node,
  }) => {
    maxLength = maxLength || 150;
    node = node || <Input maxLength={maxLength} placeholder={`请输入${label}`} />;
    return (
      <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
        {getFieldDecorator(dataIndex, {
          initialValue,
          rules,
        })(node)}
      </Form.Item>
    );
  };
  //消费事由
  const getTextArea = () => {
    return (
      <Form.Item label="消费事由" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
        {getFieldDecorator('xfsy', {
          initialValue: '',
        })(
          <TextArea
            className="consumeReason-textarea"
            placeholder="请简述消费事由"
            maxLength={1000}
            autoSize={{ maxRows: 6, minRows: 3 }}
          ></TextArea>,
        )}
        {/* <div className="consumeReason-count-txt">
          {String(getFieldValue('csmReason'))?.length}/{1000}
        </div> */}
      </Form.Item>
    );
  };
  //单选框
  const getRadio = (label, value, onChange, txt1, txt2) => {
    return (
      <Col span={12}>
        <Form.Item label={label} required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Radio.Group value={value} onChange={onChange}>
            <Radio value={1}>{txt1}</Radio>
            <Radio value={2}>{txt2}</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
    );
  };

  //附件
  const getUpload = ({ label, formData, dataIndex, setFormData, labelCol, wrapperCol }) => {
    return (
      <Col span={12}>
        <Form.Item
          label={label}
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
          // required
          help={formData[dataIndex + 'IsTurnRed'] ? `${label}不允许空值` : ''}
          validateStatus={formData[dataIndex + 'IsTurnRed'] ? 'error' : 'success'}
        >
          <Upload
            action={'/api/projectManage/queryfileOnlyByupload'}
            showUploadList={{
              showRemoveIcon: true,
              showPreviewIcon: true,
            }}
            onChange={info => {
              let list = [...info.fileList];
              setFormData(p => {
                p[dataIndex + 'FileList'] = [...list];
                return { ...p };
              });
              if (list.length === 0) {
                setFormData(p => {
                  p[dataIndex + 'IsTurnRed'] = true;
                  return { ...p };
                });
              } else {
                setFormData(p => {
                  p[dataIndex + 'IsTurnRed'] = false;
                  return { ...p };
                });
              }
            }}
            beforeUpload={(file, fileList) => {
              let reader = new FileReader(); //实例化文件读取对象
              reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
              reader.onload = e => {
                //文件读取成功完成时触发
                let urlArr = e.target.result.split(',');
                setFormData(p => {
                  p[dataIndex + 'FileUrl'] = urlArr[1];
                  return { ...p };
                });
                setFormData(p => {
                  p[dataIndex + 'FileName'] = file.name;
                  return { ...p };
                });
              };
            }}
            accept={
              '.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }
            fileList={[...formData[dataIndex + 'FileList']]}
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
  //新增发票
  const getRecepit = () => {
    const menu = (
      <Menu onClick={handleReceiptMenuClick}>
        <Menu.Item key="1">
          <Icon type="file-pdf" />
          电子发票文件
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="form" />
          手录发票
        </Menu.Item>
      </Menu>
    );
    return (
      <Form.Item
        label="发票"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        // required
        help={formData.receiptIsTurnRed ? `${label}不允许空值` : ''}
        validateStatus={formData.receiptIsTurnRed ? 'error' : 'success'}
      >
        <Dropdown overlay={menu}>
          <Button>
            <Icon type="upload" />
            新增发票
          </Button>
        </Dropdown>
      </Form.Item>
    );
  };
  //发票展示
  const getRecepitList = () => {
    const getItem = () => {
      return (
        <div
          className="recepit-item"
          onMouseEnter={() => {
            // setIsHover(true);
            // console.log('hover');
          }}
          onMouseLeave={() => {
            setIsHover(false);
            console.log('leave');
          }}
        >
          {isHover && (
            <div className="recepit-hover-icon">
              <Icon type="delete" />
            </div>
          )}
          <div className="recepit-info">
            <div className="item-top-left">
              <div className="top-left-icon">
                <Icon type="file-pdf" />
              </div>
              <div className="top-left-txt">
                <div className="recepit-name">票据1</div>
                <div className="recepit-time">2023年01月04日</div>
              </div>
            </div>
            <div className="item-top-right">
              <div className="tag-checked">已验真</div>
              <div className="tag-eltronic">电子发票文件</div>
              <div className="tag-VAT">增值税电子普通发票</div>
              {/* <div className='tag-other'>其他票据</div> */}
            </div>
          </div>
          <div className="recepit-tax-rate">
            价税合计<span>￥ 17.28</span>
          </div>
          <div className="recepit-deductible-tax">
            可抵扣税额<span>￥ 0.00</span>
          </div>
          <div className="recepit-bottom">
            <a>查看PDF</a>
            <Button type="primary" style={{ backgroundColor: '#3361ff' }}>
              重新查验
            </Button>
          </div>
        </div>
      );
    };
    return (
      <>
        <Col span={3}></Col>
        <Col span={21}>
          <div className="addexpense-recepit-list">
            {getItem()}
            {getItem()}
            {getItem()}
            {getItem()}
          </div>
        </Col>
      </>
    );
  };
  //输入框入参
  const amountInputProps = {
    label: '金额',
    labelCol: 3,
    wrapperCol: 21,
    dataIndex: 'je',
    initialValue: 1,
    rules: [
      {
        required: true,
        message: '金额不允许空值',
      },
    ],
    node: (
      <InputNumber
        style={{ width: '100%' }}
        max={99999999999.99}
        min={0}
        step={0.01}
        precision={2}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
      />
    ),
  };
  const taxInputProps = {
    label: '税额',
    labelCol: 3,
    wrapperCol: 21,
    dataIndex: 'se',
    rules: [
      // {
      //     required: true,
      //     message: '税额不允许空值',
      // },
    ],
    node: (
      <InputNumber
        style={{ width: '100%' }}
        max={99999999999.99}
        min={0}
        step={0.01}
        precision={2}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
      />
    ),
  };
  //OA流程附件上传入参
  const OAProcessProps = {
    label: 'OA流程附件',
    dataIndex: 'OAProcess',
    formData,
    setFormData,
    labelCol: 10,
    wrapperCol: 14,
  };
  //合同复印件上传入参
  const contractProps = {
    label: '合同复印件',
    dataIndex: 'contract',
    formData,
    setFormData,
    labelCol: 6,
    wrapperCol: 18,
  };
  //验收复印件上传入参
  const checkProps = {
    label: '验收复印件',
    dataIndex: 'check',
    formData,
    setFormData,
    labelCol: 10,
    wrapperCol: 14,
  };
  return (
    <>
      <Drawer
        title="新增费用明细"
        width={720}
        onClose={() => setVisible(false)}
        visible={visible}
        className="add-expense-drawer"
        maskClosable={false}
        zIndex={101}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      >
        <InputReceipt
          visible={inputReceiptVisible}
          setVisible={setInputReceiptVisible}
          setSelectReceiptVisible={setSelectReceiptVisible}
          setInputReceiptData={setInputReceiptData}
          inputReceiptData={inputReceiptData}
        />
        <UploadReceipt
          visible={uploadReceiptVisible}
          setVisible={setUploadReceiptVisible}
          userykbid={userykbid}
          setSelectReceiptVisible={setSelectReceiptVisible}
          receiptData={receiptData}
          setReceiptData={setReceiptData}
        />
        <SelectReceipt
          visible={selectReceiptVisible}
          setVisible={setSelectReceiptVisible}
          setUploadReceiptVisible={setUploadReceiptVisible}
          setInputReceiptVisible={setInputReceiptVisible}
          inputReceiptData={inputReceiptData}
          receiptData={receiptData}
        />
        <Form.Item label="费用类型" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
          {getFieldDecorator('fylx')(
            <TreeSelect
              allowClear
              showSearch
              multiple={false}
              style={{ width: '100%' }}
              treeNodeFilterProp="title"
              dropdownClassName="newproject-treeselect"
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              treeData={selectorData?.fylxData}
              placeholder="请选择"
              onChange={handleFylxChange}
            />,
          )}
        </Form.Item>
        {getInput(amountInputProps)}
        {getRecepit()}
        <Row>{getRecepitList()}</Row>
        {getInput(taxInputProps)}
        <Form.Item label="发票类型" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
          {getFieldDecorator('fplx')(
            <Select
              style={{ width: '100%', borderRadius: '1.1904rem !important' }}
              showSearch
              placeholder="请选择"
              onChange={handleFplxChange}
            >
              {selectorData?.fplxData?.map((item = {}, ind) => {
                return (
                  <Select.Option key={ind} value={item.ID} bm={item.BM}>
                    {item.MC}
                  </Select.Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
        {getTextArea()}
        {isBudget && (
          <Form.Item label="预算项目" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
            {getFieldDecorator('ysxm')(
              <TreeSelect
                allowClear
                style={{ width: '100%' }}
                showSearch
                multiple={false}
                treeNodeFilterProp="title"
                dropdownClassName="newproject-treeselect"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={selectorData?.ysxmData}
                placeholder="请选择"
                onChange={handleYsxmChange}
              />,
            )}
          </Form.Item>
        )}
        <Row>
          {getUpload(contractProps)}
          {getUpload(OAProcessProps)}
        </Row>
        <Row>
          {getRadio('是否尾款', isFinalPay, e => setIsFinalPay(e.target.value), '是', '否')}
          {isFinalPay === 1 && getUpload(checkProps)}
        </Row>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '0.1488rem solid #e9e9e9',
            padding: '1.488rem 2.3808rem',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            关闭
          </Button>
          <Button onClick={handleSubmit} type="primary">
            确定
          </Button>
        </div>
      </Drawer>
    </>
  );
};
export default Form.create()(AddExpense);
