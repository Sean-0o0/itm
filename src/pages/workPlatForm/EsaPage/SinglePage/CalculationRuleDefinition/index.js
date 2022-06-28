/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, message } from 'antd';
import LeftContent from './LeftContent';
// import RightContent from './RightContent';
import RightContent from '../../../../../components/Common/FormulaConfigComponent';
import { FetchqueryCalculateRuleDefinition, FetchoperateCalculateRuleDefinition } from '../../../../../services/EsaServices/paramSetting';
import { getDictKey } from '../../../../../utils/dictUtils';


/**
 * 新增修改供livebos直接打开
 */

class CalculationRuleDefinition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Variable: [], // 存放变量数组
      initVariableIndex: 0, // 初始查询的变量数组长度
      jsgsData: {}, // 计算公式
      selectIndex: 0, // 右侧内容点击的次数，作为更新编辑框的依据，避免死循环
      ruleData: '', // 规则数据
      dataTier: 1,// 数据维度
    };
  }


  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps() {

  }

  // liveBos弹框确定
  onSubmitOperate = () => {
    const result = { code: 1 };
    if (this.props.onSubmitOperate) {
      this.props.onSubmitOperate(result);
    }
  }
  // liveBos弹框关闭
  onCancelOperate = () => {
    if (this.props.onCancelOperate) {
      this.props.onCancelOperate();
    }
  }

  fetchData = () => {
    const { match: { params: { params }  } } = this.props;
    const paramJson = JSON.parse(decodeURIComponent(params));
    const payload = {
      indiCode: paramJson.id,
    };
    FetchqueryCalculateRuleDefinition(payload).then((res) => {
      const { records = [], code = 0 } = res;
      if (code > 0 && records.length > 0) {
        // 去除换行
        records[0].calExps = records[0].calExps.replace(/\n/g, '');
        let paramsArr = [];
        if (records[0].indiParam) {
          paramsArr = JSON.parse(records[0].indiParam);
          paramsArr.forEach((item) => {
            // eslint-disable-next-line no-param-reassign
            item.expsDescr = item.paramName;
            item.calExps = item.paramName;
            // eslint-disable-next-line no-param-reassign
            item.seq = item.param;
            // eslint-disable-next-line no-param-reassign
            item.dw = item.paramUnit;
            // eslint-disable-next-line no-param-reassign
            item.sm = item.paramDesc;
          });
        }

        // 构造变量数组

        this.setState({
          ruleData: records[0],
          dataTier: records[0].refLvl ? records[0].refLvl : 1,
          Variable: paramsArr,
          initVariableIndex: paramsArr.length,
        }, () => {
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  changeDataTier = (dataTier) => {
    this.setState({ dataTier });
  }
  // 获取点击的操作符和树形数据
  getOperatorData = (item, type) => {
    //  根据calmode不同 回填不同的字段
    // 前端界面计算方式：1|引用数据源；3|引用指标  时传入“计算公式”  2|引用过程  时传入“执行过程”  4|自定义脚本  时传入“SQL语句”
    const { calMode = '' } = this.state.ruleData;
    let temp = {};
    if ((Number(calMode) === 1 || Number(calMode) === 3) && type === 'tree') {
      temp.value = item.desc;
      temp.desc = item.desc;
    } else {
      temp = item;
    }
    if ((item.desc === item.value) && item.expsDescr === '') {
      temp.value = `$C{${item.desc}}`;
    }
    this.setState({
      jsgsData: temp,
      selectIndex: ++this.state.selectIndex,
    });
  }

  // 变量数组添加
  addVariable = () => {
    const obj = {
      expsDescr: '',
      calExpsRsol: '',
      calExps: '',
      sm: '',
      seq: '',
      dw: ''
    };
    const { Variable = [] } = this.state;
    Variable.push(obj);
    this.setState({
      Variable,
    });
  }

  // 变量数组减少
  deleteVariable = (index) => {
    const { Variable = [] } = this.state;
    // 当有初始变量是，需要加上对应的index
    const tempArr = Variable.filter((item, ind) => {
      return ind !== index;
    });
    this.setState({
      Variable: tempArr,
    });
  }

  // 变量数组改变
  editVariable = (value, objKey, index) => {
    const { Variable = [] } = this.state;
    // eslint-disable-next-line no-mixed-operators
    const finalIndex = index;
    const item = Variable[finalIndex];
    // eslint-disable-next-line guard-for-in
    for (const key in item) {
      // eslint-disable-next-line no-param-reassign
      if (key === objKey) {
        item[key] = value;
      }
    }
    this.setState({
      Variable,
    });
  }

  // 变量改变
  onBlChange = (bl) => {
    this.setState({
      bl,
    });
  }

  handleSettingFamcOk = (e) =>{
    const {validateFieldsAndScroll } = this.myFormto.props.form;

    validateFieldsAndScroll((err, values) => {
        if (!err) {
          const { sydx, yycj } = values;
          if (sydx && Number(values.sydx) === 0) {
            message.error('请选择适用对象');
            return false;
          }
          if (yycj && Number(values.yycj) === 0) {
            message.error('请选择应用层级');
            return false;
          }
          this.handleDefineOk(e);
        } else {
          (Object.values(err) || []).map((item = {}) => {
            const { errors = [] } = item;
            message.error((errors[0] || {}).message);
            return false;
          });
        }
      });
  }
  // 确定 提交表单
  handleDefineOk = (e) => {
    if (e) e.preventDefault();
    const { ruleData = {}, Variable = [] } = this.state;
    const blArr = [];
    const { getFieldValue } = this.myFormto.props.form;

    // 构造变量数组的入参
    Variable.forEach((item, index) => {
      const corrSeq = index + 1;
      const indiCode = getFieldValue('zbdm');
      const paramName = item.expsDescr;
      const param = Number(item.seq);
      const paramUnit = item.dw;
      const paramDesc = item.sm;
      const obj = {
        corrSeq,
        indiCode,
        paramName,
        param,
        paramUnit,
        paramDesc,
      };
      blArr.push(obj);
    });

    // eslint-disable-next-line no-unused-vars
    const relaType = getFieldValue('gxlx') == null ? '' : getFieldValue('gxlx').join(',');
    const calExps = getFieldValue('jsgs').replace(/\n/g, '');
    // const calExps = getFieldValue('jsgs').replace(/\s+/g, '');
    const { match: { params: { params }  } } = this.props;
    const { id, version } = JSON.parse(decodeURIComponent(params));
    const payload = {
      calMode: Number(ruleData.calMode), // 计算方式
      indiCode: id, // 指标代码
      objRange: Number(ruleData.objRange), // 适用对象
      relaType: relaType || '', // 关系类型
      refLvl: Number(getFieldValue('yycj')) || 0, // 引用层级
      calExps: encodeURIComponent(calExps || '').replace(/'/g, "%27"), // 计算表达式
      restrCond: encodeURIComponent(getFieldValue('xztj') || '').replace(/'/g, "%27"), // 限制条件
      indiParam: JSON.stringify(blArr), // 指标参数定义json
      ip: '',
      version,
    };
    FetchoperateCalculateRuleDefinition(payload).then((res) => {
      const { code = 0 } = res;
      if (code > 0) {
        message.success('提交成功');
        const { onCancelOperate } = this.props;
        // eslint-disable-next-line no-unused-expressions
        onCancelOperate && onCancelOperate();
        this.onSubmitOperate();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleCalmode = () => {
    const {dictionary} = this.props;
    const item = dictionary[getDictKey('TINDI_DEF_INDI_GRP')] || [];
    let ibm = [];
    item.forEach(element => {
      ibm.push(Number(element.ibm));
    });

    return ibm;

  }


  render() {
    const { onCancelOperate, match: { params: { params }  } } = this.props;
    const { id, version } = JSON.parse(decodeURIComponent(params));
    const { jsgsData, selectIndex, ruleData, dataTier } = this.state;

    const { dictionary } = this.props;
    let calMode = [];
    if (Number(ruleData.calMode) === 1) {
      calMode = [0];
    }
    if (Number(ruleData.calMode) === 2) {
      calMode = [];
    }
    if (Number(ruleData.calMode) === 3) {
      calMode = this.handleCalmode();
    }
    if (Number(ruleData.calMode) === 4) {
      calMode = [];
    }


    return (
      <Fragment>
        <Row style={{ background: '#fff' }}>
          <Row style={{ minHeight: '46rem', width: '100%', overflowY: 'auto' }}>
            <Col xs={24} sm={12} lg={16}>
              <LeftContent wrappedComponentRef={(node) => { this.myFormto = node; }} Variable={this.state.Variable} editVariable={this.editVariable} addVariable={this.addVariable} deleteVariable={this.deleteVariable} dictionary={dictionary} ruleData={ruleData} onBlChange={this.onBlChange} jsgsData={jsgsData} selectIndex={selectIndex} changeDataTier={this.changeDataTier} />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <RightContent versionId={version} exportValue={this.getOperatorData} dataTier={dataTier} Variable={this.state.Variable} calMode={calMode} variableName="变量" />
            </Col>
          </Row>
          <Row style={{ height: '5rem', width: '100%' }}>
            <Col xs={24} sm={24} lg={24} style={{ textAlign: 'center', paddingTop: '.75rem' }}>
              <Button className="m-btn-radius m-btn-headColor" onClick={this.handleSettingFamcOk}> 确定 </Button>
              <Button className="m-btn-radius" onClick={onCancelOperate}> 取消 </Button>
            </Col>
          </Row>
        </Row>

      </Fragment>
    );
  }
}

// export default CalculationRuleDefinition;
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(CalculationRuleDefinition);
// export default Form.create({})(CalculationRuleDefinition);

