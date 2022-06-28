
import React from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import Moment from 'moment';
import { Form, Row, Col, Input, TreeSelect, DatePicker, Radio, message, Select } from 'antd';
import { getDictKey } from '../../../../../../../../../../../utils/dictUtils';
// import { FetchQueryStaffCategoryLevel } from '../../../../../../../../../../../services/staffrelationship/index';
import { fetchObject } from '../../../../../../../../../../../services/sysCommon';

import ApplyTemp from './CalcTypes/ApplyTemp';


class SalaryPlan extends React.Component {
  state = {
    staffLevels: [], // 人员级别
    staffTypes: [], // 人员类别
  }

  componentDidMount = () => {
    const { operate = '', existingData } = this.props;

    // 人员类别 无论是新增还是修改都要查询
    this.queryStaffClassList();
    if (operate === 'edit') {
      // 修改模式  去查询人员级别
      this.queryStaffLevelList(existingData.classId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { operate = '', existingData } = nextProps;

    this.queryStaffClassList();
    if (operate === 'edit' && this.props.existingData.classId !== existingData.classId) {
      this.queryStaffLevelList(existingData.classId);
    }

    // 点击操作符或者树形数据
    if (nextProps.selectIndex !== this.props.selectIndex) {
      this.editJsgs(nextProps.jsgsData);
    }
    // 计算公式手动输入改变
    if (nextProps.inputChangeIndex !== this.props.inputChangeIndex) {
      this.handleJsgsgsChange();
    }
  }

  // 人员类别改变  人员级别也改变
  onRylbChange = (value) => {
    const { form: { setFieldsValue } } = this.props;
    if (value) {
      // 改变人员级别下拉列表
      this.queryStaffLevelList(value);
    } else {
      this.setState({
        staffLevels: [],
      });
    }
    // 重置人员级别当前值
    setFieldsValue({ ryjb: undefined });
  }

  handleFmlaDescChange = (data) => {
    
    const flag = data && data.length;
    const { getFieldValue, setFieldsValue } = this.props.form;
    let formula = getFieldValue('jsgs') || '';
    
    // c.replace(/\$S\{.*?\}/g," ")
    // 替换运算符和指标
    if (flag) {
      let i=0;
      data.forEach((item) => {
        i++;
        if(i>16){
          const { regStr = '', expsDescr = '' } = item;
        let regExp = '';
        regExp = new RegExp(regStr, 'g');
        formula = formula.replace(regExp, expsDescr);
        }
        
      });
      let j=0;
      data.forEach((item) => {
        j++;
        if(j<=16){
          const { regStr = '', expsDescr = '' } = item;
        let regExp = '';
        regExp = new RegExp(regStr, 'g');
        formula = formula.replace(regExp, expsDescr);
        }
        
      });
    }
    setFieldsValue({ gsms: formula });
  }

  // 编辑计算公式输入框
  editJsgs = (data) => {
    const str = data.value;
    const obj = lodash.get(this, '_jsgsTextArea.textAreaRef');
    let position = 0;
    if (obj) {
      if (typeof obj.selectionStart === 'number') {
        // 非IE
        position = obj.selectionStart;
      } else {
        position = document.selection.createRange().text;
      }
    }
    // 改变值
    const { getFieldValue, setFieldsValue } = this.props.form;
    const preValue = getFieldValue('jsgs') || '';
    const aftValue = `${preValue.substring(0, position)}${str}${preValue.substring(position)}`;
    setFieldsValue({ jsgs: aftValue });
    setFieldsValue({ gsms: aftValue });
    // 重置光标位置
    if (obj) {
      setTimeout(() => {
        obj.focus();
        if (obj.setSelectionRange) { // 标准浏览器
          obj.setSelectionRange(position + str.length, position + str.length);
        } else { // IE9-
          const range = obj.createTextRange();
          range.moveStart('character', -position + str.length);
          range.moveEnd('character', -position + str.length);
          range.moveStart('character', position + str.length);
          range.moveEnd('character', 0);
          range.select();
        }
      }, 10);
    }
    // 更新说明
    this.handleFmlaDescChange(data.data);
  }


  //  人员类别查询 livebos对象
  queryStaffClassList = () => {
    fetchObject('RYLBDY').then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        const tmpl = [];
        records.forEach((item) => {
          tmpl.push({
            value: item.ID,
            label: item.CLASS_NAME,
            ...item,
          });
        });
        this.setState({
          staffTypes: tmpl,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //  人员级别查询 livebos对象
  queryStaffLevelList = (classId) => {
    if (classId) {
      const condition = {
        class_id: classId,
      };
      fetchObject("RYJBDY", { condition }).then((res) => {
        const { code = 0, records } = res;
        if (code > 0) {
          const tmpl = [];
          if (records) {
            records.forEach((item) => {
              tmpl.push({
                value: item.ID,
                label: item.LEVEL_NAME,
                ...item,
              });
            });
          }
          this.setState({
            staffLevels: tmpl,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  // 计算公式编辑框手动输入改变
  handleJsgsInputChange = () => {
    // 经过父组件方法传入改变 避免在输入时内容不一致
    this.props.handelInputChange();
  }


  // 计算公式手动输入改变时
  handleJsgsgsChange = () => {
    // const flag = data && data.length;
    const { getFieldValue, setFieldsValue } = this.props.form;
    const formula = getFieldValue('jsgs') || '';
    // 替换运算符和指标
    // if (flag) {
    // data.forEach((item) => {
    //   const { regStr = '', description = '' } = item;
    //   let regExp = '';
    //   regExp = new RegExp(regStr, 'g');
    //   formula = formula.replace(regExp, description);
    // });
    this.handleFmlaDescChange(this.props.jsgsData.data);
    // }
  }


  render() {
    const { version, dictionary = {}, form: { getFieldDecorator, getFieldsValue }, rightData = {}, gxyybDatas = [], userBasicInfo: { orgid }, updatePayload, payload, existingData = {}, operate = '' } = this.props;
    const { staffLevels = [], staffTypes = [] } = this.state;

    const calcType = getFieldsValue().jsfs || (operate === 'edit' && existingData.calMode) || '';

    // 适用地区
    const sydqDic = dictionary[getDictKey('AREA_CLASS')] || [];
    const sydqData = [];
    const titleKey = 'label', rowKey = 'value';

    sydqDic.forEach((item) => {
      sydqData.push({
        value: item.ibm,
        label: item.note,
      });
    });


    return (
      <div className="m-pgfa-left">
        <Form className="m-form-default ant-form-horizontal ant-advanced-search-form" >
          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="名称" >
                <span style={{ fontSize: '1.086rem' }}>{rightData.payName}</span>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="营业部" >
                {
                  getFieldDecorator('yyb', {
                    initialValue: (operate === 'edit' && existingData.orgNo) || orgid,
                    rules: [{ required: true, message: '请选择营业部' }],
                  })(<TreeSelect
                    className="esa-xcxmgl-select"

                    showSearch
                    treeData={gxyybDatas}
                    placeholder="请选择营业部"
                    searchPlaceholder="搜索..."
                    multiple={false}
                    filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    style={{ width: '100%' }}
                  />)
                }
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="适用地区" >
                {
                  operate === 'edit' ? (getFieldDecorator('sydq', {
                    initialValue: operate === 'edit' && existingData.inArea ? existingData.inArea : undefined,
                  })(
                    <Select style={{ width: '100%' }} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children">
                      {
                        sydqData.map((item) => {
                          return <Select.Option key={item[rowKey]} value={item[rowKey]} >{item[titleKey]}</Select.Option>;
                        })
                      }

                    </Select>
                  )
                  ) : (getFieldDecorator('sydq', {
                    // initialValue: operate === 'edit' ? existingData.inArea : null,
                  })(
                    <Select style={{ width: '100%' }} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children">
                      {
                        sydqData.map((item) => {
                          return <Select.Option key={item[rowKey]} value={item[rowKey]} >{item[titleKey]}</Select.Option>;
                        })
                      }

                    </Select>)
                    )

                }
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="人员类别" >
                {

                  operate === 'edit' ? (getFieldDecorator('rylb', {
                    // initialValue: operate === 'edit' ? existingData.inArea : null,
                    initialValue: (operate === 'edit' && existingData.classId ? existingData.classId : undefined),
                    // initialValue: (operate === 'edit' && '103'),

                  })(
                    <Select style={{ width: '100%' }} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children"  onChange={this.onRylbChange}>
                      {
                        staffTypes.map((item) => {
                          return <Select.Option key={item[rowKey]} value={item[rowKey]} >{item[titleKey]}</Select.Option>;
                        })
                      }

                    </Select>)

                  ) : (getFieldDecorator('rylb', {
                    // initialValue: operate === 'edit' ? existingData.inArea : null,
                    // initialValue: (operate === 'edit' && existingData.inArea),
                  })(<Select style={{ width: '100%' }} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children"  onChange={this.onRylbChange}>
                    {
                      staffTypes.map((item) => {
                        return <Select.Option key={item[rowKey]} value={item[rowKey]} >{item[titleKey]}</Select.Option>;
                      })
                    }

                  </Select>)
                    )


                }
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="人员级别" >
                {
                  operate === 'edit' ? (getFieldDecorator('ryjb', {
                    initialValue: (operate === 'edit' && existingData.levelId ? existingData.levelId : undefined),
                    // initialValue: (operate === 'edit' && '9509'),
                  })(<Select style={{ width: '100%' }} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children" placeholder="请先选择人员类别">
                    {
                      staffLevels.map((item) => {
                        return <Select.Option key={item[rowKey]} value={item[rowKey]} >{item[titleKey]}</Select.Option>;
                      })
                    }

                  </Select>)
                  ) : (getFieldDecorator('ryjb', {
                    // initialValue: (operate === 'edit' && existingData.levelId),
                  })(<Select style={{ width: '100%' }} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children" placeholder="请先选择人员类别">
                    {
                      staffLevels.map((item) => {
                        return <Select.Option key={item[rowKey]} value={item[rowKey]} >{item[titleKey]}</Select.Option>;
                      })
                    }

                  </Select>)
                    )

                }
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item esa-datepick" label="月份" >
                {
                  getFieldDecorator('ksyf', {
                    initialValue: (operate === 'edit' && existingData.beginMon && new Moment(`${existingData.beginMon}01`)) || new Moment().add(-1, 'M'),
                    rules: [{ required: true, message: '请选择开始月份' }],

                  })(<DatePicker.MonthPicker format="YYYYMM" className="esa-xcxmgl-select" placeholder="请选择开始月份" />)
                }
                <span style={{ fontSize: '1.086rem', margin: '0 1rem' }}>-</span>
                {
                  getFieldDecorator('jsyf', {
                    initialValue: (operate === 'edit' && existingData.endMon && new Moment(`${existingData.endMon}01`)) || null,
                  })(<DatePicker.MonthPicker format="YYYYMM" className="esa-xcxmgl-select" placeholder="请选择结束月份" />)
                }
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item  esa-raido" label="计算方式" >
                {
                  getFieldDecorator('jsfs', {
                    initialValue: operate === 'edit' ? existingData.calMode : '1',
                    rules: [{ required: true }],
                  })(<Radio.Group
                    className="m-radio-group"
                  >
                    <Radio value="1">套用模板</Radio>
                    <Radio value="2">常量</Radio>
                    <Radio value="3">表达式计算</Radio>
                    <Radio value="4">手工录入</Radio>
                  </Radio.Group>) // eslint-disable-line
                }
              </Form.Item>
            </Col>
          </Row>

          {/* 套用模板 */}
          {
            calcType === '1' && (<ApplyTemp version={version} templateInitArr={this.props.templateInitArr} updatePayload={updatePayload} onSelectTemplate={this.props.onSelectTemplate} templateArr={this.props.templateArr} payload={payload} existingData={existingData} operate={operate} onTemplateArrChange={this.props.onTemplateArrChange} />)
          }

          {/* 常量值 */}
          {
            calcType === '2' && (
              <Row>
                <Col sm={24} md={24} xxl={24} >
                  <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item esa-xcxmgl-select" label="常量值">
                    {
                      getFieldDecorator('clz', {
                        initialValue: operate === 'edit' && existingData.calMode === '2' && existingData.calFmla || '',
                        rules: [{ required: true, message: '请输入常量值' }],
                      })(<Input placeholder="请输入常量值" className="" />)
                    }
                  </Form.Item>
                </Col>
              </Row>
            )
          }

          {/* 表达式计算 */}
          {
            calcType === '3' && (
              <React.Fragment>
                <Row>
                  <Col sm={24} md={24} xxl={24} >
                    <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item esa-xcxmgl-select" label="计算公式">
                      {
                        getFieldDecorator('jsgs', {
                          initialValue: (operate === 'edit' && existingData.calMode === '3' && existingData.calFmla) || '',
                          rules: [{ required: true, message: '计算公式内容不能为空' }],
                        })(<Input.TextArea className="esa-xcxmgl-select" placeholder="" style={{ minWidth: '9.5rem' }} ref={(e) => { this._jsgsTextArea = e; }} onChange={this.handleJsgsInputChange} autosize={{ minRows: 4 }} />)
                      }
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col sm={24} md={24} xxl={24} >
                    <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item esa-xcxmgl-select" label="公式描述">
                      {
                        getFieldDecorator('gsms', {
                          initialValue: (operate === 'edit' && existingData.calMode === '3') ? existingData.fmlaDesc : '',
                        })(<Input.TextArea className="esa-xcxmgl-select" disabled placeholder="" style={{ minWidth: '9.5rem' }} autosize={{ minRows: 4 }} />)
                      }
                    </Form.Item>
                  </Col>
                </Row>
              </React.Fragment>
            )
          }
        </Form>
      </div>
    );
  }
}
export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(SalaryPlan));
