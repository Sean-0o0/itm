import React from 'react';
import { Form, Row, Col, Button, Input, Select, DatePicker, Checkbox, Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

const { RangePicker } = DatePicker;
class AccountQuery extends React.Component {
    state = {
        expand: false,
    }

    handleSearch = e => {
        e.preventDefault();
        const { queryList } = this.props;
        this.props.form.validateFields((err, values) => {
            if (queryList) {
                const { jjdm,
                    jysc,
                    khrq,
                    lyxt,
                    sybm,
                    syqk,
                    ymt,
                    zhly,
                    zhyt,
                    zjzh,
                    zqzh } = values;
                queryList({
                    current: 1,
                    pageSize: 10,
                    paging: 1,
                    total: -1,
                    jjdm,
                    jysc,
                    lyxt,
                    sybm,
                    syqk,
                    ymt,
                    zhly: Array.isArray(zhly) ? zhly.join(';') : '',
                    zhyt,
                    zjzh,
                    zqzh,
                    khjsrq: khrq&&khrq.length ? moment(khrq[0]).format('YYYYMMDD') : '',
                    khksrq: khrq&&khrq.length ? moment(khrq[1]).format('YYYYMMDD') : ''
                })
            }
        });
    };

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    setDefault = () => {
        const { resetFields } = this.props.form;
        if (resetFields) {
            resetFields();
        }
    }

    handlePicker = (dates) =>{
        if(dates.length === 0){
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
              khrq: dates,
            });
        }
    }

    render() {
        const { expand = false } = this.state;
        const { dictionary = {} } = this.props;
        const { ZYZHJYSC = [],
            ZYZHLYXT = [],
            ZYZHSYBM = [],
            ZYZHZHYT = [],
            ZYZHSYQK = [],
            ZYZHZHLY = [] } = dictionary;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className='tradingunitlist-query'>
                <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item label="证券账户">
                                {getFieldDecorator(`zqzh`, {
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="交易市场">
                                {getFieldDecorator(`jysc`, {
                                    initialValue: ''
                                })(<Select
                                    placeholder="请选择"
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {ZYZHJYSC.map((item, index) => {
                                        return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="一码通号">
                                {getFieldDecorator(`ymt`, {

                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="使用部门">
                                {getFieldDecorator(`sybm`, {
                                    initialValue: ''
                                })(<Select
                                    placeholder="请选择"
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {ZYZHSYBM.map((item, index) => {
                                        return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="来源系统">
                                {getFieldDecorator(`lyxt`, {
                                    initialValue: ''
                                })(<Select
                                    placeholder="请选择"
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {ZYZHLYXT.map((item, index) => {
                                        return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="资金账号">
                                {getFieldDecorator(`zjzh`, {

                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="基金代码">
                                {getFieldDecorator(`jjdm`, {

                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="账户用途">
                                {getFieldDecorator(`zhyt`, {
                                    initialValue: ''
                                })(<Select
                                    placeholder="请选择"
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {ZYZHZHYT.map((item, index) => {
                                        return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="使用情况">
                                {getFieldDecorator(`syqk`, {
                                    initialValue: ''
                                })(<Select
                                    placeholder="请选择"
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {ZYZHSYQK.map((item, index) => {
                                        return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="开户日期">
                                {getFieldDecorator('khrq', {
                                })(<RangePicker onChange={this.handlePicker}/>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="账户来源">
                                {getFieldDecorator('zhly', {
                                })(<Checkbox.Group style={{ width: '100%', lineHeight: '40px' }}>
                                    <Row>
                                        {ZYZHZHLY.map((item, index) => {
                                            return <Col span={8}>
                                                <Checkbox value={item.ibm || index} key={index}>{item.note || ''}</Checkbox>
                                            </Col>
                                        })
                                        }
                                    </Row>
                                </Checkbox.Group>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ marginTop: 3, cursor: 'pointer' }}>
                            <Button className='m-btn-radius m-btn-headColor' type="primary" htmlType="submit" style={{ marginRight: '.7rem' }}>
                                查询
                            </Button>
                            <Button className='opt-button' style={{ margin: '0 .7rem' }} onClick={this.setDefault}>
                                重置
                            </Button>
                            {/* <Button className='opt-button' style={{ margin: '0 .7rem' }} onClick={this.toggle}>
                                {this.state.expand ? '收起' : '更多'}
                            </Button> */}
                            <div style={{ display: 'inline-block', margin: '0 1.7rem' }} onClick={this.toggle}>
                                {this.state.expand ?
                                    <svg className="icon-down" focusable="false" viewBox="0 0 16 16" aria-hidden="true" name="page-right" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 7.7c0-.1-.1-.1 0 0L9.3 1.1c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L14.7 8l-6.2 6.2c-.2.2-.2.5 0 .7.2.2.5.2.7 0l6.4-6.5s.1 0 .1-.1c.2 0 .3-.1.3-.3 0-.1-.1-.2-.2-.3zM8 7.7l-.1-.1-6.4-6.5C1.3.9 1 .9.8 1.1c-.2.2-.2.5 0 .7L6.9 8 .7 14.2c-.2.2-.2.5 0 .7.2.2.5.2.7 0l6.4-6.5s.1 0 .1-.1c.2 0 .3-.1.3-.3 0-.1-.1-.2-.2-.3z"></path></svg>
                                :<svg className="icon-up" focusable="false" viewBox="0 0 16 16" aria-hidden="true" name="page-right" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 7.7c0-.1-.1-.1 0 0L9.3 1.1c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L14.7 8l-6.2 6.2c-.2.2-.2.5 0 .7.2.2.5.2.7 0l6.4-6.5s.1 0 .1-.1c.2 0 .3-.1.3-.3 0-.1-.1-.2-.2-.3zM8 7.7l-.1-.1-6.4-6.5C1.3.9 1 .9.8 1.1c-.2.2-.2.5 0 .7L6.9 8 .7 14.2c-.2.2-.2.5 0 .7.2.2.5.2.7 0l6.4-6.5s.1 0 .1-.1c.2 0 .3-.1.3-.3 0-.1-.1-.2-.2-.3z"></path></svg>
                                }
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Form.create()(AccountQuery);
