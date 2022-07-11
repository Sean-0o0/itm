/* eslint-disable react/jsx-indent */
import React from 'react';
import { DatePicker, Form, Button, Radio } from 'antd';
import moment from 'moment';

class TaskOpen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { scheduleitem = {}, checkGroupTasks } = this.props;
    const { grpId = '', taskId = '', tgtTp = '' } = scheduleitem;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (typeof checkGroupTasks === 'function') {
          const params = {
            schdSt: '1',
            grpId,
            taskId,
            tgtTp,
            rq: moment(values.datePicker).format('YYYYMMDD'),
            redoState: values.sfcs,
          };
          this.props.checkGroupTasks(params);
          this.props.cancelThis();
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Form style={{ paddingTop: '10px' }} onSubmit={this.handleSubmit}>
          <Form.Item name="datePicker" label="日期" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
            {getFieldDecorator('datePicker', {
              rules: [{
                required: true,
                message: '请填写时间',
              }],
            })(<DatePicker getCalendarContainer={false} className="mot-calendar" format="YYYY-MM-DD" />)}

          </Form.Item>
          <Form.Item name="sfcs" label="是否重算" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
            {getFieldDecorator('sfcs', { initialValue: 1 })(<Radio.Group className="mot-radio" name="sfcs">
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
                                                            </Radio.Group>)}
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }} >
            <Button type="primary" htmlType="submit" style={{ background: '#ff7676', borderColor: 'white' }}> 确定 </Button>
          </Form.Item>
        </Form>
      </React.Fragment >
    );
  }
}
export default Form.create()(TaskOpen);
