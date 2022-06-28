import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, message, Button, Divider } from 'antd';
import SalesDepartmentModal from '../../../../../components/WorkPlatForm/EsaPage/Common/SalesDepartmentModal';
import { FetchQueryInfoRoyaltyFormulaVariable, FetchQueryInfoRoyaltyTemplate, FetchOperateRoyaltyTemplate } from '../../../../../services/EsaServices/commissionManagement';
import RoyaltyFormulaListModal from './RoyaltyFormulaListModal';
import ApplyTemp from './CalcTypes/ApplyTemp';

/**
 * 提成模板定义的新增和修改
 */

class AddEditCommissionTemplateDef extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgNo: null,
      orgName: '',
      salesDepartmentModal: {// 营业部计算modal
        visible: false,
        handleOk: this.salesDepartmentOk,
        onCancel: this.salesDepartmentCancel,
      },
      royaltyFormulaListModal: {// 提成公式选择modal
        visible: false,
        handleOk: this.royaltyFormulaListOk,
        onCancel: this.royaltyFormulaListCancel,
      },
      royaltyFormulaParamData: [], // 提成公式定义_变量查询数据
      royaltyTemplateData: {}, // 提成模板数据
      fmlaId: null, // 提成模板的提成公式ID
      valMode: null, // 提成公式计算方式
      templateParamData: [], // 提成模板参数值
      height: 0,
    };
  }
  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    const { match = {} } = this.props;
    const { params } = match.params;
    const paramJson = JSON.parse(decodeURIComponent(params));
    const { czlx, id,version } = paramJson;
    
    if (czlx === 2 && id) {
      this.queryInfoRoyaltyTemplate(id);
    } else {
      this.selectUserOrg();
    }
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    this.setState({ height });
  }
  // 默认营业部
  selectUserOrg = () => {
    const { userBasicInfo: { orgid = '', orgname = '' } } = this.props;
    this.setState({
      orgNo: Number(orgid),
      orgName: orgname,
    });
  }
  // 营业部弹框确定取消
  salesDepartmentCancel = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: false } });
  }
  salesDepartmentOk = (selectItem) => {
    this.setState({
      orgNo: Number(selectItem.key),
      orgName: selectItem.title,
    });
    this.props.form.setFieldsValue({ orgName: selectItem.title });
    this.salesDepartmentCancel();
  }
  // 提成公式定义弹框取消
  royaltyFormulaListCancel = () => {
    const { royaltyFormulaListModal } = this.state;
    this.setState({ royaltyFormulaListModal: { ...royaltyFormulaListModal, visible: false } });
  }
  // 提成公式定义弹框确定
  royaltyFormulaListOk = (selectItem) => {
    const { royaltyTemplateData } = this.state;
    this.queryInfoRoyaltyFormulaVariable(selectItem.id);
    this.setState({ fmlaId: selectItem.id });
    if (selectItem.id !== royaltyTemplateData.fmlaId) {
      this.setState({ templateParamData: [] });
    } else {
      this.setState({ templateParamData: royaltyTemplateData.paramValue });
    }
    this.props.form.setFieldsValue({ fmlaName: selectItem.tmplName });
  }
  // 查询提成模板
  queryInfoRoyaltyTemplate = async (tmplId = '') => {
    await FetchQueryInfoRoyaltyTemplate({ tmplId }).then((res) => {
      const { code, records = [] } = res;
      if (code > 0 && records.length) {
        this.setState({
          royaltyTemplateData: records[0],
          orgNo: Number(records[0].orgNo),
          orgName: records[0].orgName,
          fmlaId: records[0].fmlaId,
          templateParamData: records[0].paramValue,
        });
        this.queryInfoRoyaltyFormulaVariable(records[0].fmlaId);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  // 查询提成公式定义
  queryInfoRoyaltyFormulaVariable = async (fmlaId = '') => {
    await FetchQueryInfoRoyaltyFormulaVariable({ fmlaId }).then((res) => {
      const { code, records = [] } = res;
      if (code > 0 && records[0]) {
        this.setState({
          royaltyFormulaParamData: records[0].paramValue,
          valMode: records[0].valMode,
        });
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  // 操作提成公式模板
  operateRoyaltyTemplate = async (params) => {
    await FetchOperateRoyaltyTemplate({ ...params }).then((res) => {
      const { code, note } = res;
      if (code > 0) {
        message.success(note);
        // 调用livebos弹窗关闭
        const { onSubmitOperate } = this.props;
        if (onSubmitOperate) {
          onSubmitOperate();
        }
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  //  打开营业部弹出框
  openSalesDepartmentModal = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: true } });
  }
  //  打开提成公式定义选择弹出框
  openRoyaltyFormulaListModal = () => {
    const { royaltyFormulaListModal } = this.state;
    this.setState({ royaltyFormulaListModal: { ...royaltyFormulaListModal, visible: true } });
  }
  // 更新提成模板参数值
  updateTemplateParamData = (obj) => {
    this.setState({ templateParamData: obj });
  }
  // 操作提交
  handleSubmit = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err || err.length === 0) { // 校验通过
        const { match = {} } = this.props;
        const { params: params1 } = match.params;
        const paramJson = JSON.parse(decodeURIComponent(params1));
        const { czlx, id } = paramJson;
        const { orgNo, fmlaId, royaltyFormulaParamData, valMode, templateParamData } = this.state;
        const paramValue = [];
        const param = {};
        royaltyFormulaParamData.forEach((item) => {
          param[`FLD${item.seq}`] = 0;
        });
        if (valMode === '3') {
          // eslint-disable-next-line guard-for-in
          for (const i in param) {
            param[i] = values[i] !== '' ? Number(values[i]) : '';
          }
          paramValue.push(param);
        } else {
          templateParamData.forEach((item) => {
            Reflect.deleteProperty(item, 'key');
            // eslint-disable-next-line guard-for-in
            for (const i in param) {
              param[i] = item[i.toLowerCase()] !== '' ? Number(item[i.toLowerCase()]) : '';
            }
            paramValue.push(Object.assign({}, param));
          });
        }
        const params = {
          tmplName: values.tmplName,
          oprType: czlx,
          tmplId: czlx === 2 ? id : '',
          remk: values.remk,
          takeFmla: fmlaId,
          orgNo,
          paramValue: JSON.stringify(paramValue),
          version: czlx === 1 ? id : ''
        };
        this.operateRoyaltyTemplate(params);
      }
    });
  }
  render() {
    const { form = {}, onCancelOperate, match = {} } = this.props;
    const { getFieldDecorator } = form;
    const { params } = match.params;
    const paramJson = JSON.parse(decodeURIComponent(params));
    const { czlx, id ,version} = paramJson;
    const { height, fmlaId, valMode, orgName, salesDepartmentModal, royaltyTemplateData, templateParamData, royaltyFormulaParamData, royaltyFormulaListModal } = this.state;
    if (czlx === 2 && id) {
      royaltyFormulaParamData.forEach((item, index) => {
        if (royaltyTemplateData.paramValue.length > 0 && royaltyTemplateData.fmlaId === fmlaId) {
          royaltyFormulaParamData[index].initialValue = royaltyTemplateData.paramValue[0][`fld${item.seq}`];
        }
      });
    }
    return (
      <Fragment>
        <div style={{ overflowX: 'hidden', backgroundColor: '#fff', height }}>
          <Form className="m-form" >
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              label="模板名称"
            >{getFieldDecorator('tmplName', {
              initialValue: royaltyTemplateData.tmplName || '',
              rules: [{ required: true, message: '请输入模板名称' }],
            })(<Input />)}
            </Form.Item>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              label="说明"
            >
              {getFieldDecorator('remk', {
                initialValue: royaltyTemplateData.remk || '',
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="营业部 " >
              {getFieldDecorator('orgName', {
                initialValue: orgName,
                rules: [{ required: true, message: '请选择营业部' }],
              })(<Input.Search
                readOnly
                onSearch={this.openSalesDepartmentModal}
              />)}
            </Form.Item>
            <Form.Item labelCol={{ span: 4 }} label="模板" wrapperCol={{ span: 18 }}>
              {getFieldDecorator('fmlaName', {
                initialValue: royaltyTemplateData.fmlaName || '',
                rules: [{ required: true, message: '请选择模板' }],
              })(<Input
                readOnly
                onClick={this.openRoyaltyFormulaListModal}
                style={{ cursor: 'pointer' }}
                placeholder="点击选择模板"
              />)}
            </Form.Item>
            {royaltyFormulaParamData.length > 0 ? (
              <ApplyTemp
                royaltyFormulaParamData={royaltyFormulaParamData}
                valMode={valMode}
                form={form}
                templateParamData={templateParamData}
                updateTemplateParamData={this.updateTemplateParamData}
              />
            ) : ''}
          </Form>
          <Divider />
          <Row className="m-row">
            <Col span={22} style={{ marginBottom: 15, textAlign: 'right' }}>
              <Button style={{ marginRight: '0.666rem' }} className="m-btn-radius m-btn-headColor" onClick={this.handleSubmit}> 确定 </Button>
              <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={onCancelOperate}> 取消 </Button>
            </Col>
          </Row>
          <SalesDepartmentModal {...salesDepartmentModal} modalProps={{ bodyStyle: { height: '30rem', overflow: 'auto' } }} />
          <RoyaltyFormulaListModal {...royaltyFormulaListModal} versionId={version} />
        </div>
      </Fragment >
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(Form.create()(AddEditCommissionTemplateDef));
