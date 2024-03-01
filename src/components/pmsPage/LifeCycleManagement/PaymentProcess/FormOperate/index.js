import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Upload,
  Select,
  Radio,
  InputNumber,
  Spin,
  message,
  Tooltip,
  Icon,
} from 'antd';
import moment from 'moment';
import {
  QueryContractFlowInfo,
  QueryCreatePaymentInfo,
  QueryPaymentAccountList,
} from '../../../../../services/pmsServices';
// import debounce from 'lodash/debounce';
const { TextArea } = Input;

export default function FormOperate(props) {
  const [isSkzhOpen, setIsSkzhOpen] = useState(false);
  const {
    form,
    formData,
    setAddSkzhModalVisible,
    isHwPrj = false,
    currentXmid = -2,
    rlwbData = {},
    ddcgje = 0,
    dictionary = {},
    dhtData = [],
    ddfkData = {},
  } = props;
  const { DJLX = [] } = dictionary;
  const {
    sfyht,
    setSfyht,
    htje,
    yfkje,
    setSqrq,
    zhfw,
    setZhfw,
    setskzhId,
    setYkbSkzhId,
    fklx,
    setFklx,
  } = formData;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  //收款账户
  const [skzh, setSkzh] = useState([]);
  const [fetching, setFetching] = useState(false); //在加载数据
  const [currentPage, setCurrentPage] = useState(1); //收款账户数据懒加载页号
  const [currentKhmc, setCurrentKhmc] = useState(''); //款账户文本
  const [isNoMoreData, setIsNoMoreData] = useState(false); //没有更多数据了
  const [glsbData, setGlsbData] = useState([]); //关联设备采购有合同流程数据

  let timer = null;
  useEffect(() => {
    if (currentXmid !== -2) {
      firstTimeQueryPaymentAccountList();
      if (isHwPrj) {
        getSelectorData();
      } else if (ddcgje !== 0) {
        getSelectorData();
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [currentXmid]);

  //下拉框数据
  const getSelectorData = () => {
    QueryCreatePaymentInfo({
      czr: 0,
      xmid: currentXmid,
    })
      .then(res => {
        if (res?.success) {
          setGlsbData(p => [...JSON.parse(res.lcxxRecord)]);
          // console.log('🚀 ~ getSelectorData ~ lcxxRecord:', [...JSON.parse(res.lcxxRecord)]);
        }
      })
      .catch(e => {
        console.error('QueryCreatePaymentInfo', e);
        message.error('关联设备采购有合同流程数据查询失败', 1);
      });
  };

  //防抖
  const debounce = (fn, waits = 500) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
  };

  //是否有合同变化
  const onSfyhtChange = e => {
    setSfyht(e.target.value);
  };
  //账户范围变化
  const onZhfwChange = e => {
    // let rec = [...dgskzh];
    // let tempArr = rec.filter(x => {
    //   let arr = x.ssr?.split(';');
    //   return arr?.includes(String(LOGIN_USER_ID));
    // });
    // let finalArr = Number(e.target.value) === 1 ? [...rec] : [...tempArr];
    setZhfw(e.target.value);
    // setSkzh(p => [...finalArr]);
  };
  //收款账户变化
  const handleSkzhChange = id => {
    const obj = skzh?.filter(x => x.id === id)[0];
    // console.log('🚀 ~ file: index.js:105 ~ handleSkzhChange ~ obj:', obj);
    setskzhId(obj?.id);
    setYkbSkzhId(obj?.ykbid);
    setCurrentPage(1);
    setIsNoMoreData(false);
  };
  const firstTimeQueryPaymentAccountList = (khmc = '') => {
    QueryPaymentAccountList({
      type: 'ALL',
      current: 1,
      pageSize: 10,
      paging: 1,
      sort: '1',
      total: -1,
      khmc,
      zhid: -1,
    })
      .then(res => {
        if (res.success) {
          let rec = res.record;
          // console.log('🚀 ~ file: index.js:111 ~ firstTimeQueryPaymentAccountList ~ rec:', rec);
          setCurrentPage(1);
          setSkzh(p => [...rec]);
          setIsNoMoreData(false);
          setCurrentKhmc(khmc);
        }
      })
      .catch(e => {
        message.error('收款账号查询失败', 1);
      });
  };
  const getSkzhData = (khmc = '', current = 1) => {
    setFetching(true);
    console.log('handleSkzhSearch', khmc);
    QueryPaymentAccountList({
      type: 'ALL',
      current,
      pageSize: 10,
      paging: 1,
      sort: '1',
      total: -1,
      khmc,
      zhid: -1,
    })
      .then(res => {
        if (res.success) {
          let rec = res.record;
          console.log('🚀 ~ file: index.js:132 ~ getSkzhData ~ res:', res);
          let arr = [...skzh];
          if (res.totalrows <= 10) {
            setSkzh(p => [...rec]);
            setIsNoMoreData(true);
            setFetching(false);
          } else if (rec.length === 0) {
            setSkzh(p => [...arr]);
            setIsNoMoreData(true);
            setFetching(false);
          } else {
            setSkzh(p => [...arr, ...rec]);
            setFetching(false);
          }
          // console.log('🚀 ~ file: index.js:124 ~ getSkzhData ~ ', [...arr, ...rec]);
        }
      })
      .catch(e => {
        message.error('收款账号查询失败', 1);
      });
  };
  //
  const handleSkzhSearch = khmc => {
    debounce(() => firstTimeQueryPaymentAccountList(khmc));
  };
  //
  const handleSkzhScroll = e => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    // throttle(() => {
    if (scrollHeight - scrollTop - clientHeight <= 10) {
      let index = currentPage;
      index = index + 1;
      if (!isNoMoreData) {
        setCurrentPage(index);
        getSkzhData(currentKhmc, index);
      }
    }
    // }, 1000)();
  };
  //申请日期变化
  const onSqrqChange = (d, ds) => {
    setSqrq(ds);
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
  const getInput = ({
    label,
    labelCol,
    wrapperCol,
    dataIndex,
    initialValue,
    rules,
    maxLength,
    node,
    amount = undefined,
  }) => {
    maxLength = maxLength || 150;
    node = node || <Input maxLength={maxLength} placeholder={`请输入${label}`} />;
    return (
      <Col span={12}>
        <Form.Item
          className={amount && 'amount-help'}
          label={label}
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
        >
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules,
          })(node)}
        </Form.Item>
        {amount && (
          <div
            style={{
              position: 'absolute',
              top: '42px',
              left: '135px',
              fontSize: '12px',
              color: '#b0b0b0ba',
            }}
          >
            {amount}
          </div>
        )}
      </Col>
    );
  };
  //单选框
  const getRadio = (label, value, onChange, txt1, txt2) => {
    return (
      <Col span={12}>
        <Form.Item label={label} required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Radio.Group value={value} onChange={onChange}>
            <Radio value={1}>{txt1}</Radio>
            <Radio value={2}>{txt2}</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
    );
  };
  //单据类型单选
  const getDJLXRadio = () => {
    if (DJLX.length > 0)
      return (
        <Col span={12}>
          <Form.Item label="单据类型" required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator('djlx', {
              initialValue: DJLX[0].ibm,
              rules: [
                {
                  required: true,
                  message: '单据类型不允许空值',
                },
              ],
            })(
              <Radio.Group>
                {DJLX.map(x => (
                  <Radio key={x.ibm} value={x.ibm}>
                    {x.note}
                  </Radio>
                ))}
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
      );
    return null;
  };
  //申请日期
  const getDatePicker = () => {
    return (
      <Col span={12}>
        <Form.Item label="申请日期" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          {getFieldDecorator('sqrq', {
            initialValue: moment(),
            rules: [
              {
                required: true,
                message: '申请日期不允许空值',
              },
            ],
          })(<DatePicker style={{ width: '100%' }} onChange={onSqrqChange} />)}
        </Form.Item>
      </Col>
    );
  };
  //收款账户
  const getSelector = () => {
    return (
      <>
        <Col span={24} style={{ position: 'relative' }}>
          <Form.Item label="收款账户" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('skzh', {
              rules: [
                {
                  required: true,
                  message: '收款账户不允许空值',
                },
              ],
            })(
              <Select
                style={{ width: '100%', borderRadius: '8px !important' }}
                className="skzh-box"
                showSearch
                allowClear
                placeholder="请选择收款账户"
                onChange={handleSkzhChange}
                dropdownClassName="payment-account-select"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                optionLabelProp="children"
                onSearch={handleSkzhSearch}
                onPopupScroll={handleSkzhScroll}
                onBlur={() => firstTimeQueryPaymentAccountList()}
              >
                {skzh?.map((item = {}, ind) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      <Tooltip
                        title={
                          <div>
                            开户行：{item.khmc}
                            <div>账号：{item.yhkh}</div>
                            网点：{item.wdmc}
                          </div>
                        }
                        placement="topLeft"
                      >
                        <i
                          className="iconfont icon-bank"
                          style={{ fontSize: '1em', marginRight: '4px', color: '#3361ff' }}
                        />
                        {item.khmc} - {item.yhkh} - {item.wdmc}
                      </Tooltip>
                      <div style={{ fontSize: '12px', marginLeft: '18px', color: '#bfbfbf' }}>
                        所属者：{item.ssr}
                      </div>
                    </Select.Option>
                  );
                })}
                {isNoMoreData && (
                  <Select.Option
                    key={'无更多数据'}
                    value={'无更多数据'}
                    style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.65)' }}
                    disabled={true}
                  >
                    无更多数据
                  </Select.Option>
                )}
              </Select>,
            )}
          </Form.Item>
          <div
            style={{
              height: '20px',
              width: '1px',
              backgroundColor: '#c7c7c7',
              marginLeft: '8px',
              marginTop: '10px',
              cursor: 'pointer',
              position: 'absolute',
              top: '0',
              right: '40px',
            }}
          ></div>
          <i
            className="iconfont circle-add"
            onClick={() => setAddSkzhModalVisible(true)}
            style={{
              marginTop: '6px',
              cursor: 'pointer',
              position: 'absolute',
              top: '0',
              right: '12px',
              color: '#c7c7c7',
              fontSize: '20px',
            }}
          />
        </Col>
      </>
    );
  };
  //关联设备采购有合同
  const getGlsbcgyhtSelector = () => {
    return (
      <>
        <Col span={12}>
          <Form.Item
            label={
              <div style={{ display: 'inline-block', lineHeight: '17px' }}>
                关联设备采购
                <br />
                有合同流程
              </div>
            }
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            {getFieldDecorator('glsb', {
              rules: [
                {
                  required: true,
                  message: '关联设备采购有合同流程不允许空值',
                },
              ],
            })(
              <Select
                style={{ width: '100%', borderRadius: '8px !important' }}
                showSearch
                placeholder="请选择关联设备采购有合同流程"
              >
                {glsbData?.map((item = {}, ind) => {
                  return (
                    <Select.Option key={item.ID} value={item.ID}>
                      <Tooltip title={item.BT} placement="topLeft">
                        {item.BT}
                      </Tooltip>
                      <div style={{ fontSize: '12px', color: '#bfbfbf' }}>
                        {moment(item.BGRQ, 'YYYYMMDD').format('YYYY-MM-DD')}
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </>
    );
  };

  //关联合同
  const getGlhtSelector = () => {
    return (
      <>
        <Col span={12}>
          <Form.Item
            label={
              <span>
                关联合同
                <Tooltip
                  title="可将付款流程和具体的合同信息进行关联"
                  overlayStyle={{ maxWidth: 'unset' }}
                >
                  <Icon type="question-circle-o" style={{ marginLeft: 4, color: '#000000d9' }} />
                </Tooltip>
              </span>
            }
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            {getFieldDecorator('glht', {
              initialValue: dhtData[0].ID,
              rules: [
                {
                  required: true,
                  message: '关联合同不允许空值',
                },
              ],
            })(
              <Select
                style={{ width: '100%', borderRadius: '8px !important' }}
                placeholder="请选择关联合同"
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children?.props?.children
                    ?.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={v => {
                  setFieldsValue({
                    htje: Number(dhtData.find(x => x.ID === v)?.HTJE || 0),
                    yfkje: Number(dhtData.find(x => x.ID === v)?.YFKJE || 0),
                  });
                }}
              >
                {dhtData.map(x => (
                  <Option key={x.ID} value={x.ID}>
                    <Tooltip title={x.HTMC} placement="topLeft">
                      {x.HTMC}
                    </Tooltip>
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </>
    );
  };

  //描述
  const getTextArea = () => {
    return (
      <Col span={24}>
        <Form.Item label="描述" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          {getFieldDecorator('ms', {
            initialValue: '',
          })(
            <TextArea
              className="ms-textarea"
              placeholder="请输入描述"
              maxLength={1000}
              autoSize={{ maxRows: 6, minRows: 3 }}
            ></TextArea>,
          )}
          {/* <div className="ms-count-txt">
            {String(getFieldValue('ms'))?.length}/{1000}
          </div> */}
        </Form.Item>
      </Col>
    );
  };

  //输入框入参
  const btInputProps = {
    label: '标题',
    labelCol: 8,
    wrapperCol: 16,
    dataIndex: 'bt',
    initialValue: '',
    rules: [
      {
        required: true,
        message: '标题不允许空值',
      },
    ],
  };
  const htjeInputProps = {
    label: '合同金额(CNY)',
    labelCol: 8,
    wrapperCol: 16,
    dataIndex: 'htje',
    // 多合同时默认第一个的
    initialValue:
      rlwbData.ZJE ?? ddfkData.zcb ?? (dhtData.length > 1 ? Number(dhtData[0].HTJE || 0) : htje),
    rules: [
      {
        required: true,
        message: '合同金额不允许空值',
      },
    ],
    node: (
      <InputNumber
        className="htje-input-number"
        max={99999999999.99}
        min={0}
        step={0.01}
        precision={2}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
      />
    ),
    amount: numToCap(getFieldValue('htje')),
  };
  const yfkjeInputProps = {
    label: '已付款金额(CNY)',
    labelCol: 8,
    wrapperCol: 16,
    dataIndex: 'yfkje',
    //迭代付款时为0，多合同时默认第一个的
    initialValue:
      ddfkData !== false ? 0 : dhtData.length > 1 ? Number(dhtData[0].YFKJE || 0) : yfkje,
    rules: [
      {
        required: true,
        message: '已付款金额不允许空值',
      },
    ],
    node: (
      <InputNumber
        className="yfkje-input-number"
        max={99999999999.99}
        min={0}
        step={0.01}
        precision={2}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
      />
    ),
    amount: numToCap(getFieldValue('yfkje')),
  };
  const fjzsInputProps = {
    label: '附件张数',
    labelCol: 8,
    wrapperCol: 16,
    dataIndex: 'fjzs',
    initialValue: '',
    rules: [
      {
        required: true,
        message: '附件张数不允许空值',
      },
      {
        pattern: /^\d{0,13}$/,
        message: '只能输入整数',
      },
    ],
    maxLength: 13,
  };
  let LOGIN_USER = JSON.parse(sessionStorage.getItem('user'));
  let LOGIN_USER_NAME = LOGIN_USER.name;
  let LOGIN_USER_ORG_NAME = localStorage.getItem('orgName');
  return (
    <Form style={{ padding: '0 24px' }}>
      <div className="basic-info-title">基本信息</div>
      <Row>
        {getInputDisabled('提交人', LOGIN_USER_NAME, 8, 16)}
        {getInputDisabled('部门', LOGIN_USER_ORG_NAME, 8, 16)}
      </Row>
      <Row>
        {getInput(btInputProps)}
        {getDatePicker()}
      </Row>
      <div className="payment-info-title">付款信息</div>
      <Row>
        {getRadio('是否有合同', sfyht, onSfyhtChange, '是', '否')}
        {getDJLXRadio()}
      </Row>
      <Row>
        {dhtData.length > 1 && getGlhtSelector()}
        {getInput(fjzsInputProps)}
      </Row>
      <Row>
        {getInput(htjeInputProps)}
        {/* 硬件入围优先 */}
        {isHwPrj && getGlsbcgyhtSelector()}
        {!isHwPrj &&
          ddcgje !== 0 &&
          getRadio('付款类型', fklx, e => setFklx(e.target.value), '软件付款', '硬件付款')}
        {getInput(yfkjeInputProps)}
      </Row>
      <Row>
        {/* 不是硬件入围，再看单独采购金额 */}
        {!isHwPrj && ddcgje !== 0 && fklx === 2 && getGlsbcgyhtSelector()}
      </Row>
      <Row>{getSelector()}</Row>
      <Row>{getTextArea()}</Row>
    </Form>
  );
}

/**
 * 金额转为中文大写
 * 最大处理金额为 999999999999999.9
 * 最多只读到第四位小数，需要在传参前自行精确，如：1.23456 => 壹元贰角叁分肆毫伍厘
 * @param num 金额数字
 */
const numToCap = num => {
  //汉字的数字
  const cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  const cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  const cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  const cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  const cnInteger = '整';
  //整型完以后的单位
  const cnIntLast = '元';
  //最大处理的数字
  const maxNum = 999999999999999.9;
  //金额整数部分
  let integerNum;
  //金额小数部分
  let decimalNum;
  //输出的中文金额字符串
  let chineseStr = '';
  //分离金额后用的数组，预定义
  let parts;
  if (num > maxNum) {
    return '错误：数字超过999999999999999.9';
  }
  // 传入的参数为0情况
  if (num === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  // 转为字符串
  let strNUm = String(num);
  // indexOf 检测某字符在字符串中首次出现的位置 返回索引值（从0 开始） -1 代表无
  if (strNUm.indexOf('.') === -1) {
    integerNum = strNUm;
    decimalNum = '';
  } else {
    parts = strNUm.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //转换整数部分
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0;
    let IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    // 最后+ 元
    chineseStr += cnIntLast;
  }
  // 转换小数部分
  if (decimalNum != '') {
    let decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum === '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
};
export { numToCap };
