/* eslint-disable react/sort-comp */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, message, Button as AntdButton } from 'antd';
import LeftContent from './left';


// import RightContent from './right';
import RightContent from '../../../../../../../../../Common/FormulaConfigComponent';
// import { DoSalaryFormulaDef, FetchQuerySalaryFormulaDef } from '../../../../../../../../../../services/salaryAssessment';
import { FetchqueryInfoSalaryFormulaDef, FetchoperateSalaryFormulaDef } from '../../../../../../../../../../services/EsaServices/salaryManagement';
// import { FetchQueryStaffCategoryLevel } from '../../../../../../../../../../services/staffrelationship/index';


class AddFormulaModal extends React.Component {
  state = {
    info: [],
    selectIndex: 0, // 右侧内容点击的次数，作为更新编辑框的依据，避免死循环
    inputChangeIndex: 0,
    templateArr: [], // 存放套用模板时变量对象
    templateInitArr: [], // 套用模板修改模式时的初始变量数据
    selectedTempId: '', // 选择的模板ID
    payload: {}, // 确定操作的参数
    existingData: {}, // 已有数据（仅修改模式有用）
    jsgsData: {}, // 计算公式

  }

  componentWillMount() {
    const { operate = '', payFmlaId = '' } = this.props;
    // 修改的话先查询详情数据
    if (operate === 'edit' && payFmlaId) {
      this.fetchDetailData(payFmlaId);
    }
  }
  onCancel = () => {

    // this.props.handleCancel();
  }

  // 模板变量改变
  onTemplateArrChange = (templateArr) => {
    this.setState({
      templateArr,
    }, () => {
    });
  }


