import React from 'react';
import { Form, Row, Col, Button, Input, Select, DatePicker, TreeSelect, message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
// import { FetchQueryNature } from '../../../../../../services/dataCenter';

const { RangePicker } = DatePicker;
class TradingUnitQuery extends React.Component {
    state = {
        expand: false,
        // xz: [],
        payload: {
            id: null,
            tradeMarket: null
        }
    }

    // componentWillMount() {
    //     this.fetchQueryNature();
    // }

    // fetchQueryNature = (params = {}) => {
    //     const { payload = {} } = this.state
    //     FetchQueryNature({
    //         ...payload,
    //         ...params
    //     }
    //     ).then(res => {
    //         const { record = [], code = 0 } = res
    //         if (code > 0) {
    //             this.setState({
    //                 xz: record,
    //                 payload: {
    //                     ...payload,
    //                     ...params
    //                 }
    //             })
    //         }
    //     }).catch(err => {
    //         message.error(!err.success ? err.message : err.note);
    //     })
    // }

    handleSearch = e => {
        e.preventDefault();
        const { queryList } = this.props;
        this.props.form.validateFields((err, values) => {
            if (queryList) {
                const { authority,
                    column,
                    market,
                    name,
                    nature,
                    org,
                    rltdMngDpmt,
                    speed,
                    state,
                    subNature,
                    totalRows,
                    unitCircle,
                    unitNature,
                    zxrq,
                    ktrq
                } = values;
                if (speed && isNaN(Number(speed, 10))) {
                    message.warn("流速为数值型，请输入正确数值")
                    return
                }
                queryList({
                    current: 1,
                    pageSize: 10,
                    paging: 1,
                    total: -1,
                    authority,
                    column,
                    market,
                    name,
                    nature,
                    org,
                    rltdMngDpmt,
                    speed,
                    state,
                    subNature,
                    totalRows,
                    unitCircle,
                    unitNature,
                    leftEndDate: zxrq && zxrq.length ? moment(zxrq[0]).format('YYYYMMDD') : '',
                    leftStartDate: ktrq && ktrq.length ? moment(ktrq[0]).format('YYYYMMDD') : '',
                    rightEndDate: zxrq && zxrq.length ? moment(zxrq[1]).format('YYYYMMDD') : '',
                    rightStartDate: ktrq && ktrq.length ? moment(ktrq[1]).format('YYYYMMDD') : '',
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

    handleKtPicker = (dates) => {
        if (dates.length === 0) {
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                ktrq: dates,
            });
        }
    }

    handleZxPicker = (dates) => {
        if (dates.length === 0) {
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                zxrq: dates,
            });
        }
    }

    changeYwzl = (value) => {
        this.fetchQueryNature({
            id: value
        })
    }

    changeTradeMarket = (value) => {
        this.fetchQueryNature({
            tradeMarket: value
        })
    }

    render() {
        const { expand = false, xz = [] } = this.state;
        const { ywzl = [], org = [], ltq = [] } = this.props;
        const { dictionary = {} } = this.props;
        const { JYDYYWDL = [],
            JYDYSC = [],
            JYDYZTZSX = [],
            JYDYQXZL = [] } = dictionary;

        const { getFieldDecorator } = this.props.form;



        return (
            <div className='tradingunitlist-query'>
                <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item label="属性">
                                {getFieldDecorator(`nature`, {
                                    initialValue: ""
                                })(<Select
                                    placeholder="请选择"
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {JYDYYWDL.map((item, index) => {
                                        return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="市场">
                                {getFieldDecorator(`market`, {
                                    initialValue: ""
                                })(<Select
                                    placeholder="请选择"
                                    onChange={this.changeTradeMarket}
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {JYDYSC.map((item, index) => {
                                        return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="状态">
                                {getFieldDecorator(`state`, {
                                    initialValue: ""
                                })(<Select
                                    placeholder="请选择"
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {JYDYZTZSX.map((item, index) => {
                                        return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="使用部门">
                                {getFieldDecorator(`org`, {
                                    initialValue: ""
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="名称">
                                {getFieldDecorator(`name`, {
                                    initialValue: ""
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="子属性">
                                {getFieldDecorator(`subNature`, {
                                    initialValue: ""
                                })(<Select
                                    placeholder="请选择"
                                    onChange={this.changeYwzl}
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {ywzl.map((item, index) => {
                                        return <Select.Option value={item.ID || index} key={index}>{item.BUSINESSSUBCLASSNAME || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="性质">
                                {getFieldDecorator(`unitNature`, {
                                    initialValue: ""
                                })(<Input placeholder="请输入" />)}
                                {/* <Select
                                    placeholder="请选择"
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {xz.map((item, index) => {
                                        return <Select.Option value={item.ID || index} key={index}>{item.NAME || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)} */}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="归口管理部门">
                                {getFieldDecorator(`rltdMngDpmt`, {
                                })(<Select
                                    placeholder="请选择"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {org.map((item, index) => {
                                        return <Select.Option value={item.ID || index} key={index}>{item.NAME || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)
                                    // (<TreeSelect
                                    //     showSearch
                                    //     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    //     treeData={org}
                                    //     placeholder="请选择"
                                    //     treeNodeFilterProp="title"
                                    // />)
                                }
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="包含权限">
                                {getFieldDecorator(`auhtority`, {
                                    initialValue: ""
                                })(<Select
                                    placeholder="请选择"
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {JYDYQXZL.map((item, index) => {
                                        return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="包含联通圈">
                                {getFieldDecorator(`unitCircle`, {
                                    initialValue: ""
                                })(<Select
                                    placeholder="请选择"
                                >
                                    <Select.Option value=''>无</Select.Option>
                                    {ltq.map((item, index) => {
                                        return <Select.Option value={item.ID || index} key={index}>{item.JYDYMC || '-'}</Select.Option>
                                    })
                                    }
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="流速">
                                {getFieldDecorator(`speed`, {
                                    rules: [{
                                        required: false,
                                        pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                        message: '请输入数值'
                                    }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="开通日期">
                                {getFieldDecorator('ktrq', {
                                    rules: [{ type: 'array', message: 'shijian!' }],
                                })(<RangePicker onChange={this.handleKtPicker} />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}
                            style={{ display: expand ? 'block' : 'none' }}
                        >
                            <Form.Item label="注销日期">
                                {getFieldDecorator('zxrq', {
                                    rules: [{ type: 'array', message: 'shijian!' }],
                                })(<RangePicker onChange={this.handleZxPicker} />)}
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ marginTop: 6 }}>
                            <Button className='m-btn-radius m-btn-headColor' type="primary" htmlType="submit" style={{ marginRight: '.7rem' }}>
                                查询
                            </Button>
                            <Button className='opt-button' style={{ margin: '0 .7rem' }} onClick={this.setDefault}>
                                重置
                            </Button>
                            <div style={{ display: 'inline-block', margin: '0 1.7rem', cursor: 'pointer' }} onClick={this.toggle}>
                                {this.state.expand ?
                                    <svg className="icon-down" focusable="false" viewBox="0 0 16 16" aria-hidden="true" name="page-right" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 7.7c0-.1-.1-.1 0 0L9.3 1.1c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L14.7 8l-6.2 6.2c-.2.2-.2.5 0 .7.2.2.5.2.7 0l6.4-6.5s.1 0 .1-.1c.2 0 .3-.1.3-.3 0-.1-.1-.2-.2-.3zM8 7.7l-.1-.1-6.4-6.5C1.3.9 1 .9.8 1.1c-.2.2-.2.5 0 .7L6.9 8 .7 14.2c-.2.2-.2.5 0 .7.2.2.5.2.7 0l6.4-6.5s.1 0 .1-.1c.2 0 .3-.1.3-.3 0-.1-.1-.2-.2-.3z"></path></svg>
                                    : <svg className="icon-up" focusable="false" viewBox="0 0 16 16" aria-hidden="true" name="page-right" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 7.7c0-.1-.1-.1 0 0L9.3 1.1c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L14.7 8l-6.2 6.2c-.2.2-.2.5 0 .7.2.2.5.2.7 0l6.4-6.5s.1 0 .1-.1c.2 0 .3-.1.3-.3 0-.1-.1-.2-.2-.3zM8 7.7l-.1-.1-6.4-6.5C1.3.9 1 .9.8 1.1c-.2.2-.2.5 0 .7L6.9 8 .7 14.2c-.2.2-.2.5 0 .7.2.2.5.2.7 0l6.4-6.5s.1 0 .1-.1c.2 0 .3-.1.3-.3 0-.1-.1-.2-.2-.3z"></path></svg>
                                }
                            </div>
                        </Col>
                    </Row>
                    {/* <Row className='tradingunitlist-query-operat'>
                        <Button onClick={this.toggle}>
                            {this.state.expand ? '收起' : '更多'}
                        </Button>
                        <Button className='m-btn-radius m-btn-headColor' style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                            查询
                        </Button>
                    </Row> */}
                </Form>
            </div>
        );
    }
}

export default Form.create()(TradingUnitQuery);
