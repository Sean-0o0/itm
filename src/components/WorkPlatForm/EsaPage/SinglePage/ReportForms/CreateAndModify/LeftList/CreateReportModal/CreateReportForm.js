import React from 'react';
import { Form, Row, Col, Radio, Input, Button, message, Checkbox, Icon, Spin } from 'antd';
import { FetchOptionalIndicators, FetchCreateUpdateReports } from '../../../../../../../services/reportcenter';

class CreateReportForm extends React.Component {
  state = {
    loading: false,
    sjwd: '1', // 表单中数据维度
    IndicatorsData: [], // 获取的可选指标数据
    checkedIndicators: [], // 保存勾选的指标(仅包含rowkey)
    searchValue: '', // 保存搜索指标的框输入值
    confirmBtnLoading: false, // 生成报表按钮loading
  };
  componentDidMount() {
    this.getIndicatorsData();// 获取可选指标数据
  }
  // 点击取消按钮
  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  }
  // 指标搜索框值变化
  onSearchChange = (e) => {
    const { value = '' } = e.target;
    this.setState({
      searchValue: value,
    });
  }
  // 点击已选指标前的删除icon
  onClickIcon = (key) => {
    const { getFieldsValue } = this.props.form;
    const { zb = [] } = getFieldsValue();
    const zbTemp = zb.filter(item => item !== key);
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      zb: zbTemp,
    });
    this.setState({ checkedIndicators: zbTemp });
  }
  getIndicatorsData = (params = {}) => {
    this.setState({ loading: true });
    const { sjwd = '1' } = this.state;
    FetchOptionalIndicators({
      sjwd,
      paging: -1,
      ...params,
    }).then((result) => {
      const { records = [] } = result;
      this.setState({ loading: false, IndicatorsData: records, checkedIndicators: [] });
    }).catch((error) => {
      this.setState({ loading: false });
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 指标checkbox变化
  checkBoxOnChange = (checkedValues = []) => {
    this.setState({ checkedIndicators: checkedValues });
  }
  // 数据维度RadioGroup变化
  sjwdHandleChange = (e) => {
    const { value: sjwdTemp = '' } = e.target || {};
    const { setFieldsValue } = this.props.form;
    if (sjwdTemp) {
      this.getIndicatorsData({ sjwd: sjwdTemp });
    }
    setFieldsValue({
      zb: [],
    });
  }
  // 点击指标中的重置
  handleResetIndicators = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      zb: [],
    });
    this.setState({ checkedIndicators: [] });
  }
  // 点击生成报表按钮
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { bbmc = '', sjwd = '', zb = [] } = { ...values } || {};
        if ((!bbmc && bbmc !== 0) || bbmc.length === 0) {
          message.info('报表名称必填!');
          return false;
        } else if ((!sjwd && sjwd !== 0) || sjwd.length === 0) {
          message.info('数据维度必选!');
          return false;
        } else if ((!zb && zb !== 0) || zb.length === 0) {
          message.info('指标必选!');
          return false;
        }
        // 调用接口
        this.setState({ confirmBtnLoading: true });
        FetchCreateUpdateReports({
          czfs: '1', // 1 新增， 2 修改
          bbmc, // 报表名称
          sjwd, // 数据维度
          sxzb: zb.join() || '',
        }).then((result) => {
          const { code = -1 } = result;
          if (code > 0) {
            message.success('新建报表成功!');
            this.setState({ confirmBtnLoading: false });
          }
          // if (this.props.form && this.props.form.resetFields) this.props.form.resetFields();
          if (this.props.refresRightList && typeof this.props.refresRightList === 'function') this.props.refresRightList();
          this.onCancel();
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
          this.setState({ confirmBtnLoading: false });
        });
      }
    });
  }
  // 字符串过长处理成...
  handleStrFormat = (string, length) => {
    let strTemp = '--';
    if (string && string.length > length) {
      strTemp = <span title={string}>{`${string.substr(0, length - 1)}…`}</span>;
    } else if (string && string.length <= length) {
      strTemp = string;
    }
    return strTemp;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading = false, confirmBtnLoading = false, IndicatorsData = [], checkedIndicators = [], searchValue = ''/* , sjwd = '' */ } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const sjwdData = [{ ibm: '1', note: '指标' }, { ibm: '2', note: '基础交易数据' }, { ibm: '3', note: '薪酬方案' }];
    const checkedZBData = IndicatorsData.filter(item => item.id && checkedIndicators.includes(item.id));
    const filterZBData = IndicatorsData.filter(item => item.idxNm && item.idxNm.includes(searchValue));
    return (
      <React.Fragment>
        <Form className="m-form" style={{ margin: 0 }}>
          <div style={{ height: '40rem', overflow: 'auto' }}>
            <Form.Item {...formItemLayout} style={{ marginTop: '2rem' }} label="报表名称">
              {getFieldDecorator('bbmc', {
                rules: [{ required: true, message: '请填写报表名称!' }, { max: 25, message: '不能超过25个字符' }],
                initialValue: '',
              })(<Input autoComplete="off" />)}
            </Form.Item>

            <Form.Item {...formItemLayout} label="数据维度">
              {getFieldDecorator('sjwd', {
                rules: [{ required: true, message: '请填写报表名称!' }],
                initialValue: '1',
              })( // eslint-disable-line
                <Radio.Group onChange={(e) => { this.sjwdHandleChange(e); }} >
                  {
                    sjwdData.map(item => (<Radio key={item.ibm} value={item.ibm}> {item.note} </Radio>))
                  }
                </Radio.Group>)}
            </Form.Item>

            <Form.Item {...formItemLayout} label="选择指标">
              {getFieldDecorator('zb', {
                  rules: [{ required: true, message: '请选择指标!' }],
                  initialValue: [],
                })( // eslint-disable-line
                  <Checkbox.Group style={{ width: '100%' }} onChange={this.checkBoxOnChange}>
                    <div style={{ border: '1px solid rgba(217, 217, 217)', borderRadius: '4px', padding: '0 2rem' }}>
                      {loading && <Spin style={{ display: 'block', height: '20rem', margin: '0 auto', padding: '8rem 0' }} />}
                      {!loading && IndicatorsData && IndicatorsData.length === 0 && <div style={{ textAlign: 'center', height: '15rem', lineHeight: '15rem' }}> <a>暂无数据</a> </div>}
                      {!loading && IndicatorsData && IndicatorsData.length !== 0 && (
                        <div>
                          <div style={{ marginTop: '10px' }}><Input.Search placeholder="请搜索" value={searchValue} onChange={this.onSearchChange} /></div>
                          <Row key="filter" style={{ maxHeight: '20rem', overflowY: 'auto' }}>
                            {filterZBData.map(item => (
                              <Col span={5} key={item.id}>
                                <Checkbox value={item.id}><span style={{ marginLeft: '5px' }}>{this.handleStrFormat(item.idxNm, 4)}</span></Checkbox>
                              </Col>
                            ))}
                            {filterZBData.length === 0 && <div style={{ textAlign: 'center', height: '5rem', lineHeight: '5rem' }}> <a>未搜索到指标</a> </div>}
                          </Row>
                          <hr className="m-hr" style={{ marginBottom: '5px' }} />
                          <span>已选 <span style={{ color: '#e00e0e ' }}>{checkedIndicators.length}</span> / {IndicatorsData.length}个指标  <span onClick={this.handleResetIndicators} style={{ color: '#04abf9', marginLeft: '20px', cursor: 'pointer' }}>重置</span></span>
                          <Row key="checked">
                            {checkedZBData.map(item => (
                              <Col span={5} key={item.id}>
                                <span><Icon type="close" style={{ cursor: 'pointer' }} onClick={() => { this.onClickIcon(item.id); }} /><span style={{ marginLeft: '5px', color: '#000' }}>{this.handleStrFormat(item.idxNm, 4)}</span></span>
                              </Col>
                            ))}
                          </Row>
                        </div>)
                      }
                    </div>
                  </Checkbox.Group>)
              }
            </Form.Item>

          </div>
          <Form.Item>
            <hr className="m-hr" style={{ marginBottom: '10px' }} />
            <Row>
              <Col span={24} style={{ marginBottom: 10, textAlign: 'center' }}>
                <Button loading={confirmBtnLoading} style={{ marginRight: '0.666rem' }} className="m-btn-radius m-btn-headColor" onClick={this.handleSubmit}> 生成报表 </Button>
                <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={this.onCancel}> 取消 </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  }
}

export default Form.create()(CreateReportForm);
