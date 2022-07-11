import React from 'react';
import { Row, Input, Form, Card } from 'antd';
import ObjectUtils from '$utils/objectUtils';

const FormItem = Form.Item;

class Edit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      model: this.props.model,
      teamArr: [],
      isGroup: false,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!ObjectUtils.shallowEqual(this.props.model, nextProps.model)) {
      this.setState({
        model: nextProps.model,
      }, () => {
        this.initFormValue(nextProps.model);
      });
    }
  }

  initFormValue = (model) => {
    const { setFieldsValue } = this.props.form;
    const fieldsValue = {
      zjmc: model.label || '--',
      ip: model.ip || '--',
    };
    const { parameterM = {}, type = '' } = model;
    if (parameterM.fgyhs) {
      fieldsValue.fgyhs = parameterM.fgyhs;
    }
    if (type === 'put') {
      fieldsValue.tgtf = parameterM.tgtf || '';
      fieldsValue.mdbm = parameterM.mdbm || '';
    }
    if (type === 'wait') {
      fieldsValue.ddsj = parameterM.ddsj || '1#day';
    }
    setFieldsValue({
      ...fieldsValue,
    });
  }

  // input输入框内容改变
  // handleChangeLabel = (e) => {
  //   const { model = {} } = this.state;
  //   this.setState({
  //     model: {
  //       ...model,
  //       label: e.target.value,
  //     },
  //   });
  // }
  handleChangePartLabel = (e, index) => {
    const { teamArr = [] } = this.state;
    const newTeamArr = JSON.parse(JSON.stringify(teamArr));
    debugger;
    newTeamArr[index].label = e.target.value;
    this.setState({
      teamArr: newTeamArr,
    });
  }
  handleChangePartZb = (e, index) => {
    const { teamArr = [] } = this.state;
    const newTeamArr = JSON.parse(JSON.stringify(teamArr));
    debugger;
    newTeamArr[index].parameterM.zb = e.target.value;
    this.setState({
      teamArr: newTeamArr,
    });
  }

  handleSubmit = () => {
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    const { zjmc = '', ip = '' } = values;
    const { model = {}, teamArr = [] } = this.state;
    let newModel = '';
    newModel = {
      ...model,
      label: zjmc,
      ip: ip,
    };
    if (newModel) {
      this.props.handleChangeParameter(teamArr, newModel);
    }
  }

  render() {
    // const { model = '', isGroup = false, teamArr = [] } = this.state;
    // const { mode = 'default' } = this.props;
    // const disabled = mode === 'default';
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Card
          bordered={false}
          title={'服务器属性'}
        >
          <Form className="m-form">
              <Row className="m-row-form">
                <FormItem>
                  <div style={{ textAlign: 'left', margin: '1rem 0 1rem 0' }}>节点名称</div>
                  {getFieldDecorator('zjmc', { initialValue: '' })(<Input style={{ width: '100%' }} allowClear />)}
                </FormItem>
              </Row>
              <Row className="m-row-form">
                <FormItem>
                  <div style={{ textAlign: 'left', margin: '1rem 0 1rem 0' }}>IP地址</div>
                  {getFieldDecorator('ip', { initialValue: '' })(<Input style={{ width: '100%' }} allowClear/>)}
                </FormItem>
              </Row>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}

export default Form.create({
  onValuesChange(props, changedValues, allValues) {
    props.handleFormChange(changedValues, allValues);
  },
})(Edit);
