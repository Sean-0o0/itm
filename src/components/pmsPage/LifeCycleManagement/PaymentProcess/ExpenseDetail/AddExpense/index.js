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
  message,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import InputReceipt from './InputReceipt';
import UploadReceipt from './UploadReceipt';
import SelectReceipt from './SelectReceipt';
import { CheckInvoice, QueryCreatePaymentInfo } from '../../../../../../services/pmsServices';
import TreeUtils from '../../../../../../utils/treeUtils';
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
    OAProcessFileData: [],
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
  const [fylxInfo, setFylxInfo] = useState({
    ID: '-1',
    NAME: '无',
    FYLXDM: '',
    MBDM: '',
  });
  //发票类型数据
  const [fplxInfo, setFplxInfo] = useState({
    ID: '-1',
    NAME: '无',
    BM: '',
  });
  //预算项目数据
  const [ysxmInfo, setYsxmInfo] = useState({
    ID: '-1',
    NAME: '无',
    YSFYDM: '',
  });
  //发票数据
  const [receiptData, setReceiptData] = useState([]); //发票数据 - 电子上传,手录
  const [receiptDisplay, setReceiptDisplay] = useState([]); //发票数据-展示用
  const { visible, setVisible, form, userykbid, handleAddExpenseSuccess, currentXmid } = props;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [oaData, setOaData] = useState([]); //oa数据
  //防抖定时器
  let timer = null;

  useEffect(() => {
    getSelectorData();
    return () => {
      clearTimeout(timer);
    };
  }, []);
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

  //下拉框数据
  const getSelectorData = () => {
    QueryCreatePaymentInfo({
      czr: 0,
      xmid: currentXmid,
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
            fklcData: JSON.parse(res.fklcRecord),
          };
          setSelectorData(p => obj);
          // console.log('🚀 ~ file: index.js ~ line 110 ~ getSelectorData ~ obj', obj);
        }
      })
      .catch(e => {
        console.error('QueryCreatePaymentInfo', e);
      });
  };

  //提交数据 - 确定
  const handleSubmit = () => {
    console.log(selectorData?.fklcData);
    validateFields(err => {
      if (!err) {
        setVisible(false);
        let oaArr = oaData?.map(x => {
          return {
            name: x.name,
            base64: x.base64,
          };
        });
        let receiptArr = [...receiptDisplay];
        let attachmentArr = [...oaArr];
        formData?.contractFileUrl !== '' &&
          attachmentArr.push({
            base64: formData?.contractFileUrl,
            name: formData?.contractFileName,
          });
        formData?.checkFileUrl !== '' &&
          attachmentArr.push({
            base64: formData?.checkFileUrl,
            name: formData?.checkFileName,
          });
        let submitData = {
          consumptionReasons: getFieldValue('xfsy') === '' ? '无' : getFieldValue('xfsy'),
          date: moment().format('YYYYMMDD'),
          taxAmount: getFieldValue('se') === '' ? 0 : getFieldValue('se'),
          je: getFieldValue('je') === '' ? 0 : getFieldValue('je'),
          fylxInfo,
          fplxInfo,
          ysxmInfo,
          receiptFileInfo: [...receiptDisplay],
          OAProcessFileInfo: [...oaArr],
          contractFileInfo:
            formData?.contractFileUrl === ''
              ? {
                  base64: '无',
                  name: '无',
                }
              : {
                  base64: formData?.contractFileUrl,
                  name: formData?.contractFileName,
                },
          checkFileInfo:
            formData?.checkFileUrl === ''
              ? {
                  base64: '无',
                  name: '无',
                }
              : {
                  base64: formData?.checkFileUrl,
                  name: formData?.checkFileName,
                },
          attachmentLength: attachmentArr.length,
          attachmentArr,
          isFinalPay,
          lcid: selectorData?.fklcData[0]?.ID || -1,
        };
        handleAddExpenseSuccess(submitData);
        console.log('🚀 ~ file: index.js ~ line 135 ~ handleSubmit ~ submitData', submitData);
        //
        resetFields();
        setReceiptData([]);
        setReceiptDisplay([]);
        setFormData(p => {
          p.OAProcessFileData = [];
          p.OAProcessFileList = [];
          p.OAProcessTurnRed = false;
          p.contractFileUrl = '';
          p.contractFileName = '';
          p.contractFileList = [];
          p.contractIsTurnRed = false;
          p.checkFileUrl = '';
          p.checkFileName = '';
          p.checkFileList = [];
          p.checkIsTurnRed = false;
          return {
            ...p,
          };
        });
        console.log('确定了');
      }
    });
  };

  //关闭弹窗
  const handleClose = () => {
    setVisible(false);
    resetFields();
    setReceiptData([]);
    setReceiptDisplay([]);
    setFormData(p => {
      p.OAProcessFileData = [];
      p.OAProcessFileList = [];
      p.OAProcessTurnRed = false;
      p.contractFileUrl = '';
      p.contractFileName = '';
      p.contractFileList = [];
      p.contractIsTurnRed = false;
      p.checkFileUrl = '';
      p.checkFileName = '';
      p.checkFileList = [];
      p.checkIsTurnRed = false;
      return {
        ...p,
      };
    });
    console.log('取消了');
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
    // console.log('🚀 ~ file: index.js ~ line 156 ~ handleFylxChange ~ obj', obj);
    setIsBudget(obj.FID === '20'); //劳务费类型的id 20
  };
  const handleFplxChange = (id, node) => {
    setFplxInfo({ ID: id, NAME: node.props.children, BM: node.props.bm });
    // console.log('🚀 ~ file: index.js ~ line 161 ~ handleFplxChange', {
    //   ID: id,
    //   NAME: node.props.children,
    //   BM: node.props.bm,
    // });
  };
  const handleYsxmChange = id => {
    setYsxmInfo(ysxmData?.filter(x => x.ID === id)[0]);
    // console.log(
    //   '🚀 ~ file: index.js ~ line 163 ~ handleYsxmChange ~ ysxmData?.filter(x=>x.ID===id)[0]',
    //   ysxmData?.filter(x => x.ID === id)[0],
    // );
  };

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

  //单附件
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
                  p[dataIndex + 'FileUrl'] = e.target.result;
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
  //多附件
  const getMultipleUpload = ({ label, formData, dataIndex, setFormData, labelCol, wrapperCol }) => {
    return (
      <Col span={12}>
        <Form.Item
          label={label}
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
          help={formData[dataIndex + 'IsTurnRed'] ? `${label}不允许空值` : ''}
          validateStatus={formData[dataIndex + 'IsTurnRed'] ? 'error' : 'success'}
        >
          <Upload
            action={'/api/projectManage/queryfileOnlyByupload'}
            showUploadList={{
              showRemoveIcon: true,
              showPreviewIcon: true,
            }}
            multiple={true}
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
              let arr = [];
              fileList.forEach(item => {
                let reader = new FileReader(); //实例化文件读取对象
                reader.readAsDataURL(item); //将文件读取为 DataURL,也就是base64编码
                reader.onload = e => {
                  //文件读取成功完成时触发
                  let urlArr = e.target.result.split(',');
                  arr.push({
                    name: item.name,
                    base64: e.target.result,
                  });
                  if (arr.length === fileList.length) {
                    debounce(() => {
                      setOaData(p => [...arr]);
                      console.log('🚀 ~ file: index.js ~ line 407 ~ debounce ~ [...arr]', [...arr]);
                    }, 500);
                  }
                };
              });
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
        {/* <Menu.Item key="2">
          <Icon type="form" />
          手录发票
        </Menu.Item> */}
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
  const checkFp = data => {
    let arr = [...receiptDisplay];
    arr.forEach(x => {
      if (x.key === data.key) {
        x.loading = true;
      }
    });
    setReceiptDisplay(p => [...arr]);
    CheckInvoice({
      fileName: [data?.fileName],
      invoiceData: [(data?.base64.split(','))[1]],
      staffId: userykbid,
    }).then(res => {
      if (res.result[0].isCheck === 'true') message.success('查验通过', 1);
      else {
        message.error('查验失败', 1);
      }
      let arr = [...receiptDisplay];
      arr.forEach(x => {
        if (x.key === data.key) {
          x.loading = false;
        }
      });
      setReceiptDisplay(p => [...arr]);
    });
  };
  const handleDeleteReceipt = data => {
    let arr = receiptDisplay?.filter(item => item.key !== data.key);
    console.log('🚀 ~ file: index.js ~ line 554 ~ handleDeleteReceipt ~ arr', arr);
    setReceiptDisplay(p => [...arr]);
    setReceiptData(p => [...arr]);
  };
  //发票展示
  const getRecepitList = () => {
    const getItem = data => (
      <div
        className="recepit-item"
        key={data?.key}
        onMouseEnter={() => {
          let arr = [...receiptDisplay];
          arr.forEach(x => {
            if (x.key === data?.key) {
              x.isHover = true;
            }
          });
          console.log('🚀 ~ file: index.js ~ line 571 ~ getRecepitList ~ arr', arr);
          setReceiptDisplay(p => [...arr]);
        }}
        onMouseLeave={() => {
          let arr = [...receiptDisplay];
          arr.forEach(x => {
            if (x.key === data.key) {
              x.isHover = false;
            }
          });
          setReceiptDisplay(p => [...arr]);
        }}
      >
        {data?.isHover && (
          //<Popconfirm title="确定要移除吗？" onConfirm={() => handleDeleteReceipt(data)}>
          <div className="icon-delete" onClick={() => handleDeleteReceipt(data)}>
            <i className="iconfont delete" />
          </div>
          //</Popconfirm>
        )}
        <div className="recepit-info">
          <div className="item-top-left">
            <div className="top-left-icon">
              <Icon type="file-pdf" />
            </div>
            <div className="top-left-txt">
              <div className="recepit-name">{data?.xsfmc}</div>
              <div className="recepit-time">
                {moment(Number(data?.date)).format('YYYY年MM月DD日')}
              </div>
            </div>
          </div>
          <div className="item-top-right">
            {data?.isCheck && <div className="tag-checked">已验真</div>}
            <div className="tag-eltronic">{data?.source}</div>
            <div className="tag-VAT">{data?.invoiceType}</div>
            {/* <div className='tag-other'>其他票据</div> */}
          </div>
        </div>
        <div className="recepit-tax-rate">
          价税合计<span>￥ {data?.zje}</span>
        </div>
        <div className="recepit-deductible-tax">
          可抵扣税额<span>￥ {data?.se}</span>
        </div>
        <div className="recepit-bottom">
          <a
            style={{ color: '#3361ff' }}
            onClick={() => {
              //文件预览
              let ifram = "<iframe width='100%' height='100%' src='" + data?.base64 + "'></iframe>";
              let page = window.open().document;
              page.open();
              page.write(ifram);
              page.close();
            }}
          >
            查看PDF
          </a>
          <Button
            onClick={() => checkFp(data)}
            type="primary"
            className="btn"
            loading={data?.loading}
          >
            重新查验
          </Button>
        </div>
      </div>
    );

    if (receiptDisplay?.length !== 0)
      return (
        <>
          <Col span={3}></Col>
          <Col span={21}>
            <div className="addexpense-recepit-list">
              {receiptDisplay?.map(item => getItem(item))}
            </div>
          </Col>
        </>
      );
    return null;
  };
  const getAmountSum = () => {
    let jesum = 0;
    let sesum = 0;
    receiptDisplay?.forEach(x => {
      jesum += Number(x.zje);
      sesum += Number(x.se);
    });
    return {
      jesum,
      sesum,
    };
  };
  //输入框入参
  const amountInputProps = {
    label: '金额',
    labelCol: 3,
    wrapperCol: 21,
    dataIndex: 'je',
    initialValue: getAmountSum().jesum,
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
    initialValue: getAmountSum().sesum,
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
        destroyOnClose={true}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      >
        <InputReceipt
          visible={inputReceiptVisible}
          setVisible={setInputReceiptVisible}
          setSelectReceiptVisible={setSelectReceiptVisible}
          // setInputReceiptData={setInputReceiptData}
          // inputReceiptData={inputReceiptData}
          receiptData={receiptData}
          setReceiptData={setReceiptData}
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
          // inputReceiptData={inputReceiptData}
          receiptData={receiptData}
          setReceiptData={setReceiptData}
          setReceiptDisplay={setReceiptDisplay}
        />
        <Form.Item label="费用类型" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
          {getFieldDecorator('fylx', {
            rules: [
              {
                required: true,
                message: '费用类型不允许空值',
              },
            ],
          })(
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
              allowClear
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
          {getMultipleUpload(OAProcessProps)}
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
