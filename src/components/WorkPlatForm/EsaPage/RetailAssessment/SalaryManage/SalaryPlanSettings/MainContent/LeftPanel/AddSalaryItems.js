import React, { Fragment } from 'react';
import { Tag, Popover, Form, Checkbox, Input } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

class AddSalaryItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchPayName: '',
    };
  }
  onSalaryChange = (values = []) => {
    const { selectedYyb = '', selectedSalary = [], salaryData = [], dispatch } = this.props;
    const tmplSelectedSalary = JSON.parse(JSON.stringify(selectedSalary));
    const deleteSalary = []; // 取消选中的薪酬代码用于清理已选人员类别级别的薪酬数据
    const newSelectedSalary = JSON.parse(JSON.stringify(selectedSalary));
    // 删除取消选中
    tmplSelectedSalary.forEach((item, index) => {
      if (!values.includes(item.payCodeId)) {
        deleteSalary.push(item);
        newSelectedSalary.splice(index, 1);
      }
    });
    // 新增选中
    values.forEach((item) => {
      if (newSelectedSalary.find(selectedSalaryItem => selectedSalaryItem.payCodeId === item) === undefined) {
        const addSalaryObj = {};
        const salaryObj = salaryData.find(salaryItem => salaryItem.ID === item);
        addSalaryObj.orgNo = selectedYyb;
        addSalaryObj.payCodeId = salaryObj.ID;
        addSalaryObj.payCodeName = salaryObj.PAY_NAME;
        addSalaryObj.sno = '';
        newSelectedSalary.push(addSalaryObj);
      }
    });
    if (dispatch) {
      dispatch({
        type: 'salaryPlanSettings/updateSelectedSalary',
        payload: {
          selectedSalary: newSelectedSalary,
        },
      });
    }
  }
  onPayNameChange = (value) => {
    this.setState({ searchPayName: value });
  }
  renderPopContent = () => {
    const { form: { getFieldDecorator },
      salaryData = [],
      selectedSalary = [],
    } = this.props;
    const selectedIds = selectedSalary.map((item) => { return item.payCodeId; });
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const { searchPayName } = this.state;
    return (
      <Fragment>
        <Input.Search
          placeholder="搜索项目"
          onSearch={value => this.onPayNameChange(value)}
        />
        <Scrollbars
          autoHide
          style={{ minWidth: '20rem', height: '26rem' }}
        >
          <Form className="m-form" style={{ marginTop: 0 }}>
            <Form.Item {...formItemLayout} className="m-form-item">
              {
                getFieldDecorator('salary', {
                  initialValue: selectedIds,
                })( // eslint-disable-line
                  <Checkbox.Group onChange={this.onSalaryChange} style={{ minWidth: '20rem' }}>
                    {
                      salaryData.map(item => {
                        if (item.VERSION === '') {
                          if (searchPayName !== '') {
                            if (item.PAY_NAME.indexOf(searchPayName) !== -1) {
                              return <Checkbox key={item.ID} value={item.ID} style={{ display: 'block', marginLeft: '.5rem' }}>{item.PAY_NAME}</Checkbox>
                            } else {
                              return <Checkbox key={item.ID} value={item.ID} style={{ display: 'none', marginLeft: '.5rem' }}>{item.PAY_NAME}</Checkbox>
                            }
                          } else {
                            return <Checkbox key={item.ID} value={item.ID} style={{ display: 'block', marginLeft: '.5rem' }}>{item.PAY_NAME}</Checkbox>
                          }
                        }                        
                      })
                    }
                  </Checkbox.Group>)
              }
            </Form.Item>
          </Form>
        </Scrollbars>
      </Fragment>
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

export default Form.create({
  mapPropsToFields(props) {
    const { selectedSalary = [] } = props;
    const selectedIds = selectedSalary.map(item => item.payCodeId);
    return {
      salary: Form.createFormField({
        value: selectedIds,
      }),
    };
  },
})(AddSalaryItems);
