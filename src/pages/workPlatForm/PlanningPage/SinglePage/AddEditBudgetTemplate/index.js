import React from 'react';
import { Row, Col, message, Button, Divider } from 'antd';
import FormulaConfigComponent from '../../../../../components/WorkPlatForm/PlanningPage/Common/FormulaConfigComponent';
import { FetchQueryInfoBudgetTemplateConf, FetchOperateBudgetTemplateConf } from '../../../../../services/planning/budgetManagement';
import LeftContent from './LeftContent';

/**
 * 预算模板的新增和修改
 */
class AddEditBudgetTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      Variable: [],
      selectIndex: 0,
      inputIndex: 0,
      inputChangIndex: 0,
      params: [],
      budgetTemplateConfData: {},
    };
  }

  componentDidMount() {
    const { match = {} } = this.props;
    const { params } = match.params;
    const paramJson = JSON.parse(decodeURIComponent(params));
    const { czlx, id } = paramJson;
    if (czlx === 2 && id) {
      this.queryInfoBudgetTemplateConf(id);
    }
  }

  getValue = (info) => {
    this.setState({ info, selectIndex: ++this.state.selectIndex });
  }

  // 查询预算模板配置
  queryInfoBudgetTemplateConf = async (id = '') => {
    await FetchQueryInfoBudgetTemplateConf({ id }).then((res) => {
      const { code, records = [] } = res;
      if (code > 0) {
        this.setState({
          budgetTemplateConfData: records[0] ? records[0] : [],
          Variable: records[0] ? records[0].paramValues : [],
        });
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  updateVariable = (Variable) => {
    this.setState({ Variable });
  }

  handelInputChange = () => {
    this.setState({ inputIndex: ++this.state.inputIndex });
  }

  handleSettingFamcOk = () => {
    // 确定按钮的操作
    if (this.myFormto) {
      const { validateFieldsAndScroll } = this.myFormto;
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.myForm(values);
        }
      });
    }
  }

  // 计算公式内容改变
  inputChang = (params) => {
    this.setState({ inputChangIndex: ++this.state.inputChangIndex, params });
  }

  // 提交表单
  myForm = async (values) => {
    const { Variable = [] } = this.state;
    const { match = {} } = this.props;
    const { params } = match.params;
    const paramJson = JSON.parse(decodeURIComponent(params));
    const { czlx, id, version = '' } = paramJson;
    const operType = czlx;
    const paramValues = [];
    Variable.forEach((item) => {
      paramValues.push({
        corrCol: item.corrCol,
        descr: item.descr,
        minVal: item.minVal ? Number(item.minVal) : item.minVal,
        maxVal: item.maxVal ? Number(item.maxVal) : item.maxVal,
        auditVal: item.auditVal ? Number(item.auditVal) : item.auditVal,
        tmplId: czlx === 2 ? Number(id) : null,
      });
    });
    await FetchOperateBudgetTemplateConf({
      calFmla: values.calFmla, // 计算公式
      fmlaDesc: values.fmlaDesc, // 公式描述
      tmplId: czlx === 2 ? id : '', // 模板ID
      tmplNo: values.tmplNo, // 模板编号
      name: values.name, // 名称
      operType, // 1|新增;2|修改;3|删除
      paramValues: JSON.stringify(paramValues), // [{corrCol、descr、minVal、maxVal、auditVal、tmplId}]、以JSON串数组形式传入
      remk: values.remk, // 说明
      segValMode: values.segValMode, // 分段方式
      version: czlx === 1 ? id : version,
    }).then((response) => {
      const { code, note } = response;
      if (code > 0) {
        message.success(note);
      }
      const { onSubmitOperate } = this.props;
      if (onSubmitOperate) {
        onSubmitOperate();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 变量转换
  varChange = () => {
    const { Variable } = this.state;
    return Variable.map((item, index) => {
      return {
        calExps: ` $C{${index + 1}}`,
        calExpsRsol: ` $C{${index + 1}}`,
        expsDescr: item.descr,
      };
    });
  }

  render() {
    const { info, budgetTemplateConfData, params, Variable, selectIndex, inputChangIndex, inputIndex } = this.state;
    const { onCancelOperate, match = {} } = this.props;
    const { params: params1 } = match.params;
    const paramJson = JSON.parse(decodeURIComponent(params1));
    const { czlx, id, version = '' } = paramJson;
    return (
      <React.Fragment>
        <Row style={{ background: '#fff' }}>
          <Row className="m-row" style={{ height: '45rem', width: '100%' }}>
            <Col xs={24} sm={12} lg={16}>
              <LeftContent
                ref={(node) => { this.myFormto = node; }}
                selectIndex={selectIndex}
                data={info}
                inputChangIndex={inputChangIndex}
                setVariable={this.getVariable}
                handelInputChange={this.handelInputChange}
                params={params}
                Variable={Variable}
                budgetTemplateConfData={budgetTemplateConfData}
                updateVariable={this.updateVariable}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <FormulaConfigComponent
                versionId={czlx === 1 ? id : version}
                exportValue={this.getValue}
                inputChang={this.inputChang}
                dataTier="1;2"
                variableName="变量"
                Variable={this.varChange()}
                inputIndex={inputIndex}
                calMode={[1, 2, 3, 4, 5, 6, 7, -1, -2]}
              />
            </Col>
          </Row>
          <Divider />
          <Row style={{ height: '5rem', width: '100%' }}>
            <Col span={23} style={{ marginBottom: 15, textAlign: 'right' }}>
              <Button style={{ marginRight: '0.666rem' }} className="m-btn-radius m-btn-headColor" onClick={this.handleSettingFamcOk}> 确定 </Button>
              <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={onCancelOperate}> 取消 </Button>
            </Col>
          </Row>
        </Row>
      </React.Fragment>
    );
  }
}

export default AddEditBudgetTemplate;
