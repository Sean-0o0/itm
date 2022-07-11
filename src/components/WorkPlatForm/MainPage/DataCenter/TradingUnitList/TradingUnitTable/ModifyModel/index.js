import React from 'react';
import BasicModal from '../../../../../../Common/BasicModal';
import { Form, Input, Row, Col, Button, Select, message, TreeSelect } from 'antd';
import { FetchQueryNature, OperateMarketUnitInfo } from '../../../../../../../services/dataCenter';

class ModifyModel extends React.Component {

    state = {
        xz: [],
        payload: {
            id: null,
            tradeMarket: null
        },
    };

    componentWillMount() {
        const { selectedRow: { market = '' } } = this.props;
        this.fetchQueryNature({
            market
        });
    }

    fetchQueryNature = (params = {}) => {
        const { payload = {} } = this.state
        FetchQueryNature({
            ...payload,
            ...params
        }
        ).then(res => {
            const { record = [], code = 0 } = res
            if (code > 0) {
                this.setState({
                    xz: record,
                    payload: {
                        ...payload,
                        ...params
                    }
                })
            }
        }).catch(err => {
            message.error(!err.success ? err.message : err.note);
        })
    }

    handleSearch = e => {
        e.preventDefault();
        const { selectedRow: { mkuid = '', mkucode = '', market = '', mkuname = '' } } = this.props;
        this.props.form.validateFields((err, values) => {
            if (err) {
                const errs = Object.keys(err);
                if (errs.includes('name')) {
                    message.warn("请输入交易单元名称!");
                    return
                }

            }
            const {
                tag,
                islta,
                name,
                org,
                speed,
                state,
                unt } = values;
            if (speed && isNaN(Number(speed, 10))) {
                message.warn("流速为数值型，请输入正确数值")
                return
            }
            OperateMarketUnitInfo({
                id: mkuid,
                code: mkucode,
                islta,
                mk: market,
                name: market === '2' ? name : mkuname,
                org,
                speed,
                state,
                unt,
                tag
            })
                .then((res = {}) => {
                    const { code = 0, note = '' } = res;
                    if (code > 0) {
                        this.props.handleDisplayVisible(false, '', 1);
                    } else {
                        message.error(note);
                    }
                }).catch((e) => {
                    message.error(!e.success ? e.message : e.note);
                });

        });
    };

    handleCancel = () => {
        this.props.handleDisplayVisible(false);
    }

    render() {
        const { xz = [] } = this.state;
        const { org = [], dictionary = {}, visible = false, selectedRow = {} } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { JYDYZTZSX = [], JYDYBQ = [] } = dictionary;
        const { market } = selectedRow;

        const modalProps = {
            width: '115rem',
            title: '修改',
            style: { top: '15rem' },
            visible: visible,
            // confirmLoading,
            onCancel: () => this.handleCancel(),
            footer: null,
        };
        const labelFromater = {
            labelCol: { span: 8 },
            wrapperCol: { span: 10 },
        };
        return (
            <BasicModal {...modalProps}>
                <div className="modify-model">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label={market === "2" ? "交易单元代码" : "交易单元名称"} {...labelFromater}>
                                    {<span style={{fontSize: '1.867rem',display: 'flex',alignItems: 'center'}}>{market === "2" ? (selectedRow.mkucode || '-') : (selectedRow.mkuname || '-')}</span>}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="交易所" {...labelFromater}>
                                    {<span style={{fontSize: '1.867rem',display: 'flex',alignItems: 'center'}}>{selectedRow.marketnm || '-'}</span>}
                                </Form.Item>
                            </Col>
                            {market === "2" ?
                                <Col span={12}>
                                    <Form.Item label="交易单元名称" {...labelFromater}>
                                        {getFieldDecorator(`name`, {
                                            rules: [{ required: true, message: '请输入交易单元名称!' }],
                                            initialValue: selectedRow.mkuname || ''
                                        })(<Input placeholder="请输入" />)}
                                    </Form.Item>
                                </Col> : <></>
                            }
                            <Col span={12}>
                                <Form.Item label="交易单元性质" {...labelFromater}>
                                    {getFieldDecorator(`unt`, {
                                        initialValue: selectedRow.subnature || ''
                                    })(<Select
                                        placeholder="请选择"
                                    >
                                        {xz.map((item, index) => {
                                            return <Select.Option value={item.ID || index} key={index}>{item.NAME || '-'}</Select.Option>
                                        })
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="所属营业部名称" {...labelFromater}>
                                    {getFieldDecorator(`org`, {
                                        initialValue: selectedRow.rmdep || ''
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
                            <Col span={12}>
                                <Form.Item label="交易单元状态" {...labelFromater}>
                                    {getFieldDecorator(`state`, {
                                        initialValue: selectedRow.usagestate || ''
                                    })(<Select
                                        placeholder="请选择"
                                    >
                                        {JYDYZTZSX.map((item, index) => {
                                            return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                        })
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="是否有限制指定交易账户" labelCol={{span: 12}} wrapperCol={{span: 8}}>
                                    {getFieldDecorator(`islta`, {
                                    })(<Select
                                        placeholder="请选择"
                                    >
                                        <Select.Option value="0">无</Select.Option>
                                        <Select.Option value="1">是</Select.Option>
                                        <Select.Option value="2">否</Select.Option>
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="流速" {...labelFromater}>
                                    {getFieldDecorator(`speed`, {
                                        initialValue: selectedRow.speed || '',
                                        rules: [{
                                            required: false,
                                            pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                            message: '请输入数值'
                                        }],
                                    })(<Input placeholder="请输入" />)}
                                </Form.Item>
                            </Col>
                            {/* <Col span={12}>
                                <Form.Item label="交易单元标签" {...labelFromater}>
                                    {getFieldDecorator(`tag`, {
                                        initialValue: selectedRow.mkutag || '',
                                    })(<Select
                                        placeholder="请选择"
                                    >
                                        {JYDYBQ.map((item, index) => {
                                            return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                        })
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col> */}
                        </Row>
                        <div className="display-column-footer">
                            <Button htmlType="submit">关闭</Button>
                            <Button type="primary" onClick={this.handleSearch}>确定</Button>
                        </div>
                    </Form>
                </div>
            </BasicModal>

        );
    }
}

export default Form.create()(ModifyModel);