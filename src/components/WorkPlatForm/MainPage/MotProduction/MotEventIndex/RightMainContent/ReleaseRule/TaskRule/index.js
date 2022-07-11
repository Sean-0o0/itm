/* eslint-disable react/jsx-indent */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { Row, Col, message, Form, Select, Radio, Input, Divider } from 'antd';
import { FetchqueryData } from '../../../../../../../../services/motProduction/index';
import { getDictKey } from '../../../../../../../../utils/dictUtils';
// 引入请求路径的示例

const { Option } = Select;
// 右边内容模块-发布规则-消息推送
class TaskRule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yxgx: [], // 已选关系
      dxgx: [], // 待选关系
      leftKeys: [], // 待选关系选择
      rightKeys: [], // 已选关系选择
      gxlxDicts: [],
      SJYQ: '',
      roleData: [], //角色数据
      teamData: [], //团队数据
      employeeClassData: [], //人员分类数据
    };
  }


  componentWillMount() {
    // 数据处理
    this.fetchData(this.props.data);
    this.queryData('roleData', 'SELECT ID, ROLECODE CODE, NAME FROM LIVEBOS.LBROLE');
    this.queryData('teamData', 'SELECT ID, ID CODE, TDMC NAME FROM CIS.TTDBM');
    this.queryData('employeeClassData', 'SELECT ID, FLBM CODE, FLMC NAME FROM CIS.TRYFLBM');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      // 数据处理
      this.fetchData(nextProps.data);
    }
  }

  queryData = (dataName, tableSql) => {
    FetchqueryData({
      current: 1,
      keyword: '',
      owner: 'CRMII',
      paging: 0,
      pageSize: '',
      tablesql: tableSql,
      sort: '',
      total: -1
    }).then(ret => {
      const { records = [] } = ret;
      if (records && records.length > 0) {
        const obj = {};
        obj[dataName] = records;
        this.setState(obj);
      }
    });
  }

  fetchData = (data) => {
    const { [getDictKey('gxlx')]: gxlxDicts = [] } = this.props.dictionary;
    const yxgx = [];
    const dxgx = [];
    if (data.jsonTaskAlotRule) {
      const { ALOT_TP: alotTp, ALOT_RULE: alotRule } = JSON.parse(data.jsonTaskAlotRule);
      if (alotTp.SEC_ALOT_TP !== '0') {
        data.fpgz = [alotTp.ALOT_RULE_TP, alotTp.SEC_ALOT_TP];
      } else {
        data.fpgz = [alotTp.ALOT_RULE_TP];
      }
      data.jspjfp = [];
      data.tdpjfp = [];
      data.rylbpjfp = [];
      alotRule.forEach((item) => {
        const ruleTp = item.ALOT_TP === '1' ? data.fpgz[0] : data.fpgz[1];
        if (ruleTp === '1') {
          gxlxDicts.forEach((childItem) => {
            if (item.RLT_TP === childItem.ibm) {
              item.note = childItem.note;
              item.ibm = childItem.ibm;
              yxgx.push(item);
            }
          });
        } else if (ruleTp === '2') {
          data.jspjfp.push(item.ROLE_ID);
        } else if (ruleTp === '3') {
          data.tdpjfp.push(item.TEAM_ID);
        } else if (ruleTp === '4') {
          data.rylbpjfp.push(item.EMPE_CL);
        }
      });
      //差集
      gxlxDicts.forEach((item) => {
        let count = 0;
        yxgx.forEach((yxgxItem) => {
          if (item.ibm !== yxgxItem.ibm) {
            count++;
          }
          if (count === yxgx.length) {
            dxgx.push(item);
          }
        });
      });
    }
    if (yxgx.length === 0) {
      gxlxDicts.forEach((item) => {
        dxgx.push(item);
      });
    }
    let SJYQ = '1';
    if (data.execTmRqmt !== '') {
      SJYQ = data.execTmRqmt;
    }
    this.setState({ yxgx, dxgx, gxlxDicts, SJYQ });
    this.props.setJsonTaskData(yxgx);
  }
  upTop = (value) => {
    const { yxgx } = this.state;
    const item = yxgx[value];
    const oldPRI = item.PRI;
    delete item.PRI;
    item.PRI = '1';
    yxgx.splice(value, 1);
    yxgx.splice(0, 0, item);
    const change = yxgx.filter(Item => Item.PRI === oldPRI);
    if (change.length === 0) {
      yxgx.forEach((Item) => {
        if (Number(Item.PRI) > Number(oldPRI)) {
          Item.PRI = (Number(Item.PRI) - 1).toString();
        }
      });
    }
    this.setState({ yxgx });
    this.props.setJsonTaskData(yxgx);
  }
  up = (value) => {
    const { yxgx } = this.state;
    const item = yxgx[value];
    const oldPRI = item.PRI;
    const newPRI = (Number(item.PRI) - 1).toString();
    let i = 0;
    for (i; i < yxgx.length; i++) {
      if (yxgx[i].PRI === oldPRI) {
        break;
      }
    }
    delete item.PRI;
    item.PRI = newPRI;
    yxgx.splice(value, 1);
    yxgx.splice(i, 0, item);
    const change = yxgx.filter(Item => Item.PRI === oldPRI);
    if (change.length === 0) {
      yxgx.forEach((Item) => {
        if (Number(Item.PRI) > Number(oldPRI)) {
          Item.PRI = (Number(Item.PRI) - 1).toString();
        }
      });
    }
    this.setState({ yxgx });
    this.props.setJsonTaskData(yxgx);
  }
  down = (value) => {
    const { yxgx } = this.state;
    const item = yxgx[value];
    const oldPRI = item.PRI;
    const newPRI = (Number(item.PRI) + 1).toString();
    let i = 0;
    for (i; i < yxgx.length; i++) {
      if (yxgx[i].PRI === newPRI) {
        break;
      }
    }
    delete item.PRI;
    item.PRI = newPRI;
    yxgx.splice(value, 1);
    if (i === 0) {
      yxgx.push(item);
    } else {
      yxgx.splice(i, 0, item);
    }
    const change = yxgx.filter(Item => Item.PRI === oldPRI);
    if (change.length === 0) {
      yxgx.forEach((Item) => {
        if (Number(Item.PRI) > Number(oldPRI)) {
          Item.PRI = (Number(Item.PRI) - 1).toString();
        }
      });
    }
    this.setState({ yxgx });
    this.props.setJsonTaskData(yxgx);
  }
  leftChange = (value) => {
    const { leftKeys } = this.state;
    const change = leftKeys.filter(Item => Item === value);
    if (change.length > 0) {
      let i = 0;
      leftKeys.forEach((item, index) => {
        if (item === value) {
          i = index;
        }
      });
      leftKeys.splice(i, 1);
    } else {
      leftKeys.push(value);
    }
    this.setState({ leftKeys });
  }
  rightChange = (value) => {
    const { rightKeys } = this.state;
    const change = rightKeys.filter(Item => Item === value);
    if (change.length > 0) {
      let i = 0;
      rightKeys.forEach((item, index) => {
        if (item === value) {
          i = index;
        }
      });
      rightKeys.splice(i, 1);
    } else {
      rightKeys.push(value);
    }
    this.setState({ rightKeys });
  }
  leftShuttle = () => {
    const { leftKeys, yxgx, dxgx } = this.state;
    if (leftKeys.length === 0) {
      message.error('请选择左边节点');
    } else {
      leftKeys.forEach((item) => {
        dxgx.forEach((childItem, index) => {
          if (item === childItem.ibm) {
            let PRI = '';
            if (yxgx.length === 0) {
              PRI = '1';
            } else {
              PRI = (Number(yxgx[yxgx.length - 1].PRI) + 1).toString();
            }
            const data = {
              RLT_TP: childItem.ibm,
              PRI,
              note: childItem.note,
              ibm: childItem.ibm,
            };
            yxgx.push(data);
            dxgx.splice(index, 1);
          }
        });
      });
      this.setState({ leftKeys: [], yxgx, dxgx });
      this.props.setJsonTaskData(yxgx);
    }
  }
  rightShuttle = () => {
    const { rightKeys, yxgx, dxgx, gxlxDicts } = this.state;
    if (rightKeys.length === 0) {
      message.error('请选择右边节点');
    } else {
      rightKeys.forEach((item) => {
        yxgx.forEach((childItem, index) => {
          if (item === childItem.ibm) {
            const data = gxlxDicts.filter(Item => Item.ibm === childItem.ibm);
            dxgx.push(data[0]);
            yxgx.splice(index, 1);
          }
        });
      });
      this.setState({ rightKeys: [], yxgx, dxgx });
      this.props.setJsonTaskData(yxgx);
    }
  }
  onChange = (value) => {
    this.setState({ SJYQ: value });
  }
  getItemsValue = () => {
    const valus = this.props.form.getFieldsValue();
    return valus;
  }
  getFieldLabel = (data, values) => {
    const label = [];
    for (let i = 0; i < data.length; i++) {
      if (values.indexOf(data[i].id) > -1) {
        label.push(data[i].name);
      }
    }
    return label.join(', ');
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { type, data, mblx, dictionary = {} } = this.props;
    const { yxgx, dxgx, leftKeys, rightKeys, SJYQ, roleData, teamData, employeeClassData } = this.state;
    const { [getDictKey('rwfpgz')]: fpgzDicts = [], [getDictKey('sjyq')]: sjyqDicts = [], [getDictKey('rwyq')]: rwyqDicts = [], [getDictKey('fwlb')]: fwlbDicts = [], [getDictKey('sfzdy')]: sfzdyDicts = [] } = dictionary; // MOT字典
    const fpgzFieldValue = getFieldValue('FPGZ') || data.fpgz || [];
    const fpgzFieldLabel = [];
    if (fpgzFieldValue !== undefined) {
      fpgzDicts.map((item, index) => {
        fpgzDicts[index].disabled = false;
        if (fpgzFieldValue[0] === item.ibm) {
          fpgzDicts[index].suffix = '(默认分配)';
          fpgzFieldLabel[0] = fpgzDicts[index].note + fpgzDicts[index].suffix;
        } else if (fpgzFieldValue[1] === item.ibm) {
          fpgzDicts[index].suffix = '(兜底分配)';
          fpgzFieldLabel[1] = fpgzDicts[index].note + fpgzDicts[index].suffix;
        } else {
          fpgzDicts[index].suffix = '';
          fpgzDicts[index].disabled = fpgzFieldValue.length === 2;
        }
      });
    }
    const jspjfpFieldValue = getFieldValue('JSPJFP') || data.jspjfp;
    const tdpjfpFieldValue = getFieldValue('TDPJFP') || data.tdpjfp;
    const rylbpjfpFieldValue = getFieldValue('RYLBPJFP') || data.rylbpjfp;
    let sjyq = '';
    let rwyq = '';
    let fwlb = '';
    let rwsfsh = '';
    if (data.execTmRqmt !== undefined) {
      sjyqDicts.forEach((item) => {
        if (item.ibm === data.execTmRqmt) {
          sjyq = item.note;
        }
      });
    }
    if (data.taskRqmt !== undefined) {
      rwyqDicts.forEach((item) => {
        if (item.ibm === data.taskRqmt) {
          rwyq = item.note;
        }
      });
    }
    if (data.srvcTp !== undefined) {
      fwlbDicts.forEach((item) => {
        if (item.ibm === data.srvcTp) {
          fwlb = item.note;
        }
      });
    }
    if (data.wthrRvwTask !== undefined) {
      sfzdyDicts.forEach((item) => {
        if (item.ibm === data.wthrRvwTask) {
          rwsfsh = item.note;
        }
      });
    }
    return (
      <Fragment>
        <Row>
          <Form className="event-releaseRule-form" onSubmit={this.handleSubmit}>
            <Row style={{ width: '100%' }}>
              <Col xs={24} sm={6} md={6} lg={6}>
                <div className={type ? 'factor-item' : ''}>
                  {type ? <span>时间要求：{sjyq}</span>
                    : (
                      <Form.Item label={(<span>时间要求</span>)}>
                        {getFieldDecorator('SJYQ', { initialValue: SJYQ !== '' && SJYQ !== undefined ? SJYQ : '1', rules: [{ required: true, message: '任务分配规则的时间要求不允许为空!' }] })(<Select
                          style={{ width: '120px' }}
                          onChange={this.onChange}
                        >
                          {sjyqDicts.map(item => <Option value={item.ibm}>{item.note}</Option>)}
                        </Select>)}
                      </Form.Item>
                    )}
                </div>
              </Col>
              {SJYQ === '99' ? (
                <Col xs={24} sm={3} md={3} lg={3}>
                  <div className={type ? 'factor-item' : ''}>
                    {type ? <span>天数：{data.execTmRqmtDays}</span>
                      : (
                        <Form.Item label={(<span>天数</span>)}>
                          {getFieldDecorator('TS', { initialValue: data.execTmRqmtDays !== undefined ? data.execTmRqmtDays : '', rules: [{ required: true, message: '任务分配规则的天数不允许为空!' }] })(<Input style={{ width: '50px', color: '#333333', border: type ? 0 : '' }} />)}
                        </Form.Item>
                      )}
                  </div>
                </Col>
              ) : ''}
              <Col xs={24} sm={6} md={6} lg={6}>
                <div className={type ? 'factor-item' : ''}>
                  {type ? <span>服务类别：{fwlb}</span>
                    : (
                      <Form.Item label={(<span>服务类别</span>)}>
                        {getFieldDecorator('FWLB', { initialValue: data.srvcTp !== '' && data.srvcTp !== undefined ? data.srvcTp : '1', rules: [{ required: true, message: '任务分配规则的服务类别不允许为空!' }] })(<Select
                          style={{ width: '120px' }}
                        >
                          {fwlbDicts.map(item => <Option value={item.ibm}>{item.note}</Option>)}
                        </Select>)}
                      </Form.Item>
                    )}
                </div>
              </Col>
              <Col xs={24} sm={7} md={7} lg={7}>
                <div className={type ? 'factor-item' : ''} style={{ display: 'flex' }}>
                  {type ? <span>任务是否审核：{rwsfsh}</span>
                    : (
                      <Form.Item label={(<span>任务是否审核</span>)}>
                        {getFieldDecorator('RWSFSH', { initialValue: data.wthrRvwTask !== undefined ? data.wthrRvwTask : '0', rules: [{ required: true, message: '任务分配规则的是否审核不允许为空!' }] })(<Radio.Group >{sfzdyDicts.map(item => <Radio className="mot-radio" value={item.ibm}>{item.note}</Radio>)}</Radio.Group>)}
                      </Form.Item>
                    )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={12} md={12} lg={12} style={{ minWidth: '370px' }}>
                <div className={type ? 'factor-item' : ''}>
                  {type ? <span>任务要求：{rwyq}</span>
                    : (
                      <Form.Item label={(<span>任务要求</span>)}>
                        {getFieldDecorator('RWYQ', { initialValue: data.taskRqmt !== '' && data.taskRqmt !== undefined ? data.taskRqmt : '0', rules: [{ required: true, message: '任务分配规则的任务要求不允许为空!' }] })(<Radio.Group >{rwyqDicts.map(item => <Radio className="mot-radio" value={item.ibm}>{item.note}</Radio>)}</Radio.Group>)}
                      </Form.Item>
                    )}
                </div>
              </Col>
              {mblx === '2' ? '' : (
                <Col xs={24} sm={6} md={6} lg={6} style={{ minWidth: '580px' }}>
                  <div className={type ? 'factor-item' : ''}>
                    {
                      type ? <span>分配规则：{fpgzFieldLabel.join(', ')}</span> : (
                        <Form.Item label={(<span>分配规则</span>)}>
                          {getFieldDecorator('FPGZ', { initialValue: data.fpgz, rules: [{ required: true, message: '任务分配规则的分配规则不允许为空!' }] })(
                            <Select mode="multiple" optionLabelProp="label">{fpgzDicts.map(dict => <Option value={dict.ibm} label={`${dict.note}${dict.suffix}`} disabled={dict.disabled}>{dict.note}</Option>)}</Select>
                          )}
                        </Form.Item>
                      )
                    }
                  </div>
                </Col>
              )}
            </Row>
            {mblx === '2' ? '' : (
              <div className="fpgz-field" style={{ display: 'flex', flexDirection: 'column' }}>
                <Row style={{ order: fpgzFieldValue.indexOf('1') }}>
                  {
                    fpgzFieldValue.indexOf('1') > -1 && (
                      <div style={{ height: 'auto', margin: '20px' }}>
                        <div className="factor-item" style={{ margin: '0 0 0.5rem 2rem' }}>服务关系</div>
                        <div style={{ width: '42%', float: 'left' }}>
                          <div className="mot-fbgz-color" style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', lineHeight: '40px' }}>
                            <span style={{ marginLeft: '40px', color: '#FFF' }}>待选关系</span>
                          </div>
                          <div className="mot-yyb-transfer-list" style={{ paddingLeft: '40px' }}>
                            {dxgx.map((item) => {
                              const change = leftKeys.filter(Item => Item === item.ibm);
                              return (
                                <div style={{ padding: '5px 0', cursor: type ? '' : 'pointer' }} className={change.length > 0 ? 'mot-event-task-sel' : type ? '' : 'mot-yyb-hover'} onClick={() => (type ? '' : this.leftChange(item.ibm))}>{item.note}</div>
                              );
                            })}
                          </div>

                        </div>

                        <div style={{ float: 'left', margin: '70px 0 0 6%' }}>
                          <div className="mot-yyb-transfer-arrow mot-fbgz-color" onClick={() => (type ? '' : this.leftShuttle())}>
                            <i className="iconfont icon-left-line-arrow" />

                          </div>
                          <div className="mot-yyb-transfer-arrow mot-fbgz-color" onClick={() => (type ? '' : this.rightShuttle())}>
                            <i className="iconfont icon-right-line-arrow" />
                          </div>

                        </div>

                        <div style={{ width: '42%', float: 'right' }}>
                          <div className="mot-fbgz-color" style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', lineHeight: '40px' }}>
                            <span style={{ marginLeft: '10px', color: '#FFF' }}>优先级</span>
                            <span style={{ marginLeft: '10px', color: '#FFF' }}>已选关系</span>

                          </div>
                          <div className="mot-yyb-transfer-list">
                            {yxgx.length > 0 && yxgx.map((item, index) => {
                              if (index === 0) {
                                const change = rightKeys.filter(Item => Item === item.RLT_TP);
                                return (
                                  <div style={{ padding: '5px 0' }}>
                                    <span style={{ marginLeft: '10px' }}>{item.PRI}</span>
                                    <span style={{ marginLeft: '22px', cursor: type ? '' : 'pointer' }} className={change.length > 0 ? 'mot-event-task-sel' : type ? '' : 'mot-yyb-hover'} onClick={() => (type ? '' : this.rightChange(item.RLT_TP))}>{item.note}</span>
                                    {type ? '' : yxgx.length !== 1 ? <span style={{ float: 'right' }} className="mot-event-task-button" onClick={() => this.down(index)}>下移</span> : ''}
                                  </div>
                                );
                              } else if (yxgx[index - 1].PRI !== item.PRI) {
                                const change = rightKeys.filter(Item => Item === item.RLT_TP);
                                return (
                                  <div style={{ padding: '5px 0' }}>
                                    <Divider style={{ margin: '0 0 5px 0' }} />
                                    <span style={{ marginLeft: '10px' }}>{item.PRI}</span>
                                    <span style={{ marginLeft: '22px', cursor: type ? '' : 'pointer' }} className={change.length > 0 ? 'mot-event-task-sel' : type ? '' : 'mot-yyb-hover'} onClick={() => (type ? '' : this.rightChange(item.RLT_TP))}>{item.note}</span>
                                    {type ? '' : (
                                      <span style={{ float: 'right' }}>
                                        <span className="mot-event-task-button" onClick={() => this.upTop(index)}>置顶</span>
                                        <span className="mot-event-task-button" onClick={() => this.up(index)}>上移</span>
                                        {yxgx.length - 1 !== index ? <span className="mot-event-task-button" onClick={() => this.down(index)}>下移</span> : ''}
                                      </span>
                                    )}
                                  </div>
                                );
                              } else if (yxgx[index - 1].PRI === item.PRI) {
                                const change = rightKeys.filter(Item => Item === item.RLT_TP);
                                return (
                                  <div style={{ padding: '5px 0' }}>
                                    <span style={{ marginLeft: '40px', cursor: type ? '' : 'pointer' }} className={change.length > 0 ? 'mot-event-task-sel' : type ? '' : 'mot-yyb-hover'} onClick={() => (type ? '' : this.rightChange(item.RLT_TP))}>{item.note}</span>
                                    {type ? '' : (
                                      <span style={{ float: 'right' }}>
                                        {item.PRI !== '1' ? <span className="mot-event-task-button" onClick={() => this.upTop(index)}>置顶</span> : ''}
                                        {item.PRI !== '1' ? <span className="mot-event-task-button" onClick={() => this.up(index)}>上移</span> : ''}
                                        <span className="mot-event-task-button" onClick={() => this.down(index)}>下移</span>
                                      </span>
                                    )}
                                  </div>
                                );
                              }
                            })}
                          </div>

                        </div>
                      </div>
                    )
                  }
                </Row>
                <Row style={{ order: fpgzFieldValue.indexOf('2') }}>
                  {
                    fpgzFieldValue.indexOf('2') > -1 && (
                      <Col span={12}>
                        <div className={type ? 'factor-item' : ''}>
                          {
                            type ? <span>角色平均分配：{this.getFieldLabel(roleData, jspjfpFieldValue)}</span> : (
                              <Form.Item label={<span>角色平均分配</span>}>
                                {getFieldDecorator('JSPJFP', { initialValue: data.jspjfp, rules: [{ required: true, message: '任务分配规则的角色平均分配不允许为空!' }] })(
                                  <Select mode="multiple">{roleData.map(item => <Option value={item.id}>{item.name}</Option>)}</Select>
                                )}
                              </Form.Item>
                            )
                          }
                        </div>
                      </Col>
                    )
                  }
                </Row>
                <Row style={{ order: fpgzFieldValue.indexOf('3') }}>
                  {
                    fpgzFieldValue.indexOf('3') > -1 && (
                      <Col span={12}>
                        <div className={type ? 'factor-item' : ''}>
                          {
                            type ? <span>团队平均分配：{this.getFieldLabel(teamData, tdpjfpFieldValue)}</span> : (
                              <Form.Item label={<span>团队平均分配</span>}>
                                {getFieldDecorator('TDPJFP', { initialValue: data.tdpjfp, rules: [{ required: true, message: '任务分配规则的团队平均分配不允许为空!' }] })(
                                  <Select mode="multiple">{teamData.map(item => <Option value={item.id}>{item.name}</Option>)}</Select>
                                )}
                              </Form.Item>
                            )
                          }
                        </div>
                      </Col>
                    )
                  }
                </Row>
                <Row style={{ order: fpgzFieldValue.indexOf('4') }}>
                  {
                    fpgzFieldValue.indexOf('4') > -1 && (
                      <Col span={12}>
                        <div className={type ? 'factor-item' : ''}>
                          {
                            type ? <span>人员类别平均分配：{this.getFieldLabel(employeeClassData, rylbpjfpFieldValue)}</span> : (
                              <Form.Item label={<span>人员类别平均分配</span>}>
                                {getFieldDecorator('RYLBPJFP', { initialValue: data.rylbpjfp, rules: [{ required: true, message: '任务分配规则的人员类别平均分配不允许为空!' }] })(
                                  <Select mode="multiple">{employeeClassData.map(item => <Option value={item.id}>{item.name}</Option>)}</Select>
                                )}
                              </Form.Item>
                            )
                          }
                        </div>
                      </Col>
                    )
                  }
                </Row>
              </div>
            )}
          </Form>
        </Row>
      </Fragment>
    );
  }
}

export default Form.create()(TaskRule);
