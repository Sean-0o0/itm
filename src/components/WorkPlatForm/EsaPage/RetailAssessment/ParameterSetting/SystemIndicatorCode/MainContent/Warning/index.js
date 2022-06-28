/* eslint-disable react/jsx-indent */
/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
import React, { Fragment } from 'react';
import { Row, Col, Form, Button, Input, message } from 'antd';


class Warning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentDidMount() {

  }

  componentWillReceiveProps() {

  }

    handleWarningOk = () => {
      this.props.form.validateFields((err) => {
        if (err) {
          return '';
        }
        message.info('新增提交');
        this.props.form.resetFields();
        const { handleWarningCancel } = this.props;
        // eslint-disable-next-line no-unused-expressions
        handleWarningCancel && handleWarningCancel();
      });
    }


    render() {
      const { handleWarningCancel, selectRowData } = this.props;
      const { form: { getFieldDecorator } } = this.props;


      return (
            <Fragment>
                <Row style={{ background: '#fff' }}>
                    <Row style={{ minHeight: '20rem', width: '100%', overflowY: 'auto' }}>
                        <Form className=" m-form">
                            <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 10 }} label="指标代码" >
                                {
                                    getFieldDecorator('zbdm', {
                                        initialValue: selectRowData.zbdm,
                                        rules: [{ required: false }],
                                    })(<Input  disabled/>) // eslint-disable-line
                                }


                            </Form.Item>

                            <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 10 }} label="指标名称" >
                                {
                                    getFieldDecorator('zbmc', {
                                        initialValue: selectRowData.zbdm,
                                        rules: [{ required: false }],
                                    })(<Input   disabled/>) // eslint-disable-line
                                }


                            </Form.Item>
                            <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 10 }} label="数值预警上限" >
                                {
                                    getFieldDecorator('szyjsx', {
                                        // initialValue: '1',
                                        rules: [{ required: true }],
                                    })(<Input/>) // eslint-disable-line
                                }


                            </Form.Item>


                        </Form>
                    </Row>
                    <Row style={{ height: '5rem', width: '100%' }}>
                        <Col xs={24} sm={24} lg={24} style={{ textAlign: 'center', paddingTop: '.75rem' }}>
                            <Button className="m-btn-radius m-btn-headColor" onClick={this.handleWarningOk}> 确定 </Button>
                            <Button className="m-btn-radius" onClick={handleWarningCancel}> 取消 </Button>
                        </Col>
                    </Row>
                </Row>

            </Fragment>
      );
    }
}

// export default AddNew;
export default Form.create({})(Warning);

