import React from 'react';
import BasicModal from '../../../../Common/BasicModal';
import { Form, Input, Row, Col, Button, Select, Collapse, DatePicker, message, Radio } from 'antd';
import { OperateSelfAccountList } from '../../../../../services/processCenter'
import { FetchObjectQuery } from '../../../../../services/sysCommon/index';
import moment from 'moment';
import 'moment/locale/zh-cn';
class ModifyModel extends React.Component {
    state = {
        system: '',
        zqzh: [],
        jyqd: [],
        blType: '2'
    };

    componentWillMount() {
        const { type = '' } = this.props;
        if (type === '修改') {
            this.initBlType()
        }
        FetchObjectQuery(
            {
                "cols": "ID,ZQZH,YMT,YMTMC",
                "current": 1,
                "cxtj": "LYXT is null and XHRQ is null",
                "pageSize": 1000,
                "paging": 1,
                "serviceid": "vZYZQZH",
                "sort": "",
                "total": -1
            }
        ).then(res => {
            const { data = [], code = 0 } = res
            if (code > 0) {
                const { selectedRow: { lyxtLc }, type } = this.props;
                let system = ''
                if (type === '修改') {
                    system = lyxtLc
                }
                this.setState({
                    zqzh: data,
                    system
                })
            }
        }).catch(err => {
            message.error(!err.success ? err.message : err.note);
        })
        FetchObjectQuery(
            {
                "cols": "ID,JYQD",
                "current": 1,
                "cxtj": "USE_STATE=1",
                "pageSize": 1000,
                "paging": 1,
                "serviceid": "tZYZHJYQD",
                "sort": "",
                "total": -1
            }
        ).then(res => {
            const { data = [], code = 0 } = res
            if (code > 0) {
                this.setState({
                    jyqd: data,
                })
            }
        }).catch(err => {
            message.error(!err.success ? err.message : err.note);
        })
    }

    initBlType = () => {
        // const { selectedRow = {} } = this.props;
        // const { selectedRow: nextRows = {} } = nextProps;
        // if(JSON.stringify(selectedRow)!==JSON.stringify(nextRows)){
            const { selectedRow: { lyxtLc } } = this.props;
        this.setState({
            blType: lyxtLc ? '3' : '2'
        })
        // }
    }

