import React from 'react';
import { DatePicker, Row, Col, Form, TreeSelect, Button } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

const { MonthPicker } = DatePicker;
class OverviewHeader extends React.Component {

    onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    render() {
        const { org = [] } = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className='calculate-header'>
                <Row gutter={24}>
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                        <Col span={6}>
                            <Form.Item label="组织机构">
                                {getFieldDecorator(`org`, {
                                    initialValue: ''
                                })(<TreeSelect
                                    showSearch
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    // allowClear
                                    // multiple
                                    treeData={org}
                                    placeholder="请选择"
                                    // treeDefaultExpandAll
                                    treeNodeFilterProp="title"
                                // onChange={this.onChange}
                                />)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="日期选择">
                                {getFieldDecorator(`field`, {
                                    initialValue: moment(moment().format('YYYY-MM'), 'YYYY-MM')
                                })(<MonthPicker style={{ height: '100%' }} format='YYYY-MM' onChange={this.onChange} picker="month" />)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="总成本">
                                {getFieldDecorator(`cost`, {
                                })(<span><span style={{ fontSize: '2.5rem', color: '#4BAFEE' }}>247183</span> 元</span>)}
                            </Form.Item>

                        </Col>
                        <Col span={6} style={{ marginTop: 6 }}>
                            <Button className='m-btn-radius m-btn-headColor' type="primary" htmlType="submit" style={{ marginRight: '.7rem', float: 'right' }}>
                                查询
                            </Button>
                        </Col>
                    </Form>
                </Row>
            </div>
        );
    }
}

export default Form.create()(OverviewHeader);