  // 查询要修改的薪酬公式详情数据
  fetchDetailData = (payFmlaId) => { // eslint-disable-line

    FetchqueryInfoSalaryFormulaDef({
      // payFmlaId: 448119,
      payFmlaId,

    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        this.setState({ existingData: records[0] });
        this.setState({ selectedTempId: records[0].payTmplId });

        // 默认tempData数据(仅修改模式)
        // const { payload } = this.state;
        const { paramValues = [] } = records[0];


        const tmplTempData = [];
        if (paramValues.length > 0) {
          // 将json数组字符串改造成[{FLD0: "0", FLD1: "xx", FLD2: "xx", ....}]形式
          // 方便后续模板表格进行变量初始化
          const arr = JSON.parse(paramValues);
          arr.forEach((item = {}) => {
            const tObj = {};
            const keys = Object.keys(item).filter(m => m !== 'key');
            keys.forEach((m) => {
              if (item[m].length > 0) {
                // const k = m.replace('F', 'dyzd_');
                tObj[m] = item[m];
              }
            });
            tmplTempData.push(tObj);
          });
        }
        this.setState({
          templateInitArr: tmplTempData,
          templateArr: tmplTempData,
        }, () => {
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  updatePayload = (obj) => { // eslint-disable-line
    const { payload = {} } = this.state;
    this.setState({
      payload: {
        ...payload,
        ...obj,
      },
    });
  }

  // 获取点击的操作符和树形数据
  getOperatorData = (item) => {
    this.setState({
      jsgsData: item,
      selectIndex: ++this.state.selectIndex,
    });
  }
  // 点击选中模板 获取所选模板
  onSelectTemplate = (id) => {
    this.setState({
      selectedTempId: id,
    }, () => {

    });
  }

  // 左侧的计算公式手动输入改变
  inputChange = () => {
    this.setState({ inputChangeIndex: ++this.state.inputChangeIndex });
  }

  // 确定按钮 手动校验表单数据
  handleSettingFamcOk = () => {
    // 确定按钮的操作
    if (this.myFormto) {
      const { validateFieldsAndScroll } = this.myFormto.props.form;
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          const { payload: { tempData = [], tempFdfs = '' }, selectedTempId = '' } = this.state;

          const { jsyf = '', ksyf, jsgs } = values;
          if (jsyf && jsyf < ksyf) {
            message.error('结束月份不能小于开始月份');
            return false;
          }

          if (values.jsfs === '1' && tempFdfs !== '3') {
            if (!selectedTempId) {
              message.error('请选择模板');
              return false;
            }
            let tempDataHasBlock = false;
            tempData.forEach((item) => {
              const tmpl = Object.values(item).filter(m => m === '' || m === undefined || m === null);
              if (tmpl.length > 0) {
                tempDataHasBlock = true;
                return false;
              }
            });
            if (tempDataHasBlock) {
              message.error('请完善模板值数据');
              return false;
            }
            if (values.jsfs === '2' && !values.clz) {
              message.error('请输入常量值');
              return false;
            }
            if (values.jsfs === '3' && !jsgs) {
              message.error('请输入计算公式');
              return false;
            }
          }
          this.handleFormSubmit(values);
        } else {
          (Object.values(err) || []).map((item = {}) => {
            const { errors = [] } = item;
            message.error((errors[0] || {}).message);
            return false;
          });
        }
      });
    }
  }


  // 提交表单
  handleFormSubmit = () => {
    // const { operate = '' } = this.props;
    const { version, fetchLeftList, rightData = {}, payFmlaId = '', userBasicInfo: { orgid }, operate = '' } = this.props;
    const { selectedTempId = '' } = this.state;

    const { getFieldValue } = this.myFormto.props.form;

    let { templateArr } = this.state;


    const yyb = getFieldValue('yyb');
    const sydq = getFieldValue('sydq');
    const rylb = getFieldValue('rylb');
    const ryjb = getFieldValue('ryjb');
    const ksyf = getFieldValue('ksyf').format('YYYYMM');
    const jsyf = getFieldValue('jsyf') ? getFieldValue('jsyf').format('YYYYMM') : '';
    const jsfs = getFieldValue('jsfs');
    const clz = getFieldValue('clz');
    const jsgs = getFieldValue('jsgs');
    const gsms = getFieldValue('gsms') || '';

    // 不是套用模板， json空数组
    if (jsfs !== '1') {
      templateArr = [];
    }

    // 插入是fld1 开始的，返回的fld0开始的 重新构造模板变量入参数据
    const tempData = [];
    if (templateArr.length > 0) {
      templateArr.forEach((item) => {
        const obj = {};
        const keys = Object.keys(item).filter(m => m !== 'key');
        keys.forEach((m, index) => {
          // const k = m.replace('F', 'dyzd_');
          obj[`FLD${index + 1}`] = Number(item[m]);
        });
        tempData.push(obj);
      });
    }

    let type = '';

    if (operate === 'edit') {
      type = 2;
    } else if (operate === 'add') {
      type = 1;
    }


    // const { yyb, sydq, rylb, ryjb, ksyf = '', jsyf = '', jsfs = '', clz = '', jsgs = '', gsms = '' } = getFieldsValue;
    const payload = {
      area: Number(sydq), // 适用地区
      beginMon: Number(ksyf), // 开始月份
      calFmla: jsfs === '2' ? clz : jsfs === '3' ? jsgs : '', // 常量值/计算公式
      calMode: Number(jsfs), // 计算方式 1|套用模版;2|常量;3|表达式计算;4|手工录入
      classId: rylb ? Number(rylb) : '', // 人员类别
      depClass: 1, // 部门类别
      // empNo: Number(orgid), // 结算人员  公式定义不用传
      endMon: jsyf, // 结束月份
      fmlaDesc: gsms, // 公示说明
      levelId: ryjb ? Number(ryjb) : '', // 人员级别
      operType: type, // 操作类型  1|新增;2|修改;3|删除
      orgNo: Number(yyb), // 营业部
      paramValues: JSON.stringify(tempData), // 参数取值json 多值用数组格式：[{"FLD1":"xxx","FLD2","xxx"},{...}]
      payCodeId: Number(rightData.id), // 薪酬项目
      payFmlaId: Number(payFmlaId), // 薪酬公式ID  修改删除需要传入
      payTmplId: Number(selectedTempId), // 套用模板
      version,
    };


    FetchoperateSalaryFormulaDef(payload).then((ret = {}) => {
      const { code = 0, note = '' } = ret;
      if (code > 0) {
        message.success(note);
        //  重新查询左列内容 刷新页面
        const { handleAddFormulaModalCancel } = this.props;
        // eslint-disable-next-line no-unused-expressions
        fetchLeftList && fetchLeftList('', false);
        // eslint-disable-next-line no-unused-expressions
        this.props.refreshTable && this.props.refreshTable();
        handleAddFormulaModalCancel && handleAddFormulaModalCancel();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { rightData = {}, operate = '', gxyybDatas = [], handleAddFormulaModalCancel, version } = this.props;
    const { payload = {}, existingData = {}, jsgsData, templateArr = [] } = this.state;

    const calMode = [-1, -2, 1, 2, 3, 4, 5, 6, 7];
    const dataTier = '1;2';
    return (
      <div style={{ background: '#fff' }}>
        <Row style={{ minHeight: '46rem', width: '100%', overflowY: 'auto' }}>
          <Col xs={24} sm={12} lg={14}>
            <LeftContent version={version} wrappedComponentRef={(node) => { this.myFormto = node; }} templateInitArr={this.state.templateInitArr} onSelectTemplate={this.onSelectTemplate} jsgsData={jsgsData} templateArr={templateArr} gxyybDatas={gxyybDatas} data={this.state.info} selectIndex={this.state.selectIndex} inputChangeIndex={this.state.inputChangeIndex} setVariable={this.getVariable} handelInputChange={this.inputChange} onTemplateArrChange={this.onTemplateArrChange} rightData={rightData} payload={payload} updatePayload={this.updatePayload} existingData={existingData} operate={operate} />
          </Col>
          <Col xs={24} sm={12} lg={10}>
            <RightContent versionId={version} exportValue={this.getOperatorData} dataTier={dataTier} variableName="请选择" calMode={calMode} />
          </Col>
        </Row>
        <Row style={{ height: '5rem', width: '100%' }}>
          <Col xs={24} sm={24} lg={24} style={{ textAlign: 'center', paddingTop: '.75rem' }}>
            <AntdButton className="m-btn-radius m-btn-headColor" onClick={this.handleSettingFamcOk}> 确定 </AntdButton>
            <AntdButton className="m-btn-radius" onClick={handleAddFormulaModalCancel}> 取消 </AntdButton>
          </Col>
        </Row>
      </div>
    );
  }
}

// export default AddFormulaModal;

export default (connect(({ global }) => ({
  userBasicInfo: global.userBasicInfo,
  // gxyybDatas: code.gxyybDatas,
}))(AddFormulaModal));