    handleSearch = e => {
        e.preventDefault();
        const { blType = '' } = this.state;
        const { type, selectedRow: { lcId, lyxtLc } } = this.props;
        this.props.form.validateFields((err, values) => {
            if (err) {
                const errs = Object.keys(err);
                if (errs.includes('zhid')) {
                    message.warn("请输入证券账号!");
                    return
                }
                if (errs.includes('jysc')) {
                    message.warn("请选择交易市场!");
                    return
                }
                if (errs.includes('ymt')) {
                    message.warn("请输入一码通号!");
                    return
                }
                if (errs.includes('ymtmc')) {
                    message.warn("请输入一码通名称!");
                    return
                }
                if (errs.includes('khrq')) {
                    message.warn("请选择开户日期!");
                    return
                }
                if (errs.includes('lyxt')) {
                    message.warn("请输入来源系统!");
                    return
                }
                if (errs.includes('zjzh')) {
                    message.warn("请选择资金账户!");
                    return
                }
                if (errs.includes('zjzhmc')) {
                    message.warn("请输入资金账户名称!");
                    return
                }
                if (errs.includes('sybm')) {
                    message.warn("请选择使用部门!");
                    return
                }
                if (errs.includes('zhyt')) {
                    message.warn("请输入账户用途!");
                    return
                }
                if (errs.includes('khrq')) {
                    message.warn("请选择开户日期!");
                    return
                }
                if (errs.includes('jjdm')) {
                    message.warn("请选择基金代码!");
                    return
                }
                if (errs.includes('jjmc')) {
                    message.warn("请选择基金名称!");
                    return
                }
            }
            const { jjdm,
                jjmc,
                jyqd,
                jysc,
                khrq,
                lyxt,
                sybm,
                xhrq,
                xw,
                ymt,
                ymtmc,
                zcdybh,
                zcdymc,
                zhbh,
                zhid,
                zhmc,
                zhyt,
                zjzh,
                zjzhmc } = values;

            OperateSelfAccountList({
                jjdm: jjdm ? jjdm : '',
                jjmc: jjmc ? jjmc : '',
                jyqd: jyqd ? jyqd : null,
                jysc: jysc ? jysc : null,
                khrq: khrq ? moment(khrq).format('YYYYMMDD') : null,
                lyxt: lyxt ? lyxt : null,
                lyxt_orig: type === '修改' ? lyxtLc : null,
                sybm: sybm ? sybm : null,
                type: type === '修改' ? '1' : blType,
                xhrq: xhrq ? moment(xhrq).format('YYYYMMDD') : null,
                xw: xw ? xw : '',
                ymt: ymt ? ymt : '',
                ymtmc: ymtmc ? ymtmc : '',
                zcdybh: zcdybh ? zcdybh : '',
                zcdymc: zcdymc ? zcdymc : '',
                zhbh: zhbh ? zhbh : '',
                zhid: type === '修改' ? lcId : (zhid ? zhid : null),
                zhmc: zhmc ? zhmc : '',
                zhyt: zhyt ? zhyt : null,
                zjzh: zjzh ? zjzh : '',
                zjzhmc: zjzhmc ? zjzhmc : '',
            })
                .then((res = {}) => {
                    const { code = 0, note = '' } = res;
                    if (code > 0) {
                        this.props.handleDisplayVisible(false, '补录', 1);
                        message.success(note);
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

    changeSystem = (value) => {
        this.setState({
            system: value
        })
    }

    getName = (value) => {
        const { dictionary = {} } = this.props;
        const { ZYZHLYXT = [] } = dictionary;
        let title = '-'
        ZYZHLYXT.forEach(element => {
            const { ibm = '', note = '-' } = element;
            if (ibm === value) {
                title = note;
                return
            }
        });
        return title
    }

    handleDefault = (value) => {
        const { zqzh = [] } = this.state;
        zqzh.forEach(item => {
            const { ID, YMT, YMTMC } = item;
            if (ID === value) {
                this.props.form.setFieldsValue({
                    ymt: YMT,
                    ymtmc: YMTMC
                });
                return
            }
        })
    }

    search = (value) => {
        if (value) {

            this.props.form.setFieldsValue({
                zhid: value
            });
        }
    }

    changeType = (e) => {

        this.setState({
            blType: e.target.value,
            system: ''
        }, (() => {
            const { resetFields } = this.props.form;
            if (resetFields) {
                resetFields();
            }
        }))
    }

    render() {
        let { system = '', zqzh = [], jyqd = [], blType = '' } = this.state;
        const { visible = false, selectedRow = {}, type = '', dictionary = {} } = this.props;

        const { ZYZHJYSC = [],
            ZYZHLYXT = [],
            ZYZHSYBM = [],
            ZYZHZHYT = [] } = dictionary;
        const { getFieldDecorator } = this.props.form;
        const modalProps = {
            width: '115rem',
            title: type,
            style: { top: '6rem' },
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
                <div className="account-modify-model">
                    <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                        <Row gutter={24}>
                            {type === '补录' ? <Col span={23}>
                                <Form.Item label="补录类型" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                    {getFieldDecorator(`blType`, {
                                        initialValue: blType,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择补录类型!',
                                            },
                                        ],
                                    })(<Radio.Group onChange={this.changeType}>
                                        <Radio value='2'>证券账户</Radio>
                                        <Radio value='3'>资金账户</Radio>
                                        <Radio value='4'>证券账户+资金账户</Radio>
                                    </Radio.Group>)
                                    }
                                </Form.Item>
                            </Col> : <></>}
                            <Col span={12}>
                                <Form.Item label="证券账号" {...labelFromater}>
                                    {type === '修改' ? (<span style={{ fontSize: '1.867rem', display: 'flex', alignItems: 'center' }}>{selectedRow.zqzh ? selectedRow.zqzh : '-'}</span>) :
                                        getFieldDecorator(`zhid`, {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择证券账号!',
                                                },
                                            ],
                                        })(blType === '3' ? <Select
                                            showSearch
                                            // onSearch={this.search}
                                            onChange={this.handleDefault}
                                            optionFilterProp="children"
                                            defaultActiveFirstOption={false}
                                            filterOption={(input, option) =>
                                                option.props.children.indexOf(input.toLowerCase()) >= 0
                                            }
                                            placeholder="请选择">
                                            {zqzh.map((item, index) => {
                                                return <Select.Option value={item.ID || index} key={index}>{item.ZQZH || '-'}</Select.Option>
                                            })
                                            }
                                        </Select> : <Input placeholder="请输入" />)
                                    }
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="交易市场" {...labelFromater}>
                                    {getFieldDecorator(`jysc`, type === '修改' ? {
                                        initialValue: selectedRow.jyscLc ? selectedRow.jyscLc : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择交易市场!',
                                            },
                                        ]
                                    } : {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择交易市场!',
                                            },
                                        ],
                                    })(<Select
                                        placeholder="请选择">
                                        {ZYZHJYSC.map((item, index) => {
                                            return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                        })
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="一码通" {...labelFromater}>
                                    {getFieldDecorator(`ymt`, type === '修改' ? {
                                        initialValue: selectedRow.ymtLc ? selectedRow.ymtLc : '',
                                    } : {
                                    })(<Input placeholder="请输入" />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="一码通名称" {...labelFromater}>
                                    {getFieldDecorator(`ymtmc`, type === '修改' ? {
                                        initialValue: selectedRow.ymtmcLc ? selectedRow.ymtmcLc : '',
                                    } : {
                                    })(<Input placeholder="请输入" />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="开户日期" {...labelFromater}>
                                    {getFieldDecorator(`khrq`, type === '修改' ? {
                                        initialValue: selectedRow.khrqLc ? moment(selectedRow.khrqLc, 'YYYY-MM-DD') : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择开户日期!',
                                            },
                                        ]
                                    } : {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择开户日期!',
                                            },
                                        ],
                                    })(
                                        // <Input placeholder="请输入" />
                                        <DatePicker format="YYYY-MM-DD" />
                                    )}
                                </Form.Item>
                            </Col>
                            {blType !== '2' && <><Col span={12}>
                                <Form.Item label="来源系统" {...labelFromater}>
                                    {getFieldDecorator(`lyxt`, type === '修改' ? {
                                        initialValue: selectedRow.lyxtLc ? selectedRow.lyxtLc : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择来源系统!',
                                            },
                                        ],
                                    } : {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择来源系统!',
                                            },
                                        ],
                                    })(<Select
                                        placeholder="请选择"
                                        onChange={this.changeSystem}
                                    >
                                        {ZYZHLYXT.map((item, index) => {
                                            return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                        })
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col>
                                {system !== '1' && <>
                                    <Col span={12}>
                                        <Form.Item label="资金账户" {...labelFromater}>
                                            {getFieldDecorator(`zjzh`, type === '修改' ? {
                                                initialValue: selectedRow.zjzhLc ? selectedRow.zjzhLc : '',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入资金账户!',
                                                    },
                                                ],
                                            } : {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入资金账户!',
                                                    },
                                                ],
                                            })(<Input placeholder="请输入" disabled={type === '修改' ? true : false} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="资金账户名称" {...labelFromater}>
                                            {getFieldDecorator(`zjzhmc`, type === '修改' ? {
                                                initialValue: selectedRow.zjzhmcLc ? selectedRow.zjzhmcLc : '',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入资金账户名称!',
                                                    },
                                                ]
                                            } : {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入资金账户名称!',
                                                    },
                                                ],
                                            })(<Input placeholder="请输入" />)}
                                        </Form.Item>
                                    </Col>
                                </>}
                            </>}
                            <Col span={12}>
                                <Form.Item label="使用部门" {...labelFromater}>
                                    {getFieldDecorator(`sybm`, type === '修改' ? {
                                        initialValue: selectedRow.sybmLc ? selectedRow.sybmLc : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择使用部门!',
                                            },
                                        ]
                                    } : {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择使用部门!',
                                            },
                                        ],
                                    })(<Select
                                        placeholder="请选择"
                                    >
                                        {ZYZHSYBM.map((item, index) => {
                                            return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                        })
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="账户用途" {...labelFromater}>
                                    {getFieldDecorator(`zhyt`, type === '修改' ? {
                                        initialValue: selectedRow.zhytLc ? selectedRow.zhytLc : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择账户用途',
                                            },
                                        ],
                                    } : {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择账户用途!',
                                            },
                                        ],
                                    })(<Select
                                        placeholder="请选择"
                                    >
                                        {ZYZHZHYT.map((item, index) => {
                                            return <Select.Option value={item.ibm || index} key={index}>{item.note || '-'}</Select.Option>
                                        })
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="交易渠道" {...labelFromater}>
                                    {getFieldDecorator(`jyqd`, type === '修改' ? {
                                        initialValue: selectedRow.jyqdLc ? selectedRow.jyqdLc : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择交易渠道!',
                                            },
                                        ],
                                    } : {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择交易渠道!',
                                            },
                                        ],
                                    })(<Select
                                        placeholder="请选择"
                                    >
                                        {jyqd.map((item, index) => {
                                            return <Select.Option value={item.ID || index} key={index}>{item.JYQD || '-'}</Select.Option>
                                        })
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="销户日期" {...labelFromater}>
                                    {getFieldDecorator(`xhrq`, type === '修改' ? {
                                        initialValue: selectedRow.xhrqLc ? moment(selectedRow.xhrqLc, 'YYYYMMDD') : ''
                                    } : {})(
                                        // <Input placeholder="请输入" />
                                        <DatePicker format="YYYY-MM-DD" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        {system && system !== '3' ?
                            <Collapse defaultActiveKey={['1']} >
                                <Collapse.Panel header={this.getName(system)} key="1">
                                    <Row gutter={24}>
                                        {system !== '2' && <Col span={12}>
                                            <Form.Item label="基金代码" {...labelFromater}>
                                                {getFieldDecorator(`jjdm`, type === '修改' ? {
                                                    initialValue: selectedRow.jjdmLc ? selectedRow.jjdmLc : '',
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入基金代码!',
                                                        },
                                                    ],
                                                } : {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入基金代码!',
                                                        },
                                                    ],
                                                })(<Input placeholder="请输入" />)}
                                            </Form.Item>
                                        </Col>}
                                        {system !== '2' && <Col span={12}>
                                            <Form.Item label="基金名称" {...labelFromater}>
                                                {getFieldDecorator(`jjmc`, type === '修改' ? {
                                                    initialValue: selectedRow.jjmcLc ? selectedRow.jjmcLc : '',
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入基金名称!',
                                                        },
                                                    ],
                                                } : {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入基金名称!',
                                                        },
                                                    ],
                                                })(<Input placeholder="请输入" />)}
                                            </Form.Item>
                                        </Col>}
                                        {system !== '2' && <Col span={12}>
                                            <Form.Item label="资产单位编号" {...labelFromater}>
                                                {getFieldDecorator(`zcdybh`, type === '修改' ? {
                                                    initialValue: selectedRow.zcdybhLc ? selectedRow.zcdybhLc : ''
                                                } : {})(<Input placeholder="请输入" />)}
                                            </Form.Item>
                                        </Col>}
                                        {system !== '2' && <Col span={12}>
                                            <Form.Item label="资产单位名称" {...labelFromater}>
                                                {getFieldDecorator(`zcdymc`, type === '修改' ? {
                                                    initialValue: selectedRow.zcdymcLc ? selectedRow.zcdymcLc : ''
                                                } : {})(<Input placeholder="请输入" />)}
                                            </Form.Item>
                                        </Col>}
                                        {system !== '2' && <Col span={12}>
                                            <Form.Item label="组合编号" {...labelFromater}>
                                                {getFieldDecorator(`zhbh`, type === '修改' ? {
                                                    initialValue: selectedRow.zhbhLc ? selectedRow.zhbhLc : ''
                                                } : {})(<Input placeholder="请输入" />)}
                                            </Form.Item>
                                        </Col>}
                                        {system !== '2' && <Col span={12}>
                                            <Form.Item label="组合名称" {...labelFromater}>
                                                {getFieldDecorator(`zhmc`, type === '修改' ? {
                                                    initialValue: selectedRow.zhmcLc ? selectedRow.zhmcLc : ''
                                                } : {})(<Input placeholder="请输入" />)}
                                            </Form.Item>
                                        </Col>}
                                        <Col span={12}>
                                            <Form.Item label="席位" {...labelFromater}>
                                                {getFieldDecorator(`xw`, type === '修改' ? {
                                                    initialValue: selectedRow.xwLc ? selectedRow.xwLc : ''
                                                } : {})(<Input placeholder="请输入" />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Collapse.Panel>
                            </Collapse> : null
                        }
                        <div className="display-column-footer">
                            <Button className='.m-btn-radius' onClick={this.handleCancel}>关闭</Button>
                            <Button className='.m-btn-radius' type="primary" htmlType="submit">确定</Button>
                        </div>
                    </Form>
                </div>
            </BasicModal >

        );
    }
}

export default Form.create()(ModifyModel);