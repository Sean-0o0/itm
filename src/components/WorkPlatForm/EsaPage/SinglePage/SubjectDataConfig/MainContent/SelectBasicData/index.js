import React, { Component, Fragment } from 'react';
// eslint-disable-next-line no-unused-vars
import { Form, Input, Row, Col, message } from 'antd';
// import moment from 'moment';
import BasicModal from '../../../../../../Common/BasicModal';
import BasicDataModal from './BasicDataModal';
import YearPicker from './YearPicker';
import PageFooter from '../../PageFooter';
// eslint-disable-next-line no-unused-vars
import { FetchOperateSubjectData, FetchQuerySubjectDataList } from '../../../../../../../services/EsaServices/commissionManagement'
import moment from 'moment';
import 'moment/locale/zh-cn';

/*
选择基础基础数据
*/
class SelectBasicData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicDataModalVisible: false,
      selectedBaicData: "", // 已选基础数据
      formData: {}, // 基础数据表单数据
      sbjDataId: '',
    };
  }

  componentWillMount = () => {
    const { sbjDataId = '' } = this.props;
    if (sbjDataId !== '') {
      this.setState({ sbjDataId });
      this.fetchData(sbjDataId);
    }
  }
  componentWillReceiveProps = (nextProps) => {
    const { sbjDataId = '' } = nextProps;
    const { sbjDataId: presbjDataId = '' } = this.props;
    if (sbjDataId !== presbjDataId) {
      this.setState({ sbjDataId });
      this.fetchData(sbjDataId);
    }
  }
  fetchData = (sbjDataId) => {
    FetchQuerySubjectDataList({ prdType: 3, sbjDataId }).then((res) => {
      const { records = [], code = 0 } = res;
      if (code > 0) {
        this.setState({
          formData: records[0] ? records[0] : {},
          selectedBaicData: records[0] ? records[0].bscTbl : {}
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 基础数据选择弹框取消
  onBasicDataModalCancel = () => {
    this.setState({ basicDataModalVisible: false });
  }

  // 基础数据选择弹框确认
  onBasicDataModalOk = () => {
    const selectedData = this.basicDataModal.handleSelectedData();
    if (selectedData.length === 0) {
      message.error('请选择基础数据');
      return;
    }
    let selectedBaicData = "";
    // 填写基础数据输入框值
    let bsctbl = '';
    selectedData.forEach((item) => {
      selectedBaicData = `${selectedBaicData + item.TMPL_NO};`;
      bsctbl = `${bsctbl + item.TMPL_NAME};`;
    });
    this.props.form.setFieldsValue({ bsctbl });
    this.onBasicDataModalCancel();
    this.setState({
      selectedBaicData,
    });
  }

  //  打开基础数据选择弹框
  // eslint-disable-next-line react/sort-comp
  openBaicDataModal = () => {
    this.setState({ basicDataModalVisible: true });
  }

  // 表单检验
  validateForm = () => {
    const { validateFieldsAndScroll } = this.props.form;
    return new Promise((resolve) => {
      validateFieldsAndScroll(null, { scroll: { offsetTop: 80 } }, async (err) => {
        if (!err) {
          resolve(true);
        }
        resolve(false);
      });
    });
  }

  // 提供表单数据
  getFormData = () => {
    const { selectedBaicData } = this.state;
    return Object.assign({}, this.props.form.getFieldsValue(), { selectedBaicData });
  }

  // 提交表单
  handleSubmit = async (sign) => {
    return new Promise((resolve, _reject) => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          resolve(this.commitFom(values, sign));
        }
        resolve(false)
      });
    })
  }

  // 提交数据
  // eslint-disable-next-line no-unused-vars
  commitFom = async (values = {}, sign) => {
    const { sbjDataId = '', sbjDataIdChange } = this.props;
    const params = {
      sbj: values.sbj,
      prfmRpd: values.prfmRpd.format("YYYY"),
      dataPrd: values.dataPrd.format("YYYY"),
      oprType: sbjDataId !== '' ? 2 : 1,
      prdType: 3, // 期间类型1|月;2|季度;3|年
      bscTbl: this.state.selectedBaicData,
      sbjDataId: sbjDataId !== '' ? sbjDataId : '',
    };
    let bol = false;
    await FetchOperateSubjectData({ ...params }).then((response) => {
      const { code, note } = response;
      if (code < 0) {
        message.error(note);
      } else {
        if (sign === 1) {
          sbjDataIdChange(code);
          this.props.toNextStep();
        }
        bol = code;
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    return bol;
  }


  render() {
    const { basicDataModalVisible = false, selectedBaicData = [], formData = {} } = this.state;
    const { getFieldDecorator } = this.props.form;
    const modalProps = {
      title: '选择记录',
      width: '50rem',
      height: '35rem',
      visible: basicDataModalVisible,
      onOk: this.onBasicDataModalOk,
      onCancel: this.onBasicDataModalCancel,
      destroyOnClose: true,
    };
    return (
      <Fragment>
        <Form labelCol={{ span: 4 }} className="mt24">
          <Form.Item label="标题" wrapperCol={{ span: 10 }}>
            {
              getFieldDecorator('sbj', {
                initialValue: formData.subject,
                rules: [{
                  required: true,
                  message: '标题不能为空',
                }]
              })(<Input placeholder="请输入标题" />)
            }
          </Form.Item>
          <Form.Item label="考核年度" wrapperCol={{ span: 10 }}>
            {
              getFieldDecorator('prfmRpd', {
                initialValue: formData.prfmPrd ? moment(formData.prfmPrd) : undefined,
                rules: [{
                  required: true,
                  message: '考核年度不能为空',
                }]
              })(<YearPicker />)
            }
          </Form.Item>
          <Form.Item label="数据年度" wrapperCol={{ span: 10 }}>
            {
              getFieldDecorator('dataPrd', {
                initialValue: formData.dataPrd ? moment(formData.dataPrd) : undefined,
                rules: [{
                  required: true,
                  message: '数据年度不能为空',
                }]
              })(<YearPicker />)
            }
          </Form.Item>
          <Form.Item label="基础数据" wrapperCol={{ span: 10 }}>
            {
              getFieldDecorator('bsctbl', {
                initialValue: formData.bscTblName,
                rules: [{
                  required: true,
                  message: '基础数据不能为空',
                }]
              })(<Input.Search
                readOnly
                onSearch={this.openBaicDataModal}
                onClick={this.openBaicDataModal}
              />)
            }
          </Form.Item>
          {/* 基础数据弹框组件 */}
          <BasicModal {...modalProps}>
            <Row className="m-row-form mt10">
              <Col sm={24} md={24} lg={24} xl={24} xxl={24} className="m-form ant-form" style={{ margin: '0', padding: '1rem' }}>
                <BasicDataModal ref={(c) => { this.basicDataModal = c; }} selectedBaicData={selectedBaicData} />
              </Col>
            </Row>
          </BasicModal>
          <PageFooter current={0} total={1} toNextStep={() => this.handleSubmit(1)} />
        </Form>
      </Fragment>
    );
  }
}
export default Form.create()(SelectBasicData);
