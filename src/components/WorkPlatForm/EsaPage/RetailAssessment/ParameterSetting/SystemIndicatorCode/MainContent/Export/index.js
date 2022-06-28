/* eslint-disable react/jsx-indent */
/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
import React, { Fragment } from 'react';
import { Row, Col, Form, Button, Radio, Checkbox, message, InputNumber } from 'antd';


class Export extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fw: '', // 导出范围
    };
  }


  componentDidMount() {

  }

  componentWillReceiveProps() {

  }

    handleExportOk = () => {
      this.props.form.validateFields((err) => {
        if (err) {
          return '';
        }
        message.info('新增提交');
        this.props.form.resetFields();
        const { handleExportCancel } = this.props;
        // eslint-disable-next-line no-unused-expressions
        handleExportCancel && handleExportCancel();
      });
    }

    // 导出字段
    getExportParams = () => {
      const params = [
        { label: 'ID', value: 'Apple' },
        { label: '执行顺序', value: 'zxsx' },
        { label: '指标代码', value: 'zbdm' },
        { label: '指标名称', value: 'zbmc' },
        { label: '指标级别', value: 'zbjb' },
        { label: '适用对象', value: 'sydx' },
        { label: '指标分组', value: 'zbfz' },
        { label: '计算方式', value: 'jsfs' },
        { label: '计算表达式', value: 'jsbds' },
        { label: '表达式解析', value: 'bdsjx' },
        { label: '限制条件', value: 'xztj' },
        { label: '源指标', value: 'yzb' },
        { label: '引用参数', value: 'yycs' },
        { label: '指标属性', value: 'zbsx' },
        { label: '统计周期', value: 'tjzq' },
        { label: '作废标志', value: 'zfbz' },
        { label: '部门类别', value: 'bmlb' },
        { label: '关系类型', value: 'gxlx' },

        { label: '引用层级', value: 'yycj' },
        { label: '执行类型', value: 'zxlx' },
        { label: '结算对象', value: 'zbsfzs' },
        { label: '指标是否展示', value: 'zfbz' },
        { label: '展示顺序', value: 'zssx' },
        { label: '说明', value: 'sm' },

      ];
      return params;
    }

    onChange=(e) => {
      this.setState({
        fw: e.target.value,
      });
    }


    render() {
      const { handleExportCancel } = this.props;
      const { form: { getFieldDecorator } } = this.props;
      const { fw = '1' } = this.state;

      return (
            <Fragment>
                <Row style={{ background: '#fff' }}>
                    <Row style={{ minHeight: '30rem', width: '100%', overflowY: 'auto' }}>
                        <Form className=" m-form">
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="导出模式" >
                                {
                                    getFieldDecorator('dcms', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请选择导出模式' }],
                                    })(<Radio.Group >
                                        <Radio value="1">以office(2007-2010)格式导出</Radio>
                                        <Radio value="2">以office(91-2003-2010)格式导出</Radio>

                                    </Radio.Group>) // eslint-disable-line
                                }
                            </Form.Item>
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="范围" >
                                {
                                    getFieldDecorator('fw', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请选择范围' }],
                                    })(<Radio.Group onChange={this.onChange}>
                                        <Radio value="1">全部导出</Radio>
                                        <Radio value="2">部分导出</Radio>

                                    </Radio.Group>) // eslint-disable-line
                                }

                                {
                                    fw === '2' ? (
                                        <span>
                                            <span style={{ margin: '0 1rem 0 0' }}>从</span>
                                            <Form.Item
                                              labelCol={{ span: 0 }}
                                              wrapperCol={{ span: 5 }}
                                              label=""
                                              style={{ display: 'inline-block', width: 'calc(15% - 5px)', marginRight: 8 }}

                                            >
                                                {
                                                    getFieldDecorator('bfdcks', {
                                                        initialValue: '',
                                                        rules: [{ required: true, message: '请选择范围' }],
                                                    })(<InputNumber min={1} />) // eslint-disable-line
                                                }
                                            </Form.Item>

                                            <span style={{ margin: '0 1rem 0 0' }}>到</span>
                                            <Form.Item
                                              labelCol={{ span: 0 }}
                                              wrapperCol={{ span: 5 }}
                                              label=""
                                              style={{ display: 'inline-block', width: 'calc(15% - 5px)' }}

                                            >
                                                {
                                                    getFieldDecorator('bfdcjs', {
                                                        initialValue: '',
                                                        rules: [{ required: true, message: '请选择范围' }],
                                                    })(<InputNumber min={1} />) // eslint-disable-line
                                                }
                                            </Form.Item>
                                        </span>
                                    ) : ''
                                }

                            </Form.Item>
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="指标属性" >
                                {
                                    getFieldDecorator('zbsz', {
                                        initialValue: '1',
                                        rules: [{ required: true, message: '请选择指标属性' }],
                                    })(<Checkbox.Group options={this.getExportParams()} />)
                                }

                            </Form.Item>

                        </Form>
                    </Row>
                    <Row style={{ height: '5rem', width: '100%' }}>
                        <Col xs={24} sm={24} lg={24} style={{ textAlign: 'center', paddingTop: '.75rem' }}>
                            <Button className="m-btn-radius m-btn-headColor" onClick={this.handleExportOk}> 确定 </Button>
                            <Button className="m-btn-radius" onClick={handleExportCancel}> 取消 </Button>
                        </Col>
                    </Row>
                </Row>

            </Fragment>
      );
    }
}

// export default AddNew;
export default Form.create({})(Export);

