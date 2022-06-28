import React from 'react';
import { Row, Col, message, Button, Divider } from 'antd';
import LeftContent from './left';
import FormulaConfigComponent from '../../../../../../Common/FormulaConfigComponent';
import { FetchOperateRoyaltyFormula } from '../../../../../../../services/EsaServices/commissionManagement';

class TempletUpdateModal extends React.Component {
  state={
    info: [],
    Variable: [],
    selectIndex: 0,
    inputIndex: 0,
    inputChangIndex: 0,
    params: [],
  }

  getValue=(info) => {
    this.setState({ info, selectIndex: ++this.state.selectIndex });
  }

  getVariable=(data) => {
    this.setState({ Variable: data });
  }


  updateVariable = (val) => {
    const temp = val;
    if (Array.isArray(val)) {
      temp.forEach((item, index) => {
        temp[index].seq = index + 1;
      });
    }
    this.setState({ Variable: temp });
  }

  handelInputChange=() => {
    this.setState({ inputIndex: ++this.state.inputIndex });
  }

  inputChang=(params) => {
    this.setState({ inputChangIndex: ++this.state.inputChangIndex, params });
  }

  handleSettingFamcOk=() => {
    // 确定按钮的操作
    if (this.myFormto) {
      const { validateFieldsAndScroll } = this.myFormto;
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.myForm(values);
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

  // 计算公式内容改变
  inputChang = (params) => {
    this.setState({ inputChangIndex: ++this.state.inputChangIndex, params });
  }

  // 提交表单
  myForm=async (values) => {
    const { Variable = [] } = this.state;
    const { versionId = '' } = this.props;
    let oprType = '';
    let fmlaId = '0';
    if (this.props.data) {
      const { data } = this.props;
      oprType = 2;
      fmlaId = data.id;
    } else {
      oprType = 1;
    }
    const paramDefine = [];
    let obj;
    Variable.forEach((item) => {
      obj = {
        SEQ: parseFloat(item.seq),
        NAME: item.name,
        MIN_VAL: parseFloat(item.minVal),
        MAX_VAL: parseFloat(item.maxVal),
        AUDIT_VAL: parseFloat(item.auditVal),
      };
      paramDefine.push(obj);
    });
    await FetchOperateRoyaltyFormula({
      calFmla: values.calFmla, // 计算公式
      fmlaDesc: values.fmlaDesc, // 公式描述
      fmlaId, // 公式ID
      fmlaName: values.fmlaName, // 公式名称
      oprType, // 1|新增;2|修改;3|删除
      paramDefine: JSON.stringify(paramDefine), // [{seq、name、minVal、maxVal、auditVal}]、seq：参数顺序,以JSON串数组形式传入
      remk: values.remk, // 说明
      settType: values.settType, // 1|按单户计算;2|按营业部汇总；3|按人员汇总
      tmplType: values.tmplType, // 模板类型
      valMode: values.valMode, // 计算方式
      versionId, // 版本ID
    }).then((response) => {
      const { note = '操作成功!' } = response;
      message.info(note);
      const { refreshLeftList, handleCancel } = this.props;
      if (handleCancel) {
        handleCancel();
      }
      if (refreshLeftList) {
        refreshLeftList();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 变量转换
  varChange = (Variable) => {
    return Variable.map((item) => {
      return {
        calExps: `$C{${item.seq}}`,
        calExpsRsol: `$C{${item.seq}}`,
        expsDescr: item.name,
      };
    });
  }


  render() {
    const { data ,versionId } = this.props;
    return (
      <React.Fragment>
        <Row className="m-row" style={{ height: '45rem', width: '100%' }}>
          <Col xs={24} sm={12} lg={16}>
            <LeftContent ref={(node) => { this.myFormto = node; }} data={this.state.info} selectIndex={this.state.selectIndex} inputChangIndex={this.state.inputChangIndex} setVariable={this.getVariable} handelInputChange={this.handelInputChange} params={this.state.params} item={data} Variable={this.state.Variable} updateVariable={this.updateVariable} />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <FormulaConfigComponent versionId={versionId} exportValue={this.getValue} inputChang={this.inputChang} dataTier="1;2" calMode={[1, 2, 3, 4, 5, 6, 7,-2,-1]} Variable={this.varChange(this.state.Variable)} variableName="变量" inputIndex={this.state.inputIndex} />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={23} style={{ marginBottom: 15, textAlign: 'right' }}>
            <Button style={{ marginRight: '0.666rem' }} className="m-btn-radius m-btn-headColor" onClick={this.handleSettingFamcOk}> 确定 </Button>
            <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={this.props.handleCancel}> 取消 </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default TempletUpdateModal;
