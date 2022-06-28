/* eslint-disable react/jsx-indent */
/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
import React, { Fragment } from 'react';
import { Row, Col, Form, Select, Button, Radio, Checkbox, Input, message } from 'antd';


const { TextArea } = Input;
const { Option } = Select;
class AddNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sydx: '', // 适用对象
    };
  }


  componentWillMount() {
    const { selectRowData } = this.props;
    if (selectRowData) {
      // eslint-disable-next-line prefer-destructuring
      const sydx = selectRowData.sydx;
      this.setState({
        sydx,
      });
    }
  }

  componentDidMount() {

  }

  componentWillReceiveProps() {

  }

    onRadioChange = (e) => {
      this.setState({
        sydx: e.target.value,
      });
    }

    handleAddOk = () => {
      //   const { type } = this.props;
    //   //console.log(this.props.form.);
      this.props.form.validateFields((err, values) => {
        if (err) {
          return '';
        }
        // //console.log(values);
        // 构造选择数据，供规则定义使用
        this.props.onRowClick(values);

        message.info('提交');


        this.props.form.resetFields();
        const { handleAddCancel } = this.props;
        // eslint-disable-next-line no-unused-expressions
        handleAddCancel && handleAddCancel();
      });
    }

    // 点击规则定义
    handleOnRuleDefineClick=() => {
    //   const { handleOnDefineClick } = this.props;
      this.props.form.validateFields((err, values) => {
        if (err) {
          return '';
        }

        this.props.onRowClick(values, 'addDefine');
        message.info('提交');
        this.props.form.resetFields();
        const { handleAddCancel } = this.props;
        // eslint-disable-next-line no-unused-expressions
        handleAddCancel && handleAddCancel();
        // eslint-disable-next-line no-unused-expressions
        // handleOnDefineClick && handleOnDefineClick();
      });
    }


    render() {
      //   const sydx = '';
      const { sydx } = this.state;
      const { handleAddCancel, type, selectRowData } = this.props;
      const { form: { getFieldDecorator } } = this.props;
      //   if (selectRowData) {
      //     // eslint-disable-next-line prefer-destructuring
      //     sydx = selectRowData.sydx;
      //   }

      return (
            <Fragment>
                <Row style={{ background: '#fff' }}>
                    <Row style={{ minHeight: '46rem', width: '100%', overflowY: 'auto' }}>
                        <Form className=" m-form">
                            <Row>
                                <Col span={12} >
                                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label="指标代码" >

                                        {
                                            getFieldDecorator('zbdm', {
                                                initialValue: (type === 'edit' || type === 'delete' ? selectRowData.zbdm : ''),
                                                rules: [{ required: type !== 'delete', message: '请输入指标代码' }],
                                            })(<Input disabled={type === 'delete'} />)
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={12} >
                                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label="指标名称" >
                                        {
                                            getFieldDecorator('zbmc', {
                                                initialValue: (type === 'edit' || type === 'delete' ? selectRowData.zbmc : ''),
                                                rules: [{ required: type !== 'delete', message: '请输入指标名称' }],
                                            })(<Input disabled={type === 'delete'} />)
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="适用对象" >
                                {
                                    getFieldDecorator('sydx', {
                                        initialValue: (type === 'edit' || type === 'delete' ? selectRowData.sydx : '客户'),
                                        rules: [{ required: type !== 'delete' }],
                                    })(<Radio.Group
                                      onChange={this.onRadioChange}
                                      disabled={type === 'delete'}
                                    >
                                        <Radio key="1" value="客户">客户</Radio>
                                        <Radio key="2" value="个人">个人</Radio>
                                        <Radio key="3" value="团队">团队</Radio>
                                        <Radio key="4" value="部门">部门</Radio>
                                        <Radio key="5" value="营业部">营业部</Radio>
                                        <Radio key="6" value="公司">公司</Radio>

                                    </Radio.Group>) // eslint-disable-line
                                }
                            </Form.Item>
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="指标分组" >
                                {
                                    getFieldDecorator('zbfz', {
                                        initialValue: (type === 'edit' || type === 'delete' ? selectRowData.zbfz : '资产'),
                                        rules: [{ required: type !== 'delete', message: '请选择指标分组' }],
                                    })(<Checkbox.Group
                                      disabled={type === 'delete'}
                                    >
                                        <Checkbox value="资产" key="1">资产</Checkbox>
                                        <Checkbox value="佣金" key="2">佣金</Checkbox>
                                        <Checkbox value="交易量" key="3">交易量</Checkbox>
                                        <Checkbox value="客户数" key="4">客户数</Checkbox>
                                        <Checkbox value="绩效" key="5">绩效</Checkbox>
                                       </Checkbox.Group>)
                                }

                            </Form.Item>
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="指标属性" >
                                {
                                    getFieldDecorator('zbsx', {
                                        initialValue: (type === 'edit' || type === 'delete' ? selectRowData.zbsx : '绩效'),
                                        rules: [{ required: type !== 'delete', message: '请选择指标属性' }],
                                    })(<Checkbox.Group
                                      disabled={type === 'delete'}

                                    >
                                        <Checkbox value="绩效" key="1">绩效</Checkbox>
                                        <Checkbox value="薪酬计算" key="2">薪酬计算</Checkbox>
                                        <Checkbox value="级别计算" key="3">级别计算</Checkbox>
                                        <Checkbox value="提成指标" key="4">提成指标</Checkbox>
                                        <Checkbox value="机构考核" key="5">机构考核</Checkbox>
                                        <Checkbox value="积分" key="6">积分</Checkbox>

                                       </Checkbox.Group>)
                                }

                            </Form.Item>
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="部门类别" >
                                {
                                    getFieldDecorator('bmlb', {
                                        initialValue: (type === 'edit' || type === 'delete' ? selectRowData.bmlb : '客户经理'),
                                        rules: [{ required: type !== 'delete', message: '请选择部门类别' }],
                                    })(<Checkbox.Group
                                      disabled={type === 'delete'}

                                    >
                                        <Checkbox value="客户经理" key="1">客户经理</Checkbox>
                                        <Checkbox value="证券经纪人" key="2">证券经纪人</Checkbox>
                                        <Checkbox value="管理服务人员" key="3">管理服务人员</Checkbox>

                                       </Checkbox.Group>)
                                }

                            </Form.Item>
                            <Row>
                                <Col span={12} >
                                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label="执行顺序" >
                                        {
                                            getFieldDecorator('zxsx', {
                                                initialValue: (type === 'edit' || type === 'delete' ? selectRowData.zxsx : ''),
                                                rules: [{ required: type !== 'delete', message: '请输入执行顺序' }],
                                            })(<Input disabled={type === 'delete'} />)
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={12} >

                                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label="展示顺序" >
                                        {
                                            getFieldDecorator('zssx', {
                                                initialValue: (type === 'edit' || type === 'delete' ? selectRowData.zssx : ''),
                                                rules: [{ required: type !== 'delete', message: '请输入展示顺序' }],
                                            })(<Input disabled={type === 'delete'} />)
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} >
                                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label="执行类型" >
                                        {
                                            getFieldDecorator('zslx', {
                                                initialValue: (type === 'edit' || type === 'delete' ? selectRowData.zslx : ''),
                                                rules: [{ required: type !== 'delete', message: '请选择执行类型' }],
                                            })(<Select
                                              disabled={type === 'delete'}
                                            >
                                                <Option value="1" key="1">1</Option>
                                                <Option value="2" key="2">2</Option>
                                               </Select>)
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={12} >
                                    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label="是否展示" >
                                        {
                                            getFieldDecorator('sfzs', {
                                                initialValue: (type === 'edit' || type === 'delete' ? selectRowData.sfzs : ''),
                                                rules: [{ required: type !== 'delete', message: '请选择是否展示' }],
                                            })(<Select
                                              disabled={type === 'delete'}
                                            >
                                                <Option value="1" key="1">是</Option>
                                                <Option value="2" key="2">否</Option>
                                               </Select>)
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="计算方式" >
                                {
                                    getFieldDecorator('jsfs', {
                                        initialValue: (type === 'edit' || type === 'delete' ? selectRowData.jsfs : ''),

                                        rules: [{ required: type !== 'delete', message: '请选择计算方式' }],
                                    })(<Radio.Group
                                      disabled={type === 'delete'}

                                    >
                                        <Radio value="1">引用数据源</Radio>
                                        <Radio value="2">引用过程</Radio>
                                        <Radio value="3">引用指标</Radio>
                                        <Radio value="4">自定义脚本</Radio>
                                    </Radio.Group>) // eslint-disable-line
                                }

                            </Form.Item>
                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="作废标志" >
                                {
                                    getFieldDecorator('zfbz', {
                                        initialValue: (type === 'edit' || type === 'delete' ? selectRowData.zfbz : ''),

                                        rules: [{ required: type !== 'delete', message: '请选择计算方式' }],
                                    })(<Radio.Group
                                      disabled={type === 'delete'}

                                    >
                                        <Radio value="1">正常</Radio>
                                        <Radio value="2">作废</Radio>

                                    </Radio.Group>) // eslint-disable-line
                                }

                            </Form.Item>
                            {
                                sydx === '个人' && (
                                    <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="结算对象" >
                                        {
                                            getFieldDecorator('jsdx', {
                                                initialValue: (type === 'edit' || type === 'delete' ? selectRowData.jsdx : ''),
                                                rules: [{ required: type !== 'delete', message: '请选择结算对象' }],
                                            })(<Select
                                              disabled={type === 'delete'}
                                            >
                                                <Option value="1" key="1">1</Option>
                                                <Option value="2" key="2">2</Option>
                                               </Select>)
                                        }
                                    </Form.Item>
                                )
                            }

                            {
                                sydx === '营业部' && (
                                    <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="统计范围" >
                                        {
                                            getFieldDecorator('tjfw', {
                                                initialValue: (type === 'edit' || type === 'delete' ? selectRowData.tjfw : ''),
                                                rules: [{ required: type !== 'delete', message: '请选择统计范围' }],
                                            })(<Select
                                              disabled={type === 'delete'}
                                            >
                                                <Option value="1" key="1">1</Option>
                                                <Option value="2" key="2">2</Option>
                                               </Select>)
                                        }
                                    </Form.Item>
                                )
                            }


                            <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="说明" >
                                {
                                    getFieldDecorator('sm', {
                                        initialValue: (type === 'edit' || type === 'delete' ? selectRowData.sm : ''),

                                        rules: [{ required: false }],
                                    })(<TextArea
                                      disabled={type === 'delete'}
                                      className="m-input"
                                        //  disabled
                                      autoSize={{ minRows: 2 }}
                                    />) // eslint-disable-line
                                }


                            </Form.Item>


                            {
                                type === 'delete' ? (
                                    <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="关系类型" >

                                        {
                                            getFieldDecorator('gxlx', {
                                                initialValue: selectRowData.gxlx,
                                                // rules: [{ required: true, message: '请输入关系类型' }],
                                            })(<Input disabled />)
                                        }
                                    </Form.Item>
                                ) : ''
                            }

                        </Form>
                    </Row>
                    <Row style={{ height: '5rem', width: '100%' }}>
                        <Col xs={24} sm={24} lg={24} style={{ textAlign: 'center', paddingTop: '.75rem' }}>
                            <Button className="m-btn-radius m-btn-headColor" onClick={this.handleAddOk}> 确定 </Button>
                            {
                                type === 'add' && (<Button className="m-btn-radius m-btn-headColor" onClick={this.handleOnRuleDefineClick}> 规则定义 </Button>)
                            }

                            <Button className="m-btn-radius" onClick={handleAddCancel}> 取消 </Button>
                        </Col>
                    </Row>
                </Row>

            </Fragment>
      );
    }
}

// export default AddNew;
export default Form.create({})(AddNew);

