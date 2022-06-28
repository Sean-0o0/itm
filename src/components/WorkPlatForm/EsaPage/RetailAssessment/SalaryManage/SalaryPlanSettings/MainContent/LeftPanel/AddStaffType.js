import React from 'react';
import { Tag, Popover, Form, Button, message } from 'antd';
import CSelect from '../../../../../../../Common/Form/Select';

class AddStaffType extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { form: { setFieldsValue } } = this.props;
    const { selectedStaffTypes: preSelectedStaffTypes = [] } = this.props;
    const { selectedStaffTypes: aftSelectedStaffTypes = [] } = nextProps;
    if (JSON.stringify(preSelectedStaffTypes) !== JSON.stringify(aftSelectedStaffTypes)) {
      setFieldsValue({
        staffClass: [],
        staffLevel: [],
      });
    }
  }

  onStaffClassChange = () => {
    const { form: { setFieldsValue } } = this.props;
    // 重置人员级别当前值
    setFieldsValue({
      staffLevel: [],
    });
  }

  // 添加
  handleAdd = () => {
    const { form: { getFieldsValue, setFieldsValue },
      selectedStaff = [],
      staffClassData = [],
      staffLevelData = [],
      dispatch } = this.props;
    const values = getFieldsValue();
    const { staffClass, staffLevel } = values;
    if ((!staffClass && staffClass !== '') || (Array.isArray(staffClass) && !staffClass[0])) {
      message.error('请选择人员类别！');
      return;
    }
    for (let i = 0; i < selectedStaff.length; i++) {
      if (selectedStaff[i].classId === staffClass && (selectedStaff[i].levelName === '' || selectedStaff[i].levelName === '不限')) {
        message.error(selectedStaff[i].className + '已存在不限级别，请重新添加！');
        return;
      }
    }
    const obj = {};
    obj.classId = staffClass;
    obj.className = staffClassData.find(item => item.ID === staffClass).CLASS_NAME;
    obj.levelId = staffLevel.length === 0 ? '' : staffLevel;
    obj.levelName = staffLevel.length === 0 ? '' : staffLevelData.find(item => item.ID === staffLevel).LEVEL_NAME;
    obj.payProgram = [];
    const tmplSelectedStaff = JSON.parse(JSON.stringify(selectedStaff));
    tmplSelectedStaff.push(obj);
    if (dispatch) {
      dispatch({
        type: 'salaryPlanSettings/updateSelectedStaff',
        payload: { selectedStaff: tmplSelectedStaff },
      });
    }
    // 清空选择
    setFieldsValue({
      staffLevel: [],
      staffClass: [],
    });
  }

  // 选择对应人员类别且未选中的人员
  filterStaffLevels = () => {
    const { form: { getFieldsValue }, staffLevelData = [], selectedStaff = [] } = this.props;
    const values = getFieldsValue();
    const { staffClass } = values;
    if (typeof (staffClass) === 'undefined' || staffClass === '') {
      return [];
    }
    const resStaff = staffLevelData.filter((item) => { return item.CLASS_ID === staffClass && selectedStaff.find(m => m.levelId === item.ID) === undefined; });
    return resStaff;
  }

  renderPopContent = () => {
    const { form: { getFieldDecorator }, staffClassData = [] } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form className="m-form esa-addStaffForm">
        <Form.Item {...formItemLayout} className="m-form-item" label="人员类别">
          {
            getFieldDecorator('staffClass', {
              rules: [{
                required: true, message: '请选择人员类别',
              }],
            })(<CSelect
              style={{ minWidth: '18rem' }}
              datas={staffClassData}
              dropdownMatchSelectWidth
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={this.onStaffClassChange}
            />)
          }
        </Form.Item>

        <Form.Item {...formItemLayout} className="m-form-item" label="人员级别">
          {
            getFieldDecorator('staffLevel', {
              rules: [{
                required: false, message: '请选择人员级别',
              }],
            })(<CSelect style={{ minWidth: '18rem' }} datas={this.filterStaffLevels()} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children" />)
          }
        </Form.Item>

        <Form.Item className="m-form-item">
          <Button className="m-btn-radius m-btn-block m-btn-radius-big m-btn-headColor" onClick={this.handleAdd}>添加</Button>
        </Form.Item>
      </Form>
    );
  }
  render() {
    return (
      <Popover placement="right" content={this.renderPopContent()} trigger="click">
        <Tag className="m-pay-tag m-tag-add">
          <i className="iconfont icon-add" />添加项目
        </Tag>
      </Popover>
    );
  }
}

export default Form.create()(AddStaffType);
