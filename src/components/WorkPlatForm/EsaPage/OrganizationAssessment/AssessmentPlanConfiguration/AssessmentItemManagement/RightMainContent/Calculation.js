/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Row, Col, Form, Input, Radio, Select, Button, Tree, message } from 'antd';
import { FetchqueryOrgSalaryFormulaConf } from '../../../../../../../services/EsaServices/commissionManagement';
import TreeUtils from '../../../../../../../utils/treeUtils';
/**
 * 考核项新增修改
 */
class Calculation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [], // 指标树
      formData: {}, // 表单数据

      indicaData: '', // 指标数据
      functionData: '', // 函数数据
      commonData: '', // 公共数据
      assessmentTreeData: [], // 考核项信息

      calData: [], // 公式翻译
    };
  }
  componentWillMount() {
    let formData = {};
    const { selectFormulaItem = {}, opTp, examId = '' } = this.props;
    this.fetchTreeList();
    if (opTp === '1') {
      formData = {
        adpatObj: [],
        adpatScp: '',
        adpatScpName: '',
        itmFmla: '',
        itemFmlaDesc: '',
        itemFmlaId: '',
        itemNo: examId,
        refItm: '' };
    } else {
      let adpatObj = selectFormulaItem[0].adpatObj.split(';');
      formData = {
        ...selectFormulaItem[0],
      }
      formData.adpatObj = adpatObj;
    }
    this.setState({
      formData,
    });
  }

  // 构造正则表达式,转义特殊字符$ () {}
  getRgeStr = (str) => {
    let regStr = '';
    regStr = str.replace(new RegExp('\\$', 'g'), '\\$')
      .replace(new RegExp('\\(', 'g'), '\\(')
      .replace(new RegExp('\\)', 'g'), '\\)')
      .replace(new RegExp('\\{', 'g'), '\\{')
      .replace(new RegExp('\\}', 'g'), '\\}');
    if (regStr.startsWith('\\')) {
      return regStr;
    }
    return `\\${regStr}`;
  }

  // 所有值,构造正则表达式
  getAllValue = () => {
    const { functionList, publicData, assessmentProject, assessmentIndi } = this.state;
    let arrayData = [...functionList, ...publicData, ...assessmentProject, ...assessmentIndi];
    const allData = [];
    let ad; // 遍历生成正则表达式
    arrayData.forEach((ele) => {
      ad = {
        value: ele.value,
        regStr: `${this.getRgeStr(ele.value)}`,
        key: ele.key,
        title: ele.title
      };
      allData.push(ad);
    });
    return allData;
  }

  //查询指标
  queryOrgSalaryFormulaConf =async(confPrjType) => {
    const payload = {
      "confPrjType": confPrjType,
    }
    let datas=[];
    await FetchqueryOrgSalaryFormulaConf({ ...payload }).then((response) => {
      const { records } = response;
      records.map((item) => {
        datas.push({value: item.calExpsRsol, title:item.expsDescr, key:item.calExps});
        return datas;
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    return datas;
  }
  // 查询指标树
  fetchTreeList = async() => {
    this.setState({
      functionList: await this.queryOrgSalaryFormulaConf(1),
      publicData: await this.queryOrgSalaryFormulaConf(2),
      assessmentProject: await this.queryOrgSalaryFormulaConf(3),
      assessmentIndi: await this.queryOrgSalaryFormulaConf(4)
    })
    const treeData = [
      {
        title: '函数',
        key: '0001',
        selectable: false,
        children: this.state.functionList,
      },
      {
        title: '公共数据',
        key: '0002',
        selectable: false,
        children: this.state.publicData,
      },
      {
        title: '考核项',
        key: '0003',
        selectable: false,
        children: this.state.assessmentProject,
      },
      {
        title: '考核指标',
        key: '0004',
        selectable: false,
        children: this.state.assessmentIndi,
      }];
    this.setState({
      treeData,
    });
  }

   // 搜索框
   handChange = (event) => {
     const { functionList, publicData, assessmentProject, assessmentIndi } = this.state;
     const { value } = event.target;
     const datas1 = functionList
       .map((item) => {
         if (item.title.indexOf(value) > -1 || item.key.indexOf(value) > -1) {
           return item;
         }
         return null;
       })
       .filter((item, i, self) => item && self.indexOf(item) === i);

     const datas2 = publicData
       .map((item) => {
         if (item.title.indexOf(value) > -1 || item.key.indexOf(value) > -1) {
           return item;
         }
         return null;
       })
       .filter((item, i, self) => item && self.indexOf(item) === i);

     const datas3 = assessmentProject
       .map((item) => {
         if (item.title.indexOf(value) > -1 || item.key.indexOf(value) > -1) {
           return item;
         }
         return null;
       })
       .filter((item, i, self) => item && self.indexOf(item) === i);

     const datas4 = assessmentIndi
       .map((item) => {
         if (item.title.indexOf(value) > -1 || item.key.indexOf(value) > -1) {
           return item;
         }
         return null;
       })
       .filter((item, i, self) => item && self.indexOf(item) === i);
      const treeData = [
      {
        title: '函数',
        key: '0001',
        selectable: false,
        children: datas1,
      },
      {
        title: '公共数据',
        key: '0002',
        selectable: false,
        children: datas2,
      },
      {
        title: '考核项',
        key: '0003',
        selectable: false,
        children: datas3,
      },
      {
        title: '考核指标',
        key: '0004',
        selectable: false,
        children: datas4,
      }];
    this.setState({
      treeData
    });
  };
  
  addOperateBtn = (opt) => {
    const inputElement = document.getElementById('calFmla');
    let calFmla = this.props.form.getFieldValue('calFmla');
    if (!calFmla) {
      calFmla = '';
    }
    const calStart = calFmla.slice(0, inputElement.selectionStart);
    const calEnd = calFmla.slice(inputElement.selectionStart, calFmla.length);
    switch (opt) {
      case '+':
        calFmla = `${calStart} + ${calEnd}`;
        break;
      case '-':
        calFmla = `${calStart} - ${calEnd}`;
        break;
      case 'x':
        calFmla = `${calStart} * ${calEnd}`;
        break;
      case '÷':
        calFmla = `${calStart} ÷ ${calEnd}`;
        break;
      case '最大':
        calFmla = `${calStart}GREATEST()${calEnd}`;
        break;
      case '最小':
        calFmla = `${calStart}LEAST()${calEnd}`;
        break;
      case '并且':
        calFmla = `${calStart}AND${calEnd}`;
        break;
      case '或者':
        calFmla = `${calStart}OR${calEnd}`;
        break;
      case '＞':
        calFmla = `${calStart} > ${calEnd}`;
        break;
      case '≥':
        calFmla = `${calStart} >= ${calEnd}`;
        break;
      case '＜':
        calFmla = `${calStart} < ${calEnd}`;
        break;
      case '≤':
        calFmla = `${calStart} <= ${calEnd}`;
        break;
      case '不等于':
        calFmla = `${calStart} != ${calEnd}`;
        break;
      case '当':
        calFmla = `${calStart}CASE WHEN THEN  ELSE  THEN  END${calEnd}`;
        break;
      case '类似':
        calFmla = `${calStart}LIKE '%'||||'%'${calEnd}`;
        break;
      case '属于':
        calFmla = `${calStart}IN()${calEnd}`;
        break;
      default:
        break;
    }
    this.props.form.setFieldsValue({ calFmla });
    this.handleJsgsgsChange();
    inputElement.focus();
    inputElement.selectionStart = calFmla.length - calEnd.length;
    inputElement.selectionEnd = calFmla.length - calEnd.length;
  }

  handleNodeClick =(selectedKeys, info) => {
    const inputElement = document.getElementById('calFmla');
    let calFmla = this.props.form.getFieldValue('calFmla');
    if (!calFmla) {
      calFmla = '';
    }
    const { value,eventKey } = info.node.props;
    const calStart = calFmla.slice(0, inputElement.selectionStart);
    const calEnd = calFmla.slice(inputElement.selectionStart, calFmla.length);
    // 取描述值
    calFmla = `${calStart}${value}${calEnd}`;
    
    this.props.form.setFieldsValue({ calFmla });
    inputElement.focus();
    inputElement.selectionStart = calFmla.length - calEnd.length;
    inputElement.selectionEnd = calFmla.length - calEnd.length;
    this.handleJsgsgsChange();
  }
//替换公式
  handleJsgsgsChange = (e) => {
    let data=this.getAllValue();
    const flag = data && data.length;
    const { getFieldValue, setFieldsValue } = this.props.form;
    let formula =e?e.target.value:getFieldValue('calFmla') || '';
    // 替换运算符和指标
    if (flag) {
      data.forEach((item) => {
        const { value = '', title = '', key='', regStr='' } = item;
        let regExp = '';
        regExp = new RegExp(regStr,'g');
        formula = formula.replace(regExp, title);
      });
        setFieldsValue({ gsms: formula });
    }
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const optBtn = ['+', '-', 'x', '÷', '最大', '最小', '并且', '或者', '＞', '≥', '＜',
      '≤', '不等于', '当', '类似', '属于',
    ];
    const {assessmentGroup = [], opTp} = this.props;
    const { treeData, formData } = this.state;
    return (
      <Fragment>
        <Row>
          <Col span={16}>
            <Form className="esa-assessmentItem-form" labelCol={{ span: 3 }}wrapperCol={{ span: 16 }} >
              {/* 适用范围待待确定 */}
              {/*              <Form.Item label="适用范围" >
                {getFieldDecorator('adpatScp', {
                  initialValue: formData.itmFullName,
              rules: [{
                required: true,
                message: '',
              }] })(<Radio.Group className="esa-radio-group-inner" value={this.state.value}>
                <Radio value={0}>默认</Radio>
                <Radio value={2}>考核分组</Radio>
                <Radio value={3}>组织机构</Radio>
              </Radio.Group>)}
              </Form.Item> */}
              {/* 后期需调用公用选择弹窗 */}
              <Form.Item label="考核分组" >
                {opTp === '1' || opTp === '2' ?getFieldDecorator('adpatObj', {
                  initialValue: formData.adpatObj,
                  rules: [{
                  required: true,
                  message: '考核分组不能为空',
              }] })(<Select showSearch optionFilterProp='children' mode='multiple'>
              {assessmentGroup.map((item) => {
                return <Select.Option key={item.GRPS_ID} value={item.GRPS_ID}>{item.GRPS_NAME}</Select.Option>;
              })}
            </Select>): formData.adpatObj}
              </Form.Item>
              
              {/* 后期需调用公用选择弹窗  */}
              {/*               <Form.Item label="适用对象" >
                {getFieldDecorator('adpatObjList', {
                  initialValue: formData.adpatObjList,
                  rules: [{
                  required: true,
                  message: '适用对象不能为空',
              }] })(<Select>
                <Select.Option value={0}>分公司</Select.Option>
                <Select.Option value={1}>传统营业部</Select.Option>
                <Select.Option value={2}>传统营业部</Select.Option>
              </Select>)}
              </Form.Item> */}
              <Form.Item label="计算公式" >
                {opTp === '1' || opTp === '2' ? getFieldDecorator('calFmla', {
                  initialValue: formData.itemFmla,
                  rules: [{
                  required: true,
                  message: '计算公式不能为空',
              }] })(<Input.TextArea rows={10} onChange={this.handleJsgsgsChange} />): formData.itemFmla}
              </Form.Item>
              <Form.Item  label="公式描述">
               {opTp === '1' || opTp === '2' ? getFieldDecorator('gsms', {
                  initialValue: formData.itemFmlaDesc,
                  rules: [{
                  required: false,
                  message: '计算公式不能为空',
              }] })(<Input.TextArea disabled rows={10} />): formData.itemFmlaDesc}
              </Form.Item>
            </Form>
          </Col>
          {opTp === '1' || opTp === '2' ?
          <Col span={8} style={{ padding: '1rem 1rem 1rem 0' }}>
            <Row gutter={[8, 12]}>
              { optBtn.map((item, index) => {
                return <Col span={6}><Button className="m-btn-radius m-btn-headColor" key={index} block type="primary" onClick={() => { this.addOperateBtn(item); }}>{item}</Button></Col>;
              })}
            </Row>
            <Row>
            <Input placeholder="输入关键字检索" style={{height: '30px', margin: 5 }} onChange={this.handChange} />
            </Row>
            <Tree
              onSelect={this.handleNodeClick}
              treeData={treeData}
            />
          </Col>:''}
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(Calculation);
