import React from 'react';
import { DatePicker, Row, Col, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

const { MonthPicker } = DatePicker;
class OverviewHeader extends React.Component {

    onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className='calculate-header'>
                <Row gutter={24}>
                    <Form className="ant-advanced-search-form">
                        <Col span={6}>
                            <Form.Item label="计算月份">
                                {getFieldDecorator(`field`, {
                                    initialValue: moment(moment().format('YYYY-MM'),'YYYY-MM')
                                })(<MonthPicker style={{height: '100%'}} format='YYYY-MM' onChange={this.onChange} picker="month" />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="总成本">
                                {getFieldDecorator(`cost`, {
                                })(<span><span style={{ fontSize: '2.5rem', color: '#4BAFEE' }}>247183</span> 元</span>)}
                            </Form.Item>

                        </Col>
                    </Form>
                </Row>
            </div>
        );
    }
}

export default Form.create()(OverviewHeader);
