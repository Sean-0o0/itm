/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import {  Row, Col, message, Button, Divider} from 'antd';
import lodash from 'lodash';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import { FetchoperateDataTemplateField,FetchqueryDataTemplateField } from '../../../../../services/EsaServices/commissionManagement';

/**
 * 导入数据模板定义--配置模板字段-计算公式配置-新增修改供livebos直接打开
 */

class DataTemplateColumnFormulaDef extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: 0,
      inputIndex: 0,
      inputChangIndex: 0,
      params: [],
      salaryTemplateConfData: {},
      height:0,
      indicators: [],
      selectItem:[],
      tmplNo:'',
      tmplDtlId: 0
    };
  }

  componentDidMount() {
    const { match = {} } = this.props;
    const { id } = match.params;
    if (id) {
      const ids=id.split(',');
      this.setState({
        tmplNo: ids[0],
        tmplDtlId: ids[1]
      },()=>{
        this.queryDataTemplateFieldConf(this.state.tmplNo);
      })
    }
    window.addEventListener('resize', this.updateDimensions);

  }
  componentWillMount() {
    this.updateDimensions();
  }

  // 查询模板明细
  queryDataTemplateFieldConf = async (id = '') => {
    const payload = {
      tmplDtlId: '',
      tmplNo: this.state.tmplNo,
      pagelength: 10,
      pageno: 10,
      paging: 0,
      sort: "",
      totalrows:0
    }
    await FetchqueryDataTemplateField( payload).then((res) => {
      const { code, records = [] } = res;
      if (code > 0) {
        const selectItem = records.find(item => this.state.tmplDtlId == item.tmplDtlId) || [];
        this.setState({
          indicators: records,
          selectItem:  selectItem
        });
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }

  handelInputChange = () => {
    this.setState({ inputIndex: ++this.state.inputIndex });
  }

  // 获取点击的操作符和树形数据
  getOperatorData = (str = '') => {
    this.myFormto.editFmla(str);
  }

  handleSubmit = () => {
    // 确定按钮的操作
    if (this.myFormto) {
      const { validateFieldsAndScroll } = this.myFormto.props.form;
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

  replaceAll = (str = '') => {
    this.state.indicators.map((item) => {
      const { fileColName = '', tmplDtlId = '' } = item;
      let regExp = '';
      regExp = new RegExp(fileColName, 'g');
      return str = str.replace(regExp, tmplDtlId);
    });
    return str;
  }


  // 提交表单
  myForm = async (values) => {
    let payload={
      ...this.state.selectItem,
      calExpsDisp:values.calFmla,
      oprType:2,
      calExps:this.replaceAll(values.calFmla)
    }
    await FetchoperateDataTemplateField(payload).then((response) => {
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

  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    this.setState({ height });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    const { height, salaryTemplateConfData, params, selectIndex, inputChangIndex, tmplDtlId, selectItem, indicators=[] } = this.state;
    const { onCancelOperate, dictionary } = this.props;
    return (
      <React.Fragment>
        <Row style={{ background: '#fff', height }}>
          <Row className="m-row" style={{ width: '100%' }}>
            <Col xs={24} sm={24} lg={16}>
              <LeftContent
                onRef={(node) => { this.myFormto = node; }}
                selectIndex={selectIndex}
                selectItem={selectItem}
                inputChangIndex={inputChangIndex}
                handelInputChange={this.handelInputChange}
                params={params}
                dictionary={dictionary}
                salaryTemplateConfData={salaryTemplateConfData}
                indicators={indicators}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <RightContent indicators={indicators} getOperatorData={this.getOperatorData} tmplDtlId={tmplDtlId} />
            </Col>
          </Row>
          <Divider style={{ marginTop: 0 }} />
          <Row style={{ height: '5rem', width: '100%' }}>
            <Col span={23} style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: '0.666rem' }} className="m-btn-radius m-btn-headColor" onClick={this.handleSubmit}> 确定 </Button>
              <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={onCancelOperate}> 取消 </Button>
            </Col>
          </Row>
        </Row>
      </React.Fragment>
    );
  }
}

// export default CalculationRuleDefinition;
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(DataTemplateColumnFormulaDef);
// export default Form.create({})(CalculationRuleDefinition);

