import React from 'react';
import { Form, DatePicker, Row, Col, Input, Select, Button } from 'antd';
import BasicModal from '../../../../../Common/BasicModal';
class ModifyTradingUnit extends React.Component {
    state = {

    };

    handleCancel = () => {
        const { callBack } = this.props;
        callBack(false);
    }

    render() {
        const { data, columns } = this.state;
        const { visable } = this.props;
        const { getFieldDecorator } = this.props.form;
        const modalProps = {
            width: '115rem',
            title: '修改',
            style: { top: '15rem' },
            visible: visable,
            onCancel: () => this.handleCancel(),
            onOk: () => this.handleConfirm(),
            onCancelEvent: () => this.handleCancel(),
            footer: null,
        };
        const labelFromater = {
            labelCol: { span: 8 },
            wrapperCol: { span: 10 },
        };
        return (
            <BasicModal {...modalProps}>
                <div className="account-modify-model">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                        <Row gutter={24}>
                            <Col span={11}>
                                <Form.Item label="交易单元号" {...labelFromater}>
                                    {getFieldDecorator(`ymt`, {
                                        initialValue: '111',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入交易单元号!',
                                        //     },
                                        // ]
                                    })(<Input placeholder="请输入" disabled={true}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="交易单元市场" {...labelFromater}>
                                    {getFieldDecorator(`jysc`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入交易单元市场!',
                                        //     },
                                        // ]
                                    })(<Input placeholder="请输入" disabled={true}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="交易单元属性" {...labelFromater}>
                                    {getFieldDecorator(`ymt`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请选择交易单元属性!',
                                        //     },
                                        // ]
                                    })(<Select
                                        placeholder="请选择"
                                        onChange={this.changeSystem}
                                    >
                                        {/* {ZYZHLYXT.map((item, index) => {
                                            return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                        })
                                        } */}
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="交易单元状态" {...labelFromater}>
                                    {getFieldDecorator(`ymtmc`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入交易单元状态!',
                                        //     },
                                        // ],
                                    })(<Input placeholder="请输入" />)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="资金账户" {...labelFromater}>
                                    {getFieldDecorator(`ymtmc`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入资金账户!',
                                        //     },
                                        // ],
                                    })(<Input placeholder="请输入" disabled={true}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="交易单元名称" {...labelFromater}>
                                    {getFieldDecorator(`ymtmc`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入交易单元名称!',
                                        //     },
                                        // ],
                                    })(<Input placeholder="请输入" disabled={true}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="分公司名称" {...labelFromater}>
                                    {getFieldDecorator(`ymtmc`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入分公司名称!',
                                        //     },
                                        // ],
                                    })(<Input placeholder="请输入" disabled={true}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="营业部名称" {...labelFromater}>
                                    {getFieldDecorator(`ymtmc`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入营业部名称!',
                                        //     },
                                        // ],
                                    })(<Input placeholder="请输入" disabled={true}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="协议开户日期" {...labelFromater}>
                                    {getFieldDecorator(`khrq`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请选择开始日期!',
                                        //     },
                                        // ]
                                    })(
                                        <DatePicker format="YYYY-MM-DD" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="协议结束日期" {...labelFromater}>
                                    {getFieldDecorator(`khrq`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请选择结束日期!',
                                        //     },
                                        // ]
                                    })(
                                        <DatePicker format="YYYY-MM-DD" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="业务模式" {...labelFromater}>
                                    {getFieldDecorator(`lyxt`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请选择业务模式!',
                                        //     },
                                        // ],
                                    })(<Select
                                        placeholder="请选择"
                                        onChange={this.changeSystem}
                                    >
                                        {/* {ZYZHLYXT.map((item, index) => {
                                            return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                        })
                                        } */}
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="前端收费（万）" {...labelFromater}>
                                    {getFieldDecorator(`zjzh`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入前端收费（万）!',
                                        //     },
                                        // ],
                                    })(<Input placeholder="请输入" />)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="后端收费（万）" {...labelFromater}>
                                    {getFieldDecorator(`zjzhmc`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入后端收费（万）!',
                                        //     },
                                        // ]
                                    })(<Input placeholder="请输入" />)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="佣金率" {...labelFromater}>
                                    {getFieldDecorator(`zjzhmc`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入佣金率!',
                                        //     },
                                        // ]
                                    })(<Input placeholder="请输入" disabled={true}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="净佣金收入" {...labelFromater}>
                                    {getFieldDecorator(`zjzhmc`, {
                                        initialValue: '',
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请输入净佣金收入!',
                                        //     },
                                        // ]
                                    })(<Input placeholder="请输入" disabled={true}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="备注" {...labelFromater}>
                                    {getFieldDecorator(`zjzhmc`, {
                                        initialValue: '',
                                    })(<Input placeholder="请输入"/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className="display-column-footer">
                            <Button className='.m-btn-radius' onClick={this.handleCancel}>关闭</Button>
                            <Button className='.m-btn-radius' type="primary" htmlType="submit">确定</Button>
                        </div>
                    </Form>
                </div>
            </BasicModal>

        );
    }
}

export default Form.create()(ModifyTradingUnit);
