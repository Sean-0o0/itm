import React from 'react';
import BasicModel from '../../../../../Common/BasicModal';
import { DatePicker, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

const { MonthPicker } = DatePicker;
class TradingUnitCalculate extends React.Component {
    state = {
    }

    handleCancel = () => {
        const { changeCalcVisible } = this.props;
        if (changeCalcVisible) {
            changeCalcVisible(false)
        }
    }

    hadleOk = () => {

    }

    render() {
        const { visible = false, type = 1 } = this.props;
        const { getFieldDecorator } = this.props.form;

        const modalProps = {
            width: '55rem',
            title: type === 1 ? '成本试算' : type === 2 ? '成本确认' : '成本回退',
            style: { top: '35rem' },
            visible: visible,
            // confirmLoading,
            onCancel: () => this.handleCancel(type),
            onOk: () => this.hadleOk()
        };
        const temp = ['2022-06', '2022-07', '2022-08']

        return (
            <BasicModel {...modalProps}>
                <div className='calc-modal'>
                    <Form className="ant-advanced-search-form">
                        <Form.Item label={`${type === 1 ? '成本试算' : type === 2 ? '成本确认' : '成本回退'}月份`}>
                            {getFieldDecorator(`field`, {
                                initialValue: moment(moment().format('YYYY-MM'), 'YYYY-MM'),
                                rules: [{
                                    validator: (_, value) =>
                                        temp.includes(moment(value).format('YYYY-MM')) ? Promise.resolve() : Promise.reject(new Error('当前月份已确认')),
                                }],
                            })(<MonthPicker style={{ height: '100%' }} format='YYYY-MM' onChange={this.onChange} picker="month" />)}
                        </Form.Item>
                    </Form>
                </div>
            </BasicModel >
        );
    }
}

export default Form.create()(TradingUnitCalculate);
