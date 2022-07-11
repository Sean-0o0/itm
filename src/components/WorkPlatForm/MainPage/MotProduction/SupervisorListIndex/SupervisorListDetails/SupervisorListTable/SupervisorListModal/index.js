/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { Row, Col, message, Form, Select, Input, Checkbox, Card, Radio } from 'antd';
import { FetchquerySuperviseMessageTemplate, FetchSuperviseTaskMaintenance } from '../../../../../../../../services/motProduction';
import { FetchObjectQuery } from '../../../../../../../../services/sysCommon';
import moment from 'moment';
// 日期份选择控件
import 'moment/locale/zh-cn';
// 组件国际化
moment.locale('zh-cn');
const { Option } = Select;
/**
 * 考评人员结构配置
 */

class SupervisorListModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tMotEvnt: [], // 督导事件
            tSpvsObj: [], // 消息通知对象
            tMsgCfg: [], // 消息通知渠道
            mbscnr: [], // 模板生成内容
            xxtzdx: [],
            msgDetail: [], // 消息通知明细
            tMotRole: [], //督导角色
        };
        // 正在发送请求的状态，避免重复点击确认时，发起多次请求
        this.requesting = false;
    }
    componentDidMount() {
        this.fetch();
        this.fetchRole()
    }
    fetch = async () => {
        let tMotEvnt = [];
        let tSpvsObj = [];
        let tMsgCfg = [];
        //const condition = "TGT_TP = 3";
        // const condition = {
        //     tgt_tp: 3,
        // };
        // const { records: ddsj } = await fetchObject('TMOT_EVNT', { condition });
        // if (Array.isArray(ddsj) && ddsj.length > 0) {
        //     tMotEvnt = ddsj;
        //     this.setState({ tMotEvnt });
        // }
        // const { records: xxtzdx } = await fetchObject('TSPVS_MSG_NTFY_OBJ');
        // if (Array.isArray(xxtzdx) && xxtzdx.length > 0) {
        //     tSpvsObj = xxtzdx;
        //     const tt = [];
        //     const mbscnr = [];
        //     tt.push(xxtzdx[0].OBJ_ID);
        //     mbscnr.push(xxtzdx[0]);
        //     this.setState({ tSpvsObj, xxtzdx: tt, mbscnr });
        //     this.fetchTemplate(xxtzdx[0].OBJ_ID);
        // }
        // const { records: xxtzqd } = await fetchObject('TMSG_CHNL_CFG');
        // if (Array.isArray(xxtzqd) && xxtzqd.length > 0) {
        //     tMsgCfg = xxtzqd;
        //     this.setState({ tMsgCfg });
        // }

        const condition = {
            tgt_tp: 3,
        };
        const { records: ddsj } = await FetchObjectQuery('TMOT_EVNT', { condition });
        if (Array.isArray(ddsj) && ddsj.length > 0) {
            tMotEvnt = ddsj;
            this.setState({ tMotEvnt });
        }
        const { records: xxtzdx } = await FetchObjectQuery('TSPVS_MSG_NTFY_OBJ');
        if (Array.isArray(xxtzdx) && xxtzdx.length > 0) {
            tSpvsObj = xxtzdx;
            const tt = [];
            const mbscnr = [];
            tt.push(xxtzdx[0].OBJ_ID);
            mbscnr.push(xxtzdx[0]);
            this.setState({ tSpvsObj, xxtzdx: tt, mbscnr });
            this.fetchTemplate(xxtzdx[0].OBJ_ID);
        }
        const { records: xxtzqd } = await FetchObjectQuery('TMSG_CHNL_CFG');
        if (Array.isArray(xxtzqd) && xxtzqd.length > 0) {
            tMsgCfg = xxtzqd;
            this.setState({ tMsgCfg });
        }
    }
    onChange = (value) => {
        const { tSpvsObj, msgDetail } = this.state;
        const mbscnr = [];
        let xxtzdx = ''
        if (value.length > 0) {
            const index = value.length - 1;
            xxtzdx = value[index];
            value.forEach(item => {
                const Item = tSpvsObj.filter(bgjItem => {
                    if (bgjItem.OBJ_ID === item) {
                        return true;
                    }
                });
                mbscnr.push(Item[0]);
            })
            const data = msgDetail.filter(item => item.MSG_NTFY_OBJ === xxtzdx);
            if (data.length === 0) {
                this.fetchTemplate(xxtzdx);
            }
        }
        this.setState({ mbscnr, xxtzdx });
    };
    fetchTemplate = (value) => {
        const { msgDetail } = this.state;
        FetchquerySuperviseMessageTemplate({ msgNtfyObj: Number(value) }).then((res) => {
            const { records = [], code } = res;
            if (code > 0) {
                const item = {
                    MSG_NTFY_OBJ: value,
                    MSG_NTFY_SBJ: records.length > 0 ? records[0].msgNtfySbj : '',
                    MSG_NTFY_CNTNT: records.length > 0 ? records[0].msgNtfyCntnt : '',
                    EXT_MSG_CNTNT: '',
                }
                msgDetail.push(item);
                this.setState({ msgDetail });
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }
    handleScnrChange = (e) => {
        this.setState({ xxtzdx: e.target.value });
    };
    fethHtml = () => {
        const { xxtzdx, msgDetail } = this.state;
        let bt = '';
        let content = '';
        let gxnr = '';
        const data = msgDetail.filter(item => item.MSG_NTFY_OBJ === xxtzdx[0]);
        if (data.length > 0) {
            bt = data[0].MSG_NTFY_SBJ;
            content = data[0].MSG_NTFY_CNTNT;
            gxnr = data[0].EXT_MSG_CNTNT;
        }
        const html = (
            <Row style={{ color: '#333333' }}>
                <Row style={{ margin: '18px 0' }}>
                    <Col xs={24} sm={24} md={24} lg={24} style={{ marginBottom: '10px' }}>
                        {bt}
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        {content}
                    </Col>
                </Row>
                <Col xs={24} sm={24} md={24} lg={24} style={{ marginBottom: '10px' }}>
                    <span>个性编辑内容：</span>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Input.TextArea autosize={{ minRows: 4, maxRows: 5 }} value={gxnr} placeholder="请输入" onChange={this.onChangeNR} />
                </Col>
            </Row>
        );
        return html;
    }
    onChangeNR = (e) => {
        const { xxtzdx, msgDetail } = this.state;
        msgDetail.forEach(item => {
            if (item.MSG_NTFY_OBJ === xxtzdx[0]) {
                item.EXT_MSG_CNTNT = e.target.value;
            }
        })
        this.setState({ msgDetail });
    }
    getItemsValue = () => {
        this.props.form.validateFields((err, values) => {
            if (!err && !this.requesting) {
                this.createFun(values);
            }
        });
    }
    createFun = (modalValus) => {
        this.requesting = true;
        const { qrySqlId, selectedRowKeys, selectAll, setVisible } = this.props;
        const { msgDetail } = this.state;
        const spvsDtl = {
            'QRY_SQL_ID': qrySqlId,
            'CHC_ID': selectedRowKeys.length > 0 ? selectedRowKeys.join(',') : '',
            'WTHR_ALL': selectAll ? 1 : 0,
        };
        const prams = {
            oprTp: 1,
            taskId: '',
            taskNm: modalValus.RWMC !== undefined ? modalValus.RWMC : '',
            spvsMo: moment(new Date()).format('YYYYMM'),
            spvsDtl: JSON.stringify(spvsDtl),
            spvsRole: modalValus.DDJS || "", //督导角色
            // spvsEvntLst: modalValus.DDSJ !== undefined && modalValus.DDSJ.length > 0 ? modalValus.DDSJ.join(';') : '',
            msgNtfyObj: modalValus.XXTZDX !== undefined && modalValus.XXTZDX.length > 0 ? modalValus.XXTZDX.join(';') : '',
            msgNtfyChnl: modalValus.XXTZQD !== undefined && modalValus.XXTZQD.length > 0 ? modalValus.XXTZQD.join(';') : '',
            msgNtfyDtl: msgDetail.length > 0 ? JSON.stringify(msgDetail) : '',
        };
        FetchSuperviseTaskMaintenance(prams).then((result) => {
            const { code, note } = result;
            if (code > 0) {
                message.success(note);
                setVisible(false);
            } else {
              this.requesting = false;
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
            this.requesting = false;
        });
    }

    // 获取督导角色
    fetchRole = () => {
        const queryOption = { orderBy: '', batchNo: 1, batchSize: 99999, queryCount: false, valueOption: 0 };

        fetchObject("lbRole", { queryOption }).then((res = {}) => {
            const { code = 0, records = [], total = 0 } = res;
            if (code > 0 && total !== 0) {
                this.setState({
                    tMotRole: records
                })
            }

        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { tMotEvnt, tSpvsObj, tMsgCfg, mbscnr, xxtzdx, tMotRole = [] } = this.state;
        const optionsSFQD = [];
        tMsgCfg.forEach((item) => {
            optionsSFQD.push({ label: item.CHNL_NM, value: item.CHNL_CODE });
        });
        return (
            <Fragment>
                <Form className="factor-variable-form">
                    <Row style={{ padding: 20 }}>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item label={(<span>督导月份</span>)}>
                                <Input placeholder="请输入" value={moment(new Date()).format('YYYY-MM')} disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item label={(<span>任务名称</span>)}>
                                {getFieldDecorator('RWMC', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请输入任务名称!' }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        {/* <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item label={(<span>督导事件</span>)}>
                                {getFieldDecorator('DDSJ', { rules: [{ required: true, validator: (_, value) => (value && value.length > 0 ? Promise.resolve() : Promise.reject('请选择督导事件')) }] })(<Select
                                    // onChange={(value) => { this.onChange('ddsj', value); }}
                                    placeholder="请选择"
                                    mode="multiple"
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {tMotEvnt.map(item => <Option value={item.EVNT_ID}>{item.EVNT_NM}</Option>)}
                                </Select>)}
                            </Form.Item>
                        </Col> */}
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item label={(<span>督导角色</span>)}>
                                {getFieldDecorator('DDJS', { rules: [{ required: true, validator: (_, value) => (value && value.length > 0 ? Promise.resolve() : Promise.reject('请选择督导角色')) }] })(
                                    <Select
                                        // onChange={(value) => { this.onChange('ddsj', value); }}
                                        placeholder="请选择"
                                        // mode="multiple"
                                        allowClear
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) => {
                                            return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        }
                                    >
                                        {tMotRole.map(item => <Option value={item.ID}>{item.Name}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item label={(<span>消息通知对象</span>)}>
                                {getFieldDecorator('XXTZDX', { initialValue: xxtzdx, rules: [{ required: true, validator: (_, value) => (value && value.length > 0 ? Promise.resolve() : Promise.reject('请选择消息通知对象')) }] })(<Select
                                    onChange={(value) => { this.onChange(value); }}
                                    placeholder="请选择"
                                    mode="multiple"
                                >
                                    {tSpvsObj.map(item => <Option value={item.OBJ_ID}>{item.OBJ_NM}</Option>)}
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item label={(<span>消息通知渠道</span>)} >
                                {getFieldDecorator('XXTZQD', { rules: [{ required: true, validator: (_, value) => (value && value.length > 0 ? Promise.resolve() : Promise.reject('请选择消息通知渠道')) }] })(<Checkbox.Group
                                    options={optionsSFQD}
                                    style={{ paddingTop: '8px' }}
                                />)}
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Form.Item label={(<span>消息通知内容</span>)}>
                                <Card className="supervisor-list-modal-card">
                                    <Row>
                                        <Col xs={24} sm={24} md={24} lg={24} style={{ color: '#333333' }}>
                                            <span>模板生成内容：</span>
                                            <Radio.Group value={xxtzdx.toString()} onChange={this.handleScnrChange} className="supervisor-list-radio-group">
                                                {mbscnr.map(item => <Radio.Button value={item.OBJ_ID}>{item.OBJ_NM}</Radio.Button>)}
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                    {this.fethHtml()}

                                </Card>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        );
    }
}
export default Form.create()(SupervisorListModal);
