import React, { Fragment } from 'react';
import { Row, Col, message, Form, Select, DatePicker, Input, Button, TreeSelect } from 'antd';
import TreeUtils from '../../../../../../utils/treeUtils';
import { FetchObjectQuery } from '../../../../../../services/sysCommon';
import { FetchuserAuthorityDepartment, FetchquerySuperviseStaffDetail } from '../../../../../../services/motProduction';
import SupervisorListTable from './SupervisorListTable';
import moment from 'moment';
// 日期份选择控件
import 'moment/locale/zh-cn';
// 组件国际化
moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const { Option } = Select;
/**
 * 考评人员结构配置
 */

class SupervisorListDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: ['month', 'month'],
            ddyfValue: [],
            gxyybTree: [],  // 营业部树形数据
            tMotEvnt: [],  // 督导事件List
            tMotRylb: [], // 人员类别List
            ztyyb: '',  // 主体营业部
            yyb: '',  // 营业部
            rylb: '', // 人员类别
            ddsj: [],  // 督导事件
            ddxx: '',  // 督导次数下限
            ddsx: '', // 督导次数上限
            productData: {  // 督导名单列表数据
                records: [],
                total: 0,
                coldtl: '',
                qrySqlId: '',
            },
            pageState: {  // 分页查询条件
                paging: 1,
                current: 1,
                pageSize: 10,
                sort: '',
                total: -1,
            },
            loading: false,
        };
    }
    componentDidMount() {
        this.fetch();
        this.fetchGxyybList();
    }
    fetch = async () => {
        let tMotEvnt = [];
        //const condition = "TGT_TP = 3";
        // const condition = {
        //   tgt_tp: 3,
        // };
        const condition = {
            cols: "DIC_CL,DIC_CODE,DIC_NM,DIC_NOTE,ID,TGT_TP",
            current: 1,
            cxtj: "DIC_CL==TMOT_EVNT&&TGT_TP==3", //原先direct接口传入的条件参数    
            pageSize: 10,
            paging: 1,
            serviceid: "motDic",
            sort: "",
            total: -1
          }
        const { data: ddsj } = await FetchObjectQuery(condition );
        debugger
        console.log(`ddsj`, ddsj)
        if (Array.isArray(ddsj) && ddsj.length > 0) {
            tMotEvnt = ddsj;
            this.setState({ tMotEvnt });
        }

        const condition2 = {
            cols: "DIC_CL,DIC_CODE,DIC_NM,DIC_NOTE,ID,TGT_TP",
            current: 1,
            cxtj: "DIC_CL==TRYFLBM&&TGT_TP==3", //原先direct接口传入的条件参数    
            pageSize: 10,
            paging: 1,
            serviceid: "motDic",
            sort: "",
            total: -1
          }
        let tMotRylb = [];
        const { data: rylb } = await FetchObjectQuery(condition2);
        if (Array.isArray(rylb) && rylb.length > 0) {
            tMotRylb = rylb;
            this.setState({ tMotRylb });
        }
    }
    // 获取管辖营业部的数据
    fetchGxyybList = () => {
        FetchuserAuthorityDepartment({ paging: 0, current: 1, pageSize: 10, total: -1, sort: '' }).then((result) => {
            const { code = 0, records = [] } = result;
            if (code > 0) {
                let gxyybCurrent = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' });
                // this.setTree(gxyybCurrent);
                gxyybCurrent = gxyybCurrent[0].children[0];
                this.setState({
                    gxyybTree: gxyybCurrent,
                    ztyyb: undefined,
                });
                this.fetchData('');
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }
    // 设置树形数据父节点不可选
    setTree = (TreeFormat) => {
        const Tree = TreeFormat;
        Tree.forEach((item, index) => {
            if (item.children !== undefined) {
                Tree[index] = { disabled: true, ...item };
                this.setTree(item.children);
            } else {
                return false;
            }
        });
    }
    handlePanelChange = (value, mode) => {
        this.setState({
            ddyfValue: value,
            mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
        });
    };

    handleChange = (value) => {
        this.setState({ ddyfValue: value });
    };
    onChangeZTYYB = (value) => {
        this.setState({
            ztyyb: value,
        });
    };
    onChangeYYB = (value) => {
        this.setState({
            yyb: value,
        });
    };
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };
    setPageState = (value) => {
        const { pageState } = this.state;
        const page = { ...pageState, ...value };
        this.setState({
            pageState: page,
        });
        this.fetchData(page);
    }
    clickQuery = () => {
        const { pageState } = this.state;
        const page = {
            ...pageState,
            current: 1,
        };
        this.setState({
            pageState: page,
        });
        this.fetchData(page);
    }
    clickReset = () => {
        this.setState({
            ddyfValue: [],
            ztyyb: '',
            yyb: '',
            rylb: '',
            ddsj: [],
            ddxx: '',
            ddsx: '',
        });
    }
    fetchData = (page) => {
        this.setState({ loading: true });
        const { ddyfValue, ztyyb, yyb, rylb, ddsj, ddxx, ddsx, productData } = this.state;
        let pageState = [];
        if (page !== '') {
            pageState = page;
        } else {
            pageState = this.state.pageState;
        }
        const prams = {
            ...pageState,
            strtSpvsMo: ddyfValue.length > 0 ? Number(moment(ddyfValue[0]).format('YYYYMM')) : '',
            endSpvsMo: ddyfValue.length > 0 ? Number(moment(ddyfValue[1]).format('YYYYMM')) : '',
            mainOrgId: Number(ztyyb),
            orgId: yyb === '' ? null : Number(yyb),
            stfCl: rylb === '' ? null : Number(rylb),
            spvsEvntLst: ddsj.length > 0 ? ddsj.join(';') : null,
            spvsNumLowLmt: ddxx === '' ? null : Number(ddxx),
            spvsNumUpLmt: ddsx === '' ? null : Number(ddsx),
        };
        FetchquerySuperviseStaffDetail(prams).then((result) => {
            const { records = [], coldtl = '', code, note, total } = result;
            if (code > 0) {
                this.setState({
                    productData: {
                        ...productData,
                        records,
                        total,
                        coldtl,
                        qrySqlId: note,
                    },
                    loading: false,
                });
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }
    render() {
        const { mode, ddyfValue, gxyybTree, tMotEvnt, productData, ztyyb, yyb, rylb, ddsj, ddxx, ddsx, loading, tMotRylb, pageState: { current } } = this.state;
        return (
            <Fragment>
                <Row style={{ height: '52px', borderBottom: '1px solid #EDEDED' }}>
                    <div style={{ padding: '16px 20px', fontWeight: 'bold', color: '#333333' }}>名单明细</div>
                </Row>
                <Form className="supervisor-form">
                    <Row style={{ padding: '20px 5px 0px' }}>
                        <Col xs={24} sm={7} md={7} lg={7} style={{ minWidth: '355px' }}>
                            <Form.Item label={(<span>督导月份</span>)}>
                                <RangePicker
                                    style={{ width: '260px' }}
                                    value={ddyfValue}
                                    mode={mode}
                                    format="YYYY-MM"
                                    placeholder={['起始月份', '截止月份']}
                                    onChange={this.handleChange}
                                    onPanelChange={this.handlePanelChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={7} md={7} lg={7} style={{ minWidth: '355px' }}>
                            <Form.Item label={(<span>主体营业部</span>)}>
                                <TreeSelect
                                    placeholder="请选择"
                                    searchPlaceholder="请输入关键字"
                                    style={{ width: '260px' }}
                                    dropdownStyle={{ maxHeight: '50vh', overflow: 'auto' }}
                                    treeData={gxyybTree}
                                    showSearch
                                    // filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    filterTreeNode={(input, option) => { return option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.indexOf(input) >= 0 }}
                                    onChange={(value, label) => this.onChangeZTYYB(value, label)}
                                    value={ztyyb}
                                    treeDefaultExpandedKeys={[gxyybTree.value]}
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={7} md={7} lg={7} style={{ minWidth: '355px' }}>
                            <Form.Item label={(<span>营业部</span>)}>
                                <TreeSelect
                                    placeholder="请选择"
                                    searchPlaceholder="请输入关键字"
                                    style={{ width: '260px' }}
                                    dropdownStyle={{ maxHeight: '50vh', overflow: 'auto' }}
                                    treeData={gxyybTree}
                                    showSearch
                                    // filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    filterTreeNode={(input, option) => { return option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.indexOf(input) >= 0 }}
                                    onChange={(value, label) => this.onChangeYYB(value, label)}
                                    value={yyb}
                                    treeDefaultExpandedKeys={[gxyybTree.value]}
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ padding: '0px 5px' }}>
                        <Col xs={24} sm={7} md={7} lg={7} style={{ minWidth: '355px' }}>
                            <Form.Item label={(<span>人员类别</span>)}>
                                <Select
                                    style={{ width: '260px' }}
                                    onChange={(value) => { this.onChange('rylb', value); }}
                                    placeholder="请选择"
                                    value={rylb}
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {tMotRylb.map(item => <Option value={item.ID}>{item.FLMC}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={7} md={7} lg={7} style={{ minWidth: '355px' }}>
                            <Form.Item label={(<span>督导事件</span>)}>
                                <Select
                                    style={{ width: '260px' }}
                                    onChange={(value) => { this.onChange('ddsj', value); }}
                                    placeholder="请选择"
                                    value={ddsj}
                                    mode="multiple"
                                    allowClear
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {tMotEvnt.map(item => <Option value={item.EVNT_ID}>{item.EVNT_NM}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={7} md={7} lg={7} style={{ minWidth: '355px' }}>
                            <Form.Item label={(<span>督导次数</span>)}>
                                <Input.Group>
                                    <Input style={{ width: '100px' }} value={ddxx} placeholder="下限" onChange={(e) => { this.onChange('ddxx', e.target.value); }} />
                                    <Input
                                        style={{
                                            width: 30,
                                            borderLeft: 0,
                                            borderRight: 0,
                                            pointerEvents: 'none',
                                            backgroundColor: '#fff',
                                        }}
                                        placeholder="~"
                                        disabled
                                    />
                                    <Input style={{ width: '130px', borderLeft: 0 }} className="supervisor-input-compact" value={ddsx} placeholder="上限" suffix="次" onChange={(e) => { this.onChange('ddsx', e.target.value); }} />
                                </Input.Group>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={3} md={3} lg={3}>
                            <span style={{ display: 'inline-flex', float: 'left', marginTop: '0.4rem' }}>
                                <Button className="factor-bottom m-btn-border-headColor" style={{ marginRight: '1.5rem' }} onClick={this.clickQuery} >查询</Button>
                                <Button onClick={this.clickReset} >重置</Button>
                            </span>
                        </Col>
                    </Row>
                    <SupervisorListTable productData={productData} current={current} setPageState={this.setPageState} loading={loading} />
                </Form>
            </Fragment>
        );
    }
}
export default Form.create()(SupervisorListDetails);
